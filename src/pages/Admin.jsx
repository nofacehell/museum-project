import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Страница входа в админ-панель
const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Проверяем авторизацию и очищаем данные при загрузке страницы
  useEffect(() => {
    console.log('Admin: Инициализация страницы авторизации');
    
    // Очищаем любую предыдущую авторизацию при входе на страницу логина
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
  }, []);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log(`Попытка входа с логином: ${username}`);
    
    // Имитация задержки запроса
    setTimeout(() => {
      // Проверка учетных данных (в реальном приложении это должно быть на сервере)
      if (username === 'admin' && password === 'museum123') {
        // Сохраняем статус авторизации во всех возможных ключах для совместимости
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUsername', username);
        
        // Показываем сообщение об успешном входе
        alert('Вход выполнен успешно! Перенаправляем в панель управления.');
        
        // Перенаправляем на админ-панель
        navigate('/admin/dashboard');
      } else {
        setLoading(false);
        setError('Неверное имя пользователя или пароль');
      }
    }, 1000);
  };

  // Стили для страницы входа
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)', // Учитываем header и footer
      backgroundColor: '#f3f4f6',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    },
    title: {
      margin: '0',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    subtitle: {
      margin: '10px 0 0',
      fontSize: '14px',
      opacity: '0.8'
    },
    body: {
      padding: '20px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    buttonDisabled: {
      opacity: '0.7',
      cursor: 'not-allowed'
    },
    error: {
      color: '#dc2626',
      fontSize: '14px',
      marginBottom: '15px',
      textAlign: 'center'
    },
    hint: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center',
      marginTop: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Музей Онлайн</h1>
          <p style={styles.subtitle}>Панель администратора</p>
        </div>
        
        <div style={styles.body}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>Имя пользователя</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя пользователя"
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Пароль</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                style={styles.input}
              />
            </div>
            
            {error && <div style={styles.error}>{error}</div>}
            
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          
          <p style={styles.hint}>
            Для демо-входа используйте:<br />
            Логин: admin<br />
            Пароль: museum123
          </p>
          
          <div style={styles.hint}>
            <a href="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>
              &larr; Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
  