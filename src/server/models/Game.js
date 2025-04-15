import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// Модель игры для интерактивных экспонатов
const Game = sequelize.define('Game', {
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
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  relatedExhibits: {
    type: DataTypes.TEXT, // Массив идентификаторов связанных экспонатов в формате JSON
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('relatedExhibits');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('relatedExhibits', JSON.stringify(value));
    }
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'medium',
    validate: {
      isIn: [['easy', 'medium', 'hard']]
    }
  },
  minAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 7
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // Время в минутах
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gameData: {
    type: DataTypes.TEXT, // JSON с данными игры
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('gameData');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('gameData', JSON.stringify(value));
    }
  }
}, {
  timestamps: true,
  tableName: 'games'
});

// Данные для начального заполнения базы
const defaultGames = [
  {
    title: "Эволюция компьютеров",
    description: "Путешествие по истории развития компьютеров от механических вычислительных машин до современных суперкомпьютеров. Расставьте компьютеры в хронологическом порядке и узнайте интересные факты о каждом из них.",
    shortDescription: "Хронологическая игра о развитии компьютерной техники",
    type: "timeline",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop",
    featured: true,
    difficulty: "easy",
    minAge: 8,
    estimatedTime: 10,
    instructions: "Перетаскивайте изображения компьютеров, чтобы расположить их в хронологическом порядке от самых ранних до современных. Нажмите 'Проверить', чтобы узнать правильность вашего ответа.",
    gameData: {
      items: [
        {
          id: 1,
          name: "Аналитическая машина Бэббиджа",
          year: 1837,
          image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/AnalyticalMachine_Babbage_London.jpg",
          fact: "Первый механический компьютер общего назначения, спроектированный Чарльзом Бэббиджем"
        },
        {
          id: 2,
          name: "ENIAC",
          year: 1945,
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Eniac.jpg/800px-Eniac.jpg",
          fact: "Первый электронный цифровой компьютер общего назначения"
        },
        {
          id: 3,
          name: "Apple I",
          year: 1976,
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Apple_I_Computer_%282%29.jpg/800px-Apple_I_Computer_%282%29.jpg",
          fact: "Первый персональный компьютер Apple, созданный Стивом Возняком"
        },
        {
          id: 4,
          name: "IBM PC",
          year: 1981,
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/IBM_PC_5150.jpg/800px-IBM_PC_5150.jpg",
          fact: "Первый массовый персональный компьютер, задавший стандарт для индустрии ПК"
        },
        {
          id: 5,
          name: "iMac G3",
          year: 1998,
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/IMac_G3_Bondi_Blue.jpg/800px-IMac_G3_Bondi_Blue.jpg",
          fact: "Революционный дизайн с полупрозрачным цветным корпусом, созданный под руководством Джонатана Айва"
        }
      ]
    },
    relatedExhibits: [1, 3]
  },
  {
    title: "Собери мобильный телефон",
    description: "Узнайте, как устроены мобильные телефоны, собрав виртуальный смартфон из отдельных компонентов. Эта игра поможет вам понять, какие детали находятся внутри вашего телефона и какую роль они выполняют.",
    shortDescription: "Интерактивная головоломка по сборке смартфона",
    type: "puzzle",
    thumbnail: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop",
    featured: true,
    difficulty: "medium",
    minAge: 10,
    estimatedTime: 15,
    instructions: "Перетащите компоненты на правильные места в корпусе телефона. Используйте подсказки, чтобы узнать о функциях каждой детали.",
    gameData: {
      components: [
        {
          id: 1,
          name: "Аккумулятор",
          image: "https://example.com/battery.png",
          description: "Источник питания для всех компонентов телефона",
          position: { x: 50, y: 300 }
        },
        {
          id: 2,
          name: "Процессор",
          image: "https://example.com/cpu.png",
          description: "Мозг телефона, выполняющий все вычисления",
          position: { x: 150, y: 100 }
        },
        {
          id: 3,
          name: "Камера",
          image: "https://example.com/camera.png",
          description: "Модуль для съемки фотографий и видео",
          position: { x: 200, y: 50 }
        },
        {
          id: 4,
          name: "Дисплей",
          image: "https://example.com/display.png",
          description: "Экран для отображения информации",
          position: { x: 120, y: 180 }
        },
        {
          id: 5,
          name: "Динамик",
          image: "https://example.com/speaker.png",
          description: "Компонент для воспроизведения звука",
          position: { x: 180, y: 30 }
        }
      ]
    },
    relatedExhibits: [3]
  }
];

// Функция для заполнения базы данных тестовыми данными
const seedGames = async (force = false) => {
  try {
    // Проверяем, есть ли уже данные в таблице
    const count = await Game.count();
    
    // Если данных нет или указан флаг принудительного заполнения
    if (count === 0 || force) {
      console.log('📥 Добавление тестовых игр в базу данных...');
      
      // Создаем записи последовательно
      for (const item of defaultGames) {
        await Game.create(item);
      }
      
      console.log(`✅ Добавлено ${defaultGames.length} тестовых игр`);
    } else {
      console.log(`ℹ️ В базе данных уже есть ${count} игр. Пропускаем добавление тестовых данных.`);
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении тестовых игр:', error);
  }
};

export { Game, seedGames }; 