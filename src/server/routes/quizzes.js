import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Quiz } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Данные по умолчанию для викторин (заглушка при отсутствии БД)
const defaultQuizzes = [
  {
    _id: "1",
    title: "История компьютеров",
    description: "Проверьте свои знания об истории развития компьютерной техники, от первых ЭВМ до современных ПК.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Eniac.jpg/800px-Eniac.jpg",
    category: "История техники",
    difficulty: "Средний",
    questions: [
      {
        _id: "q1-1",
        text: "Какой компьютер считается первым массовым ПК с графическим интерфейсом?",
        options: [
          { _id: "o1-1", text: "IBM PC", isCorrect: false },
          { _id: "o1-2", text: "Apple Macintosh", isCorrect: true },
          { _id: "o1-3", text: "Commodore 64", isCorrect: false },
          { _id: "o1-4", text: "Atari ST", isCorrect: false }
        ],
        explanation: "Apple Macintosh, выпущенный в 1984 году, стал первым массовым компьютером с графическим интерфейсом пользователя (GUI) и мышью в качестве стандартного устройства ввода."
      },
      {
        _id: "q1-2",
        text: "В каком году был выпущен первый микропроцессор Intel 4004?",
        options: [
          { _id: "o2-1", text: "1965", isCorrect: false },
          { _id: "o2-2", text: "1971", isCorrect: true },
          { _id: "o2-3", text: "1975", isCorrect: false },
          { _id: "o2-4", text: "1981", isCorrect: false }
        ],
        explanation: "Intel 4004 был выпущен в 1971 году и стал первым коммерчески доступным микропроцессором, содержащим 2300 транзисторов."
      },
      {
        _id: "q1-3",
        text: "Кто создал первую программу для вычислительной машины?",
        options: [
          { _id: "o3-1", text: "Ада Лавлейс", isCorrect: true },
          { _id: "o3-2", text: "Алан Тьюринг", isCorrect: false },
          { _id: "o3-3", text: "Джон фон Нейман", isCorrect: false },
          { _id: "o3-4", text: "Чарльз Бэббидж", isCorrect: false }
        ],
        explanation: "Ада Лавлейс (1815-1852) считается первым программистом в истории. Она создала первую программу для аналитической машины Чарльза Бэббиджа (которая так и не была построена при их жизни)."
      }
    ],
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "2",
    title: "Мобильные телефоны",
    description: "Тест на знание истории мобильных телефонов и их технических характеристик.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/DynaTAC8000X.jpg/450px-DynaTAC8000X.jpg",
    category: "Мобильные устройства",
    difficulty: "Легкий",
    questions: [
      {
        _id: "q2-1",
        text: "Какая компания выпустила первый в мире коммерческий сотовый телефон Motorola DynaTAC 8000X?",
        options: [
          { _id: "o1-1", text: "Nokia", isCorrect: false },
          { _id: "o1-2", text: "Apple", isCorrect: false },
          { _id: "o1-3", text: "Motorola", isCorrect: true },
          { _id: "o1-4", text: "Samsung", isCorrect: false }
        ],
        explanation: "Первый коммерческий сотовый телефон Motorola DynaTAC 8000X был представлен компанией Motorola в 1983 году."
      },
      {
        _id: "q2-2",
        text: "Какая операционная система была установлена на первом iPhone?",
        options: [
          { _id: "o2-1", text: "iOS 1", isCorrect: true },
          { _id: "o2-2", text: "iOS", isCorrect: false },
          { _id: "o2-3", text: "iPhone OS", isCorrect: false },
          { _id: "o2-4", text: "Mac OS X Mobile", isCorrect: false }
        ],
        explanation: "На первом iPhone, представленном в 2007 году, была установлена операционная система iOS 1 (хотя тогда она называлась iPhone OS)."
      },
      {
        _id: "q2-3",
        text: "Какая модель Nokia считается самым продаваемым мобильным телефоном всех времен?",
        options: [
          { _id: "o3-1", text: "Nokia 3310", isCorrect: false },
          { _id: "o3-2", text: "Nokia 1100", isCorrect: true },
          { _id: "o3-3", text: "Nokia 5110", isCorrect: false },
          { _id: "o3-4", text: "Nokia 6600", isCorrect: false }
        ],
        explanation: "Nokia 1100, выпущенная в 2003 году, является самым продаваемым мобильным телефоном в истории с более чем 250 миллионами проданных устройств."
      }
    ],
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "3",
    title: "Портативная электроника",
    description: "Викторина о различных портативных электронных устройствах, от плееров до карманных компьютеров.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Ipod_classic_6G_80GB_packaging.jpg/800px-Ipod_classic_6G_80GB_packaging.jpg",
    category: "Аудиотехника",
    difficulty: "Сложный",
    questions: [
      {
        _id: "q3-1",
        text: "Какое устройство выпустила компания Sony в 1979 году, революционизировав способ прослушивания музыки?",
        options: [
          { _id: "o1-1", text: "Discman", isCorrect: false },
          { _id: "o1-2", text: "Walkman", isCorrect: true },
          { _id: "o1-3", text: "iPod", isCorrect: false },
          { _id: "o1-4", text: "MiniDisc", isCorrect: false }
        ],
        explanation: "Sony Walkman TPS-L2, выпущенный в 1979 году, стал первым портативным аудиоплеером, позволив людям слушать музыку на ходу."
      },
      {
        _id: "q3-2",
        text: "Какая компания создала первый серийный КПК (карманный персональный компьютер)?",
        options: [
          { _id: "o2-1", text: "Apple", isCorrect: false },
          { _id: "o2-2", text: "Palm", isCorrect: true },
          { _id: "o2-3", text: "Microsoft", isCorrect: false },
          { _id: "o2-4", text: "BlackBerry", isCorrect: false }
        ],
        explanation: "Palm выпустила Palm Pilot 1000 в 1996 году, который считается первым успешным коммерческим КПК (PDA)."
      },
      {
        _id: "q3-3",
        text: "Какой плеер выпустила компания Apple в 2001 году?",
        options: [
          { _id: "o3-1", text: "iPhone", isCorrect: false },
          { _id: "o3-2", text: "iPad", isCorrect: false },
          { _id: "o3-3", text: "iPod", isCorrect: true },
          { _id: "o3-4", text: "iWalk", isCorrect: false }
        ],
        explanation: "iPod был выпущен Apple 23 октября 2001 года и полностью изменил индустрию портативных музыкальных плееров."
      }
    ],
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

// Флаг, указывающий на использование заглушки
let useDefaultData = false;

// Функция для переключения на заглушку при проблемах с БД
export const setUseDefaultData = (value) => {
  useDefaultData = value;
  console.log(`🔄 API викторин переключен на ${useDefaultData ? 'тестовые данные' : 'базу данных'}`);
};

// Конфигурация Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// GET всех викторин
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (error) {
    console.error('❌ Ошибка при получении викторин:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении викторин' });
  }
});

