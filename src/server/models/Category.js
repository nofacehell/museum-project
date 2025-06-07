import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// Модель категории
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Функция для заполнения базы данных начальными категориями
export const seedCategories = async (force = false) => {
  try {
    const defaultCategories = [
      { name: 'Разное', description: 'Различные экспонаты, не относящиеся к другим категориям' },
      { name: 'Аудиотехника', description: 'Экспонаты, связанные с аудио оборудованием' },
      { name: 'Видеотехника', description: 'Экспонаты, связанные с видео оборудованием' },
      { name: 'Бытовая техника', description: 'Экспонаты, связанные с бытовой техникой' }
    ];

    if (force) {
      await Category.destroy({ where: {} });
    }

    for (const category of defaultCategories) {
      await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }

    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

export { Category };
