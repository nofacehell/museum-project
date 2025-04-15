import React, { useState, useEffect } from 'react';

/**
 * Компонент страницы входа в админ-панель
 */
const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Проверка существующей авторизации при загрузке
  useEffect(() => {
    console.log("AdminLogin: Инициализация");
    
    // Проверяем, авторизован ли пользователь
    const isLoggedIn = localStorage.getItem('adminAuth') === 'true';
    
    if (isLoggedIn) {
      console.log("AdminLogin: Пользователь уже авторизован");
      // Перенаправляем на админ-панель
      window.location.href = '/admin/panel';
    }
    
    console.log("AdminLogin: Инициализация завершена");
  }, []);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("AdminLogin: Попытка входа", { username });
    
    // Сбрасываем прошлые ошибки
    setError('');
    setLoading(true);
    
    // Имитация проверки на сервере
    setTimeout(() => {
      // Проверка учетных данных (для демонстрации)
      if (username === 'admin' && password === 'admin123') {
        console.log("AdminLogin: Авторизация успешна");
        
        // Сохраняем информацию об авторизации
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUsername', username);
        
        // Перенаправляем на админ-панель
        window.location.href = '/admin/panel';
      } else {
        console.log("AdminLogin: Ошибка авторизации");
        setError('Неверное имя пользователя или пароль');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <span style={styles.logoIcon}>🏛️</span>
          <h1 style={styles.title}>Музей Онлайн</h1>
          <p style={styles.subtitle}>Вход в админ-панель</p>
        </div>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.errorBox}>{error}</div>}
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={loading ? {...styles.submitButton, ...styles.submitButtonDisabled} : styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти в систему'}
          </button>
          
          <a href="/" style={styles.backLink}>
            Вернуться на сайт
          </a>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>© {new Date().getFullYear()} Музей Онлайн. Все права защищены.</p>
        </div>
      </div>
      
      <div style={styles.helpText}>
        <p>Для демонстрации используйте:</p>
        <p><strong>Логин:</strong> admin</p>
        <p><strong>Пароль:</strong> admin123</p>
      </div>
    </div>
  );
};

// Стили для компонента
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f8fafc',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999
  },
  loginBox: {
    width: '400px',
    maxWidth: '90%',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '24px',
    textAlign: 'center'
  },
  logoIcon: {
    fontSize: '48px',
    display: 'block',
    margin: '0 auto 12px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 4px'
  },
  subtitle: {
    fontSize: '16px',
    opacity: '0.8',
    margin: 0
  },
  form: {
    padding: '24px'
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#475569',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '16px',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box'
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'background-color 0.2s'
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed'
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '14px'
  },
  footer: {
    borderTop: '1px solid #e2e8f0',
    padding: '16px 24px'
  },
  footerText: {
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'center',
    margin: 0
  },
  helpText: {
    marginTop: '20px',
    backgroundColor: '#fff7ed',
    border: '1px solid #fed7aa',
    padding: '12px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#9a3412'
  }
};

export default AdminLogin; 