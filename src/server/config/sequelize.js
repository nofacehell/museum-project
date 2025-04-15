import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Определяем __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем путь к базе данных
const dbPath = path.join(__dirname, '../../../db/museum.sqlite');

// Создаем директорию для БД, если её нет
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Создаем экземпляр Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true, // Включаем поля createdAt и updatedAt
    underscored: true, // Для использования snake_case вместо camelCase в именах полей
  }
});

// Функция для подключения к базе данных
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Успешное подключение к SQLite базе данных');
    
    // Синхронизируем модели с БД (создаем таблицы, если их нет)
    await sequelize.sync({ force: true });
    console.log('✅ Таблицы в базе данных пересозданы');
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
    return false;
  }
};

export default sequelize; 
