// server/src/routes/quizzes.js
import express from 'express';
import { Quiz } from '../models/index.js';

const router = express.Router();

// ————— Заглушка для викторин (если БД недоступна) ——————————
const defaultQuizzes = [
  {
    _id: "1",
    title: "История компьютеров",
    description: "Проверьте свои знания об истории развития компьютерной техники.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Eniac.jpg/800px-Eniac.jpg",
    category: "История техники",
    difficulty: "Средний",
    questions: [ /* ... */ ],
    featured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  // … другие викторины …
];

let useFallback = false;

/** 
 * Переключить использование локальных тестовых данных 
 * вместо реальной БД 
 */
export function setUseFallbackData(flag) {
  useFallback = flag;
  console.log(`🔄 Quizzes API using ${useFallback ? 'fallback' : 'database'} data`);
}

// GET /api/quizzes
router.get('/', async (req, res) => {
  try {
    if (useFallback || !req.dbConnected) {
      return res.json(defaultQuizzes);
    }
    const quizzes = await Quiz.findAll({ order: [['createdAt', 'DESC']] });
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ message: 'Ошибка при получении викторин', error: err.message });
  }
});

// GET /api/quizzes/featured
router.get('/featured', async (req, res) => {
  try {
    if (useFallback || !req.dbConnected) {
      return res.json(defaultQuizzes.filter(q => q.featured));
    }
    const featured = await Quiz.findAll({ where: { featured: true }, order: [['createdAt', 'DESC']] });
    res.json(featured);
  } catch (err) {
    console.error('Error fetching featured quizzes:', err);
    res.status(500).json({ message: 'Ошибка при получении избранных викторин', error: err.message });
  }
});

// GET /api/quizzes/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    if (useFallback || !req.dbConnected) {
      return res.json(defaultQuizzes.filter(q => q.category === category));
    }
    const byCat = await Quiz.findAll({ where: { category }, order: [['createdAt', 'DESC']] });
    res.json(byCat);
  } catch (err) {
    console.error(`Error fetching quizzes in category ${req.params.category}:`, err);
    res.status(500).json({ message: 'Ошибка при получении викторин по категории', error: err.message });
  }
});

// GET /api/quizzes/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useFallback || !req.dbConnected) {
      const quiz = defaultQuizzes.find(q => q._id === id || String(q.id) === id);
      if (!quiz) return res.status(404).json({ message: 'Викторина не найдена' });
      return res.json(quiz);
    }
    const quiz = await Quiz.findByPk(id);
    if (!quiz) return res.status(404).json({ message: 'Викторина не найдена' });
    res.json(quiz);
  } catch (err) {
    console.error(`Error fetching quiz ${req.params.id}:`, err);
    res.status(500).json({ message: 'Ошибка при получении викторины', error: err.message });
  }
});

// POST /api/quizzes
router.post('/', async (req, res) => {
  try {
    if (useFallback || !req.dbConnected) {
      const newQuiz = { 
        _id: String(defaultQuizzes.length + 1), 
        ...req.body, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      defaultQuizzes.push(newQuiz);
      return res.status(201).json(newQuiz);
    }
    const created = await Quiz.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(400).json({ message: 'Ошибка при создании викторины', error: err.message });
  }
});

// PUT /api/quizzes/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useFallback || !req.dbConnected) {
      const idx = defaultQuizzes.findIndex(q => q._id === id || String(q.id) === id);
      if (idx === -1) return res.status(404).json({ message: 'Викторина не найдена' });
      defaultQuizzes[idx] = { ...defaultQuizzes[idx], ...req.body, updatedAt: new Date() };
      return res.json(defaultQuizzes[idx]);
    }
    const [updatedCount] = await Quiz.update(req.body, { where: { id } });
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Викторина не найдена или не изменена' });
    }
    const updatedQuiz = await Quiz.findByPk(id);
    res.json(updatedQuiz);
  } catch (err) {
    console.error(`Error updating quiz ${req.params.id}:`, err);
    res.status(400).json({ message: 'Ошибка при обновлении викторины', error: err.message });
  }
});

// DELETE /api/quizzes/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useFallback || !req.dbConnected) {
      const idx = defaultQuizzes.findIndex(q => q._id === id || String(q.id) === id);
      if (idx === -1) return res.status(404).json({ message: 'Викторина не найдена' });
      defaultQuizzes.splice(idx, 1);
      return res.json({ message: 'Викторина удалена (локально)' });
    }
    const deletedCount = await Quiz.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Викторина не найдена' });
    }
    res.json({ message: 'Викторина успешно удалена' });
  } catch (err) {
    console.error(`Error deleting quiz ${req.params.id}:`, err);
    res.status(500).json({ message: 'Ошибка при удалении викторины', error: err.message });
  }
});

export default router;
