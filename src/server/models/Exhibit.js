import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';
import { Category } from './Category.js';

class Exhibit extends Model {}

Exhibit.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  additionalImages: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('additionalImages');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('additionalImages', JSON.stringify(value));
    }
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  technicalSpecs: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('technicalSpecs');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('technicalSpecs', JSON.stringify(value));
    }
  },
  historicalContext: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Exhibit',
  tableName: 'exhibits',
  timestamps: true,
  underscored: true
});

// Определяем связь с категорией
Exhibit.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Exhibit, { foreignKey: 'categoryId' });

// Функция для миграции существующих данных
export const migrateExhibits = async () => {
  try {
    // Получаем все существующие экспонаты
    const exhibits = await Exhibit.findAll();
    
    // Получаем категорию "Разное" для экспонатов без категории
    const otherCategory = await Category.findOne({ where: { slug: 'other' } });
    
    // Обновляем каждый экспонат
    for (const exhibit of exhibits) {
      let categoryId;
      
      // Определяем категорию на основе существующего значения
      switch (exhibit.category?.toLowerCase()) {
        case 'аудиотехника':
          categoryId = (await Category.findOne({ where: { slug: 'audio' } }))?.id;
          break;
        case 'видеотехника':
          categoryId = (await Category.findOne({ where: { slug: 'video' } }))?.id;
          break;
        case 'бытовая техника':
          categoryId = (await Category.findOne({ where: { slug: 'appliances' } }))?.id;
          break;
        default:
          categoryId = otherCategory.id;
      }
      
      // Обновляем экспонат
      await exhibit.update({ categoryId });
    }
    
    console.log('✅ Миграция экспонатов завершена успешно');
  } catch (error) {
    console.error('❌ Ошибка при миграции экспонатов:', error);
    throw error;
  }
};

// Функция для начального заполнения таблицы экспонатов
export const seedExhibits = async (force = false) => {
  try {
    const count = await Exhibit.count();
    if (count > 0 && !force) {
      console.log(`Таблица экспонатов уже содержит ${count} записей. Пропускаем начальное заполнение.`);
      return;
    }

    // Получаем id категорий
    const audio = await Category.findOne({ where: { name: 'Аудиотехника' } });
    const misc = await Category.findOne({ where: { name: 'Разное' } });

    const defaultExhibits = [
      {
        title: 'Sony Walkman',
        description: 'Портативный кассетный плеер, произведший революцию в прослушивании музыки.',
        shortDescription: 'Легендарный плеер Sony',
        image: '/uploads/exhibits/1745221225861-795646119.png',
        year: '1979',
        manufacturer: 'Sony',
        historicalContext: 'Первый в мире портативный кассетный плеер',
        featured: true,
        technicalSpecs: JSON.stringify({
          "Тип носителя": "Компакт-кассета",
          "Батарея": "2 x AA батареи",
          "Функции": "Воспроизведение, перемотка, функция 'горячая линия' (микрофон)",
          "Разъемы": "Два 3.5 мм аудиовыхода"
        }),
        additionalImages: null,
        categoryId: audio?.id || misc?.id
      },
      {
        title: 'Nokia 3310',
        description: 'Культовый мобильный телефон, известный своей прочностью и длительным временем работы.',
        shortDescription: 'Неубиваемый телефон Nokia',
        image: '/uploads/exhibits/1745221459656-75249255.png',
        year: '2000',
        manufacturer: 'Nokia',
        historicalContext: 'Один из самых популярных мобильных телефонов в истории',
        featured: true,
        technicalSpecs: JSON.stringify({
          "Дисплей": "Монохромный 84 x 48 пикселей",
          "Вес": "133 г",
          "Батарея": "900 мАч, до 260 часов в режиме ожидания",
          "Функции": "SMS, игры (Змейка, Память, Тетрис), будильник"
        }),
        additionalImages: null,
        categoryId: misc?.id || audio?.id
      }
    ];

    await Exhibit.bulkCreate(defaultExhibits);
    console.log(`✅ Создано ${defaultExhibits.length} базовых экспонатов`);
  } catch (error) {
    console.error('❌ Ошибка при заполнении таблицы экспонатов:', error);
    throw error;
  }
};

export default Exhibit;