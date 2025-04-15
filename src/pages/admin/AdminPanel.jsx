import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getExhibits, getQuizzes, getGames, getAdminReviews, 
  updateReviewStatus, deleteExhibit, deleteQuiz, deleteGame, deleteReview 
} from '../../utils/api';
import UIkit from 'uikit';

/**
 * Компонент панели администратора
 */
const AdminPanel = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [exhibits, setExhibits] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    exhibits: 0,
    quizzes: 0,
    games: 0,
    reviews: 0
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const getImageUrl = (imagePath) => {
    console.log('getImageUrl called with:', imagePath);
    
    if (!imagePath) {
      console.log('No image path provided, returning placeholder');
      return 'https://placehold.co/300x200/cccccc/333333?text=Нет+изображения';
    }
    
    if (imagePath.startsWith('http')) {
      console.log('External URL detected:', imagePath);
      return imagePath;
    }
    
    if (imagePath.startsWith('data:image')) {
      console.log('Base64 image detected');
      return imagePath;
    }
    
    // Если путь начинается с /uploads, используем его как есть
    if (imagePath.startsWith('/uploads')) {
      const fullUrl = `${API_URL}${imagePath}`;
      console.log('Using uploads path:', fullUrl);
      return fullUrl;
    }
    
    // Для остальных случаев добавляем /uploads/
    const fullUrl = `${API_URL}/uploads/${imagePath}`;
    console.log('Constructed full URL:', fullUrl);
    return fullUrl;
  };

  // Проверяем, в темной ли теме сейчас сайт
  const isDarkTheme = () => {
    return document.documentElement.classList.contains('dark-theme') || 
           document.body.classList.contains('dark-theme') ||
           document.querySelector('.theme-toggle')?.checked;
  };

  // Используем initialTab при изменении props
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Проверка авторизации при загрузке
  useEffect(() => {
    console.log("AdminPanel: Инициализация");
    
    // Получаем имя пользователя
    const savedUsername = localStorage.getItem('adminUsername') || 'Администратор';
    setUsername(savedUsername);
    
    // Загружаем данные для админ-панели
    loadData();
    
    console.log("AdminPanel: Инициализация завершена");

    // Добавляем стили для темной темы админ-панели
    const style = document.createElement('style');
    style.textContent = `
      /* Dark theme styles for admin panel */
      .dark-theme .admin-container {
        background-color: #121212;
        color: #f3f4f6;
      }
      
      .dark-theme .admin-sidebar {
        background-color: #1e1e1e;
        border-right: 1px solid #333;
      }
      
      .dark-theme .admin-logo {
        border-bottom: 1px solid #333;
      }
      
      .dark-theme .admin-nav-button {
        color: #94a3b8;
      }
      
      .dark-theme .admin-nav-button-active {
        color: white;
        background-color: #0f0f0f;
        border-left: 3px solid #3b82f6;
      }
      
      .dark-theme .admin-content {
        background-color: #121212;
      }
      
      .dark-theme .admin-header {
        background-color: #1e1e1e;
        border-bottom: 1px solid #333;
      }
      
      .dark-theme .admin-page-title {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-refresh-button {
        background-color: #333;
        color: #94a3b8;
      }
      
      .dark-theme .admin-user-name {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-user-role {
        color: #94a3b8;
      }
      
      .dark-theme .admin-tab-content {
        background-color: #1e1e1e;
      }
      
      .dark-theme .admin-heading {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-welcome {
        color: #94a3b8;
      }
      
      .dark-theme .admin-stat-card {
        background-color: #252525;
      }
      
      .dark-theme .admin-stat-value {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-stat-label {
        color: #94a3b8;
      }
      
      .dark-theme .admin-activity-log {
        background-color: #252525;
      }
      
      .dark-theme .admin-subheading {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-activity-text {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-table {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-table-head {
        background-color: #252525;
        color: #94a3b8;
        border-bottom: 2px solid #333;
      }
      
      .dark-theme .admin-table-row {
        border-bottom: 1px solid #333;
      }
      
      .dark-theme .admin-table-row:hover {
        background-color: #252525;
      }
      
      .dark-theme .admin-table-cell {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-edit-button {
        background-color: #333;
        border: 1px solid #444;
      }
      
      .dark-theme .admin-delete-button {
        background-color: #300;
        border: 1px solid #400;
      }
      
      .dark-theme .admin-footer {
        background-color: #1e1e1e;
        border-top: 1px solid #333;
      }
      
      .dark-theme .admin-copyright {
        color: #94a3b8;
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  // Загрузка всех данных
  const loadData = async () => {
    console.log("AdminPanel: Загрузка данных");
    setLoading(true);
    setError(null);
    
    try {
      // Параллельно загружаем все данные
      const [exhibitsData, quizzesData, gamesData, reviewsData] = await Promise.all([
        getExhibits().catch(e => { console.error("Ошибка загрузки экспонатов:", e); return []; }),
        getQuizzes().catch(e => { console.error("Ошибка загрузки квизов:", e); return []; }),
        getGames().catch(e => { console.error("Ошибка загрузки игр:", e); return []; }),
        getAdminReviews().catch(e => { console.error("Ошибка загрузки отзывов:", e); return []; })
      ]);

      console.log('Загруженные отзывы для админа (сырые данные):', reviewsData);
      
      // Обрабатываем отзывы
      let formattedReviews = [];
      if (Array.isArray(reviewsData)) {
        formattedReviews = reviewsData.map(review => {
          console.log('Обработка отзыва:', review);
          
          // Используем функцию formatReviewImages для обработки изображений
          const processedImages = formatReviewImages(review);
          console.log('Обработанные изображения:', processedImages);

          return {
            id: review.id || review._id,
            name: review.name,
            text: review.text || review.comment,
            comment: review.comment || review.text,
            rating: review.rating || 5,
            images: processedImages,
            image: processedImages.length > 0 ? processedImages[0] : null,
            date: review.date || review.createdAt || review.visitDate,
            createdAt: review.createdAt,
            approved: review.approved !== undefined ? review.approved : (review.status === 'approved'),
            status: review.status || (review.approved ? 'approved' : 'pending')
          };
        });
        console.log('Отформатированные отзывы:', formattedReviews);
      } else {
        console.error('Данные отзывов API не являются массивом:', reviewsData);
      }

      // Сохраняем все загруженные данные
      setExhibits(Array.isArray(exhibitsData) ? exhibitsData : []);
      setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
      setGames(Array.isArray(gamesData) ? gamesData : []);
      setReviews(formattedReviews);

      // Обновляем статистику
      setStats({
        exhibits: Array.isArray(exhibitsData) ? exhibitsData.length : 0,
        quizzes: Array.isArray(quizzesData) ? quizzesData.length : 0,
        games: Array.isArray(gamesData) ? gamesData.length : 0,
        reviews: formattedReviews.length
      });
      
      console.log("AdminPanel: Данные загружены");
    } catch (err) {
      console.error("AdminPanel: Ошибка при загрузке данных", err);
      setError('Ошибка при загрузке данных для админ-панели.');
    } finally {
       setLoading(false);
    }
  };

  // Переход к редактированию элемента
  const handleEdit = (type, id) => {
    console.log(`AdminPanel: Редактирование ${type} с ID ${id}`);
    switch(type) {
      case 'exhibit':
        navigate(`/admin/exhibit/${id}`);
        break;
      case 'quiz':
        navigate(`/admin/quiz/${id}`);
        break;
      case 'game':
        navigate(`/admin/game/${id}`);
        break;
      default:
        console.error("AdminPanel: Неизвестный тип элемента для редактирования");
    }
  };

  // Добавление нового элемента
  const handleAdd = (type) => {
    console.log(`AdminPanel: Создание нового ${type}`);
    switch(type) {
      case 'exhibit':
        navigate('/admin/exhibit/new');
        break;
      case 'quiz':
        navigate('/admin/quiz/new');
        break;
      case 'game':
        navigate('/admin/game/new');
        break;
      default:
        console.error("AdminPanel: Неизвестный тип элемента для создания");
    }
  };

  // Удаление элемента
  const handleDelete = async (type, id) => {
    console.log(`AdminPanel: Удаление ${type} с ID ${id}`);
    
    if (!window.confirm(`Вы уверены, что хотите удалить этот элемент?`)) {
      return;
    }
    
    try {
      switch(type) {
        case 'exhibit':
          // Удаляем через API
          await deleteExhibit(id);
          // Обновляем локальный state
          const updatedExhibits = exhibits.filter(e => e.id !== id);
          setExhibits(updatedExhibits);
          break;
        case 'quiz':
          // Удаляем через API
          await deleteQuiz(id);
          // Обновляем локальный state
          const updatedQuizzes = quizzes.filter(q => q.id !== id);
          setQuizzes(updatedQuizzes);
          break;
        case 'game':
          // Удаляем через API
          await deleteGame(id);
          // Обновляем локальный state
          const updatedGames = games.filter(g => g.id !== id);
          setGames(updatedGames);
          break;
        case 'review':
          // Удаляем через API
          await deleteReview(id);
          // Обновляем локальный state
          const updatedReviews = reviews.filter(r => r.id !== id);
          setReviews(updatedReviews);
          break;
        default:
          console.error("AdminPanel: Неизвестный тип элемента для удаления");
      }
      
      // Перезагружаем все данные после удаления для обновления статистики
      await loadData();
    } catch (err) {
      console.error("AdminPanel: Ошибка при удалении элемента", err);
      alert(`Ошибка при удалении ${type}. Пожалуйста, попробуйте снова.`);
    }
  };

  // Обработчик выхода из админ-панели
  const handleLogout = () => {
    console.log("AdminPanel: Выход из системы");
    
    // Удаляем информацию об авторизации
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isAdminAuthenticated');
    
    // Перенаправляем на страницу входа используя navigate
    navigate('/admin');
  };

  // Обработчик одобрения отзыва
  const handleApproveReview = async (id, shouldApprove) => {
    try {
      setLoading(true);
      console.log(`Updating review ${id} status to ${shouldApprove ? 'approved' : 'rejected'}`);
      
      // Обновляем статус отзыва и ждем ответа
      const response = await updateReviewStatus(id, shouldApprove ? 'approved' : 'rejected');
      
      // Проверяем успешность операции: если нет ошибки, считаем успешным
      // (убрали проверку response.review, т.к. API может просто вернуть сообщение)
      // if (response && (response.review || response.message?.includes('успешно'))) { 
        
        // Обновляем состояние локально
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === id 
              ? { 
                  ...review, 
                  status: shouldApprove ? 'approved' : 'rejected',
                  approved: shouldApprove 
                } 
              : review
          )
        );
        // Показываем уведомление об успехе
        alert(`Отзыв успешно ${shouldApprove ? 'одобрен' : 'отклонен'}`);
        console.log('Review status updated successfully on server');

        // Можно опционально перезагрузить данные, если нужно обновить всю таблицу
        // await loadData(); 
      // } else {
      //   // Если API вернул ошибку или неожиданный ответ
      //   throw new Error(response?.message || 'Не удалось обновить статус отзыва на сервере.');
      // }

    } catch (error) {
      console.error('Error updating review status:', error);
      alert(`Ошибка при ${shouldApprove ? 'одобрении' : 'отклонении'} отзыва: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Функция для открытия модального окна с изображениями
  const openImageModal = (images, index) => {
    setCurrentImages(Array.isArray(images) ? images : [images]);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeImageModal = () => {
    setIsModalOpen(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  // Функции для навигации по изображениям
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < currentImages.length - 1 ? prev + 1 : prev
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    );
  };

  // Модальное окно для просмотра изображений
  const renderImageModal = () => {
    if (!isModalOpen) return null;
    
    return (
      <div style={styles.modalOverlay} onClick={closeImageModal}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={closeImageModal}>×</button>
          <img
            src={getImageUrl(currentImages[currentImageIndex])}
            alt={`Изображение ${currentImageIndex + 1}`}
            style={styles.modalImage}
            onError={(e) => {
              console.error('Error loading image:', e);
              e.target.src = 'https://placehold.co/600x400/cccccc/333333?text=Ошибка+загрузки';
            }}
          />
          {currentImages.length > 1 && (
            <div style={styles.modalNav}>
              <button
                style={styles.modalNavButton}
                onClick={prevImage}
                disabled={currentImageIndex === 0}
              >
                Предыдущее
              </button>
              <span>
                {currentImageIndex + 1} / {currentImages.length}
              </span>
              <button
                style={styles.modalNavButton}
                onClick={nextImage}
                disabled={currentImageIndex === currentImages.length - 1}
              >
                Следующее
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const formatReviewImages = (review) => {
    if (!review) return [];
    
    let images = [];
    
    // Проверяем поле images
    if (review.images) {
      try {
        // Если images это строка JSON, парсим её
        if (typeof review.images === 'string') {
          images = JSON.parse(review.images);
        }
        // Если images уже массив, используем его
        else if (Array.isArray(review.images)) {
          images = review.images;
        }
      } catch (e) {
        console.error('Error parsing review images:', e);
      }
    }
    
    // Проверяем поле image (одиночное изображение)
    if (review.image && !images.includes(review.image)) {
      images.unshift(review.image);
    }
    
    // Фильтруем только валидные URL изображений
    return images.filter(img => 
      typeof img === 'string' && 
      img.trim() !== '' && 
      (img.startsWith('http') || img.startsWith('data:image') || img.startsWith('/uploads'))
    );
  };

  // Рендер активной вкладки
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'exhibits':
        return renderExhibits();
      case 'quizzes':
        return renderQuizzes();
      case 'games':
        return renderGames();
      case 'reviews':
        return renderReviews();
      default:
        return renderDashboard();
    }
  };

  // Рендер дашборда
  const renderDashboard = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.heading}>Панель управления</h2>
      
      {loading ? (
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <p>Загрузка данных...</p>
        </div>
      ) : (
        <>
          <p style={styles.welcome}>
            Добро пожаловать, <strong>{username}</strong>! Вот краткая статистика музея:
          </p>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🖼️</div>
              <div style={styles.statValue}>{stats.exhibits}</div>
              <div style={styles.statLabel}>Экспонатов</div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>❓</div>
              <div style={styles.statValue}>{stats.quizzes}</div>
              <div style={styles.statLabel}>Квизов</div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎮</div>
              <div style={styles.statValue}>{stats.games}</div>
              <div style={styles.statLabel}>Игр</div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statIcon}>💬</div>
              <div style={styles.statValue}>{stats.reviews}</div>
              <div style={styles.statLabel}>Отзывов</div>
            </div>
          </div>
          
          <div style={styles.activityLog}>
            <h3 style={styles.subheading}>Последние действия</h3>
            <ul style={styles.activityList}>
              <li style={styles.activityItem}>
                <span style={styles.activityTime}>12:30</span>
                <span style={styles.activityText}>Добавлен новый экспонат "Картина неизвестного художника"</span>
              </li>
              <li style={styles.activityItem}>
                <span style={styles.activityTime}>11:15</span>
                <span style={styles.activityText}>Обновлен квиз "История искусства"</span>
              </li>
              <li style={styles.activityItem}>
                <span style={styles.activityTime}>Вчера</span>
                <span style={styles.activityText}>Добавлена новая игра "Мемори: Известные картины"</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );

  // Рендер экспонатов
  const renderExhibits = () => (
    <div style={styles.tabContent}>
      <div style={styles.tableHeader}>
      <h2 style={styles.heading}>Управление экспонатами</h2>
        <button 
          style={styles.addButton}
          onClick={() => handleAdd('exhibit')}
        >
          Добавить экспонат
        </button>
      </div>
      
      {loading ? (
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <p>Загрузка экспонатов...</p>
        </div>
      ) : exhibits.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🖼️</div>
          <h3>Нет экспонатов</h3>
          <p>Создайте свой первый экспонат, нажав кнопку "Добавить экспонат"</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHead}>ID</th>
                <th style={styles.tableHead}>Название</th>
                <th style={styles.tableHead}>Категория</th>
                <th style={styles.tableHead}>Автор</th>
                <th style={styles.tableHead}>Изображение</th>
                <th style={styles.tableHead}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {exhibits.map(exhibit => (
                <tr key={exhibit.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{exhibit.id}</td>
                  <td style={styles.tableCell}>{exhibit.title}</td>
                  <td style={styles.tableCell}>{exhibit.category}</td>
                  <td style={styles.tableCell}>{exhibit.author || 'Не указан'}</td>
                  <td style={styles.tableCell}>
                    {exhibit.image && (
                      <img 
                        src={getImageUrl(exhibit.image)} 
                        alt={exhibit.title}
                        style={{ maxWidth: '100px', height: 'auto' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Нет+изображения';
                        }}
                      />
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button 
                        style={styles.editButton} 
                        onClick={() => handleEdit('exhibit', exhibit.id)}
                      >
                        ✏️
                      </button>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => handleDelete('exhibit', exhibit.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Рендер квизов
  const renderQuizzes = () => (
    <div style={styles.tabContent}>
      <div style={styles.tableHeader}>
      <h2 style={styles.heading}>Управление квизами</h2>
        <button 
          style={styles.addButton}
          onClick={() => handleAdd('quiz')}
        >
          Добавить квиз
        </button>
      </div>
      
      {loading ? (
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <p>Загрузка квизов...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>❓</div>
          <h3>Нет квизов</h3>
          <p>Создайте свой первый квиз, нажав кнопку "Добавить квиз"</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHead}>ID</th>
                <th style={styles.tableHead}>Название</th>
                <th style={styles.tableHead}>Вопросов</th>
                <th style={styles.tableHead}>Категория</th>
                <th style={styles.tableHead}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(quiz => (
                <tr key={quiz.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{quiz.id}</td>
                  <td style={styles.tableCell}>{quiz.title}</td>
                  <td style={styles.tableCell}>{quiz.questions?.length || 0}</td>
                  <td style={styles.tableCell}>{quiz.category || 'Общий'}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button 
                        style={styles.editButton} 
                        onClick={() => handleEdit('quiz', quiz.id)}
                      >
                        ✏️
                      </button>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => handleDelete('quiz', quiz.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Рендер игр
  const renderGames = () => (
    <div style={styles.tabContent}>
      <div style={styles.tableHeader}>
      <h2 style={styles.heading}>Управление играми</h2>
        <button 
          style={styles.addButton}
          onClick={() => handleAdd('game')}
        >
          Добавить игру
        </button>
      </div>
      
      {loading ? (
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <p>Загрузка игр...</p>
        </div>
      ) : games.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎮</div>
          <h3>Нет игр</h3>
          <p>Создайте свою первую игру, нажав кнопку "Добавить игру"</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHead}>ID</th>
                <th style={styles.tableHead}>Название</th>
                <th style={styles.tableHead}>Тип</th>
                <th style={styles.tableHead}>Сложность</th>
                <th style={styles.tableHead}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr key={game.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{game.id}</td>
                  <td style={styles.tableCell}>{game.title}</td>
                  <td style={styles.tableCell}>{game.type || 'Не указан'}</td>
                  <td style={styles.tableCell}>{game.difficulty || 'Средняя'}</td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button 
                        style={styles.editButton} 
                        onClick={() => handleEdit('game', game.id)}
                      >
                        ✏️
                      </button>
                      <button 
                        style={styles.deleteButton}
                        onClick={() => handleDelete('game', game.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Рендер отзывов
  const renderReviews = () => (
    <div className={`admin-tab-content p-6 ${isDarkTheme() ? 'dark' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление отзывами</h2>
        <button
          onClick={() => loadData()}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Обновить список
        </button>
        </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Посетитель</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Рейтинг</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Дата</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Текст</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Фото</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.map((review) => {
              return (
                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{review.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{review.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {'⭐'.repeat(review.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(review.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="max-w-xs overflow-hidden text-ellipsis">
                      {review.text}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {review.images && review.images.length > 0 ? (
                      <div style={styles.reviewImagesContainer}>
                        {Array.isArray(review.images) ? (
                          review.images.map((img, index) => {
                            console.log('Processing image:', img);
                            const imageUrl = getImageUrl(img);
                            console.log('Generated URL:', imageUrl);
                            return (
                              <div key={index} style={styles.imageContainer}>
                                <img
                                  src={imageUrl}
                                  alt={`Review image ${index + 1}`}
                                  style={styles.reviewImageThumbnail}
                                  onClick={() => openImageModal(review.images, index)}
                                  onError={(e) => {
                                    console.error('Error loading image:', e);
                                    e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Ошибка+загрузки';
                                  }}
                                />
                                {review.images.length > 1 && (
                                  <span style={styles.imageCounter}>
                                    {index + 1}/{review.images.length}
                                  </span>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div style={styles.imageContainer}>
                            <img
                              src={getImageUrl(review.images)}
                              alt="Review image"
                              style={styles.reviewImageThumbnail}
                              onClick={() => openImageModal([review.images], 0)}
                              onError={(e) => {
                                console.error('Error loading image:', e);
                                e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Ошибка+загрузки';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={styles.noImage}>Нет изображений</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {review.status === 'approved' ? 'Одобрен' : 'На рассмотрении'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                      onClick={() => handleApproveReview(review.id, review.status !== 'approved')}
                      className={`mr-2 px-3 py-1 rounded text-white transition-colors ${
                        review.status === 'approved'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {review.status === 'approved' ? '✕' : '✓'}
                        </button>
                        <button 
                        onClick={() => handleDelete('review', review.id)}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
                      >
                      🗑
                      </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
      </div>
    </div>
  );

  return (
    <div style={styles.container} className="admin-container">
      <div style={styles.sidebar} className="admin-sidebar">
        <div style={styles.logo} className="admin-logo">
          <span style={styles.logoIcon}>🏛️</span>
          <div style={styles.logoText}>
            <div style={styles.logoTitle}>Музей Онлайн</div>
            <div style={styles.logoSubtitle}>Админ-панель</div>
          </div>
        </div>
        
        <nav style={styles.nav}>
          <button 
            style={activeTab === 'dashboard' ? {...styles.navButton, ...styles.navButtonActive} : styles.navButton}
            className={activeTab === 'dashboard' ? "admin-nav-button admin-nav-button-active" : "admin-nav-button"}
            onClick={() => setActiveTab('dashboard')}
          >
            <span style={styles.navIcon}>📊</span> Дашборд
          </button>
          
          <button
            className="uk-button uk-button-default"
            onClick={() => navigate('/admin/exhibits')}
            style={{
              marginRight: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            🖼️ Экспонаты
          </button>
          
          <button 
            style={activeTab === 'quizzes' ? {...styles.navButton, ...styles.navButtonActive} : styles.navButton}
            className={activeTab === 'quizzes' ? "admin-nav-button admin-nav-button-active" : "admin-nav-button"}
            onClick={() => setActiveTab('quizzes')}
          >
            <span style={styles.navIcon}>❓</span> Квизы
          </button>
          
          <button 
            style={activeTab === 'games' ? {...styles.navButton, ...styles.navButtonActive} : styles.navButton}
            className={activeTab === 'games' ? "admin-nav-button admin-nav-button-active" : "admin-nav-button"}
            onClick={() => setActiveTab('games')}
          >
            <span style={styles.navIcon}>🎮</span> Игры
          </button>
          
          <button 
            style={activeTab === 'reviews' ? {...styles.navButton, ...styles.navButtonActive} : styles.navButton}
            className={activeTab === 'reviews' ? "admin-nav-button admin-nav-button-active" : "admin-nav-button"}
            onClick={() => setActiveTab('reviews')}
          >
            <span style={styles.navIcon}>💬</span> Отзывы
          </button>
        </nav>
        
        <div style={styles.sidebarFooter}>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Выйти из системы
          </button>
          <a href="/" style={styles.backToSiteLink}>
            Вернуться на сайт
          </a>
        </div>
      </div>
      
      <div style={styles.content} className="admin-content">
        <header style={styles.header} className="admin-header">
          <div style={styles.headerContent}>
            <div style={styles.pageTitle} className="admin-page-title">
              {activeTab === 'dashboard' && <><span style={styles.pageTitleIcon}>📊</span> Дашборд</>}
              {activeTab === 'exhibits' && <><span style={styles.pageTitleIcon}>🖼️</span> Экспонаты</>}
              {activeTab === 'quizzes' && <><span style={styles.pageTitleIcon}>❓</span> Квизы</>}
              {activeTab === 'games' && <><span style={styles.pageTitleIcon}>🎮</span> Игры</>}
              {activeTab === 'reviews' && <><span style={styles.pageTitleIcon}>💬</span> Отзывы</>}
          </div>
          
            <div style={styles.headerRight}>
              <button style={styles.refreshButton} className="admin-refresh-button" onClick={loadData}>
                🔄
              </button>
          <div style={styles.userInfo}>
                <span style={styles.userName} className="admin-user-name">{username}</span>
                <span style={styles.userRole} className="admin-user-role">Администратор</span>
              </div>
              <div style={styles.userAvatar}>
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        
        <main style={styles.main}>
          {renderActiveTab()}
        </main>
        
        <footer style={styles.footer} className="admin-footer">
          <p style={styles.copyright} className="admin-copyright">© {new Date().getFullYear()} Музей Онлайн — Админ-панель v1.0</p>
        </footer>
      </div>
      {renderImageModal()}
    </div>
  );
};

// Стили для компонента
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#1e293b',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #334155'
  },
  logo: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #334155'
  },
  logoIcon: {
    fontSize: '32px',
    marginRight: '12px'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoTitle: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  logoSubtitle: {
    fontSize: '12px',
    opacity: '0.7'
  },
  nav: {
    flex: 1,
    padding: '20px 0'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    fontSize: '14px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  navButtonActive: {
    color: 'white',
    backgroundColor: '#0f172a',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: '3px solid #3b82f6',
    fontWeight: '500'
  },
  navIcon: {
    marginRight: '10px',
    fontSize: '18px'
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #334155'
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#b91c1c'
    }
  },
  backToSiteLink: {
    display: 'block',
    textAlign: 'center',
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '14px'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 30px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  headerContent: {
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#334155',
    display: 'flex',
    alignItems: 'center'
  },
  pageTitleIcon: {
    marginRight: '10px',
    fontSize: '24px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center'
  },
  refreshButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    border: 'none',
    color: '#64748b',
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '20px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0'
    }
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '12px',
    textAlign: 'right'
  },
  userName: {
    fontSize: '15px',
    color: '#334155',
    fontWeight: '500'
  },
  userRole: {
    fontSize: '12px',
    color: '#64748b'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  main: {
    flex: 1,
    padding: '30px',
    overflow: 'auto'
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  },
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#334155',
    marginTop: 0,
    marginBottom: '20px'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  addButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2563eb'
    }
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(59, 130, 246, 0.1)',
    borderRadius: '50%',
    borderLeft: '4px solid #3b82f6',
    animation: 'spin 1s linear infinite'
  },
  welcome: {
    fontSize: '16px',
    color: '#475569',
    marginBottom: '24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b'
  },
  activityLog: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '20px'
  },
  subheading: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#334155',
    marginTop: 0,
    marginBottom: '16px'
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  activityItem: {
    display: 'flex',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0'
  },
  activityTime: {
    width: '60px',
    flexShrink: 0,
    fontWeight: '500',
    color: '#64748b'
  },
  activityText: {
    color: '#334155'
  },
  footer: {
    padding: '16px 30px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: 'white'
  },
  copyright: {
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'center',
    margin: 0
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHead: {
    backgroundColor: '#f8fafc',
    color: '#475569',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  },
  tableCell: {
    padding: '12px 16px',
    color: '#334155',
    fontSize: '14px'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  editButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0'
    }
  },
  deleteButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#fecaca'
    }
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#64748b'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  reviewImagesContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    maxWidth: '300px'
  },
  reviewImageThumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  imageContainer: {
    position: 'relative',
  },
  imageCounter: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: '4px',
    padding: '2px 4px',
    fontSize: '0.875rem',
  },
  noImage: {
    color: '#999',
    fontStyle: 'italic'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    position: 'relative',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: 'calc(90vh - 100px)',
    objectFit: 'contain',
  },
  modalClose: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    '&:hover': {
      color: '#000',
    },
  },
  modalNav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  modalNavButton: {
    background: '#f0f0f0',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      background: '#e0e0e0',
    },
    '&:disabled': {
      background: '#f0f0f0',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
};

// CSS для анимации спиннера
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default AdminPanel; 
