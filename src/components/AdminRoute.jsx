import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import ExhibitEdit from '../pages/admin/ExhibitEdit';
import QuizEdit from '../pages/admin/QuizEdit';
import GameEdit from '../pages/admin/GameEdit';

/**
 * Компонент для обработки административных маршрутов
 * Его нужно подключить в public/index.html для обработки маршрутов без обновления страницы
 */
const AdminRoute = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Проверяем авторизацию
  const isAuthenticated = 
    localStorage.getItem('isAdminAuthenticated') === 'true' || 
    localStorage.getItem('adminAuth') === 'true';
  
  console.log("AdminRoute: Обработка маршрута", pathname);
  console.log("AdminRoute: Статус авторизации =", isAuthenticated);
  
  if (!isAuthenticated) {
    console.log("AdminRoute: Перенаправление на /admin (не авторизован)");
    return <Navigate to="/admin" />;
  }
  
  // Отображаем соответствующий компонент в зависимости от маршрута
  if (pathname === '/admin/dashboard') {
    console.log("AdminRoute: Отображаем AdminDashboard");
    return <AdminDashboard />;
  }
  
  // Администрирование экспонатов
  if (pathname.match(/^\/admin\/exhibits\/new$/)) {
    return <ExhibitEdit />;
  }
  
  if (pathname.match(/^\/admin\/exhibits\/[^/]+\/edit$/)) {
    const id = pathname.split('/')[3];
    return <ExhibitEdit exhibitId={id} />;
  }
  
  // Администрирование квизов
  if (pathname.match(/^\/admin\/quizzes\/new$/)) {
    return <QuizEdit />;
  }
  
  if (pathname.match(/^\/admin\/quizzes\/[^/]+\/edit$/)) {
    const id = pathname.split('/')[3];
    return <QuizEdit quizId={id} />;
  }
  
  // Администрирование игр
  if (pathname.match(/^\/admin\/games\/new$/)) {
    return <GameEdit />;
  }
  
  if (pathname.match(/^\/admin\/games\/[^/]+\/edit$/)) {
    const id = pathname.split('/')[3];
    return <GameEdit gameId={id} />;
  }
  
  // Если маршрут не найден, отображаем AdminDashboard
  console.log("AdminRoute: Неизвестный маршрут, отображаем AdminDashboard");
  return <AdminDashboard />;
};

export default AdminRoute; 