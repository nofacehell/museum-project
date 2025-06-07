import React, { useState, useEffect } from 'react';
import { getAdminReviews, updateReviewStatus, deleteReview } from '../../utils/api';
import { STATIC_URL, getStaticUrl } from '../../utils/config';

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getAdminReviews();
      console.log('Raw review data from API:', data); // Debug log
      
      // Преобразуем данные для соответствия нашему интерфейсу
      const formattedReviews = data.map(review => {
        // Обработка изображений
        let images = [];
        if (review.images) {
          if (typeof review.images === 'string') {
            try {
              images = JSON.parse(review.images);
            } catch (e) {
              console.error('Error parsing images JSON:', e);
              images = [];
            }
          } else if (Array.isArray(review.images)) {
            images = review.images;
          }
        }
        
        console.log(`Review ID ${review.id} - Images:`, images);
        
        // Проверяем наличие текста отзыва
        const reviewText = review.text || review.comment || 'Текст отзыва отсутствует';
        
        return {
          ...review,
          visitorName: review.name || review.visitorName || 'Посетитель',
          status: review.approved ? 'approved' : (review.status || 'pending'),
          comment: reviewText,
          createdAt: review.date || review.createdAt || new Date(),
          images: images
        };
      });
      
      console.log('Formatted reviews for admin panel:', formattedReviews); // Debug log
      setReviews(formattedReviews);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Ошибка при загрузке отзывов');
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await updateReviewStatus(reviewId, 'approved');
      await fetchReviews();
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await updateReviewStatus(reviewId, 'rejected');
      await fetchReviews();
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        await deleteReview(reviewId);
        await fetchReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#fff7ed', text: '#c2410c' };
      case 'approved':
        return { bg: '#f0fdf4', text: '#15803d' };
      case 'rejected':
        return { bg: '#fef2f2', text: '#b91c1c' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'На рассмотрении';
      case 'approved':
        return 'Одобрен';
      case 'rejected':
        return 'Отклонен';
      default:
        return 'Неизвестно';
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/api/uploads/')) {
      return getStaticUrl(image.replace('/api', ''));
    }
    if (image.startsWith('/uploads/')) {
      return getStaticUrl(image);
    }
    return getStaticUrl(`/uploads/reviews/${image}`);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Управление отзывами</h2>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Список отзывов */}
        <div style={{ flex: '1' }}>
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {reviews.map(review => (
              <div 
                key={review.id} 
                style={{
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#1e293b',
                  cursor: 'pointer',
                  boxShadow: selectedReview && selectedReview.id === review.id ? '0 0 0 2px #3b82f6' : 'none'
                }}
                onClick={() => setSelectedReview(review)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{review.visitorName}</h3>
                    <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ 
                    padding: '5px 10px',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(review.status).bg,
                    color: getStatusColor(review.status).text,
                    fontSize: '14px'
                  }}>
                    {getStatusText(review.status)}
                  </div>
                </div>
                
                <p style={{ 
                  margin: '0 0 10px 0', 
                  color: '#e2e8f0',
                  display: '-webkit-box',
                  WebkitLineClamp: '3',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {review.comment || 'Текст отзыва отсутствует'}
                </p>

                {review.images && review.images.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginBottom: '10px',
                    overflowX: 'auto',
                    padding: '5px'
                  }}>
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={getImageUrl(image)}
                        alt={`Изображение ${index + 1}`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          console.error('Error loading image:', image);
                          e.target.src = 'https://placehold.co/60x60?text=Ошибка';
                        }}
                      />
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {(!review.status || review.status === 'pending') && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(review.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Одобрить
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(review.id);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(review.id);
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: (!review.status || review.status === 'pending') ? 'auto' : '100%'
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Детальный просмотр отзыва */}
        {selectedReview && (
          <div style={{
            flex: '0 0 400px',
            padding: '20px',
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            border: '1px solid #2d3748'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <button 
                onClick={() => setSelectedReview(null)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ← Назад
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 5px 0', color: 'white' }}>{selectedReview.visitorName}</h2>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                {new Date(selectedReview.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={{ 
              padding: '5px 10px',
              borderRadius: '4px',
              backgroundColor: getStatusColor(selectedReview.status).bg,
              color: getStatusColor(selectedReview.status).text,
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              {getStatusText(selectedReview.status)}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'white' }}>Текст отзыва:</h3>
              <p style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>{selectedReview.comment}</p>
            </div>

            {selectedReview.images && selectedReview.images.length > 0 && (
              <div>
                <h3 style={{ color: 'white' }}>Изображения:</h3>
                <div style={{ 
                  display: 'grid',
                  gap: '10px',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))'
                }}>
                  {selectedReview.images.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`Изображение ${index + 1}`}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {(!selectedReview.status || selectedReview.status === 'pending') && (
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                marginTop: '20px',
                padding: '20px',
                backgroundColor: '#374151',
                borderRadius: '8px'
              }}>
                <button 
                  onClick={() => handleApprove(selectedReview.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Одобрить отзыв
                </button>
                <button 
                  onClick={() => handleReject(selectedReview.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Отклонить отзыв
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManager; 