import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Компонент для проверки авторизации администратора
 * Если пользователь авторизован - отображает вложенные компоненты
 * Если нет - перенаправляет на страницу входа
 */
const AuthCheck = ({ children }) => {
  // Проверяем авторизацию по всем возможным ключам
  const isAuthenticated = 
    localStorage.getItem('isAdmin') === 'true' || 
    localStorage.getItem('isAdminAuthenticated') === 'true' || 
    localStorage.getItem('adminAuth') === 'true';
  
  // Выводим в консоль статус авторизации
  useEffect(() => {
    console.log('AuthCheck: Проверка авторизации:', isAuthenticated ? 'успешно' : 'не авторизован');
    console.log('AuthCheck: localStorage.isAdmin:', localStorage.getItem('isAdmin'));
    console.log('AuthCheck: localStorage.isAdminAuthenticated:', localStorage.getItem('isAdminAuthenticated'));
    console.log('AuthCheck: localStorage.adminAuth:', localStorage.getItem('adminAuth'));
  }, [isAuthenticated]);
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    console.log('AuthCheck: Перенаправление на страницу входа');
    return <Navigate to="/admin" replace />;
  }
  
  // Если авторизован, рендерим дочерние компоненты
  console.log('AuthCheck: Пользователь авторизован, отображаем содержимое');
  return children;
};

export default AuthCheck; 