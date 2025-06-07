// 🎨 Улучшенный DashboardStats.jsx с выровненными карточками и горизонтальным блоком быстрых действий

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    exhibits: 0,
    categories: 0,
    quizzes: 0,
    games: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [exhibits, categories, quizzes, games, reviews] = await Promise.all([
          axios.get('/api/exhibits'),
          axios.get('/api/categories'),
          axios.get('/api/quizzes'),
          axios.get('/api/games'),
          axios.get('/api/reviews')
        ]);

        setStats({
          exhibits: exhibits.data.length,
          categories: categories.data.length,
          quizzes: quizzes.data.length,
          games: games.data.length,
          reviews: reviews.data.length
        });
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке статистики');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="uk-flex uk-flex-center uk-flex-middle uk-height-medium">
      <div><span className="uk-spinner" uk-spinner="ratio: 1.5"></span> Загрузка...</div>
    </div>
  );

  if (error) return <div className="uk-alert-danger" uk-alert>{error}</div>;

  const items = [
    { label: 'Экспонаты', count: stats.exhibits, color: 'primary', icon: 'image' },
    { label: 'Категории', count: stats.categories, color: 'success', icon: 'folder' },
    { label: 'Квизы', count: stats.quizzes, color: 'danger', icon: 'question' },
    { label: 'Игры', count: 12, color: 'warning', icon: 'play' },
    { label: 'Отзывы', count: stats.reviews, color: 'secondary', icon: 'comments' },
  ];

  return (
    <div className="uk-container uk-container-expand">
      <h3 className="uk-heading-line uk-margin-large-bottom">
        <span><span uk-icon="icon: info; ratio: 1.3" className="uk-margin-small-right"></span>Обзор системы</span>
      </h3>

      <div className="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-5@l uk-grid-match" uk-grid>
        {items.map((item, index) => (
          <div key={index}>
            <div className="uk-card uk-card-default uk-card-hover uk-card-body uk-border-rounded uk-box-shadow-medium uk-height-medium">
              <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-height-1-1">
              <div className="uk-flex uk-flex-middle uk-margin-small-bottom">
                <span uk-icon={`icon: ${item.icon}`} className={`uk-margin-small-right uk-text-${item.color}`}></span>
                <span className="uk-text-bold uk-text-uppercase">{item.label}</span>
                </div>
                <div 
                  className={`uk-text-${item.color} stat-number`} 
                  style={{ 
                    fontSize: '3.5rem', 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`
                  }}
                >
                  {item.count}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .stat-number {
            transition: transform 0.3s ease;
          }

          .uk-card:hover .stat-number {
            transform: scale(1.1);
          }

          .uk-card {
            transition: all 0.3s ease;
          }

          .uk-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div className="uk-card uk-card-default uk-card-body uk-margin-xlarge-top uk-box-shadow-small">
        <h4 className="uk-heading-line uk-text-primary uk-margin-bottom"><span>Быстрые действия</span></h4>

        <div className="quick-actions">
          <button 
            onClick={() => navigate('/admin/exhibits')} 
            className="quick-action-btn quick-action-btn--primary"
          >
            <span className="quick-action-btn-icon">+</span>
            Управление экспонатами
            </button>
          
          <button 
            onClick={() => navigate('/admin/quizzes')} 
            className="quick-action-btn quick-action-btn--danger"
          >
            <span className="quick-action-btn-icon">✎</span>
            Управление квизами
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;