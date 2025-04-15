import React, { useEffect } from 'react';
import AdminDashboard from './AdminDashboard';

/**
 * Компонент-обертка для AdminDashboard, который автоматически встраивается в DOM 
 * при посещении URL /admin/dashboard
 */
const DashboardWrapper = () => {
  useEffect(() => {
    console.log('DashboardWrapper: Инициализация');
    
    // Проверяем авторизацию
    const isAuthenticated = 
      localStorage.getItem('isAdminAuthenticated') === 'true' || 
      localStorage.getItem('adminAuth') === 'true';
    
    if (!isAuthenticated) {
      console.log('DashboardWrapper: Пользователь не авторизован, перенаправление');
      window.location.href = '/#/admin';
      return;
    }
    
    // Инициализируем AdminDashboard напрямую в DOM
    const init = () => {
      console.log('DashboardWrapper: Создание DOM-структуры');
      
      // Скрываем стандартные элементы сайта
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      const main = document.querySelector('main.uk-main');
      
      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (main) main.style.display = 'none';
      
      // Создаем контейнер для админ-панели, если его еще нет
      let adminContent = document.getElementById('admin-content');
      
      if (!adminContent) {
        adminContent = document.createElement('div');
        adminContent.id = 'admin-content';
        adminContent.style.position = 'fixed';
        adminContent.style.top = '0';
        adminContent.style.left = '0';
        adminContent.style.right = '0';
        adminContent.style.bottom = '0';
        adminContent.style.backgroundColor = '#fff';
        adminContent.style.zIndex = '9999';
        adminContent.style.overflow = 'auto';
        
        document.body.appendChild(adminContent);
        console.log('DashboardWrapper: Создан контейнер admin-content');
      }
    };
    
    // Запускаем инициализацию с небольшой задержкой
    setTimeout(init, 100);
    
    // Очистка при размонтировании
    return () => {
      console.log('DashboardWrapper: Размонтирование');
      
      // Восстанавливаем стандартные элементы сайта
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      const main = document.querySelector('main.uk-main');
      
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      if (main) main.style.display = '';
      
      // Удаляем контейнер для админ-панели
      const adminContent = document.getElementById('admin-content');
      if (adminContent) {
        adminContent.remove();
        console.log('DashboardWrapper: Удален контейнер admin-content');
      }
    };
  }, []);

  // После того как DashboardWrapper инициализирует DOM,
  // будет запущен компонент AdminDashboard через admin-routes.js
  return null;
};

export default DashboardWrapper; 