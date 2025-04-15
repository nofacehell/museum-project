import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// Модель викторины
const Quiz = sequelize.define('Quiz', {
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
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
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
    defaultValue: 8
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // Время в минутах
    allowNull: true
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
  questions: {
    type: DataTypes.TEXT, // JSON в виде текста
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('questions');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('questions', JSON.stringify(value));
    }
  }
}, {
  timestamps: true,
  tableName: 'quizzes'
});

// Данные для заполнения базы викторинами
const defaultQuizzes = [
  {
    title: "История вычислительной техники",
    description: "Проверьте свои знания об основных вехах развития компьютеров и вычислительной техники в этой увлекательной викторине. Вы узнаете о первопроходцах компьютерной индустрии, революционных устройствах и важных технологических прорывах.",
    shortDescription: "Викторина о ключевых моментах в развитии компьютерной техники",
    category: "История",
    image: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=500&auto=format&fit=crop",
    difficulty: "medium",
    minAge: 12,
    estimatedTime: 15,
    featured: true,
    relatedExhibits: [1],
    questions: [
      {
        id: 1,
        question: "Какой компьютер считается первым массовым персональным компьютером с графическим интерфейсом?",
        options: [
          "IBM PC",
          "Apple Macintosh",
          "Commodore 64",
          "ZX Spectrum"
        ],
        correct: 1,
        explanation: "Apple Macintosh, выпущенный в 1984 году, стал первым коммерчески успешным компьютером с графическим интерфейсом пользователя (GUI) и мышью."
      },
      {
        id: 2,
        question: "Кто разработал первый веб-браузер и веб-сервер?",
        options: [
          "Стив Джобс",
          "Билл Гейтс",
          "Тим Бернерс-Ли",
          "Линус Торвальдс"
        ],
        correct: 2,
        explanation: "Тим Бернерс-Ли разработал первый веб-браузер и веб-сервер в 1990 году, заложив основы современного Интернета."
      },
      {
        id: 3,
        question: "Какой язык программирования был создан первым?",
        options: [
          "FORTRAN",
          "COBOL",
          "Pascal",
          "C"
        ],
        correct: 0,
        explanation: "FORTRAN (FORmula TRANslation) был разработан IBM в 1950-х годах и считается первым высокоуровневым языком программирования."
      },
      {
        id: 4,
        question: "Какое устройство ENIAC занимало в 1945 году?",
        options: [
          "Настольное пространство",
          "Несколько шкафов",
          "Целую комнату",
          "Целое здание"
        ],
        correct: 2,
        explanation: "ENIAC (Electronic Numerical Integrator and Computer) занимал целую комнату площадью около 167 кв.м и весил около 30 тонн."
      },
      {
        id: 5,
        question: "Какой объем оперативной памяти имел первый Macintosh 1984 года?",
        options: [
          "128 КБ",
          "512 КБ",
          "1 МБ",
          "4 МБ"
        ],
        correct: 0,
        explanation: "Первый Macintosh имел 128 КБ оперативной памяти, что считалось достаточным для графического интерфейса пользователя того времени."
      }
    ]
  },
  {
    title: "Революция мобильных устройств",
    description: "Узнайте больше об эволюции мобильных телефонов и смартфонов в этой интерактивной викторине. От первых громоздких мобильных телефонов до современных смартфонов - проверьте, насколько хорошо вы знаете историю устройств, которыми пользуемся каждый день.",
    shortDescription: "Тест о развитии мобильных телефонов и смартфонов",
    category: "Технологии",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop",
    difficulty: "easy",
    minAge: 10,
    estimatedTime: 10,
    featured: true,
    relatedExhibits: [3],
    questions: [
      {
        id: 1,
        question: "Какая компания выпустила первый смартфон с сенсорным экраном?",
        options: [
          "Apple",
          "Nokia",
          "IBM",
          "Samsung"
        ],
        correct: 2,
        explanation: "IBM Simon, выпущенный в 1994 году, считается первым смартфоном с сенсорным экраном."
      },
      {
        id: 2,
        question: "В каком году был представлен первый iPhone?",
        options: [
          "2005",
          "2007",
          "2009",
          "2010"
        ],
        correct: 1,
        explanation: "Первый iPhone был представлен Стивом Джобсом 9 января 2007 года на конференции Macworld."
      },
      {
        id: 3,
        question: "Какая операционная система используется в большинстве современных смартфонов?",
        options: [
          "iOS",
          "Android",
          "Windows Mobile",
          "BlackBerry OS"
        ],
        correct: 1,
        explanation: "Android от Google является наиболее распространенной мобильной операционной системой в мире, с долей рынка более 70%."
      },
      {
        id: 4,
        question: "Какая модель Nokia стала известна своей невероятной прочностью и надежностью?",
        options: [
          "Nokia 3310",
          "Nokia 5110",
          "Nokia 6600",
          "Nokia N95"
        ],
        correct: 0,
        explanation: "Nokia 3310, выпущенная в 2000 году, стала интернет-мемом благодаря своей легендарной прочности и надежности."
      },
      {
        id: 5,
        question: "Что из перечисленного НЕ является компонентом современного смартфона?",
        options: [
          "Гироскоп",
          "NFC-чип",
          "Электронно-лучевая трубка",
          "Акселерометр"
        ],
        correct: 2,
        explanation: "Электронно-лучевая трубка (ЭЛТ) использовалась в старых телевизорах и мониторах, но никогда не применялась в смартфонах из-за своих размеров и энергопотребления."
      }
    ]
  }
];

// Функция для заполнения базы данных викторинами
const seedQuizzes = async (force = false) => {
  try {
    // Проверяем, есть ли уже данные в таблице
    const count = await Quiz.count();
    
    // Если данных нет или указан флаг принудительного заполнения
    if (count === 0 || force) {
      console.log('📥 Добавление тестовых викторин в базу данных...');
      
      // Создаем записи последовательно
      for (const item of defaultQuizzes) {
        await Quiz.create(item);
      }
      
      console.log(`✅ Добавлено ${defaultQuizzes.length} тестовых викторин`);
    } else {
      console.log(`ℹ️ В базе данных уже есть ${count} викторин. Пропускаем добавление тестовых данных.`);
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении тестовых викторин:', error);
  }
};

export { Quiz, seedQuizzes }; 