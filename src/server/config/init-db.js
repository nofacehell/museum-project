const sequelize = require('./database');
const { Category, seedCategories } = require('../models/Category');
const { Exhibit, seedExhibits, migrateExhibits } = require('../models/Exhibit');

const initializeDatabase = async () => {
  try {
    // Синхронизируем базу данных
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    // Заполняем категории
    await seedCategories();
    console.log('Categories seeded successfully');

    // Заполняем экспонаты
    await seedExhibits();
    console.log('Exhibits seeded successfully');

    // Мигрируем существующие данные
    await migrateExhibits();
    console.log('Data migration completed successfully');

    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = initializeDatabase; 