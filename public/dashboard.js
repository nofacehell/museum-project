// Скрипт прямого рендеринга AdminDashboard с использованием LocalStorage
(() => {
  console.log('Dashboard.js: Инициализация...');
  
  // Проверяем авторизацию
  const isAuthenticated = 
    localStorage.getItem('isAdminAuthenticated') === 'true' || 
    localStorage.getItem('adminAuth') === 'true';
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    console.log('Dashboard.js: Пользователь не авторизован, перенаправление на /admin');
    window.location.href = '/admin?redirect=/admin/dashboard';
    throw new Error('Unauthorized');
  }
  
  // Находим или создаем контейнер для админ-панели
  let adminContent = document.getElementById('admin-content');
  if (!adminContent) {
    console.log('Dashboard.js: Создание контейнера admin-content');
    
    adminContent = document.createElement('div');
    adminContent.id = 'admin-content';
    adminContent.style.position = 'fixed';
    adminContent.style.top = '0';
    adminContent.style.left = '0';
    adminContent.style.right = '0';
    adminContent.style.bottom = '0';
    adminContent.style.backgroundColor = '#fff';
    adminContent.style.zIndex = '9999';
    
    document.body.appendChild(adminContent);
  }
  
  // Скрываем стандартный шаблон сайта
  const hideDefaultTemplate = () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (main) main.style.display = 'none';
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard.js: DOM загружен');
    hideDefaultTemplate();
    
    // Добавляем загрузочный индикатор
    adminContent.innerHTML = `
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
        <div style="
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          border-top-color: #3490dc;
          animation: admin-spin 1s ease-in-out infinite;
        "></div>
        <p style="margin-top: 20px; font-family: system-ui, sans-serif;">Загрузка панели администратора...</p>
        <style>
          @keyframes admin-spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;
    
    // Вместо использования React Router, создаем демо-данные напрямую
    const initAdminPanel = () => {
      console.log('Dashboard.js: Инициализация данных панели администратора');
      
      // Демо-данные для использования, если localStorage пуст
      const demoExhibits = [
        { id: '1', title: 'Мона Лиза', category: 'Картины', year: '1503', author: 'Леонардо да Винчи' },
        { id: '2', title: 'Звездная ночь', category: 'Картины', year: '1889', author: 'Винсент Ван Гог' },
        { id: '3', title: 'Венера Милосская', category: 'Скульптуры', year: '~100 до н.э.', author: 'Неизвестен' }
      ];
      
      const demoQuizzes = [
        { id: '1', title: 'История Ренессанса', difficulty: 'Средний', questions: 10 },
        { id: '2', title: 'Импрессионизм', difficulty: 'Легкий', questions: 5 },
        { id: '3', title: 'Модернизм', difficulty: 'Сложный', questions: 15 }
      ];
      
      const demoGames = [
        { id: '1', title: 'Найди отличия', category: 'Поиск', difficulty: 'Легкий' },
        { id: '2', title: 'Пазл "Шедевры искусства"', category: 'Головоломки', difficulty: 'Средний' },
        { id: '3', title: 'Хронология', category: 'Викторина', difficulty: 'Сложный' }
      ];
      
      const demoReviews = [
        { id: '1', author: 'Иван Петров', rating: 5, text: 'Отличный музей!', status: 'approved' },
        { id: '2', author: 'Мария Сидорова', rating: 4, text: 'Интересные экспонаты, но хотелось бы больше интерактива.', status: 'pending' },
        { id: '3', author: 'Алексей Смирнов', rating: 2, text: 'Сайт работает медленно.', status: 'rejected' }
      ];
      
      // Проверяем наличие данных в localStorage, если нет - используем демо-данные
      if (!localStorage.getItem('exhibits')) {
        localStorage.setItem('exhibits', JSON.stringify(demoExhibits));
        console.log('Dashboard.js: Добавлены демо-данные для экспонатов');
      }
      
      if (!localStorage.getItem('quizzes')) {
        localStorage.setItem('quizzes', JSON.stringify(demoQuizzes));
        console.log('Dashboard.js: Добавлены демо-данные для квизов');
      }
      
      if (!localStorage.getItem('games')) {
        localStorage.setItem('games', JSON.stringify(demoGames));
        console.log('Dashboard.js: Добавлены демо-данные для игр');
      }
      
      if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify(demoReviews));
        console.log('Dashboard.js: Добавлены демо-данные для отзывов');
      }
    };
    
    // Инициализируем данные и перезагружаем страницу
    initAdminPanel();
    
    // Через 2 секунды снова проверяем контейнер
    setTimeout(() => {
      // Если все еще отображается загрузочный экран, показываем кнопку возврата
      if (adminContent.innerHTML.includes('Загрузка панели администратора')) {
        adminContent.innerHTML += `
          <div style="text-align: center; margin-top: 30px;">
            <p>Панель администратора не загрузилась автоматически.</p>
            <button onclick="window.location.reload()" style="
              padding: 10px 20px;
              background-color: #3490dc;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            ">Перезагрузить страницу</button>
            <button onclick="window.location.href='/admin'" style="
              padding: 10px 20px;
              background-color: #718096;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              margin-left: 10px;
            ">Вернуться на страницу входа</button>
          </div>
        `;
      }
    }, 5000);
  });
})(); 