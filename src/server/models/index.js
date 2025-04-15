// Импортируем все модели
import { Exhibit, seedExhibits } from './Exhibit.js';
import { Game, seedGames } from './Game.js';
import { Quiz, seedQuizzes } from './Quiz.js';
import { Review, seedReviews } from './Review.js';

// Функция для загрузки всех начальных данных
const seedDatabase = async (force = false) => {
  console.log('🌱 Начинаем заполнение базы данных тестовыми данными...');
  
  // Запускаем все функции заполнения последовательно
  await seedExhibits(force);
  await seedGames(force);
  await seedQuizzes(force);
  await seedReviews(force);
  
  console.log('✅ Заполнение базы данных завершено!');
};

// Экспортируем все модели и функцию заполнения
export {
  Exhibit,
  Game,
  Quiz,
  Review,
  seedDatabase
}; 
