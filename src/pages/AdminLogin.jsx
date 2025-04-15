import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import 'uikit/dist/css/uikit.min.css';
import Icons from 'uikit/dist/js/uikit-icons';
import '../styles/admin.css';

UIkit.use(Icons);

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // Тестовые данные для входа (в реальном приложении должны храниться на сервере)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';
  
  // Проверка темы и авторизации при загрузке компонента
  useEffect(() => {
    // Проверка темы
    const darkMode = localStorage.getItem('adminDarkMode') === 'true' || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(darkMode);
    applyTheme(darkMode);
    
    // Скрываем стандартные элементы сайта
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Проверяем, авторизован ли пользователь
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true' || 
                          localStorage.getItem('adminAuth') === 'true';
    
    if (isAuthenticated) {
      navigate('/admin/dashboard');
      return;
    }
    
    // Проверяем наличие параметра logout
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('logout')) {
      UIkit.notification({
        message: 'Вы успешно вышли из панели администратора',
        status: 'success',
        pos: 'top-center',
        timeout: 2000
      });
      
      // Очищаем URL от параметра logout
      window.history.replaceState({}, document.title, '/admin');
    }
    
    // Восстанавливаем элементы при размонтировании
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, [navigate]);
  
  // Применение темы
  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('admin-dark-mode');
      document.body.classList.add('admin-dark-mode');
    } else {
      document.documentElement.classList.remove('admin-dark-mode');
      document.body.classList.remove('admin-dark-mode');
    }
  };
  
  // Переключение темы
  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(newDarkMode);
    localStorage.setItem('adminDarkMode', newDarkMode ? 'true' : 'false');
  };

  // Обработка формы входа
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Имитация задержки сервера
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Запись информации о авторизации
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminAuth', 'true');
        
        UIkit.notification({
          message: 'Успешная авторизация!',
          status: 'success',
          pos: 'top-center',
          timeout: 2000
        });
        
        // Перенаправление на панель администратора
        navigate('/admin/dashboard');
      } else {
        setError('Неверное имя пользователя или пароль');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className={`admin-login ${isDark ? 'dark-mode' : 'light-mode'}`}>
      <div className="theme-toggle-container">
        <button onClick={toggleTheme} className="theme-toggle-login">
          {isDark ? '☀️ Светлая тема' : '🌙 Темная тема'}
        </button>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <span uk-icon="icon: album; ratio: 2"></span>
            </div>
            <h1>Музей Онлайн</h1>
            <p>Вход в панель администратора</p>
          </div>
          
          {error && (
            <div className="uk-alert uk-alert-danger">
              <span uk-icon="icon: warning; ratio: 0.8"></span> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="uk-margin">
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: user"></span>
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="uk-margin">
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                <input
                  className="uk-input"
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="uk-button uk-button-primary uk-width-1-1"
              disabled={loading}
            >
              {loading ? (
                <div uk-spinner="ratio: 0.6"></div>
              ) : (
                <>Войти <span uk-icon="sign-in"></span></>
              )}
            </button>
          </form>
          
          <div className="login-hint">
            <p>Данные для входа: admin / admin123</p>
          </div>
        </div>
      </div>
      
      <div className="login-footer">
        <p>&copy; 2023 Музей Онлайн | Панель администратора</p>
      </div>
    </div>
  );
};

export default AdminLogin; 