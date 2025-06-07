// server/src/routes/exhibits.js
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Exhibit from '../models/Exhibit.js';
import { generateCategoryIcon } from '../utils/iconHelper.js';
import { Category } from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Настройка папки для загрузок ────────────────────────────────
const uploadsDir = path.join(__dirname, '../../../uploads/exhibits');
fs.mkdirSync(uploadsDir, { recursive: true });

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads/exhibits');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Создаём инстанс multer
const uploadInstance = multer({ storage });

// Функция для удаления старого изображения
const deleteOldImage = async (imagePath) => {
  if (!imagePath) return;
  try {
    const fullPath = path.join(__dirname, '../../../', imagePath.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
  }
};

const router = express.Router();

// ─── Получить все экспонаты ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const exhibits = await Exhibit.findAll({
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(exhibits);
  } catch (error) {
    console.error('Error fetching exhibits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Избранные экспонаты ─────────────────────────────────────────
router.get('/featured', async (req, res) => {
  try {
    const data = req.dbConnected
      ? await Exhibit.findAll({ where: { featured: true }, limit: 3 })
      : (req.localDB.getAll('exhibits') || []).filter(e => e.featured).slice(0, 3);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении избранных экспонатов', error: err.message });
  }
});

// ─── По категории ─────────────────────────────────────────────────
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const data = req.dbConnected
      ? await Exhibit.findAll({ where: { category } })
      : (req.localDB.getAll('exhibits') || []).filter(e => e.category === category);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении по категории', error: err.message });
  }
});

// ─── Восстановить дефолтные экспонаты ────────────────────────────
router.get('/restore', async (_req, res) => {
  try {
    const ok = await restoreExhibits();
    res.json({
      success: true,
      message: ok
        ? 'Базовые экспонаты восстановлены успешно'
        : 'Восстановление не требуется'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при восстановлении', error: err.message });
  }
});

// ─── Пакетная загрузка ────────────────────────────────────────────
router.post('/batch', async (req, res) => {
  try {
    const { exhibits } = req.body;
    if (!Array.isArray(exhibits) || exhibits.length === 0) {
      return res.status(400).json({ message: 'Нужен массив экспонатов' });
    }
    const created = [];
    for (const item of exhibits) {
      try {
        const inst = await Exhibit.create(item);
        created.push(inst);
      } catch (e) {
        console.error('Batch error:', e);
      }
    }
    res.status(201).json({
      message: `Создано ${created.length} из ${exhibits.length}`,
      created
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка пакетного создания', error: err.message });
  }
});

// ─── Конкретный экспонат ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const exhibit = await Exhibit.findByPk(req.params.id, {
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }]
    });
    if (!exhibit) {
      return res.status(404).json({ error: 'Exhibit not found' });
    }
    res.json(exhibit);
  } catch (error) {
    console.error('Error fetching exhibit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать экспонат
router.post('/', uploadInstance.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), async (req, res) => {
  try {
    console.log('=== POST /api/exhibits ===');
    console.log('req.files:', req.files);
    console.log('req.body:', req.body);
    const exhibitData = {
      ...req.body,
      image: req.files.image ? `/uploads/exhibits/${req.files.image[0].filename}` : null,
      technicalSpecs: req.body.technicalSpecs ? JSON.parse(req.body.technicalSpecs) : {},
      additionalImages: req.files.additionalImages ? req.files.additionalImages.map(f => `/uploads/exhibits/${f.filename}`) : []
    };

    const exhibit = await Exhibit.create(exhibitData);
    res.status(201).json(exhibit);
  } catch (error) {
    console.error('Error creating exhibit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить экспонат
router.put('/:id', uploadInstance.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const exhibit = await Exhibit.findByPk(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ error: 'Exhibit not found' });
    }

    const exhibitData = {
      ...req.body,
      technicalSpecs: req.body.technicalSpecs ? JSON.parse(req.body.technicalSpecs) : exhibit.technicalSpecs,
      additionalImages: req.body.additionalImages ? JSON.parse(req.body.additionalImages) : exhibit.additionalImages
    };

    if (req.file) {
      // Удаляем старое изображение, если оно существует
      if (exhibit.image) {
        const oldImagePath = path.join(__dirname, '../../', exhibit.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      exhibitData.image = `/uploads/exhibits/${req.file.filename}`;
    }

    await exhibit.update(exhibitData);
    res.json(exhibit);
  } catch (error) {
    console.error('Error updating exhibit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Удалить экспонат ────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const exhibit = await Exhibit.findByPk(req.params.id);
    if (!exhibit) {
      return res.status(404).json({ error: 'Exhibit not found' });
    }

    // Удаляем изображения
    if (exhibit.image) {
      const imagePath = path.join(__dirname, '../../', exhibit.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (exhibit.additionalImages && exhibit.additionalImages.length > 0) {
      exhibit.additionalImages.forEach(image => {
        const imagePath = path.join(__dirname, '../../', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await exhibit.destroy();
    res.json({ message: 'Exhibit deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
