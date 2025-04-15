import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/reviews.css';

const ReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews/admin');
      setReviews(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при загрузке отзывов' });
    }
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/reviews/${reviewId}/status`, {
        status: newStatus
      });
      fetchReviews();
      setMessage({ type: 'success', text: 'Статус отзыва успешно обновлен' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при обновлении статуса отзыва' });
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
        fetchReviews();
        setMessage({ type: 'success', text: 'Отзыв успешно удален' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Ошибка при удалении отзыва' });
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'approved':
        return 'status-badge status-approved';
      case 'rejected':
        return 'status-badge status-rejected';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'На модерации';
      case 'approved':
        return 'Одобрен';
      case 'rejected':
        return 'Отклонен';
      default:
        return status;
    }
  };

  return (
    <div className="review-moderation">
      <h2>Модерация отзывов</h2>
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="reviews-grid">
        {reviews.map(review => (
          <div key={review._id} className={`review-card ${review.status === 'pending' ? 'review-pending' : ''}`}>
            <div className="review-header">
              <h3 className="review-name">{review.name}</h3>
              <div className={getStatusBadgeClass(review.status)}>
                {getStatusText(review.status)}
              </div>
            </div>
            <div className="review-meta">
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <div className="review-date">
                {new Date(review.createdAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
            <p className="review-content">{review.text}</p>
            {review.images && review.images.length > 0 && (
              <div className="review-images">
                {review.images.map((image, index) => (
                  <img key={index} src={image} alt={`Фото ${index + 1}`} />
                ))}
              </div>
            )}
            <div className="review-actions">
              {review.status === 'pending' && (
                <div className="uk-button-group">
                  <button
                    className="uk-button uk-button-primary"
                    onClick={() => handleStatusChange(review._id, 'approved')}
                  >
                    Одобрить
                  </button>
                  <button
                    className="uk-button uk-button-danger"
                    onClick={() => handleStatusChange(review._id, 'rejected')}
                  >
                    Отклонить
                  </button>
                </div>
              )}
              <button
                className="uk-button uk-button-danger"
                onClick={() => handleDelete(review._id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewModeration; 