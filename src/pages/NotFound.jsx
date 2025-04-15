import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Компонент страницы 404 (Страница не найдена)
 */
const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.errorCode}>404</div>
        <h1 style={styles.title}>Страница не найдена</h1>
        <p style={styles.message}>
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <div style={styles.actions}>
          <Link to="/" style={styles.homeButton}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

// Стили для компонента
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '40px 20px',
    textAlign: 'center'
  },
  content: {
    maxWidth: '600px'
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#3b82f6',
    lineHeight: '1',
    marginBottom: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1e293b'
  },
  message: {
    fontSize: '18px',
    marginBottom: '32px',
    color: '#64748b'
  },
  actions: {
    display: 'flex',
    justifyContent: 'center'
  },
  homeButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  }
};

export default NotFound;
