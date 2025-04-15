import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// Модель отзывов о музее
const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON строка с массивом URL или data:image строк',
    get() {
      const rawValue = this.getDataValue('images');
      if (rawValue) {
        try {
          return JSON.parse(rawValue);
        } catch (e) {
          console.error('Error parsing images JSON:', e);
          return [];
        }
      }
      return [];
    },
    set(value) {
      if (Array.isArray(value)) {
        // Если массив пустой, сохраняем null
        if (value.length === 0) {
          this.setDataValue('images', null);
        } else {
          this.setDataValue('images', JSON.stringify(value));
        }
      } else if (typeof value === 'string' && value.startsWith('data:image')) { // Проверяем, что строка - это data URL
        // Если пришла одна строка (data URL), сохраняем её как массив с одним элементом
        this.setDataValue('images', JSON.stringify([value]));
      } else {
        // Во всех остальных случаях (включая пустую строку или некорректные данные) сохраняем null
        this.setDataValue('images', null);
      }
    }
  },
  image: {
    type: DataTypes.VIRTUAL,
    get() {
      const images = this.images;
      return images && images.length > 0 ? images[0] : null;
    },
    set(value) {
      if (value) {
        this.images = [value];
      }
    }
  },
  exhibitId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'exhibits',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected']]
    }
  },
  approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    set(value) {
      this.setDataValue('approved', value);
      // Синхронизируем status с approved
      if (value === true) {
        this.setDataValue('status', 'approved');
      } else if (value === false) {
        this.setDataValue('status', 'rejected');
      }
    }
  },
  visitDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'reviews',
  hooks: {
    beforeSave: (review) => {
      // Синхронизируем approved со status
      if (review.status === 'approved') {
        review.approved = true;
      } else if (review.status === 'rejected') {
        review.approved = false;
      }
    }
  }
});

// Данные для начального заполнения
const defaultReviews = [
  {
    name: "Алексей Петров",
    email: "alex@example.com",
    rating: 5,
    comment: "Потрясающая экспозиция! Особенно впечатлили старые компьютеры и игровые приставки. Очень интересно было увидеть эволюцию электроники за последние 50 лет. Обязательно приду ещё раз с детьми!",
    exhibitId: 1,
    approved: true,
    visitDate: new Date(2023, 5, 15)
  },
  {
    name: "Мария Иванова",
    email: "maria@example.com",
    rating: 4,
    comment: "Интересная экспозиция. Понравились интерактивные экспонаты и возможность поиграть на старых приставках. Хотелось бы больше информации о современных технологиях.",
    exhibitId: null,
    approved: true,
    visitDate: new Date(2023, 6, 22)
  },
  {
    name: "Дмитрий Сидоров",
    email: "dmitry@example.com",
    rating: 5,
    comment: "Музей превзошел все ожидания! Экскурсовод очень увлекательно рассказывал историю каждого экспоната. Особенно понравился раздел с мобильными телефонами - было забавно показать детям, какими огромными были первые мобильники.",
    exhibitId: 3,
    approved: true,
    visitDate: new Date(2023, 7, 10)
  }
];

// Функция для заполнения базы данных тестовыми отзывами
const seedReviews = async (force = false) => {
  try {
    // Проверяем, есть ли уже данные в таблице
    const count = await Review.count();
    
    // Если данных нет или указан флаг принудительного заполнения
    if (count === 0 || force) {
      console.log('📥 Добавление тестовых отзывов в базу данных...');
      
      // Создаем записи последовательно
      for (const item of defaultReviews) {
        await Review.create(item);
      }
      
      console.log(`✅ Добавлено ${defaultReviews.length} тестовых отзывов`);
    } else {
      console.log(`ℹ️ В базе данных уже есть ${count} отзывов. Пропускаем добавление тестовых данных.`);
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении тестовых отзывов:', error);
  }
};

export { Review, seedReviews }; 