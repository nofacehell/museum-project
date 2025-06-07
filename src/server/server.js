// server/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import winston from 'winston';
import multer from 'multer';

import { connectDB } from './config/sequelize.js';
import { seedDatabase } from './models/index.js';
import { handleImageError } from './utils/image-handler.js';
import { startAutoBackup } from './scripts/auto-backup.js';

import exhibitsRouter   from './routes/exhibits.js';
import quizzesRouter    from './routes/quizzes.js';
import gamesRouter      from './routes/games.js';
import reviewsRouter    from './routes/reviews.js';
import categoriesRouter from './routes/categories.js';
import authRouter       from './routes/auth.js';
import usersRouter      from './routes/users.js';
import ticketsRouter    from './routes/tickets.js';
import eventsRouter     from './routes/events.js';
import adminBackupRouter from './routes/admin-backup.js';

dotenv.config();

// Принудительное использование локального хранилища (для отладки)
const FORCE_LOCAL_STORAGE = process.env.FORCE_LOCAL_STORAGE === 'true';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// =========== LOGGING ===========
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'src/server/server.log' })
  ]
});

// Добавляем консольный вывод логов для разработки
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// =========== CORS ===========
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));

// =========== BODY PARSERS ===========
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =========== LOCAL FALLBACK STORAGE ===========
const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const localDB = {
  getAll: col => {
    const f = path.join(DATA_DIR, `${col}.json`);
    return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  },
  save: (col, data) => {
    const f = path.join(DATA_DIR, `${col}.json`);
    fs.writeFileSync(f, JSON.stringify(data, null, 2));
  },
  addItem: (col, item) => {
    const all = localDB.getAll(col);
    const id = all.length ? Math.max(...all.map(i => i.id || 0)) + 1 : 1;
    const newItem = { id, ...item };
    all.push(newItem);
    localDB.save(col, all);
    return newItem;
  },
  updateItem: (col, id, data) => {
    const all = localDB.getAll(col);
    const idx = all.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    localDB.save(col, all);
    return all[idx];
  },
  deleteItem: (col, id) => {
    const all = localDB.getAll(col);
    const idx = all.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return false;
    all.splice(idx, 1);
    localDB.save(col, all);
    return true;
  }
};

// =========== ПРОВЕРКА ЛОКАЛЬНЫХ ДАННЫХ ===========
// Проверяем наличие локальных данных и логируем результаты
const checkLocalData = () => {
  console.log('\n🔍 Проверка локальных данных:');
  const collections = ['exhibits', 'categories', 'quizzes', 'games', 'reviews'];
  
  collections.forEach(col => {
    const data = localDB.getAll(col);
    console.log(`📁 ${col}: ${data.length} записей`);
  });
  console.log('\n');
};

// Сразу проверяем локальные данные при запуске
checkLocalData();

// Глобальная переменная для хранения состояния подключения к БД
let isDBConnected = false;

// Функция для проверки подключения к БД
connectDB()
  .then((connected) => {
    isDBConnected = connected && !FORCE_LOCAL_STORAGE;
    
    console.log(`✅ База данных ${connected ? 'подключена' : 'не подключена'}`);
    console.log(`🔧 Режим хранения данных: ${isDBConnected ? 'База данных SQLite' : 'Локальное JSON хранилище'}`);
    
    logger.info(`Database connection status: ${connected}`);
    logger.info(`Using storage mode: ${isDBConnected ? 'SQLite DB' : 'Local JSON storage'}`);
    
    return seedDatabase();
  })
  .then(() => {
    console.log('✅ База данных проинициализирована');
    logger.info('Database seeded successfully');

    // Запускаем автоматическое резервное копирование, если база данных подключена
    if (isDBConnected) {
      console.log('🚀 Запуск автоматического резервного копирования...');
      startAutoBackup().catch(error => {
        console.error('❌ Ошибка при запуске автоматического резервного копирования:', error);
        logger.error('Auto backup failed to start:', error);
      });
    }
  })
  .catch(err => {
    console.error('❌ Ошибка настройки БД:', err);
    logger.error('Database setup error:', err);
    isDBConnected = false;
  });

// прокидываем флаг подключения к БД и localDB в каждый запрос
app.use((req, _, next) => {
  // Принудительно используем локальное хранилище, если задан флаг
  req.dbConnected = isDBConnected && !FORCE_LOCAL_STORAGE;
  req.localDB = localDB;
  
  // Отладочный вывод для API запросов
  if (req.url.startsWith('/api/')) {
    console.log(`🔍 ${req.method} ${req.url} - DB Connected: ${req.dbConnected}`);
    logger.info(`Request to ${req.method} ${req.url} - DB Connected: ${req.dbConnected}`);
  }
  
  next();
});

// =========== STATIC UPLOADS ===========
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Apply image error handler middleware
app.use(handleImageError);

// Serve static files from /uploads directory (для Vite-прокси)
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

logger.info(`Serving static files from ${UPLOADS_DIR}`);

// =========== HEALTHCHECK ===========
app.get('/', (_, res) => {
  res.json({
    status: 'ok',
    env:    process.env.NODE_ENV,
    time:   new Date().toISOString(),
    api:    '/api',
    storage: isDBConnected ? 'sqlite' : 'local'
  });
});

// =========== API ADDITIONAL INFO ===========
app.get('/api/status', (_, res) => {
  res.json({
    status: 'ok',
    dbConnected: isDBConnected,
    storageMode: isDBConnected ? 'sqlite' : 'local',
    collections: {
      exhibits: localDB.getAll('exhibits').length,
      categories: localDB.getAll('categories').length,
      quizzes: localDB.getAll('quizzes').length,
      games: localDB.getAll('games').length,
      reviews: localDB.getAll('reviews').length
    },
    time: new Date().toISOString()
  });
});

// =========== API ROUTES ===========
app.use('/api/exhibits',   exhibitsRouter);
app.use('/api/quizzes',    quizzesRouter);
app.use('/api/games',      gamesRouter);
app.use('/api/reviews',    reviewsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth',       authRouter);
app.use('/api/users',      usersRouter);
app.use('/api/tickets',    ticketsRouter);
app.use('/api/events',     eventsRouter);
app.use('/api/admin',      adminBackupRouter);

// =========== SPA SERVE (PROD) ===========
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../dist');
  app.use(express.static(clientDist));
  app.get('*', (_, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// =========== ERROR HANDLER ===========
app.use((err, _, res, __) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

// =========== START SERVER ===========
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`🔧 Storage mode: ${isDBConnected ? 'SQLite DB' : 'Local JSON storage'}`);
});

export default app;
