import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/exhibits.css';
import { getExhibits } from '../utils/api';

// Подключаем иконки UIkit
UIkit.use(Icons);

// Функция для отладки
const debugExhibits = (message, data) => {
  console.log(`===== EXHIBITS DEBUG: ${message} =====`);
  console.log('Exhibits data:', data);
  console.log(`============================`);
};

// Default exhibits to use if API fails
const DEFAULT_EXHIBITS = [
  {
    id: '1',
    title: 'Apple Macintosh',
    description: 'The original Macintosh was the first commercially successful personal computer to feature a mouse and a graphical user interface rather than a command-line interface.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Macintosh_128k_transparency.png',
    category: 'Компьютеры'
  },
  {
    id: '2',
    title: 'Sony Walkman TPS-L2',
    description: 'The Sony Walkman TPS-L2 was the first portable, personal cassette player introduced in 1979, changing how people listen to music on the go.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Sony-TPS-L2.jpg',
    category: 'Аудиотехника'
  },
  {
    id: '3',
    title: 'Nokia 3310',
    description: 'The Nokia 3310 is an iconic mobile phone known for its durability, long battery life, and the game Snake II. It was one of the most successful phones of all time.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Nokia_3310_Blue_R7309170_%28retouch%29.png/1024px-Nokia_3310_Blue_R7309170_%28retouch%29.png',
    category: 'Мобильные устройства'
  }
];

// Маппинг категорий: английские ключи (для UI) -> русские названия (из БД)
const categoryMapping = {
  'computers': 'Компьютеры',
  'phones': 'Мобильные устройства',
  'audio': 'Аудиотехника',
  'gaming': 'Игровые консоли'
};

// Обратный маппинг для удобства проверки
const reverseCategoryMapping = Object.entries(categoryMapping).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/300x200/cccccc/333333?text=Нет+изображения';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:image')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
  return `${API_URL}/uploads/${imagePath}`;
};