// GET избранных викторин
router.get('/featured', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { featured: true }
    });
    res.json(quizzes);
  } catch (error) {
    console.error('❌ Ошибка при получении избранных викторин:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении избранных викторин' });
  }
});

// GET викторин по категории
router.get('/category/:category', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { category: req.params.category }
    });
    res.json(quizzes);
  } catch (error) {
    console.error(`❌ Ошибка при получении викторин категории ${req.params.category}:`, error);
    res.status(500).json({ error: `Ошибка сервера при получении викторин категории ${req.params.category}` });
  }
});

// GET викторины по ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Викторина не найдена' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error(`❌ Ошибка при получении викторины с ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Ошибка сервера при получении викторины' });
  }
});

// POST создание новой викторины
router.post('/', async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('❌ Ошибка при создании викторины:', error);
    res.status(400).json({ 
      error: 'Ошибка при создании викторины',
      details: error.message 
    });
  }
});

// PUT обновление викторины
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Quiz.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updated === 0) {
      return res.status(404).json({ error: 'Викторина не найдена или не изменена' });
    }
    
    const updatedQuiz = await Quiz.findByPk(req.params.id);
    res.json(updatedQuiz);
  } catch (error) {
    console.error(`❌ Ошибка при обновлении викторины с ID ${req.params.id}:`, error);
    res.status(400).json({ 
      error: 'Ошибка при обновлении викторины',
      details: error.message 
    });
  }
});

// DELETE удаление викторины
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Quiz.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ error: 'Викторина не найдена' });
    }
    
    res.json({ message: 'Викторина успешно удалена' });
  } catch (error) {
    console.error(`❌ Ошибка при удалении викторины с ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Ошибка сервера при удалении викторины' });
  }
});

export default router; 