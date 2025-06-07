import express from 'express';
import { Category } from '../models/Category.js';
import Exhibit from '../models/Exhibit.js';

const router = express.Router();

// Получить все категории
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получить категорию по ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получить экспонаты по категории
router.get('/:id/exhibits', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const exhibits = await Exhibit.findAll({
      where: { categoryId: category.id },
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(exhibits);
  } catch (error) {
    console.error('Error fetching exhibits by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
