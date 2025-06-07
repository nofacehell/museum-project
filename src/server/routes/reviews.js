// server/src/routes/reviews.js
import express from 'express';
import { Review } from '../models/index.js';
import { processImages } from '../utils/imageHandler.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Получаем __dirname эквивалент для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads/reviews');
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
    }
  }
});

// Utility to parse JSON fields safely
function tryParseJSON(value, fallback = []) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

// GET /api/reviews — все одобренные
router.get('/', async (req, res) => {
  try {
    let reviews;
    if (req.dbConnected) {
      const rows = await Review.findAll({
        where: { status: 'approved' },
        attributes: ['id', 'name', 'comment', 'rating', 'status', 'createdAt', 'images', 'visitorName', 'visitorEmail'],
        order: [['createdAt', 'DESC']],
      });
      reviews = rows.map(r => r.get({ plain: true }));
    } else {
      reviews = (req.localDB.getAll('reviews') || [])
        .filter(r => r.status === 'approved');
    }

    // распарсить images и форматировать данные
    reviews = reviews.map(r => ({
      id: r.id,
      name: r.visitorName || r.name,
      text: r.comment,
      rating: r.rating,
      images: tryParseJSON(r.images, []),
      date: r.createdAt,
      status: r.status,
      approved: r.status === 'approved'
    }));

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Ошибка при получении отзывов', error: err.message });
  }
});

// GET /api/reviews/admin — все (для админа)
router.get('/admin', async (req, res) => {
  try {
    let reviews;
    if (req.dbConnected) {
      const rows = await Review.findAll({
        attributes: ['id', 'name', 'comment', 'rating', 'status', 'createdAt', 'images', 'visitorName', 'visitorEmail'],
        order: [['createdAt', 'DESC']],
      });
      reviews = rows.map(r => r.get({ plain: true }));
    } else {
      reviews = req.localDB.getAll('reviews') || [];
    }

    console.log('Raw reviews from DB:', reviews); // Debug log

    // распарсить images и форматировать данные
    reviews = reviews.map(r => {
      // Проверяем наличие текста отзыва
      const reviewText = r.comment || r.text || '';
      
      // Обрабатываем изображения
      let images = [];
      try {
        if (r.images) {
          if (typeof r.images === 'string') {
            images = JSON.parse(r.images);
            console.log(`Распарсили JSON изображения для отзыва ${r.id}:`, images);
          } else if (Array.isArray(r.images)) {
            images = r.images;
            console.log(`Изображения уже в массиве для отзыва ${r.id}:`, images);
          }
        }
      } catch (error) {
        console.error(`Ошибка парсинга изображений для отзыва ${r.id}:`, error);
      }
      
      // Проверяем, есть ли в массиве хотя бы одно изображение
      const hasImages = Array.isArray(images) && images.length > 0;
      
      return {
        id: r.id,
        name: r.visitorName || r.name,
        text: reviewText,
        comment: reviewText, // Добавляем поле comment для совместимости
        rating: r.rating || 5,
        images: hasImages ? images : [],
        date: r.createdAt,
        status: r.status || 'pending',
        approved: r.status === 'approved',
        visitorEmail: r.visitorEmail
      };
    });

    console.log('Formatted reviews for admin (FINAL):', reviews);
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching admin reviews:', err);
    res.status(500).json({ message: 'Ошибка при получении всех отзывов', error: err.message });
  }
});

