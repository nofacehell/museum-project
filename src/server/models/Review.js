import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Review extends Model {}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
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
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('images', value ? JSON.stringify(value) : null);
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  visitorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  visitorEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  exhibitId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  timestamps: true,
  underscored: true
});

// Sample data for reviews
const sampleReviews = [
  {
    name: "Иван Петров",
    visitorName: "Иван Петров",
    visitorEmail: "ivan@example.com",
    rating: 5,
    comment: "Отличный музей! Очень понравилась экспозиция.",
    images: null,
    status: 'approved'
  },
  {
    name: "Мария Иванова",
    visitorName: "Мария Иванова",
    visitorEmail: "maria@example.com",
    rating: 4,
    comment: "Интересные экспонаты, но можно было бы добавить больше информации.",
    images: null,
    status: 'approved'
  },
  {
    name: "Алексей Смирнов",
    visitorName: "Алексей Смирнов",
    visitorEmail: "alexey@example.com",
    rating: 5,
    comment: "Прекрасное место для семейного посещения!",
    images: null,
    status: 'approved'
  }
];

// Function to seed reviews
export const seedReviews = async (force = false) => {
  try {
    if (!force) {
      const count = await Review.count();
      if (count > 0) {
        console.log(`Reviews table already has ${count} records. Skipping seeding.`);
        return;
      }
    }
    
    console.log('Starting to seed reviews with data:', JSON.stringify(sampleReviews, null, 2));
    const result = await Review.bulkCreate(sampleReviews, {
      validate: true,
      logging: console.log
    });
    console.log('✅ Reviews seeded successfully:', result.length, 'reviews created');
  } catch (error) {
    console.error('❌ Error seeding reviews. Full error:', {
      message: error.message,
      name: error.name,
      sql: error.sql,
      parameters: error.parameters,
      stack: error.stack
    });
    throw error;
  }
};

export default Review;