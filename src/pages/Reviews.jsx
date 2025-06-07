import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/reviews.css';
import { getReviews, createReview } from '../utils/api';

// Создаем стили для светлой и темной темы
const createStyles = (isDark = false) => ({
  container: {
    backgroundColor: isDark ? '#121212' : '#F8FAFC',
    color: isDark ? '#F3F4F6' : '#1E293B',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    padding: '20px',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    backgroundImage: isDark ? 'linear-gradient(145deg, #1F2937, #111827)' : 'linear-gradient(145deg, #FFFFFF, #F3F4F6)',
    boxShadow: isDark ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 10px 25px rgba(148, 163, 184, 0.1)',
    borderBottom: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    transition: 'all 0.3s ease',
    borderRadius: '16px',
    padding: '40px 20px',
    marginBottom: '40px',
    position: 'relative',
    overflow: 'hidden',
  },
  decorative1: {
    background: isDark ? 'rgba(147, 51, 234, 0.15)' : 'rgba(99, 102, 241, 0.1)',
  },
  decorative2: {
    background: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(79, 70, 229, 0.1)',
  },
  decorativeDot1: {
    background: isDark ? 'rgba(147, 51, 234, 0.4)' : 'rgba(99, 102, 241, 0.3)',
  },
  decorativeDot2: {
    background: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(79, 70, 229, 0.3)',
  },
  badge: {
    backgroundColor: isDark ? '#8B5CF6' : '#6366F1',
    backgroundImage: isDark ? 'linear-gradient(145deg, #8B5CF6, #3B82F6)' : 'linear-gradient(145deg, #6366F1, #4F46E5)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    color: 'white',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '20px',
    marginBottom: '20px',
  },
  heading: {
    color: isDark ? '#F3F4F6' : '#1E293B',
    transition: 'color 0.3s ease',
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 20px',
  },
  description: {
    color: isDark ? '#9CA3AF' : '#64748B',
    transition: 'color 0.3s ease',
    fontSize: '1.1rem',
    maxWidth: '800px',
    margin: '0 auto 30px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  stat: {
    backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)',
    borderColor: isDark ? '#374151' : '#E2E8F0',
    backdropFilter: 'blur(8px)',
    boxShadow: isDark ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 10px 25px rgba(148, 163, 184, 0.1)',
    transition: 'all 0.3s ease',
    padding: '10px 20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon1: {
    color: isDark ? '#8B5CF6' : '#6366F1',
  },
  icon2: {
    color: isDark ? '#3B82F6' : '#4F46E5',
  },
  statText: {
    color: isDark ? '#F3F4F6' : '#1E293B',
  },
  formCard: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    backgroundImage: isDark ? 'linear-gradient(145deg, #1F2937, #111827)' : 'linear-gradient(145deg, #FFFFFF, #F3F4F6)',
    boxShadow: isDark ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 10px 25px rgba(148, 163, 184, 0.1)',
    border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    borderRadius: '16px',
    overflow: 'hidden',
    marginTop: '40px',
    transition: 'all 0.3s ease',
  },
  formHeader: {
    backgroundImage: isDark ? 'linear-gradient(145deg, #8B5CF6, #3B82F6)' : 'linear-gradient(145deg, #6366F1, #4F46E5)',
    padding: '30px',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '12px',
    color: 'white',
  },
  formSubtitle: {
    fontSize: '1.1rem',
    opacity: '0.9',
    color: 'white',
  },
  formBody: {
    padding: '30px',
    backgroundColor: isDark ? '#111827' : '#FFFFFF',
    transition: 'background-color 0.3s ease',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    color: isDark ? '#F3F4F6' : '#1E293B',
    fontSize: '1.1rem',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    display: 'block',
    marginBottom: '8px',
  },
  input: {
    backgroundColor: isDark ? '#1F2937' : '#F8FAFC',
    border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: isDark ? '#F3F4F6' : '#1E293B',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    backgroundColor: isDark ? '#1F2937' : '#F8FAFC',
    border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: isDark ? '#F3F4F6' : '#1E293B',
    fontSize: '1rem',
    minHeight: '150px',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    backgroundColor: isDark ? '#1F2937' : '#F8FAFC',
    border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: isDark ? '#F3F4F6' : '#1E293B',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    appearance: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  uploadArea: {
    border: `2px dashed ${isDark ? '#374151' : '#E2E8F0'}`,
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  uploadIcon: {
    color: isDark ? '#8B5CF6' : '#6366F1',
  },
  uploadText: {
    color: isDark ? '#9CA3AF' : '#64748B',
    margin: '16px 0',
    fontSize: '1.1rem',
    transition: 'color 0.3s ease',
  },
  button: {
    backgroundImage: isDark ? 'linear-gradient(45deg, #8B5CF6, #3B82F6)' : 'linear-gradient(45deg, #6366F1, #4F46E5)',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
    boxShadow: '0 4px 18px rgba(99, 102, 241, 0.3)',
    transition: 'all 0.3s ease',
    marginTop: '12px',
  },
  reviewCard: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    backgroundImage: isDark ? 'linear-gradient(145deg, #1F2937, #111827)' : 'linear-gradient(145deg, #FFFFFF, #F3F4F6)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: isDark ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 10px 25px rgba(148, 163, 184, 0.1)',
    border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    height: '100%',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
  },
  cardHeader: {
    borderBottom: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    paddingBottom: '16px',
    marginBottom: '16px',
    transition: 'border-color 0.3s ease',
  },
  authorName: {
    margin: '0',
    fontSize: '1.4rem',
    fontWeight: '600',
    color: isDark ? '#F3F4F6' : '#1E293B',
    transition: 'color 0.3s ease',
  },
  reviewDate: {
    fontSize: '0.9rem',
    color: isDark ? '#9CA3AF' : '#64748B',
    transition: 'color 0.3s ease',
  },
  reviewText: {
    color: isDark ? '#D1D5DB' : '#334155',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '20px',
    transition: 'color 0.3s ease',
  },
  reviewImage: {
    width: '100%',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`,
    transition: 'border-color 0.3s ease',
    cursor: 'pointer',
  },
  starFillColor1: isDark ? '#FFD700' : '#FBBF24',
  starFillColor2: isDark ? '#FFA500' : '#F59E0B',
  starStroke: isDark ? '#FFD700' : '#F59E0B',
  starStrokeEmpty: isDark ? '#4B5563' : '#CBD5E1',
  starInnerFill: isDark ? '#FFF7D6' : '#FFFFFF',
  starInnerOpacity: isDark ? '0.6' : '0.8',
  reviewImages: {
    marginTop: '1rem',
    width: '100%'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  reviewImageFullSize: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  imageCounter: {
    position: 'absolute',
    bottom: '-30px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    fontSize: '1rem'
  },
  imageModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  imageModal: {
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modalClose: {
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '2rem',
    cursor: 'pointer',
    padding: '8px',
    zIndex: 1001
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: '4px'
  },
  modalNavigation: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: 'translateY(-50%)',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px',
    pointerEvents: 'none'
  },
  navButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    fontSize: '2rem',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    pointerEvents: 'auto',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)'
    }
  }
});

const formatReviewImages = (review) => {
  if (!review) return [];
  
  let images = [];
  
  // Проверяем поле images
  if (review.images) {
    try {
      // Если images это строка JSON, парсим её
      if (typeof review.images === 'string') {
        images = JSON.parse(review.images);
      }
      // Если images уже массив, используем его
      else if (Array.isArray(review.images)) {
        images = review.images;
      }
    } catch (e) {
      console.error('Error parsing review images:', e);
    }
  }
  
  // Проверяем поле image (одиночное изображение)
  if (review.image && !images.includes(review.image)) {
    images.unshift(review.image);
  }
  
  return images;
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ 
    name: '', 
    text: '', 
    rating: 5,
    images: [],
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Проверяем, в темной ли теме сейчас сайт
  const isDarkTheme = () => {
    return document.documentElement.classList.contains('dark-theme') || 
           document.body.classList.contains('dark-theme') ||
           document.querySelector('.theme-toggle')?.checked;
  };
  
  // Переключаем тему напрямую в DOM
  const toggleTheme = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.click();
    } else {
      document.documentElement.classList.toggle('dark-theme');
      document.body.classList.toggle('dark-theme');
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем отзывы через API
        const reviewsData = await getReviews();
        
        // Проверяем, получили ли мы данные
        if (reviewsData && Array.isArray(reviewsData)) {
          console.log("Получены отзывы с сервера:", reviewsData);
          
          // Преобразуем отзывы в формат, ожидаемый компонентом
          const formattedReviews = reviewsData.map(review => {
            // Обрабатываем изображения сразу при форматировании
            const processedImages = formatReviewImages(review);
            
            return {
              id: review.id || review._id,
              name: review.name,
              text: review.text || review.comment, // Поддержка обоих форматов
              comment: review.comment || review.text,
              rating: review.rating || 5,
              images: processedImages, // Используем обработанные изображения
              image: processedImages.length > 0 ? processedImages[0] : null, // Берем первое валидное
              date: review.date || review.createdAt || review.visitDate,
              createdAt: review.createdAt,
              // Берем approved из API или вычисляем из status
              approved: review.approved !== undefined ? review.approved : (review.status === 'approved'), 
              // Копируем status из API или вычисляем из approved (для совместимости)
              status: review.status || (review.approved ? 'approved' : 'pending') 
            };
          });
          
          console.log("Форматированные отзывы (перед setState):", formattedReviews);
          setReviews(formattedReviews);
        } else {
          // Если API вернул некорректные данные или произошла ошибка, используем дефолтные отзывы
          const defaultReviews = [
            {
              id: 1,
              name: "Анна",
              text: "Замечательный музей! Очень понравились интерактивные экспонаты и возможность изучать историю электроники в игровой форме.",
              rating: 5,
              date: "2024-03-15",
              approved: true
            },
            {
              id: 2,
              name: "Михаил",
              text: "Отличная подборка экспонатов. Особенно впечатлила секция винтажных компьютеров.",
              rating: 4,
              date: "2024-03-14",
              approved: true
            },
            {
              id: 3,
              name: "Елена",
              text: "Удобный интерфейс и интересные материалы. Было бы здорово добавить больше информации о современных технологиях.",
              rating: 4,
              date: "2024-03-13",
              approved: true
            }
          ];
          setReviews(defaultReviews);
        }
      } catch (err) {
        console.error("Ошибка при загрузке отзывов:", err);
        setError("Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.");
        
        // Устанавливаем дефолтные отзывы при ошибке
        const defaultReviews = [
          {
            id: 1,
            name: "Анна",
            text: "Замечательный музей! Очень понравились интерактивные экспонаты и возможность изучать историю электроники в игровой форме.",
            rating: 5,
            date: "2024-03-15",
            approved: true
          },
          {
            id: 2,
            name: "Михаил",
            text: "Отличная подборка экспонатов. Особенно впечатлила секция винтажных компьютеров.",
            rating: 4,
            date: "2024-03-14",
            approved: true
          },
          {
            id: 3,
            name: "Елена",
            text: "Удобный интерфейс и интересные материалы. Было бы здорово добавить больше информации о современных технологиях.",
            rating: 4,
            date: "2024-03-13",
            approved: true
          }
        ];
        setReviews(defaultReviews);
      } finally {
        setLoading(false);
      }
    };
    
    loadReviews();
    
    // Добавляем стили для темной темы
    const style = document.createElement('style');
    style.textContent = `
      /* Стили для темной темы */
      .dark-theme .reviews-container {
        /* Убираем черный фон, чтобы использовать основной фон сайта */
        background-color: transparent;
        color: #F3F4F6;
      }
      
      .dark-theme .reviews-header {
        background-color: #1F2937;
        background-image: linear-gradient(145deg, #1F2937, #111827);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid #374151;
      }
      
      .dark-theme .reviews-badge {
        background-color: #8B5CF6;
        background-image: linear-gradient(145deg, #8B5CF6, #3B82F6);
      }
      
      .dark-theme .reviews-heading {
        color: #F3F4F6;
      }
      
      .dark-theme .reviews-description {
        color: #9CA3AF;
      }
      
      .dark-theme .reviews-stat {
        background-color: rgba(55, 65, 81, 0.5);
        border-color: #374151;
      }
      
      .dark-theme .review-form-card {
        background-color: #1F2937;
        background-image: linear-gradient(145deg, #1F2937, #111827);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        border: 1px solid #374151;
      }
      
      .dark-theme .review-form-header {
        background-image: linear-gradient(145deg, #8B5CF6, #3B82F6);
      }
      
      .dark-theme .review-form-body {
        background-color: #111827;
      }
      
      .dark-theme .form-group label {
        color: #F3F4F6;
      }
      
      .dark-theme .form-group input,
      .dark-theme .form-group textarea,
      .dark-theme .form-group select {
        background-color: #1F2937;
        border: 1px solid #374151;
        color: #F3F4F6;
      }
      
      .dark-theme .review-image-upload {
        border-color: #374151;
        background-color: rgba(31, 41, 55, 0.5);
      }
      
      .dark-theme .review-image-upload p {
        color: #9CA3AF;
      }
      
      .dark-theme .review-submit-button {
        background-image: linear-gradient(45deg, #8B5CF6, #3B82F6);
      }
      
      .dark-theme .review-card {
        background-color: #1F2937;
        background-image: linear-gradient(145deg, #1F2937, #111827);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        border: 1px solid #374151;
      }
      
      .dark-theme .review-card-header {
        border-bottom: 1px solid #374151;
      }
      
      .dark-theme .review-author {
        color: #F3F4F6;
      }
      
      .dark-theme .review-date {
        color: #9CA3AF;
      }
      
      .dark-theme .review-text {
        color: #D1D5DB;
      }
      
      .dark-theme .review-image {
        border-color: #374151;
      }
      
      .dark-theme .reviews-list-heading {
        color: #F3F4F6;
      }
      
      /* Стили для звезд в темной теме */
      .dark-theme .star-filled {
        fill: url(#star-gradient-dark);
        stroke: #FFD700;
      }
      
      .dark-theme .star-empty {
        stroke: #4B5563;
      }
      
      .dark-theme .star-inner {
        fill: #FFF7D6;
        opacity: 0.6;
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Добавляем текстовые поля
      formData.append('name', newReview.name);
      formData.append('comment', newReview.text);
      formData.append('rating', newReview.rating);
      formData.append('email', newReview.email || `visitor_${Date.now()}@example.com`);
      
      // Добавляем изображения
      if (newReview.images && newReview.images.length > 0) {
        for (let i = 0; i < newReview.images.length; i++) {
          const image = newReview.images[i];
          if (image.startsWith('data:image')) {
            // Конвертируем base64 в Blob
            const response = await fetch(image);
            const blob = await response.blob();
            formData.append('images', blob, `image${i}.jpg`);
          }
        }
      }
      
      console.log('Submitting review with FormData');
      console.log('FormData contents:', {
        name: formData.get('name'),
        comment: formData.get('comment'),
        rating: formData.get('rating'),
        email: formData.get('email'),
        images: formData.getAll('images')
      });
      
      // Отправляем отзыв через API
      const response = await createReview(formData);
      console.log('API response for review creation:', response);
      
      // Извлекаем данные отзыва из ответа API
      const createdReview = response.data || response;
      
      // Если отзыв успешно создан, добавляем его локально
      const newReviewObject = {
        id: createdReview.id || createdReview._id || Date.now(),
        name: newReview.name,
        text: newReview.text,
        rating: parseInt(newReview.rating),
        images: createdReview.images || [],
        date: new Date().toISOString(),
        approved: false,
        status: 'pending'
      };
      
      console.log('Adding review to local state:', newReviewObject);
      
      // Добавляем отзыв в локальное состояние
      setReviews(prev => [newReviewObject, ...prev]);
      
      // Сбрасываем форму
      setNewReview({ name: '', text: '', rating: 5, images: [], email: '' });
      
      // Показываем уведомление пользователю
      alert('Спасибо за ваш отзыв! Он будет опубликован после проверки администратором.');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Uploading files:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Добавляем информацию о типе файла в лог
          console.log(`Converting ${file.name} (${file.type}) to base64`);
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error(`Error reading file ${file.name}:`, error);
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      // Фильтруем только валидные изображения и добавляем логирование
      const validImages = images.filter(img => {
        const isValid = img !== null && 
          typeof img === 'string' && 
          img.trim() !== '' && 
          img.startsWith('data:image');
        
        if (!isValid) {
          console.warn('Invalid image data:', img ? img.substring(0, 100) + '...' : 'null');
        } else {
          console.log('Valid image data:', img.substring(0, 100) + '...');
        }
        
        return isValid;
      });
      
      console.log(`Found ${validImages.length} valid images out of ${images.length} total`);
      
      setNewReview(prev => ({
        ...prev,
        images: [...prev.images, ...validImages]
      }));
    });
  };

  const removeImage = (index) => {
    setNewReview(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Рендер звезд с уникальными идентификаторами для градиентов
  const renderStars = (rating, id = 'new') => {
    return (
      <div className="star-rating" style={{ display: 'flex', gap: '4px' }}>
        {[...Array(5)].map((_, index) => {
          const isFilled = index < rating;
          const suffix = isDarkTheme() ? '-dark' : '-light';
          const starId = `star-${id}-${index}${suffix}`;
          
          return (
            <div key={`${id}-${index}`} style={{ width: '24px', height: '24px' }}>
              <svg 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%' }}
              >
                <defs>
                  <linearGradient id={starId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDarkTheme() ? '#FFD700' : '#FBBF24'} />
                    <stop offset="100%" stopColor={isDarkTheme() ? '#FFA500' : '#F59E0B'} />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill={isFilled ? `url(#${starId})` : 'transparent'}
                  stroke={isFilled ? (isDarkTheme() ? '#FFD700' : '#F59E0B') : (isDarkTheme() ? '#4B5563' : '#CBD5E1')}
                  strokeWidth={isFilled ? "0.7" : "1.5"}
                  strokeLinejoin="round"
                  className={isFilled ? 'star-filled' : 'star-empty'}
                />
                {isFilled && (
                  <path
                    d="M12 5L13.75 9.4L18.5 10L15.2 13.25L16 18L12 15.75L8 18L8.75 13.25L5.5 10L10.25 9.4L12 5Z"
                    fill={isDarkTheme() ? "#FFF7D6" : "#FFFFFF"}
                    opacity={isDarkTheme() ? "0.6" : "0.8"}
                    className="star-inner"
                  />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    );
  };

  const openImageModal = (images, index) => {
    // Преобразуем все пути к изображениям
    const processedImages = images.map(image => getImageUrl(image));
    setSelectedImages(processedImages);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    if (image.startsWith('data:image')) return image;
    
    // Если путь уже содержит /api/uploads, используем его как есть
    if (image.startsWith('/api/uploads/')) {
      return image;
    }
    
    // Если путь содержит /uploads, добавляем /api
    if (image.startsWith('/uploads/')) {
      return `/api${image}`;
    }
    
    // Для случаев когда приходит только имя файла
    return `/api/uploads/reviews/${image}`;
  };

  if (loading) {
    return (
      <div className="uk-container uk-text-center uk-margin-large-top">
        <div data-uk-spinner="ratio: 2"></div>
        <p className="uk-text-lead">Загрузка отзывов...</p>
      </div>
    );
  }

  // Проверяем наличие глобального переключателя темы
  const hasGlobalThemeToggle = Boolean(document.querySelector('.theme-toggle'));

  return (
    <div className={`reviews-container ${isDarkTheme() ? 'dark-theme' : ''}`}>
      {/* Кнопка переключения темы - всегда показываем для удобства тестирования */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: hasGlobalThemeToggle ? '70px' : '20px', 
        zIndex: 100 
      }}>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-button"
          style={{
            background: isDarkTheme() 
              ? 'linear-gradient(45deg, #8B5CF6, #3B82F6)' 
              : 'linear-gradient(45deg, #6366F1, #4F46E5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}
        >
          {isDarkTheme() ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Заголовок страницы */}
      <div className="reviews-header">
        {/* Декоративные элементы */}
        <div className="decorative-circle decorative-circle-1"></div>
        <div className="decorative-circle decorative-circle-2"></div>
        <div className="decorative-dot decorative-dot-1"></div>
        <div className="decorative-dot decorative-dot-2"></div>

        <div className="uk-text-center" data-aos="fade-up">
          <span className="reviews-badge">
            Мнения посетителей
          </span>
          <h1 className="reviews-heading uk-heading-medium">
            Отзывы
          </h1>
          <p className="reviews-description">
            Делитесь своими впечатлениями о посещении нашего музея
          </p>
          
          <div className="reviews-stats">
            <div className="reviews-stat">
              <span data-uk-icon="icon: users; ratio: 1.2" className="reviews-stat-icon-1"></span>
              <span className="reviews-stat-text">{reviews.filter(r => r.status === 'approved').length} отзывов</span>
            </div>
            <div className="reviews-stat">
              <span data-uk-icon="icon: star; ratio: 1.2" className="reviews-stat-icon-2"></span>
              <span className="reviews-stat-text">4.5 средняя оценка</span>
            </div>
          </div>
        </div>
      </div>

      {/* Форма отзыва */}
      <div className="uk-container uk-container-small">
        <div className="review-form-card">
          <div className="review-form-header">
            <h2 className="review-form-title">Оставить отзыв</h2>
            <p className="review-form-subtitle">Поделитесь своими впечатлениями и помогите другим посетителям</p>
            
            {/* Декоративные элементы для заголовка формы */}
            <div className="header-decoration-1"></div>
            <div className="header-decoration-2"></div>
          </div>
          <div className="review-form-body">
            {error && (
              <div className="uk-alert uk-alert-danger">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label htmlFor="name">Ваше имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newReview.name}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Ваш email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newReview.email}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="example@domain.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="text">Ваш отзыв</label>
                <textarea
                  id="text"
                  name="text"
                  value={newReview.text}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="rating">Оценка</label>
                <div style={{ marginBottom: '12px' }}>
                  {renderStars(parseInt(newReview.rating), 'form')}
                </div>
                <select
                  id="rating"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleInputChange}
                >
                  <option value="5">5 звезд - Отлично</option>
                  <option value="4">4 звезды - Хорошо</option>
                  <option value="3">3 звезды - Удовлетворительно</option>
                  <option value="2">2 звезды - Плохо</option>
                  <option value="1">1 звезда - Очень плохо</option>
                </select>
              </div>
              <div className="form-group">
                <label>Изображения</label>
                <div className="review-image-upload" 
                  onClick={() => document.getElementById('image-upload').click()}
                  style={{ cursor: 'pointer' }}
                >
                  <span data-uk-icon="icon: cloud-upload; ratio: 2.5" className="upload-icon"></span>
                  <p className="upload-text">Перетащите сюда изображения или нажмите в любом месте этой области</p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{
                      position: 'absolute',
                      width: '1px',
                      height: '1px',
                      padding: '0',
                      margin: '-1px',
                      overflow: 'hidden',
                      clip: 'rect(0, 0, 0, 0)',
                      border: '0'
                    }}
                  />
                </div>
                {newReview.images.length > 0 && (
                  <div className="review-images-preview">
                    {newReview.images.map((image, index) => (
                      <div key={index} className="review-image-preview">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          className="review-image-remove"
                          onClick={() => removeImage(index)}
                        >
                          <span data-uk-icon="icon: close; ratio: 0.8"></span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="review-submit-button" 
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <span>
                    <span data-uk-spinner="ratio: 0.8"></span> Отправка...
                  </span>
                ) : (
                  'Отправить отзыв'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Список отзывов */}
      <div className="uk-section">
        <div className="uk-container">
          <h2 className="reviews-list-heading">
            Что говорят наши посетители
          </h2>
          
          {reviews.filter(review => review.status === 'approved').length === 0 ? (
            <div className="uk-text-center uk-margin-large-top">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🙁</div>
              <p className="uk-text-lead">Пока нет одобренных отзывов</p>
              <p>Будьте первыми, кто оставит отзыв о нашем музее!</p>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '20px',
              justifyContent: 'center',
              margin: '0 -10px',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {reviews
                .filter(review => review.status === 'approved')
                .map(review => {
                  const images = formatReviewImages(review);
                  return (
                    <div 
                      key={review.id} 
                      data-aos="fade-up"
                      style={{
                        flex: '0 0 calc(33.333% - 20px)',
                        width: 'calc(33.333% - 20px)',
                        minWidth: '400px',
                        maxWidth: '450px',
                        margin: '0 10px'
                      }}
                    >
                      <div className="review-card" style={{ height: '100%', padding: '20px' }}>
                        <div className={`review-card-decoration ${review.rating >= 4 ? 'high-rating' : 'low-rating'}`}></div>
                        
                        <div className="review-card-header">
                          <div className="uk-flex uk-flex-between uk-flex-middle">
                            <h4 className="review-author">{review.name}</h4>
                            <div className="review-meta">
                              <div className="stars">
                                {renderStars(review.rating, review.id)}
                              </div>
                              <span className="review-date">
                                {new Date(review.date || review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="review-card-body">
                          <p className="review-text">{review.comment || review.text}</p>
                          
                          {images.length > 0 && (
                            <div className="image-grid">
                              {images.map((image, index) => (
                                <div key={index} className="image-container">
                                  <img 
                                    src={getImageUrl(image)} 
                                    alt={`Фото ${index + 1} от ${review.name}`}
                                    className="review-image"
                                    onClick={() => openImageModal(images, index)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  {index === 0 && images.length > 1 && (
                                    <div className="image-counter">
                                      +{images.length - 1}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
          
      {/* Модальное окно для просмотра изображений */}
      {showImageModal && selectedImages.length > 0 && (
        <div 
          className="image-modal-overlay" 
          onClick={closeImageModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="image-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '100%',
              maxHeight: '100%',
              margin: '0 auto'
            }}
          >
            <button 
              className="modal-close" 
              onClick={closeImageModal}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '8px',
                zIndex: 1001
              }}
            >
              ×
            </button>
            
            <img
              src={getImageUrl(selectedImages[currentImageIndex])}
              alt={`Фото ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
            
            {selectedImages.length > 1 && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  pointerEvents: 'none'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => 
                        prev === 0 ? selectedImages.length - 1 : prev - 1
                      );
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      color: 'white',
                      fontSize: '2rem',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease',
                      pointerEvents: 'auto'
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => 
                        prev === selectedImages.length - 1 ? 0 : prev + 1
                      );
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      color: 'white',
                      fontSize: '2rem',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'background-color 0.3s ease',
                      pointerEvents: 'auto'
                    }}
                  >
                    →
                  </button>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'white',
                  fontSize: '1rem'
                }}>
                  {currentImageIndex + 1} / {selectedImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews; 