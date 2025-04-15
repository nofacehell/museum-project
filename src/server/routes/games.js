import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Game } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Данные по умолчанию для игр (заглушка при отсутствии БД)
const defaultGames = [
  {
    _id: "1",
    title: "Найди пару",
    description: "Игра на память с электронными устройствами. Переворачивайте карточки и находите пары одинаковых устройств, тренируя свою память и знакомясь с историей электроники.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Elektronika_MK_52.jpg/800px-Elektronika_MK_52.jpg",
    gameType: "memory",
    difficulty: "Легкий",
    estimatedTime: "5-10 мин",
    category: "Игры на память",
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "2",
    title: "Оригинал или подделка?",
    description: "Сможете ли вы отличить оригинальное устройство от подделки? В этой игре вам предстоит выбрать из двух изображений то, которое показывает подлинное электронное устройство.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Raspberry_Pi_4_Model_B_-_Top.jpg/800px-Raspberry_Pi_4_Model_B_-_Top.jpg",
    gameType: "artist",
    difficulty: "Средний",
    estimatedTime: "5-10 мин",
    category: "Викторины",
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "3",
    title: "Хронология электроники",
    description: "Разместите электронные устройства в правильном хронологическом порядке их появления. Проверьте свои знания истории развития технологий!",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/First-hp35.jpg/800px-First-hp35.jpg",
    gameType: "timeline",
    difficulty: "Сложный",
    estimatedTime: "5-10 мин",
    category: "Викторины", 
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "4",
    title: "Угадай тип устройства",
    description: "Сможете ли вы определить тип электронного устройства по его внешнему виду? В этой игре вам предстоит выбрать правильную категорию устройства, основываясь только на его изображении.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Atari_2600_Wood_4Sw_Set.jpg/800px-Atari_2600_Wood_4Sw_Set.jpg",
    gameType: "style",
    difficulty: "Средний",
    estimatedTime: "5-10 мин",
    category: "Викторины",
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
  console.log(`🔄 API игр переключен на ${useDefaultData ? 'тестовые данные' : 'базу данных'}`);
};

// Конфигурация Cloudinary (если используется)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// GET всех игр
router.get('/', async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    console.error('❌ Ошибка при получении игр:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении игр' });
  }
});

// GET избранных игр
router.get('/featured', async (req, res) => {
  try {
    const games = await Game.findAll({
      where: { featured: true }
    });
    res.json(games);
  } catch (error) {
    console.error('❌ Ошибка при получении избранных игр:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении избранных игр' });
  }
});

// GET игры по ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    
    if (!game) {
      return res.status(404).json({ error: 'Игра не найдена' });
    }
    
    res.json(game);
  } catch (error) {
    console.error(`❌ Ошибка при получении игры с ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Ошибка сервера при получении игры' });
  }
});

// POST создание новой игры
router.post('/', async (req, res) => {
  try {
    const newGame = await Game.create(req.body);
    res.status(201).json(newGame);
  } catch (error) {
    console.error('❌ Ошибка при создании игры:', error);
    res.status(400).json({ 
      error: 'Ошибка при создании игры',
      details: error.message 
    });
  }
});

// PUT обновление игры
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Game.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updated === 0) {
      return res.status(404).json({ error: 'Игра не найдена или не изменена' });
    }
    
    const updatedGame = await Game.findByPk(req.params.id);
    res.json(updatedGame);
  } catch (error) {
    console.error(`❌ Ошибка при обновлении игры с ID ${req.params.id}:`, error);
    res.status(400).json({ 
      error: 'Ошибка при обновлении игры',
      details: error.message 
    });
  }
});

// DELETE удаление игры
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Game.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({ error: 'Игра не найдена' });
    }
    
    res.json({ message: 'Игра успешно удалена' });
  } catch (error) {
    console.error(`❌ Ошибка при удалении игры с ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Ошибка сервера при удалении игры' });
  }
});

export default router; 