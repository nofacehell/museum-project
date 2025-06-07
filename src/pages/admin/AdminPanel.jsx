import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getExhibits, getQuizzes, getGames, getAdminReviews, 
  updateReviewStatus, deleteExhibit, deleteQuiz, deleteGame, deleteReview,
  forceLocalDelete
} from '../../utils/api';
import { STATIC_URL } from '../../utils/config';
import UIkit from 'uikit';
import '../../styles/admin-new.css'; // Импорт стилей для админ-панели
import Categories from './Categories'; // Импорт компонента управления категориями
import ReviewsManager from './ReviewsManager';
import QuizzesManager from './QuizzesManager';
import GamesManager from './GamesManager';

/**
 * Компонент панели администратора - упрощённая версия для отладки
 */
const AdminPanel = ({ initialTab = 'dashboard' }) => {
  console.log("AdminPanel: Инициализация с начальной вкладкой", initialTab);
  const navigate = useNavigate();
  
  // Базовые состояния
  const [activeTab, setActiveTab] = useState(initialTab);
  const [username, setUsername] = useState('Администратор');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("AdminPanel: useEffect для загрузки базовых данных");

    try {
    // Получаем имя пользователя
    const savedUsername = localStorage.getItem('adminUsername') || 'Администратор';
    setUsername(savedUsername);
      console.log("AdminPanel: Имя пользователя установлено", savedUsername);
      
      // Упрощённая инициализация
      setTimeout(() => {
        setLoading(false);
        console.log("AdminPanel: Загрузка завершена");
      }, 500);
    } catch (err) {
      console.error("AdminPanel: Ошибка инициализации", err);
      setError("Произошла ошибка при загрузке данных: " + err.message);
       setLoading(false);
    }
  }, []);
  
  // Проверяем, в темной ли теме сейчас сайт - упрощённая версия
  const isDarkTheme = () => false;

  // Обработчик выхода из админ-панели
  const handleLogout = () => {
    console.log("AdminPanel: Выход из системы");
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };
  
  // Обновляем функцию renderActiveTab
  const renderActiveTab = () => {
    console.log("AdminPanel: Рендер активной вкладки", activeTab);
    
    switch (activeTab) {
      case 'reviews':
        return <ReviewsManager />;
      case 'quizzes':
        return <QuizzesManager />;
      case 'games':
        return <GamesManager />;
      case 'categories':
        return <Categories />;
      case 'exhibits':
        return (
          <div className="admin-tab-content">
            <h2>Управление экспонатами</h2>
            <p>Раздел в разработке</p>
          </div>
        );
      default:
        return (
          <div className="admin-tab-content">
            <h2>Панель управления</h2>
            <p>Добро пожаловать в панель управления музеем</p>
          </div>
        );
    }
  };

  // Wrap the entire return in a try-catch to identify any rendering issues
  try {
    console.log("AdminPanel: About to render, activeTab =", activeTab);
    
    // Если идёт загрузка
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%'
        }}>
          <div style={{
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderLeftColor: '#3b82f6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px' }}>Загрузка данных админ-панели...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    // Если произошла ошибка
    if (error) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#b91c1c'
        }}>
          <h2>Ошибка при загрузке данных</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Перезагрузить страницу
        </button>
    </div>
  );
    }
    
    // Основной интерфейс (упрощенный)
    return (
      <div style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Боковая панель */}
        <div style={{
          width: '250px',
          height: '100vh',
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            paddingBottom: '20px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🏛️</span>
            <h2 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Музей Онлайн</h2>
      </div>
      
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['dashboard', 'exhibits', 'categories', 'quizzes', 'games', 'reviews'].map(tab => (
                      <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 15px',
                  backgroundColor: activeTab === tab ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: activeTab === tab ? 'white' : '#94a3b8',
                  border: 'none',
                  borderRadius: '4px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                {tab === 'dashboard' && '📊 '}
                {tab === 'exhibits' && '🖼️ '}
                {tab === 'categories' && '📋 '}
                {tab === 'quizzes' && '❓ '}
                {tab === 'games' && '🎮 '}
                {tab === 'reviews' && '💬 '}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
            ))}
        </div>

        <button 
            onClick={handleLogout}
            style={{
              marginTop: 'auto',
              padding: '10px 15px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: 'none',
              borderRadius: '4px',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            Выйти из системы
          </button>
      </div>
      
        {/* Основной контент */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          backgroundColor: '#f8fafc'
        }}>
          {renderActiveTab()}
        </div>
    </div>
  );
  } catch (error) {
    console.error("AdminPanel: Render error:", error);
    return (
      <div style={{
    padding: '20px',
        margin: '20px',
    backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
    borderRadius: '8px',
        color: '#b91c1c'
      }}>
        <h2>Error Rendering Admin Panel</h2>
        <p>An error occurred while rendering the admin panel: {error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
};

export default AdminPanel; 
