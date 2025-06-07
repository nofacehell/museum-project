// Импортируем все модели
import Exhibit, { seedExhibits } from './Exhibit.js';
import { Game, seedGames } from './Game.js';
import { Quiz, seedQuizzes } from './Quiz.js';
import Review, { seedReviews } from './Review.js';
import { Category, seedCategories } from './Category.js';
import User from './User.js';
import Event from './Event.js';
import EventRegistration from './EventRegistration.js';
import Ticket from './Ticket.js';

// Определяем отношения между моделями
const setupAssociations = () => {
  // Отношения пользователей и билетов
  User.hasMany(Ticket, { foreignKey: 'userId' });
  Ticket.belongsTo(User, { foreignKey: 'userId' });

  // Отношения пользователей и регистраций на события
  User.hasMany(EventRegistration, { foreignKey: 'userId' });
  EventRegistration.belongsTo(User, { foreignKey: 'userId' });

  // Отношения событий и регистраций
  Event.hasMany(EventRegistration, { foreignKey: 'eventId' });
  EventRegistration.belongsTo(Event, { foreignKey: 'eventId' });

  // Существующие отношения
  // (сохраняем их для совместимости)
};

// Функция для загрузки всех начальных данных
const seedDatabase = async (force = false) => {
  console.log('🌱 Начинаем инициализацию и заполнение базы данных...');
  
  try {
    // Устанавливаем отношения между моделями
    setupAssociations();
    
    // Синхронизируем все модели без force = true, чтобы сохранять данные между перезапусками
    console.log('Синхронизация моделей с базой данных...');
    await Promise.all([
      Category.sync({ force: false }),
      Review.sync({ force: false }),
      Exhibit.sync({ force: false }),
      Game.sync({ force: false }),
      Quiz.sync({ force: false }),
      User.sync({ force: false }),
      Event.sync({ force: false }),
      EventRegistration.sync({ force: false }),
      Ticket.sync({ force: false })
    ]);
    console.log('✅ Все модели синхронизированы');

    // Проверяем, существуют ли уже данные в базе, прежде чем пытаться создать новые
    const categoriesCount = await Category.count();
    const exhibitsCount = await Exhibit.count();
    const gamesCount = await Game.count();
    const quizzesCount = await Quiz.count();
    const reviewsCount = await Review.count();
    const usersCount = await User.count();

    // Только заполняем таблицы, если они пусты
    if (categoriesCount === 0) {
      await seedCategories(false);
      console.log('✅ Категории заполнены');
    } else {
      console.log(`✓ Уже имеется ${categoriesCount} категорий в базе`);
    }
    
    if (exhibitsCount === 0) {
      await seedExhibits(false);
      console.log('✅ Экспонаты заполнены');
    } else {
      console.log(`✓ Уже имеется ${exhibitsCount} экспонатов в базе`);
    }
    
    if (gamesCount === 0) {
      await seedGames(false);
      console.log('✅ Игры заполнены');
    } else {
      console.log(`✓ Уже имеется ${gamesCount} игр в базе`);
    }
    
    if (quizzesCount === 0) {
      await seedQuizzes(false);
      console.log('✅ Викторины заполнены');
    } else {
      console.log(`✓ Уже имеется ${quizzesCount} викторин в базе`);
    }
    
    if (reviewsCount === 0) {
      await seedReviews(false);
      console.log('✅ Отзывы заполнены');
    } else {
      console.log(`✓ Уже имеется ${reviewsCount} отзывов в базе`);
    }

    if (usersCount === 0) {
      // Создаем тестового админа только если нет пользователей
      await User.create({
        email: 'admin@museum.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
      console.log('✅ Тестовый админ создан');
    } else {
      console.log(`✓ Уже имеется ${usersCount} пользователей в базе`);
    }

    console.log('✅ База данных успешно инициализирована!');
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
    throw error;
  }
};

// Экспортируем все модели и функцию заполнения
export {
  Exhibit,
  Game,
  Quiz,
  Review,
  Category,
  User,
  Event,
  EventRegistration,
  Ticket,
  seedDatabase
}; 
