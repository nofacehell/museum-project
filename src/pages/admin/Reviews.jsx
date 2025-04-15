import React, { useState, useEffect } from 'react';
import { getAdminReviews, updateReviewStatus } from '../../utils/api';

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
            
            return {
              id: review.id || review._id,
              name: review.name,
              text: review.text || review.comment,
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
    
    return images;
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div style={styles.container} className="admin-reviews-container">
        <div style={styles.loading} className="admin-loading">Загрузка отзывов...</div>
      </div>
    );
  }

  // Если есть ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <div style={styles.container} className="admin-reviews-container">
        <div style={styles.error} className="admin-error">{error}</div>
      </div>
    );
  }

  // Получаем статистику по отзывам
  const approvedCount = reviews.filter(review => review.approved).length;
  const pendingCount = reviews.filter(review => !review.approved).length;

  return (
    <div style={styles.container} className="admin-reviews-container">
      <div style={styles.header} className="admin-reviews-header">
        <h2 style={styles.title} className="admin-reviews-title">Управление отзывами</h2>
        <div style={styles.statsContainer} className="admin-stats-container">
          <div style={styles.statCard} className="admin-stat-card">
            <div style={styles.statValue} className="admin-stat-value">{reviews.length}</div>
            <div style={styles.statLabel} className="admin-stat-label">Всего отзывов</div>
          </div>
          <div style={styles.statCard} className="admin-stat-card">
            <div style={styles.statValue} className="admin-stat-value">{approvedCount}</div>
            <div style={styles.statLabel} className="admin-stat-label">Одобрено</div>
          </div>
          <div style={styles.statCard} className="admin-stat-card">
            <div style={styles.statValue} className="admin-stat-value">{pendingCount}</div>
            <div style={styles.statLabel} className="admin-stat-label">На рассмотрении</div>
          </div>
        </div>
      </div>

      <div style={styles.filters} className="admin-reviews-filters">
        <div style={styles.filter} className="admin-filter">
          <label style={styles.filterLabel} className="admin-filter-label">
            Статус:
            <select 
              style={styles.filterSelect} 
              className="admin-filter-select"
              value={selectedStatus} 
              onChange={handleStatusFilterChange}
            >
              <option value="all">Все</option>
              <option value="approved">Одобренные</option>
              <option value="pending">На рассмотрении</option>
            </select>
          </label>
        </div>
      </div>

      <div style={styles.tableContainer} className="admin-table-container">
        <table style={styles.table} className="admin-table">
          <thead style={styles.tableHead} className="admin-table-head">
            <tr>
              <th style={styles.tableHeaderCell} className="admin-table-header-cell">
                <button 
                  style={styles.sortButton} 
                  className="admin-sort-button"
                  onClick={() => handleSortChange('name')}
                >
                  Имя {getSortIcon('name')}
                </button>
              </th>
              <th style={styles.tableHeaderCell} className="admin-table-header-cell">
                <button 
                  style={styles.sortButton} 
                  className="admin-sort-button"
                  onClick={() => handleSortChange('rating')}
                >
                  Рейтинг {getSortIcon('rating')}
                </button>
              </th>
              <th style={styles.tableHeaderCellWide} className="admin-table-header-cell-wide">Отзыв</th>
              <th style={styles.tableHeaderCell} className="admin-table-header-cell">Фото</th>
              <th style={styles.tableHeaderCell} className="admin-table-header-cell">
                <button 
                  style={styles.sortButton} 
                  className="admin-sort-button"
                  onClick={() => handleSortChange('created_at')}
                >
                  Дата {getSortIcon('created_at')}
                </button>
              </th>
              <th style={styles.tableHeaderCell} className="admin-table-header-cell">Статус</th>
              <th style={styles.tableHeaderCell} className="admin-table-header-cell">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedReviews().map(review => (
              <tr key={review.id} style={styles.tableRow} className="admin-table-row">
                <td style={styles.tableCell} className="admin-table-cell">{review.name}</td>
                <td style={styles.tableCell} className="admin-table-cell">{renderStars(review.rating)}</td>
                <td style={styles.tableCellWide} className="admin-table-cell-wide">
                  {review.text || review.comment}
                </td>
                <td style={styles.tableCell} className="admin-table-cell">
                  {review.images && review.images.length > 0 && (
                    <div style={styles.imageContainer}>
                      <img 
                        src={review.images[0]} 
                        alt="Фото к отзыву" 
                        style={styles.reviewImage}
                        className="admin-review-image"
                      />
                      {review.images.length > 1 && (
                        <div style={styles.imageCounter}>+{review.images.length - 1}</div>
                      )}
                    </div>
                  )}
                </td>
                <td style={styles.tableCell} className="admin-table-cell">
                  {formatDate(review.created_at || review.createdAt || review.updatedAt)}
                </td>
                <td style={styles.tableCell} className="admin-table-cell">{renderStatus(review.approved)}</td>
                <td style={styles.tableCell} className="admin-table-cell">
                  {review.approved ? (
                    <button 
                      style={styles.rejectButton} 
                      className="admin-reject-button"
                      onClick={() => handleStatusChange(review.id, 'rejected')}
                    >
                      Отклонить
                    </button>
                  ) : (
                    <button 
                      style={styles.approveButton} 
                      className="admin-approve-button"
                      onClick={() => handleStatusChange(review.id, 'approved')}
                    >
                      Одобрить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
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
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  imageContainer: {
    position: 'relative',
    width: '60px',
    height: '60px',
  },
  imageCounter: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '10px',
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