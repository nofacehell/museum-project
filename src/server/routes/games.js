// server/src/routes/games.js
import express from 'express';
import { Game } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// ————— Заглушка для игр (если нет БД) ——————————
const defaultGames = [
  {
    _id: "1",
    title: "Найди пару",
    description: "Игра на память с электронными устройствами. Переворачивайте карточки и находите пары одинаковых устройств.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Elektronika_MK_52.jpg/800px-Elektronika_MK_52.jpg",
    gameType: "memory",
    difficulty: "Легкий",
    estimatedTime: "5-10 мин",
    category: "Игры на память",
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  // … другие элементы …
];

let useFallback = false;

/** Переключить использование заглушки вместо БД */
export function setUseFallbackData(flag) {
  useFallback = flag;
  console.log(`🔄 Games API using ${useFallback ? "fallback" : "database"} data`);
}

// GET /api/games
router.get('/', async (req, res) => {
  try {
    if (useFallback || !req.dbConnected) {
      return res.json(defaultGames);
    }
    const games = await Game.findAll({ order: [['createdAt', 'DESC']] });
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ message: 'Ошибка при получении игр', error: err.message });
  }
});

// GET /api/games/featured
router.get('/featured', async (req, res) => {
  try {
    if (useFallback || !req.dbConnected) {
      return res.json(defaultGames.filter(g => g.featured));
    }
    const featured = await Game.findAll({ where: { featured: true }, order: [['createdAt', 'DESC']] });
    res.json(featured);
  } catch (err) {
    console.error('Error fetching featured games:', err);
    res.status(500).json({ message: 'Ошибка при получении избранных игр', error: err.message });
  }
});

// GET /api/games/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useFallback || !req.dbConnected) {
      const game = defaultGames.find(g => g._id === id || String(g.id) === id);
      if (!game) return res.status(404).json({ message: 'Игра не найдена' });
      return res.json(game);
    }
    const game = await Game.findByPk(id);
    if (!game) return res.status(404).json({ message: 'Игра не найдена' });
    res.json(game);
  } catch (err) {
    console.error(`Error fetching game ${req.params.id}:`, err);
    res.status(500).json({ message: 'Ошибка при получении игры', error: err.message });
  }
});

// POST /api/games
router.post('/', async (req, res) => {
  try {
    if (useFallback || !req.dbConnected) {
      const newGame = { _id: String(defaultGames.length + 1), ...req.body, createdAt: new Date(), updatedAt: new Date() };
      defaultGames.push(newGame);
      return res.status(201).json(newGame);
    }
    const created = await Game.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(400).json({ message: 'Ошибка при создании игры', error: err.message });
  }
});

// PUT /api/games/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useFallback || !req.dbConnected) {
      const idx = defaultGames.findIndex(g => g._id === id || String(g.id) === id);
      if (idx === -1) return res.status(404).json({ message: 'Игра не найдена' });
      defaultGames[idx] = { ...defaultGames[idx], ...req.body, updatedAt: new Date() };
      return res.json(defaultGames[idx]);
    }
    const [updatedCount] = await Game.update(req.body, { where: { id } });
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Игра не найдена или не изменена' });
    }
    const updated = await Game.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(`Error updating game ${req.params.id}:`, err);
    res.status(400).json({ message: 'Ошибка при обновлении игры', error: err.message });
  }
});

// DELETE /api/games/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useFallback || !req.dbConnected) {
      const idx = defaultGames.findIndex(g => g._id === id || String(g.id) === id);
      if (idx === -1) return res.status(404).json({ message: 'Игра не найдена' });
      defaultGames.splice(idx, 1);
      return res.json({ message: 'Игра удалена (локально)' });
    }
    const deletedCount = await Game.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Игра не найдена' });
    }
    res.json({ message: 'Игра успешно удалена' });
  } catch (err) {
    console.error(`Error deleting game ${req.params.id}:`, err);
    res.status(500).json({ message: 'Ошибка при удалении игры', error: err.message });
  }
});

export default router;
