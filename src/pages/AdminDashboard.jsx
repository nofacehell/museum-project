import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './admin/AdminPanel';

/**
 * Компонент AdminDashboard
 * Простая обертка для AdminPanel с проверкой авторизации
 */
const AdminDashboard = ({ activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AdminDashboard: Инициализация');
    
    // Устанавливаем флаг загрузки
    setIsLoading(true);
    
    // Скрываем основные элементы сайта
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Проверяем, авторизован ли пользователь
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || 
                    localStorage.getItem('isAdminAuthenticated') === 'true' || 
                    localStorage.getItem('adminAuth') === 'true';
    
    if (!isAdmin) {
      console.log('AdminDashboard: Пользователь не авторизован, перенаправление');
      navigate('/admin');
      return;
    }
    
    // Если авторизован, устанавливаем флаг авторизации и сбрасываем загрузку
    setIsAuthorized(true);
    setIsLoading(false);
    
    // Очищаем при размонтировании
    return () => {
      console.log('AdminDashboard: Размонтирование');
    if (header) header.style.display = '';
    if (footer) footer.style.display = '';
    };
  }, [navigate]);

  // Если идет загрузка, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div style={loaderStyles.container}>
        <div style={loaderStyles.content}>
          <div style={loaderStyles.spinner}></div>
          <p style={loaderStyles.text}>Загрузка админ-панели...</p>
        </div>
      </div>
    );
  }

  // Рендерим AdminPanel только если пользователь авторизован
  return isAuthorized ? <AdminPanel initialTab={activeTab} /> : null;
};

// Стили для лоадера
const loaderStyles = {
    container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
    backgroundColor: '#f8fafc'
  },
  content: {
      display: 'flex',
      flexDirection: 'column',
    alignItems: 'center'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(59, 130, 246, 0.1)',
      borderRadius: '50%',
    borderTop: '5px solid #3b82f6',
    animation: 'spin 1s linear infinite'
  },
  text: {
    marginTop: '20px',
    color: '#334155',
    fontSize: '16px'
  }
};

// Добавляем CSS для анимации
const loaderAnimation = document.createElement('style');
loaderAnimation.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(loaderAnimation);

export default AdminDashboard; 