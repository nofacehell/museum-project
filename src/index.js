import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Инициализация скрипта для перенаправления на хэш-маршруты админки
const initializeAdminRoutesScript = () => {
  // Проверяем, не запущен ли уже скрипт
  if (window.adminRoutesInitialized) return;
  
  // Отмечаем, что скрипт инициализирован
  window.adminRoutesInitialized = true;
  
  console.log("[AdminRoutesScript] Инициализация v3.1 (hash mode)...");
  
  // Функция для проверки и обработки маршрутов
  const handleRoutes = () => {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    console.log("[AdminRoutesScript] Текущий путь:", currentPath);
    console.log("[AdminRoutesScript] Текущий хэш:", currentHash);
    
    // Проверка, является ли текущий маршрут маршрутом админки
    const isAdminPathByHash = currentHash.startsWith('#/admin/');
    const isAdminPathByUrl = currentPath.startsWith('/admin/');
    const isAdminPage = currentPath === '/admin' || currentPath === '/admin/';
    
    console.log("[AdminRoutesScript] Путь админки (по хэшу)?", isAdminPathByHash);
    console.log("[AdminRoutesScript] Путь админки (по URL)?", isAdminPathByUrl);
    console.log("[AdminRoutesScript] Страница авторизации админа?", isAdminPage);
    
    // Проверка авторизации
    const isAuthenticated = 
      localStorage.getItem('isAdminAuthenticated') === 'true' || 
      localStorage.getItem('adminAuth') === 'true';
      
    console.log("[AdminRoutesScript] Авторизован?", isAuthenticated);
    console.log("[AdminRoutesScript] localStorage.isAdminAuthenticated:", localStorage.getItem('isAdminAuthenticated'));
    console.log("[AdminRoutesScript] localStorage.adminAuth:", localStorage.getItem('adminAuth'));
    
    // Генерируем уникальный ID сессии
    const sessionId = `admin-${Math.random().toString(36).substring(2, 8)}`;
    console.log("[AdminRoutesScript] ID сессии:", sessionId);
    
    // Если пользователь авторизован и находится на странице логина,
    // перенаправляем на dashboard через хэш
    if (isAdminPage && isAuthenticated && !isAdminPathByHash) {
      console.log("[AdminRoutesScript] Перенаправление на dashboard через хэш");
      window.location.href = '/#/admin/dashboard';
      return;
    }
    
    // Если это маршрут админки через URL и пользователь авторизован, 
    // перенаправляем его на тот же маршрут, но через хэш
    if (isAdminPathByUrl && isAuthenticated) {
      const hashPath = currentPath.replace(/^\/admin/, '#/admin');
      console.log("[AdminRoutesScript] Перенаправление URL на хэш:", hashPath);
      window.location.href = `/${hashPath}`;
      return;
    }
    
    // Если это маршрут админки через хэш
    if (isAdminPathByHash && isAuthenticated) {
      console.log("[AdminRoutesScript] Обнаружен dashboard, активируем административный интерфейс...");
      
      // Функция настройки интерфейса, вызываемая после загрузки DOM
      const setupAdminInterface = () => {
        console.log("[AdminRoutesScript] DOM загружен, настройка интерфейса...");
        
        // ВАЖНОЕ ИЗМЕНЕНИЕ: Только скрываем стандартные элементы, но не манипулируем #admin-content
        // Это позволит React самостоятельно управлять контейнером admin-content
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const mainContent = document.querySelector('main.uk-main');
        
        if (header) {
          header.style.display = 'none';
          console.log("[AdminRoutesScript] Header скрыт");
        }
        
        if (footer) {
          footer.style.display = 'none';
          console.log("[AdminRoutesScript] Footer скрыт");
        }
        
        if (mainContent) {
          mainContent.style.display = 'none';
          console.log("[AdminRoutesScript] Основное содержимое скрыто");
        }
        
        // Добавляем стили для admin-content, но не создаем и не манипулируем DOM-элементом
        if (!document.getElementById('admin-content-styles')) {
          const adminStyles = document.createElement('style');
          adminStyles.id = 'admin-content-styles';
          adminStyles.textContent = `
            #admin-content {
              transition: opacity 0.3s ease;
              display: block !important;
              visibility: visible !important;
              position: fixed !important;
              inset: 0px !important;
              z-index: 9999 !important;
              overflow: auto !important;
            }
            .dark-theme #admin-content {
              background-color: #111827 !important;
            }
            .light-theme #admin-content {
              background-color: #F9FAFB !important;
            }
          `;
          document.head.appendChild(adminStyles);
          console.log("[AdminRoutesScript] Добавлены стили для admin-content");
        }
        
        console.log("[AdminRoutesScript] Настройка завершена успешно");
      };
      
      // Если DOM уже загружен, настраиваем интерфейс сейчас
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setupAdminInterface();
      } else {
        // Иначе ждем загрузки DOM
        document.addEventListener('DOMContentLoaded', setupAdminInterface);
      }
    } else {
      console.log("[AdminRoutesScript] Не требуется активация (не маршрут админки или не авторизован)");
    }
  };
  
  // Запускаем обработку маршрутов при загрузке и при изменении хэша
  handleRoutes();
  window.addEventListener('hashchange', handleRoutes);
};

// Глобальный обработчик изменения темы
const initializeThemeListener = () => {
  document.addEventListener('themechange', (event) => {
    const isDark = event.detail?.dark || false;
    console.log("[ThemeManager] Получено событие изменения темы:", isDark ? "темная" : "светлая");
    
    // Обновляем классы для главного документа
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
    
    // Обновляем header
    const updateHeader = () => {
      const headers = [
        document.querySelector('header.header'),
        document.querySelector('.header'),
        document.querySelector('header')
      ];
      
      for (const header of headers) {
        if (header) {
          console.log("[ThemeManager] Обновляем стиль header");
          if (isDark) {
            header.classList.add('dark-theme-header');
          } else {
            header.classList.remove('dark-theme-header');
          }
          
          // Обновляем все навигационные ссылки
          const links = header.querySelectorAll('a, .nav-link');
          links.forEach(link => {
            link.style.color = isDark ? '#f9fafb' : '#1e3a8a';
          });
          
          // Обновляем логотип
          const logo = header.querySelector('.logo, .uk-logo');
          if (logo) {
            logo.style.color = isDark ? '#f9fafb' : '#1e3a8a';
          }
        }
      }
    };
    
    // Вызываем обновление для header
    updateHeader();
    setTimeout(updateHeader, 100);
  });
  
  console.log("[ThemeManager] Обработчик событий изменения темы инициализирован");
};

// Запускаем слушатель тем
initializeThemeListener();

// Запускаем скрипт админ-маршрутов
initializeAdminRoutesScript();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
); 