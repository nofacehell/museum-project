import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

/**
 * Компонент макета для админ-панели
 * Обеспечивает проверку авторизации и базовую структуру для всех страниц админ-панели
 */
const AdminLayout = () => {
  const navigate = useNavigate();

  // Проверка авторизации при загрузке
  useEffect(() => {
    console.log("AdminLayout: Инициализация");
    
    // Проверяем, авторизован ли пользователь
    const isLoggedIn = localStorage.getItem('adminAuth') === 'true';
    
    if (!isLoggedIn) {
      console.log("AdminLayout: Пользователь не авторизован");
      // Перенаправляем на страницу входа
      navigate('/admin/login');
      return;
    }
    
    // Скрываем стандартные элементы страницы
    hideStandardElements();
    
    // Восстанавливаем стандартные элементы при размонтировании
    return () => {
      console.log("AdminLayout: Размонтирование");
      restoreStandardElements();
    };
  }, [navigate]);
  
  // Скрытие стандартных элементов страницы (хедер, футер и т.д.)
  const hideStandardElements = () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const mainContent = document.getElementById('main-content');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (mainContent) mainContent.style.display = 'none';
    
    // Добавляем класс для body, чтобы изменить стили
    document.body.classList.add('admin-mode');
    
    console.log("AdminLayout: Стандартные элементы скрыты");
  };
  
  // Восстановление стандартных элементов страницы
  const restoreStandardElements = () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const mainContent = document.getElementById('main-content');
    
    if (header) header.style.display = '';
    if (footer) footer.style.display = '';
    if (mainContent) mainContent.style.display = '';
    
    // Удаляем класс для body
    document.body.classList.remove('admin-mode');
    
    console.log("AdminLayout: Стандартные элементы восстановлены");
  };

  return (
    <div id="admin-root">
      <Outlet />
    </div>
  );
};

export default AdminLayout; 