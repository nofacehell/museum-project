import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    avatar: '/images/avatars/default.jpg',
    achievements: [
      { id: 1, title: 'Первая игра', description: 'Завершена первая игра', date: '2024-01-01' },
      { id: 2, title: 'Мастер памяти', description: 'Найдены все пары в игре "Найди пару"', date: '2024-01-02' },
      { id: 3, title: 'Искусствовед', description: 'Правильно определены все стили в игре "Угадай стиль"', date: '2024-01-03' }
    ],
    stats: {
      gamesPlayed: 15,
      totalScore: 1200,
      averageTime: '2:30'
    }
  });

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Профиль</h1>
        <p className="profile-description">Ваши достижения и статистика</p>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-avatar">
            <img src={user.avatar} alt={user.name} />
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="uk-icon" data-uk-icon="icon: play-circle; ratio: 1.5"></span>
            <div className="stat-info">
              <span className="stat-value">{user.stats.gamesPlayed}</span>
              <span className="stat-label">Игр сыграно</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="uk-icon" data-uk-icon="icon: star; ratio: 1.5"></span>
            <div className="stat-info">
              <span className="stat-value">{user.stats.totalScore}</span>
              <span className="stat-label">Общий счет</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="uk-icon" data-uk-icon="icon: clock; ratio: 1.5"></span>
            <div className="stat-info">
              <span className="stat-value">{user.stats.averageTime}</span>
              <span className="stat-label">Среднее время</span>
            </div>
          </div>
        </div>

        <div className="profile-achievements">
          <h3 className="section-title">Достижения</h3>
          <div className="achievements-list">
            {user.achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-icon">
                  <span className="uk-icon" data-uk-icon="icon: trophy; ratio: 1.2"></span>
                </div>
                <div className="achievement-info">
                  <h4 className="achievement-title">{achievement.title}</h4>
                  <p className="achievement-description">{achievement.description}</p>
                  <span className="achievement-date">{achievement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/games" className="profile-button">
            К играм
          </Link>
          <button className="profile-button secondary">
            Редактировать профиль
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 