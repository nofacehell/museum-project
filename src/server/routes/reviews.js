import express from 'express';
import { Review } from '../models/index.js';
import { Op } from 'sequelize';
import { processImages } from '../utils/imageHandler.js';

const router = express.Router();

// Получить все одобренные отзывы
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { status: 'approved' },
      attributes: ['id', 'name', 'comment', 'rating', 'status', 'createdAt', 'images'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(reviews);
  } catch (error) {
    console.error('❌ Ошибка при получении отзывов:', error);
    res.status(500).json({ message: 'Ошибка при получении отзывов', error: error.message });
  }
});

// Получить все отзывы для администратора (включая неодобренные)
router.get('/admin', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      attributes: ['id', 'name', 'comment', 'rating', 'status', 'createdAt', 'images', 'approved'],
      order: [['createdAt', 'DESC']]
    });
    
    // Преобразуем данные перед отправкой
    const formattedReviews = reviews.map(review => {
      const rawReview = review.get({ plain: true });
      // Если images это строка JSON, парсим её
      if (typeof rawReview.images === 'string') {
        try {
          rawReview.images = JSON.parse(rawReview.images);
        } catch (e) {
          console.error('Error parsing images JSON:', e);
          rawReview.images = [];
        }
      }
      return rawReview;
    });
    
    console.log('Sending admin reviews:', formattedReviews);
    res.json(formattedReviews);
  } catch (error) {
    console.error('❌ Ошибка при получении всех отзывов:', error);
    res.status(500).json({ message: 'Ошибка при получении всех отзывов', error: error.message });
  }
});

// Создать новый отзыв
router.post('/', async (req, res) => {
  try {
    const reviewData = req.body;
    console.log('Received review data:', reviewData);
    
    // Проверяем обязательные поля
    if (!reviewData.name || !reviewData.comment || !reviewData.rating) {
      return res.status(400).json({ 
        message: 'Не указаны обязательные поля: name, comment, rating' 
      });
    }
    
    // Проверяем корректность рейтинга
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return res.status(400).json({ 
        message: 'Рейтинг должен быть от 1 до 5' 
      });
    }
    
    // Обрабатываем изображения
    let processedImages = [];
    if (reviewData.images) {
      // Если images пришло как строка, пытаемся распарсить JSON
      if (typeof reviewData.images === 'string') {
        try {
          reviewData.images = JSON.parse(reviewData.images);
        } catch (e) {
          console.error('Error parsing images JSON:', e);
          reviewData.images = [];
        }
      }
      
      // Обрабатываем и сохраняем изображения
      processedImages = await processImages(reviewData.images);
      console.log('Processed images:', processedImages);
    }
    
    // Создаем объект для сохранения в БД
    const reviewToSave = {
      name: reviewData.name,
      comment: reviewData.comment,
      rating: reviewData.rating,
      images: processedImages.length > 0 ? JSON.stringify(processedImages) : null,
      approved: false,
      status: 'pending'
    };
    
    console.log('Saving review with processed images:', reviewToSave);
    
    // Создаем новый отзыв
    const review = await Review.create(reviewToSave);
    
    // Получаем созданный отзыв
    const createdReview = review.get({ plain: true });
    if (typeof createdReview.images === 'string') {
      try {
        createdReview.images = JSON.parse(createdReview.images);
      } catch (e) {
        console.error('Error parsing created review images:', e);
        createdReview.images = [];
      }
    }
    
    console.log('Created review:', createdReview);
    
    res.status(201).json({
      message: 'Отзыв успешно создан и будет опубликован после проверки модератором',
      review: createdReview
    });
  } catch (error) {
    console.error('❌ Ошибка при создании отзыва:', error);
    res.status(400).json({ message: 'Ошибка при создании отзыва', error: error.message });
  }
});

// Обновить статус отзыва (одобрить/отклонить)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, approved } = req.body;
    
    // Находим отзыв для обновления
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    
    // Обновляем оба поля: status и approved
    const updateData = {
      status: status || (approved ? 'approved' : 'rejected'),
      approved: approved || status === 'approved'
    };
    
    // Обновляем статус отзыва
    await review.update(updateData);
    
    res.json({
      message: `Отзыв успешно ${updateData.approved ? 'одобрен' : 'отклонен'}`,
      review
    });
  } catch (error) {
    console.error(`❌ Ошибка при обновлении статуса отзыва с ID ${req.params.id}:`, error);
    res.status(400).json({ message: 'Ошибка при обновлении статуса отзыва', error: error.message });
  }
});

// Удалить отзыв
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    
    // Удаляем отзыв из БД
    await review.destroy();
    
    res.json({ message: 'Отзыв успешно удален' });
  } catch (error) {
    console.error(`❌ Ошибка при удалении отзыва с ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Ошибка при удалении отзыва', error: error.message });
  }
});

export default router; 