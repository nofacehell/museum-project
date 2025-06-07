import express from 'express';
import { Quiz } from '../models/index.js';

const router = express.Router();

// GET /api/quizzes
router.get('/', async (req, res) => {
  try {
    let quizzes;
    
    if (req.dbConnected) {
      // Получаем данные из базы данных
      quizzes = await Quiz.findAll({ order: [['createdAt', 'DESC']] });
    } else {
      // Получаем данные из локального хранилища
      quizzes = req.localDB.getAll('quizzes');
      console.log(`Используем локальное хранилище: найдено ${quizzes.length} викторин`);
    }
    
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ message: 'Ошибка при получении викторин', error: err.message });
  }
});

// GET /api/quizzes/featured
router.get('/featured', async (req, res) => {
  try {
    let featured;
    
    if (req.dbConnected) {
      featured = await Quiz.findAll({ where: { featured: true }, order: [['createdAt', 'DESC']] });
    } else {
      // Получаем данные из локального хранилища
      const quizzes = req.localDB.getAll('quizzes');
      featured = quizzes.filter(q => q.featured);
    }
    
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
    let byCat;
    
    if (req.dbConnected) {
      byCat = await Quiz.findAll({ where: { category }, order: [['createdAt', 'DESC']] });
    } else {
      // Получаем данные из локального хранилища
      const quizzes = req.localDB.getAll('quizzes');
      byCat = quizzes.filter(q => q.category === category);
    }
    
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
    let quiz;
    
    if (req.dbConnected) {
      quiz = await Quiz.findByPk(id);
    } else {
      // Получаем данные из локального хранилища
      const quizzes = req.localDB.getAll('quizzes');
      quiz = quizzes.find(q => q._id === id || String(q.id) === id);
    }
    
    if (!quiz) {
      return res.status(404).json({ message: 'Викторина не найдена' });
    }
    
    res.json(quiz);
  } catch (err) {
    console.error(`Error fetching quiz ${req.params.id}:`, err);
    res.status(500).json({ message: 'Ошибка при получении викторины', error: err.message });
  }
});

// POST /api/quizzes
router.post('/', async (req, res) => {
  try {
    let created;
    
    if (req.dbConnected) {
      created = await Quiz.create(req.body);
    } else {
      // Сохраняем в локальное хранилище
      const data = {
        ...req.body,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      created = req.localDB.addItem('quizzes', data);
    }
    
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
    let updatedQuiz;
    
    if (req.dbConnected) {
      const [updatedCount] = await Quiz.update(req.body, { where: { id } });
      if (updatedCount === 0) {
        return res.status(404).json({ message: 'Викторина не найдена или не изменена' });
      }
      updatedQuiz = await Quiz.findByPk(id);
    } else {
      // Обновляем в локальном хранилище
      const data = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      updatedQuiz = req.localDB.updateItem('quizzes', id, data);
      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Викторина не найдена' });
      }
    }
    
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
    let success;
    
    if (req.dbConnected) {
      const deletedCount = await Quiz.destroy({ where: { id } });
      success = deletedCount > 0;
    } else {
      // Удаляем из локального хранилища
      success = req.localDB.deleteItem('quizzes', id);
    }
    
    if (!success) {
      return res.status(404).json({ message: 'Викторина не найдена' });
    }
    
    res.json({ message: 'Викторина успешно удалена' });
  } catch (err) {
    console.error(`Error deleting quiz ${req.params.id}:`, err);
    res.status(500).json({ message: 'Ошибка при удалении викторины', error: err.message });
  }
});

export default router; 