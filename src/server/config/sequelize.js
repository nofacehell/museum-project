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

// Проверка существования и доступности файла БД
const isDBFileAccessible = () => {
  try {
    // Проверяем существование файла
    if (!fs.existsSync(dbPath)) {
      console.log(`⚠️ База данных не найдена по пути: ${dbPath}`);
      return false;
    }
    
    // Проверяем доступность файла для чтения/записи
    fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
    const stats = fs.statSync(dbPath);
    console.log(`📊 Размер файла БД: ${stats.size} байт, дата изменения: ${stats.mtime}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Ошибка доступа к файлу БД: ${error.message}`);
    return false;
  }
};

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
    // Проверяем доступность файла БД
    const isFileOK = isDBFileAccessible();
    if (!isFileOK) {
      console.warn('❗ Файл базы данных недоступен, будет использоваться локальное хранилище');
      return false;
    }
    
    // Пытаемся аутентифицироваться в базе данных
    await sequelize.authenticate();
    
    // Проверяем, что база содержит необходимые таблицы
    try {
      await sequelize.query('SELECT count(*) FROM sqlite_master WHERE type="table"');
      console.log('✅ Успешное подключение к SQLite базе данных');
      return true;
    } catch (tableError) {
      console.error('❌ Ошибка проверки таблиц в базе данных:', tableError.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error.message);
    return false;
  }
};

export default sequelize; 
