import sequelize from '../config/sequelize.js';
import { seedCategories } from '../models/Category.js';
import Exhibit, { seedExhibits } from '../models/Exhibit.js';

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Таблицы пересозданы.');
    await seedCategories(true);
    console.log('Категории заполнены.');
    await seedExhibits(true);
    console.log('Экспонаты заполнены.');
    process.exit(0);
  } catch (e) {
    console.error('Ошибка инициализации базы:', e);
    process.exit(1);
  }
})(); 