const Exhibits = () => {
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadExhibits = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Attempting to fetch exhibits from API...');
      
      // Use a timeout to handle hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API request timed out')), 5000)
      );
      
      const fetchPromise = getExhibits();
      
      // Race between the fetch and the timeout
      let data = await Promise.race([fetchPromise, timeoutPromise])
        .catch(err => {
          console.warn('⚠️ API request failed or timed out:', err.message);
          throw err; // Rethrow to be caught by the outer try/catch
        });
      
      // Use default exhibits if API returned nothing useful
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('⚠️ No valid data from API, using default exhibits');
        setExhibits(DEFAULT_EXHIBITS);
      } else {
        console.log('✅ Successfully loaded exhibits from API:', data);
        // Map MongoDB _id to id if needed for backward compatibility
        data = data.map(exhibit => ({
          ...exhibit,
          id: exhibit.id || exhibit._id
        }));
        setExhibits(data);
      }
    } catch (err) {
      console.error('❌ Error loading exhibits:', err);
      setError('Не удалось загрузить экспонаты из базы данных. Используются демо-экспонаты.');
      setExhibits(DEFAULT_EXHIBITS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize AOS animation
    AOS.init({
      duration: 800,
      once: true,
    });
    
    // Load exhibits on component mount
    loadExhibits();
    
    // Add event listener for storage events (if using localStorage)
    window.addEventListener('storage', (e) => {
      if (e.key === 'exhibits') {
        loadExhibits();
      }
    });
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  // Filter exhibits based on category and search query
  const filteredExhibits = exhibits.filter((exhibit) => {
    // Проверяем категорию с учетом маппинга
    const matchesCategory = selectedCategory === 'all' || 
                           categoryMapping[selectedCategory] === exhibit.category;
    
    const matchesSearch = exhibit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exhibit.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Отладочная информация
  useEffect(() => {
    console.log(`Текущая выбранная категория: ${selectedCategory}`);
    console.log(`Ожидаемая категория в БД: ${categoryMapping[selectedCategory] || 'Все'}`);
    console.log('Доступные экспонаты:', exhibits);
    console.log('Отфильтрованные экспонаты:', filteredExhibits);
  }, [selectedCategory, exhibits, filteredExhibits]);

  const categories = ['all', 'computers', 'phones', 'audio', 'gaming'];
  
  const categoryLabels = {
    all: 'Все экспонаты',
    computers: 'Компьютеры',
    phones: 'Телефоны',
    audio: 'Аудио',
    gaming: 'Игровые консоли'
  };

  return (
    <div className="uk-section exhibits-section" style={{ marginTop: "60px", paddingTop: "30px" }}>
      <div className="uk-container">
        <h1 className="uk-heading-medium uk-text-center uk-margin-medium-bottom" data-aos="fade-up">
          Экспонаты музея электроники
        </h1>
        
        {/* Search and Filter Controls */}
        <div className="uk-margin-medium-bottom uk-flex uk-flex-middle uk-flex-wrap" data-aos="fade-up" data-aos-delay="100">
          <div className="uk-search uk-search-default uk-width-medium uk-margin-right">
            <span uk-search-icon="true"></span>
            <input 
              className="uk-search-input" 
              type="search" 
              placeholder="Поиск экспонатов..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="uk-button-group category-filters uk-flex-wrap">
            {categories.map((category) => (
              <button 
                key={category}
                className={`uk-button ${selectedCategory === category ? 'uk-button-primary' : 'uk-button-default'} uk-margin-small-right uk-margin-small-bottom`}
                onClick={() => setSelectedCategory(category)}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="uk-text-center uk-margin-medium-top">
            <div uk-spinner="ratio: 2"></div>
            <p className="uk-margin-small-top">Загрузка экспонатов...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="uk-alert-danger" uk-alert="true">
            <p>{error}</p>
            <button 
              className="uk-button uk-button-primary uk-margin-small-top" 
              onClick={loadExhibits}
            >
              Попробовать снова
            </button>
          </div>
        )}
        
        {/* Debug Info */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="uk-margin-medium-bottom uk-alert-primary" uk-alert="true">
            <h3>Отладочная информация</h3>
            <p>Выбранная категория: {selectedCategory}</p>
            <p>Количество экспонатов: {exhibits.length}</p>
            <p>Отфильтровано: {filteredExhibits.length}</p>
          </div>
        )} */}
        
        {/* Exhibits Grid */}
        {!loading && !error && (
          <>
            {filteredExhibits.length === 0 ? (
              <div className="uk-alert-warning" uk-alert="true">
                <p>Экспонаты не найдены. Пожалуйста, измените параметры поиска.</p>
              </div>
            ) : (
              <div className="uk-grid uk-child-width-1-3@m uk-child-width-1-2@s uk-child-width-1-1 uk-grid-match" uk-grid="true">
                {filteredExhibits.map((exhibit, index) => (
                  <div key={exhibit.id || index} data-aos="fade-up" data-aos-delay={100 + index * 50}>
                    <div className="uk-card uk-card-default uk-card-hover">
                      <div className="uk-card-media-top uk-text-center uk-padding-small">
                        <img 
                          src={getImageUrl(exhibit.image)} 
                          alt={exhibit.title} 
                          style={{ maxHeight: '200px', width: 'auto', margin: '0 auto' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Нет+изображения';
                          }}
                        />
                      </div>
                      <div className="uk-card-body">
                        <h3 className="uk-card-title">{exhibit.title}</h3>
                        <p className="uk-text-truncate">{exhibit.description}</p>
                        <span 
                          className={`uk-label ${
                            reverseCategoryMapping[exhibit.category] === 'computers' ? 'uk-label-success' :
                            reverseCategoryMapping[exhibit.category] === 'phones' ? 'uk-label-warning' :
                            reverseCategoryMapping[exhibit.category] === 'audio' ? 'uk-label-danger' :
                            'uk-label-primary'
                          }`}
                        >
                          {exhibit.category}
                        </span>
                        <div className="uk-margin-small-top">
                          <Link 
                            to={`/exhibits/${exhibit.id}`} 
                            className="uk-button uk-button-text"
                          >
                            Подробнее &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Exhibits;
  