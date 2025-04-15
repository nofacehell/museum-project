import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exhibit from './models/Exhibit.js';
import Game from './models/Game.js';
import Quiz from './models/Quiz.js';
import connectDB from './config/db.js';

dotenv.config();

// Подключение к базе данных
connectDB();

// Тестовые данные для экспонатов
const exhibitData = [
  {
    title: "Apple Macintosh",
    category: "Компьютеры",
    description: "Первый массовый персональный компьютер с графическим интерфейсом, выпущенный в 1984 году. Macintosh произвел революцию в компьютерной индустрии, представив дружественный к пользователю интерфейс и мышь как стандартное устройство ввода. Его выпуск был ознаменован знаменитой рекламой '1984', снятой режиссером Ридли Скоттом.",
    shortDescription: "Первый массовый персональный компьютер с графическим интерфейсом, выпущенный в 1984 году.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Macintosh_128k_transparency.png/800px-Macintosh_128k_transparency.png",
    year: "1984",
    manufacturer: "Apple Inc.",
    technicalSpecs: {
      "Процессор": "Motorola 68000 @ 8 МГц",
      "Память": "128 КБ RAM",
      "Хранение": "400 КБ 3.5\" дисковод",
      "Экран": "9-дюймовый 512x342 монохромный"
    },
    historicalContext: "Macintosh был представлен во время переломного периода в истории персональных компьютеров. Это был первый коммерчески успешный персональный компьютер с графическим интерфейсом и мышью. Эти инновации сделали компьютеры намного более доступными для обычных пользователей, что привело к широкому распространению домашних компьютеров в 1980-х и 1990-х годах.",
    featured: true
  },
  {
    title: "Sony Walkman TPS-L2",
    category: "Аудиотехника",
    description: "Первый в мире портативный аудиоплеер, выпущенный в 1979 году, революционизировал способ, которым люди слушают музыку. Компактный Walkman позволил людям брать свою музыку с собой куда угодно, что сделало музыку более персональной и портативной. Модель TPS-L2 была первой в огромной линейке устройств Walkman, которые производились до 2010 года.",
    shortDescription: "Первый в мире портативный аудиоплеер, изменивший способ прослушивания музыки, выпущенный в 1979 году.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Original_Sony_Walkman_TPS-L2.JPG/800px-Original_Sony_Walkman_TPS-L2.JPG",
    year: "1979",
    manufacturer: "Sony Corporation",
    technicalSpecs: {
      "Тип носителя": "Компакт-кассета",
      "Батарея": "2 x AA батареи",
      "Функции": "Воспроизведение, перемотка, функция 'горячая линия' (микрофон)",
      "Разъемы": "Два 3.5 мм аудиовыхода"
    },
    historicalContext: "До появления Walkman, портативные музыкальные устройства были громоздкими и неудобными. Sony Walkman изменил культуру потребления музыки, сделав ее действительно личным опытом. Это устройство создало новый рынок портативной электроники и заложило основу для будущих устройств, таких как Discman, MP3-плееры и в конечном итоге смартфоны с функциями музыкальных плееров.",
    featured: true
  },
  {
    title: "Nokia 3310",
    category: "Мобильные устройства",
    description: "Легендарный мобильный телефон, известный своей невероятной прочностью, представленный в 2000 году. Nokia 3310 продалась тиражом более 126 миллионов единиц, став одним из самых успешных мобильных телефонов в истории. Помимо прочности, телефон был известен своей длительной работой от батареи, сменными панелями и популярной игрой 'Змейка'.",
    shortDescription: "Легендарный мобильный телефон, известный своей невероятной прочностью, представленный в 2000 году.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Nokia_3310_blue_R7309170_%28retouch%29.png/800px-Nokia_3310_blue_R7309170_%28retouch%29.png",
    year: "2000",
    manufacturer: "Nokia",
    technicalSpecs: {
      "Дисплей": "Монохромный 84 x 48 пикселей",
      "Вес": "133 г",
      "Батарея": "900 мАч, до 260 часов в режиме ожидания",
      "Функции": "SMS, игры (Змейка, Память, Тетрис), будильник"
    },
    historicalContext: "Nokia 3310 появился в период быстрого роста рынка мобильных телефонов, когда они только начинали становиться предметами массового потребления. Его надежность, доступность и функциональность сделали его популярным во всем мире. В культурном плане, Nokia 3310 стал иконой дизайна и символом эпохи до смартфонов, а его слава породила множество интернет-мемов о его неразрушимости.",
    featured: true
  }
];

