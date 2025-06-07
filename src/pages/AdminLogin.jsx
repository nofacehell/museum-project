import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem('theme') === 'dark' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const navigate = useNavigate();

  // Применяем тему при загрузке и изменении
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkTheme]);

  // Скрываем стандартные элементы сайта
  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // Проверяем авторизацию
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
    
    // Восстанавливаем отображение при размонтировании
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Имитация авторизации на сервере
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        console.log("AdminLogin: Авторизация успешна");
        
        // Сохраняем информацию об авторизации
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminUsername', username);
        
        // Перенаправляем на админ-панель используя navigate вместо window.location
        console.log("AdminLogin: Redirecting to /admin");
        navigate('/admin');
      } else {
        setError('Неверное имя пользователя или пароль');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className={`admin-login-page ${darkTheme ? 'dark' : 'light'}`}>
      <div className="theme-toggle-wrapper">
        <button 
          className="theme-toggle-button"
          onClick={toggleTheme}
          aria-label="Переключить тему"
        >
          {darkTheme ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <FaLock className="admin-login-icon" />
            <h1>Панель администратора</h1>
            <p>Введите данные для входа</p>
          </div>
          
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="username" className="admin-form-label">
                Имя пользователя
              </label>
              <div className="admin-input-wrapper">
                <FaUser className="admin-input-icon" />
                <input
                  id="username"
                  type="text"
                  className="admin-form-input"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">
                Пароль
              </label>
              <div className="admin-input-wrapper">
                <FaLock className="admin-input-icon" />
                <input
                  id="password"
                  type="password"
                  className="admin-form-input"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`admin-login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          
          <div className="admin-login-hint">
            
          </div>
        </div>
      </div>
      
      <div className="admin-login-footer">
        <p>&copy; {new Date().getFullYear()} Виртуальный Музей</p>
      </div>
    </div>
  );
};

export default AdminLogin; 