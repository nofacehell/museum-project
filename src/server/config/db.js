import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setUseDefaultData as setExhibitsUseDefaultData } from '../routes/exhibits.js';
import { setUseDefaultData as setGamesUseDefaultData } from '../routes/games.js';
import { setUseDefaultData as setQuizzesUseDefaultData } from '../routes/quizzes.js';

dotenv.config();

// Проверка наличия URI в .env файле
if (!process.env.MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI не найден в .env файле. Работа с базой данных будет недоступна.');
  console.warn('⚠️ Приложение переключается на работу с тестовыми данными.');
  
  // Активируем заглушки для всех маршрутов
  setExhibitsUseDefaultData(true);
  setGamesUseDefaultData(true);
  setQuizzesUseDefaultData(true);
}

const connectDB = async () => {
  try {
    // Если нет URI, возвращаем false
    if (!process.env.MONGODB_URI) {
      return false;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`🌿 MongoDB подключена: ${conn.connection.host}`);
    
    // Переключаемся на режим базы данных
    setExhibitsUseDefaultData(false);
    setGamesUseDefaultData(false);
    setQuizzesUseDefaultData(false);
    
    return true;
  } catch (error) {
    console.error(`❌ Ошибка подключения к MongoDB: ${error.message}`);
    
    // Подробная информация для диагностики
    if (error.name === 'MongoNetworkError') {
      console.error('⚠️ Проблема с сетевым подключением к MongoDB. Проверьте, запущен ли сервер MongoDB.');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('⚠️ Не удалось выбрать сервер MongoDB. Проверьте правильность URI и доступность сервера.');
    } else if (error.name === 'MongoParseError') {
      console.error('⚠️ Неверный формат URI подключения к MongoDB.');
    }
    
    console.log('ℹ️ Переключение на работу с тестовыми данными...');
    
    // Активируем заглушки для всех маршрутов
    setExhibitsUseDefaultData(true);
    setGamesUseDefaultData(true);
    setQuizzesUseDefaultData(true);
    
    return false;
  }
};

export default connectDB; 