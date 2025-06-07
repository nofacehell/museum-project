import React, { useState, useEffect } from 'react';
import { getAdminReviews, updateReviewStatus, deleteReview } from '../../utils/api';
import { getStaticUrl, STATIC_URL } from '../../utils/config';

/**
 * Компонент для управления отзывами в админ-панели
 */
const Reviews = () => {
  // Состояние компонента
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Проверяем, в темной ли теме сейчас сайт
  const isDarkTheme = () => {
    return document.documentElement.classList.contains('dark-theme') || 
           document.body.classList.contains('dark-theme') ||
           document.querySelector('.theme-toggle')?.checked;
  };

  // Загрузка всех отзывов
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        // Используем функцию getAdminReviews для получения всех отзывов
        const data = await getAdminReviews();
        console.log('Загруженные отзывы для админа (сырые данные):', data);
        
        // Проверяем, что data - это массив
        if (Array.isArray(data)) {
          // Преобразуем поля, чтобы обеспечить совместимость с компонентом
          const formattedReviews = data.map(review => {
            const processedImages = formatReviewImages(review);
            
            // Проверяем наличие текста отзыва
            const reviewText = review.text || review.comment || 'Текст отзыва отсутствует';
            
            return {
              id: review.id || review._id,
              name: review.name,
              text: reviewText,
              comment: reviewText, // Добавляем поле comment для совместимости
              rating: review.rating || 5,
              images: processedImages,
              image: processedImages.length > 0 ? processedImages[0] : null,
              created_at: review.created_at || review.createdAt || review.date,
              approved: review.approved !== undefined ? review.approved : false
            };
          });
          
          console.log('Отформатированные отзывы:', formattedReviews);
          setReviews(formattedReviews);
        } else {
          console.error('Данные API не являются массивом:', data);
          setError('Получены некорректные данные от сервера');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке отзывов:', err);
        setError('Произошла ошибка при загрузке отзывов: ' + (err.message || 'Неизвестная ошибка'));
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Обработчик изменения статуса отзыва
  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await updateReviewStatus(reviewId, newStatus);
      
      // Обновляем локальное состояние после успешного обновления на сервере
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
          ? { ...review, approved: newStatus === 'approved' } 
          : review
        )
      );
    } catch (err) {
      console.error('Ошибка при обновлении статуса отзыва:', err);
      setError('Произошла ошибка при обновлении статуса отзыва');
    }
  };

  // Обработчик изменения фильтра статуса
  const handleStatusFilterChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // Обработчик изменения сортировки
  const handleSortChange = (field) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Получаем отфильтрованные и отсортированные отзывы
  const filteredAndSortedReviews = () => {
    let result = [...reviews];
    
    // Фильтрация
    if (selectedStatus !== 'all') {
      const isApproved = selectedStatus === 'approved';
      result = result.filter(review => review.approved === isApproved);
    }
    
    // Сортировка
    result.sort((a, b) => {
      let valueA, valueB;
      
      // Поле может быть в разных форматах в зависимости от источника данных
      if (sortField === 'created_at') {
        valueA = a.created_at || a.createdAt;
        valueB = b.created_at || b.createdAt;
        
        // Преобразуем даты для корректного сравнения
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      // Сравниваем значения
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Функция для отображения статуса
  const renderStatus = (approved) => {
    if (approved) {
      return <span style={styles.approvedStatus} className="admin-status-approved">Одобрен</span>;
    } else {
      return <span style={styles.pendingStatus} className="admin-status-pending">На рассмотрении</span>;
    }
  };

  // Функция для отображения рейтинга в виде звезд
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} style={styles.star}>★</span>);
      } else {
        stars.push(<span key={i} style={styles.emptyStar}>☆</span>);
      }
    }
    return <div style={styles.ratingStars} className="admin-rating-stars">{stars}</div>;
  };

  // Функция для получения иконки сортировки
  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Функция для форматирования изображений отзыва
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
    
    console.log('Processed images for review:', review.id, images);
    return images;
  };

  // Функция для получения полного URL изображения
  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    
    // Если путь уже содержит /uploads, используем базовый URL
    if (image.startsWith('/uploads/')) {
      return `${STATIC_URL}${image}`;
    }
    
    // Для случаев когда приходит только имя файла
    return `${STATIC_URL}/uploads/reviews/${image}`;
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="uk-container uk-container-small uk-margin-large-top">
        <div className="uk-text-center">
          <div uk-spinner="ratio: 2"></div>
          <p className="uk-margin-small-top uk-text-muted">Загрузка отзывов...</p>
        </div>
      </div>
    );
  }

  // Если есть ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <div className="uk-container uk-container-small uk-margin-large-top">
        <div className="uk-alert-danger" uk-alert="true">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Получаем статистику по отзывам
  const approvedCount = reviews.filter(review => review.approved).length;
  const pendingCount = reviews.filter(review => !review.approved).length;

  return (
    <div className="uk-container uk-container-small uk-margin-large-top admin-reviews-container">
      {/* Header Section */}
      <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
        {/* Stats Cards */}
        <div className="uk-grid-small uk-child-width-1-3@m" uk-grid="true">
          <div>
            <div className="uk-card uk-card-primary uk-card-body uk-text-center">
              <h3 className="uk-card-title">{reviews.length}</h3>
              <p className="uk-text-meta">Всего отзывов</p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-secondary uk-card-body uk-text-center">
              <h3 className="uk-card-title">{approvedCount}</h3>
              <p className="uk-text-meta">Одобрено</p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body uk-text-center">
              <h3 className="uk-card-title">{pendingCount}</h3>
              <p className="uk-text-meta">На рассмотрении</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
        <div className="uk-grid-small" uk-grid="true">
          <div className="uk-width-1-3@m">
            <label className="uk-form-label">Статус:</label>
            <select 
              className="uk-select"
              value={selectedStatus} 
              onChange={handleStatusFilterChange}
            >
              <option value="all">Все</option>
              <option value="approved">Одобренные</option>
              <option value="pending">На рассмотрении</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="uk-grid-small uk-child-width-1-2@m" uk-grid="true">
        {filteredAndSortedReviews().map(review => (
          <div key={review.id}>
            <div className="uk-card uk-card-default uk-card-hover">
              <div className="uk-card-header">
                <div className="uk-grid-small uk-flex-middle" uk-grid="true">
                  <div className="uk-width-auto">
                    {review.images && review.images.length > 0 && (
                      <div className="uk-inline">
                        <img 
                          src={getImageUrl(review.images[0])} 
                          alt="Фото к отзыву" 
                          className="uk-border-circle"
                          width="50"
                          height="50"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/50x50?text=Ошибка';
                          }}
                        />
                        {review.images.length > 1 && (
                          <div className="uk-position-bottom-right uk-label uk-label-danger">
                            +{review.images.length - 1}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="uk-width-expand">
                    <h3 className="uk-card-title uk-margin-remove-bottom">{review.name}</h3>
                    <p className="uk-text-meta uk-margin-remove-top">
                      {formatDate(review.created_at || review.createdAt || review.updatedAt)}
                    </p>
                  </div>
                  <div className="uk-width-auto">
                    {review.approved ? (
                      <span className="uk-label uk-label-success">Одобрен</span>
                    ) : (
                      <span className="uk-label uk-label-warning">На рассмотрении</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="uk-card-body">
                <div className="uk-margin-small-bottom">
                  {renderStars(review.rating)}
                </div>
                <p className="uk-text-break">
                  {review.text || review.comment || 'Текст отзыва отсутствует'}
                </p>
              </div>
              <div className="uk-card-footer">
                <div className="uk-grid-small uk-flex-middle" uk-grid="true">
                  <div className="uk-width-expand">
                    {review.images && review.images.length > 0 && (
                      <div className="uk-grid-small uk-child-width-1-4" uk-grid="true">
                        {review.images.slice(0, 4).map((image, index) => (
                          <div key={index}>
                            <img 
                              src={getImageUrl(image)} 
                              alt={`Фото ${index + 1}`}
                              className="uk-border-rounded"
                              width="60"
                              height="60"
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/60x60?text=Ошибка';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="uk-width-auto">
                    {review.approved ? (
                      <button 
                        className="uk-button uk-button-danger uk-button-small"
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                      >
                        Отклонить
                      </button>
                    ) : (
                      <button 
                        className="uk-button uk-button-primary uk-button-small"
                        onClick={() => handleStatusChange(review.id, 'approved')}
                      >
                        Одобрить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Стили компонента
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#111827',
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  statCard: {
    flex: 1,
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  filters: {
    display: 'flex',
    marginBottom: '20px',
    gap: '15px',
  },
  filter: {
    marginRight: '15px',
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#374151',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHead: {
    backgroundColor: '#f3f4f6',
    borderBottom: '2px solid #e5e7eb',
  },
  tableHeaderCell: {
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#374151',
  },
  tableHeaderCellWide: {
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#374151',
    width: '300px',
  },
  sortButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#374151',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    padding: '12px 15px',
    fontSize: '14px',
    color: '#374151',
    verticalAlign: 'middle',
  },
  tableCellWide: {
    padding: '12px 15px',
    fontSize: '14px',
    color: '#374151',
    verticalAlign: 'middle',
    maxWidth: '300px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  approvedStatus: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  pendingStatus: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#fff7ed',
    color: '#c2410c',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  approveButton: {
    padding: '6px 12px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  rejectButton: {
    padding: '6px 12px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#ef4444',
  },
  ratingStars: {
    display: 'flex',
  },
  star: {
    color: '#f59e0b',
    fontSize: '16px',
  },
  emptyStar: {
    color: '#d1d5db',
    fontSize: '16px',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  imageContainer: {
    position: 'relative',
    width: '60px',
    height: '60px',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  imageCounter: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    fontSize: '10px',
    padding: '2px 4px',
    borderRadius: '4px',
  },
};

// Добавление стилей для темной темы
useEffect(() => {
  const style = document.createElement('style');
  style.textContent = `
    /* Dark theme styles for admin reviews */
    .dark-theme .admin-reviews-container {
      background-color: #1e1e1e;
      color: #f3f4f6;
    }
    
    .dark-theme .admin-reviews-title {
      color: #f3f4f6;
    }
    
    .dark-theme .admin-stat-card {
      background-color: #252525;
    }
    
    .dark-theme .admin-stat-value {
      color: #f3f4f6;
    }
    
    .dark-theme .admin-stat-label {
      color: #94a3b8;
    }
    
    .dark-theme .admin-filter-label {
      color: #e2e8f0;
    }
    
    .dark-theme .admin-filter-select {
      background-color: #252525;
      border-color: #4b5563;
      color: #e2e8f0;
    }
    
    .dark-theme .admin-table {
      background-color: #252525;
    }
    
    .dark-theme .admin-table-head {
      background-color: #1f2937;
      border-bottom: 2px solid #4b5563;
    }
    
    .dark-theme .admin-table-header-cell,
    .dark-theme .admin-table-header-cell-wide {
      color: #e2e8f0;
    }
    
    .dark-theme .admin-sort-button {
      color: #e2e8f0;
    }
    
    .dark-theme .admin-table-row {
      border-bottom: 1px solid #374151;
    }
    
    .dark-theme .admin-table-row:hover {
      background-color: #374151;
    }
    
    .dark-theme .admin-table-cell,
    .dark-theme .admin-table-cell-wide {
      color: #e2e8f0;
    }
    
    .dark-theme .admin-loading {
      color: #94a3b8;
    }
    
    .dark-theme .admin-error {
      color: #f87171;
    }
    
    .dark-theme .admin-status-approved {
      background-color: #065f46;
      color: #d1fae5;
    }
    
    .dark-theme .admin-status-pending {
      background-color: #7c2d12;
      color: #ffedd5;
    }
    
    .dark-theme .admin-approve-button {
      background-color: #065f46;
      color: #d1fae5;
    }
    
    .dark-theme .admin-reject-button {
      background-color: #7f1d1d;
      color: #fee2e2;
    }
    
    .dark-theme .admin-emptyStar {
      color: #4b5563;
    }
  `;
  document.head.appendChild(style);
  
  return () => document.head.removeChild(style);
}, []);

export default Reviews; 