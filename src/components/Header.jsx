import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  // Определяем текущую тему при монтировании
  useEffect(() => {
    // Проверяем, авторизован ли пользователь как админ
    const adminAuth = 
      localStorage.getItem('adminAuth') === 'true' || 
      localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAdmin(adminAuth);
    
    const checkTheme = () => {
      const darkThemeDetected = 
        document.documentElement.classList.contains('dark-theme') || 
        document.body.classList.contains('dark-theme') ||
        localStorage.getItem('adminDarkMode') === 'true' ||
        localStorage.getItem('darkTheme') === 'true';
        
      setIsDark(darkThemeDetected);
      
      // Применяем стили напрямую к header для надежности
      const header = document.querySelector('.header');
      if (header) {
        if (darkThemeDetected) {
          header.classList.add('dark-theme-header');
        } else {
          header.classList.remove('dark-theme-header');
        }
      }
    };
    
    // Проверяем тему при монтировании
    checkTheme();
    
    // Слушаем события изменения темы
    const handleThemeChange = (event) => {
      const isDarkTheme = event.detail?.dark || false;
      setIsDark(isDarkTheme);
      console.log("Header: Получено событие изменения темы", isDarkTheme ? "темная" : "светлая");
    };
    
    // Подписываемся на событие themechange
    document.addEventListener('themechange', handleThemeChange);
    
    // Отписываемся при размонтировании
    return () => {
      document.removeEventListener('themechange', handleThemeChange);
    };
  }, []);
  
  // Обработчик клика на кнопку "Админ"
  const handleAdminClick = (e) => {
    e.preventDefault();
    // HashRouter использует # в URL
    navigate('/admin');
    // После навигации перезагружаем страницу, чтобы быть уверенным, что маршрут обработан
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return (
    <header className={`header ${isDark ? 'dark-theme-header' : ''}`} data-theme={isDark ? 'dark' : 'light'}>
      <div className="header-container">
        <Link to="/" className="logo" style={{ color: isDark ? '#F9FAFB' : '#1e3a8a' }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8V19H21V8L12 3L3 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15V19M15 15V19M3 8H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Музей Онлайн
        </Link>

        <nav className="nav-links">
          <NavLink to="/exhibits" className="nav-link" style={{ color: isDark ? '#F9FAFB' : '#1e3a8a' }}>
            ЭКСПОНАТЫ
          </NavLink>
          <NavLink to="/quizzes" className="nav-link" style={{ color: isDark ? '#F9FAFB' : '#1e3a8a' }}>
            ВИКТОРИНЫ
          </NavLink>
          <NavLink to="/games" className="nav-link" style={{ color: isDark ? '#F9FAFB' : '#1e3a8a' }}>
            ИГРЫ
          </NavLink>
          <NavLink to="/about" className="nav-link" style={{ color: isDark ? '#F9FAFB' : '#1e3a8a' }}>
            О НАС
          </NavLink>
          <NavLink to="/reviews" className="nav-link" style={{ color: isDark ? '#F9FAFB' : '#1e3a8a' }}>
            ОТЗЫВЫ
          </NavLink>
          <a 
            href="#" 
            className="nav-link" 
            style={{ color: isDark ? '#F9FAFB' : '#1e3a8a' }}
            onClick={handleAdminClick}
          >
            АДМИН
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header; 