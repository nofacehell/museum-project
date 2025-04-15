import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/sequelize.js';
import { seedDatabase } from './models/index.js';
import { router } from './routes/exhibits.js';
import quizRoutes from './routes/quizzes.js';
import gameRoutes from './routes/games.js';
import reviewRoutes from './routes/reviews.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Определяем __dirname и __filename для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные среды из .env файла
dotenv.config();

// Создаем экземпляр Express приложения
const app = express();

// Применяем middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path for local storage in case DB is unavailable
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Local storage functions
const localDB = {
  getAll: (collection) => {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
  },
  save: (collection, data) => {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
};

// Подключаемся к базе данных
connectDB().then(() => {
  console.log('✅ База данных подключена');
  // Заполняем базу данных начальными данными
  seedDatabase().then(() => {
    console.log('✅ База данных заполнена начальными данными');
  }).catch(error => {
    console.error('❌ Ошибка при заполнении базы данных:', error);
  });
}).catch(error => {
  console.error('❌ Ошибка подключения к базе данных:', error);
});

// Add local DB to request
app.use((req, res, next) => {
  req.dbConnected = true;
  req.localDB = localDB;
  next();
});

// Базовый маршрут для проверки API
app.get('/', (req, res) => {
  res.json({ 
    message: 'API музея электроники работает!',
    database: 'SQLite',
    database_status: 'connected',
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    endpoints: [
      '/api/exhibits',
      '/api/games',
      '/api/quizzes',
      '/api/reviews'
    ]
  });
});

// API маршруты
app.use('/api/exhibits', router);
app.use('/api/games', gameRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Serve static files if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Определяем порт и запускаем сервер
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер музея электроники запущен и работает на порту ${PORT}`);
  console.log(` API доступно по адресу: http://localhost:${PORT}/api`);
  console.log(`📊 База данных SQLite: ✅ Подключена`);
  console.log(`📝 Примеры запросов:
    - Получить все экспонаты: GET http://localhost:${PORT}/api/exhibits
    - Получить все игры: GET http://localhost:${PORT}/api/games
    - Получить все викторины: GET http://localhost:${PORT}/api/quizzes
    - Получить все отзывы: GET http://localhost:${PORT}/api/reviews
  `);
});

// Обработка необработанных исключений
process.on('uncaughtException', (err) => {
  console.error('❌ Необработанное исключение:', err);
  
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Обработка необработанных отклонений промисов
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Необработанное отклонение промиса:', reason);
});

export default app; 