// POST /api/reviews — создать отзыв
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    console.log('Received review data:', {
      body: req.body,
      files: req.files
    });

    const { name, comment, rating, exhibitId, email } = req.body;
    
    // Проверяем обязательные поля
    if (!name || !comment || rating == null || !email) {
      return res.status(400).json({ 
        message: 'Не указаны обязательные поля: name, comment, rating, email',
        received: { name, comment, rating, email }
      });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Рейтинг должен быть от 1 до 5' });
    }

    // Обрабатываем загруженные файлы
    let images = [];
    if (req.files && req.files.length > 0) {
      try {
        // Формируем пути к файлам
        images = req.files.map(file => `/api/uploads/reviews/${file.filename}`);
        console.log('Uploaded files:', req.files);
        console.log('Image paths:', images);
      } catch (error) {
        console.error('Error processing uploaded files:', error);
        return res.status(500).json({ 
          message: 'Ошибка при обработке загруженных файлов',
          error: error.message 
        });
      }
    }

    // Сохраняем пути в JSON строку
    const imagesJson = images.length ? JSON.stringify(images) : null;

    const record = {
      name,
      visitorName: name,
      visitorEmail: email,
      comment,
      rating,
      images: imagesJson,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      exhibitId,
    };

    console.log('Creating review record:', record);

    let created;
    try {
      if (req.dbConnected) {
        const inst = await Review.create(record);
        created = inst.get({ plain: true });
      } else {
        const all = req.localDB.getAll('reviews') || [];
        const id = all.length ? Math.max(...all.map(r=>r.id||0))+1 : 1;
        created = { id, ...record };
        all.push(created);
        req.localDB.save('reviews', all);
      }
    } catch (error) {
      console.error('Error saving review:', error);
      // Если произошла ошибка при сохранении, удаляем загруженные файлы
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            await fs.promises.unlink(file.path);
          } catch (unlinkError) {
            console.error('Error deleting uploaded file:', unlinkError);
          }
        }
      }
      return res.status(500).json({ 
        message: 'Ошибка при сохранении отзыва',
        error: error.message 
      });
    }

    // Форматируем ответ
    const response = {
      id: created.id,
      name: created.visitorName || created.name,
      text: created.comment,
      rating: created.rating,
      images: tryParseJSON(created.images, []),
      date: created.createdAt,
      status: created.status,
      approved: created.status === 'approved'
    };

    res.status(201).json({
      message: 'Отзыв успешно создан и будет опубликован после проверки модератором',
      review: response
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ 
      message: 'Ошибка при создании отзыва',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// PATCH /api/reviews/:id/status — обновить статус/approved
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;

    if (req.dbConnected) {
      const inst = await Review.findByPk(id);
      if (!inst) return res.status(404).json({ message: 'Отзыв не найден' });
      const updatedData = {
        status: status,
        updatedAt: new Date()
      };
      await inst.update(updatedData);
      const updated = inst.get({ plain: true });
      
      // Форматируем ответ
      const response = {
        id: updated.id,
        name: updated.visitorName || updated.name,
        text: updated.comment,
        rating: updated.rating,
        images: tryParseJSON(updated.images, []),
        date: updated.createdAt,
        status: updated.status,
        approved: updated.status === 'approved'
      };
      
      return res.json({ message: 'Статус отзыва обновлён', review: response });
    }

    // fallback: localDB
    const all = req.localDB.getAll('reviews') || [];
    const idx = all.findIndex(r => String(r.id) === id);
    if (idx === -1) return res.status(404).json({ message: 'Отзыв не найден' });
    all[idx] = {
      ...all[idx],
      status: status,
      updatedAt: new Date()
    };
    req.localDB.save('reviews', all);
    
    // Форматируем ответ
    const response = {
      id: all[idx].id,
      name: all[idx].visitorName || all[idx].name,
      text: all[idx].comment,
      rating: all[idx].rating,
      images: tryParseJSON(all[idx].images, []),
      date: all[idx].createdAt,
      status: all[idx].status,
      approved: all[idx].status === 'approved'
    };
    
    res.json({ message: 'Статус отзыва обновлён (локально)', review: response });
  } catch (err) {
    console.error('Error updating review status:', err);
    res.status(400).json({ message: 'Ошибка при обновлении статуса отзыва', error: err.message });
  }
});

// DELETE /api/reviews/:id — удалить отзыв
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (req.dbConnected) {
      const inst = await Review.findByPk(id);
      if (!inst) return res.status(404).json({ message: 'Отзыв не найден' });
      await inst.destroy();
      return res.json({ message: 'Отзыв успешно удалён' });
    }

    // fallback: localDB
    const all = req.localDB.getAll('reviews') || [];
    const idx = all.findIndex(r => String(r.id) === id);
    if (idx === -1) return res.status(404).json({ message: 'Отзыв не найден' });
    all.splice(idx, 1);
    req.localDB.save('reviews', all);
    res.json({ message: 'Отзыв удалён (локально)' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Ошибка при удалении отзыва', error: err.message });
  }
});

export default router;