// Тестовые данные для игр
const gameData = [
  {
    title: "Память: Ретро-гаджеты",
    description: "Классическая игра на память с культовыми электронными устройствами. Найдите пары одинаковых гаджетов и узнайте больше о технологических вехах.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Electronic_devices.jpg/800px-Electronic_devices.jpg",
    gameType: "memory",
    route: "/games/memory",
    difficulty: "лёгкий",
    estimatedTime: "5-10 минут",
    category: "Память"
  },
  {
    title: "Угадай производителя",
    description: "Тест на знание истории электроники. Сможете ли вы определить, какая компания выпустила эти легендарные устройства?",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Technology_through_time.jpg",
    gameType: "artist",
    route: "/games/artist",
    difficulty: "средний",
    estimatedTime: "10-15 минут",
    category: "Знания"
  },
  {
    title: "Хронология технологий",
    description: "Расположите важные электронные устройства в правильном хронологическом порядке и изучите эволюцию технологий за последние десятилетия.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Elektronika_MK-52_calculator.jpg/800px-Elektronika_MK-52_calculator.jpg",
    gameType: "timeline",
    route: "/games/timeline",
    difficulty: "сложный",
    estimatedTime: "15-20 минут",
    category: "История"
  },
  {
    title: "Определи поколение",
    description: "Сможете ли вы определить, к какому поколению и эпохе принадлежит устройство? Проверьте свои знания в области истории электроники!",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Amiga500_system.jpg/800px-Amiga500_system.jpg",
    gameType: "style",
    route: "/games/style",
    difficulty: "средний",
    estimatedTime: "10-15 минут",
    category: "Эпохи"
  }
];

// Тестовые данные для викторин
const quizData = [
  {
    title: "История вычислительной техники",
    description: "Проверьте свои знания об эволюции компьютеров и вычислительных устройств",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Old-computers-in-storage.jpg/800px-Old-computers-in-storage.jpg",
    category: "Компьютеры",
    difficulty: "средний",
    timeLimit: 10,
    questions: [
      {
        question: "Какой компьютер считается первым массовым персональным компьютером с графическим интерфейсом?",
        options: [
          { text: "Apple Macintosh", isCorrect: true },
          { text: "IBM PC", isCorrect: false },
          { text: "Commodore 64", isCorrect: false },
          { text: "Atari ST", isCorrect: false }
        ],
        explanation: "Apple Macintosh, выпущенный в 1984 году, стал первым массовым компьютером с графическим интерфейсом пользователя (GUI)."
      },
      {
        question: "В каком году был представлен первый iPhone?",
        options: [
          { text: "2005", isCorrect: false },
          { text: "2006", isCorrect: false },
          { text: "2007", isCorrect: true },
          { text: "2008", isCorrect: false }
        ],
        explanation: "Стив Джобс представил первый iPhone на конференции Macworld 9 января 2007 года."
      },
      {
        question: "Кто является создателем операционной системы Linux?",
        options: [
          { text: "Стив Джобс", isCorrect: false },
          { text: "Билл Гейтс", isCorrect: false },
          { text: "Линус Торвальдс", isCorrect: true },
          { text: "Марк Цукерберг", isCorrect: false }
        ],
        explanation: "Linux был создан финским студентом Линусом Торвальдсом в 1991 году как бесплатная альтернатива UNIX."
      }
    ]
  },
  {
    title: "Мобильная революция",
    description: "Тест о мобильных телефонах и их влиянии на современный мир",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/DynaTAC8000X.jpg/450px-DynaTAC8000X.jpg",
    category: "Мобильные устройства",
    difficulty: "лёгкий",
    timeLimit: 5,
    questions: [
      {
        question: "Какая компания выпустила первый в мире мобильный телефон?",
        options: [
          { text: "Nokia", isCorrect: false },
          { text: "Apple", isCorrect: false },
          { text: "Motorola", isCorrect: true },
          { text: "Samsung", isCorrect: false }
        ],
        explanation: "Первый в мире коммерческий портативный сотовый телефон - Motorola DynaTAC 8000X был выпущен в 1983 году."
      },
      {
        question: "Какой мобильный телефон известен своей исключительной прочностью и долговечностью?",
        options: [
          { text: "iPhone 3G", isCorrect: false },
          { text: "Nokia 3310", isCorrect: true },
          { text: "Blackberry Bold", isCorrect: false },
          { text: "Samsung Galaxy S", isCorrect: false }
        ],
        explanation: "Nokia 3310, выпущенная в 2000 году, стала известна своей невероятной прочностью, что привело к множеству мемов в интернете."
      },
      {
        question: "Что из перечисленного впервые появилось в смартфонах?",
        options: [
          { text: "Сенсорный экран", isCorrect: false },
          { text: "Камера", isCorrect: false },
          { text: "Магазин приложений", isCorrect: true },
          { text: "Bluetooth", isCorrect: false }
        ],
        explanation: "Магазин приложений (App Store) был впервые представлен Apple в 2008 году и стал революционной функцией, характерной именно для смартфонов."
      }
    ]
  }
];

// Функция для заполнения базы данных
const seedDB = async () => {
  try {
    // Очистка существующих данных
    await Exhibit.deleteMany({});
    await Game.deleteMany({});
    await Quiz.deleteMany({});
    
    console.log('Предыдущие данные удалены из базы данных');
    
    // Добавление новых данных
    const exhibits = await Exhibit.insertMany(exhibitData);
    const games = await Game.insertMany(gameData);
    const quizzes = await Quiz.insertMany(quizData);
    
    console.log(`Добавлено ${exhibits.length} экспонатов`);
    console.log(`Добавлено ${games.length} игр`);
    console.log(`Добавлено ${quizzes.length} викторин`);
    
    console.log('База данных успешно заполнена!');
    process.exit();
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
};

// Запускаем заполнение базы данных
seedDB(); 