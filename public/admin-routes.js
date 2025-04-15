// Скрипт для обхода проблем с маршрутизацией
(function() {
  // Проверяем, является ли путь админским
  const isAdminPath = window.location.pathname.startsWith('/admin/') && 
                      window.location.pathname !== '/admin/login' && 
                      window.location.pathname !== '/admin';
  
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true' || 
                          localStorage.getItem('adminAuth') === 'true';
  
  console.log('Admin Routes Script: Checking path', window.location.pathname);
  console.log('Admin Routes Script: Is admin path?', isAdminPath);
  console.log('Admin Routes Script: Is authenticated?', isAuthenticated);
  
  // Если это админский путь и пользователь авторизован
  if (isAdminPath && isAuthenticated) {
    console.log('Admin Routes Script: Hiding regular content');
    
    // Скрываем стандартные элементы сайта (заголовок и подвал)
    document.addEventListener('DOMContentLoaded', function() {
      // Задержка позволяет React загрузиться сперва
      setTimeout(function() {
        // Находим основной контейнер
        const mainElement = document.querySelector('main.uk-main');
        if (mainElement) {
          // Заменяем содержимое на заглушку
          const originalContent = mainElement.innerHTML;
          mainElement.innerHTML = '<div id="admin-content"></div>';
          
          // Добавляем стили для всей страницы
          const styleElement = document.createElement('style');
          styleElement.textContent = `
            header, footer {
              display: none !important;
            }
            #admin-content {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 9999;
            }
          `;
          document.head.appendChild(styleElement);
          
          console.log('Admin Routes Script: Added admin content container');
        }
      }, 100);
    });
  }
})(); 