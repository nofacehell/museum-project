import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/admin.css';          // базовые стили админки
import './styles/admin-override.css'; // перезапись стилей админки
import App from './App';
import reportWebVitals from './reportWebVitals';

// Функция инициализации темы
const initializeThemeListener = () => {
  document.addEventListener('themechange', ({ detail }) => {
    const isDark = detail?.dark;
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('dark-theme', isDark);
  });
  
  // Проверяем сохраненную тему при загрузке
  const savedTheme = localStorage.getItem('darkTheme') === 'true';
  if (savedTheme) {
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
  }
};

// Функция инициализации админских маршрутов
const initializeAdminRoutesScript = () => {
  if (window.adminRoutesInitialized) return;
  window.adminRoutesInitialized = true;

  const handleRoutes = () => {
    const { pathname, hash } = window.location;
    const isHashAdmin = hash.startsWith('#/admin');
    const isUrlAdmin  = pathname.startsWith('/admin');
    const isAdminLogin = pathname === '/admin' || pathname === '/admin/';
    const isAuth = localStorage.getItem('adminAuth') === 'true' ||
                   localStorage.getItem('isAdminAuthenticated') === 'true';

    // Редиректы
    if (isAdminLogin && isAuth && !isHashAdmin) {
      window.location.replace('/#/admin/dashboard');
      return;
    }
    if (isUrlAdmin && isAuth) {
      window.location.replace(hash || '/#/admin/dashboard');
      return;
    }

    // Активируем админ-режим
    if ((isHashAdmin) && isAuth) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  };

  window.addEventListener('hashchange', handleRoutes);
  handleRoutes();
};

// Инициализируем слушатель темы
initializeThemeListener();

// Запуск слушателей перед рендером
initializeAdminRoutesScript();

// Рендер приложения
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();