import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/exhibits.css';
import { getExhibits, getCategories } from '../utils/api';
import { getStaticUrl } from '../utils/config';
import { initParallax } from '../utils/parallax';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Input,
  Select,
  Button,
  useToast,
  Badge,
  Flex,
  Spinner,
} from '@chakra-ui/react';

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
    title: 'Sony Walkman TPS-L2',
    description: 'The Sony Walkman TPS-L2 was the first portable, personal cassette player introduced in 1979, changing how people listen to music on the go.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Sony-TPS-L2.jpg',
    category: 'audio'
  },
  {
    id: '2',
    title: 'Sony Trinitron KV-1311CR',
    description: 'The Sony Trinitron was a line of color television sets produced by Sony. The KV-1311CR was one of the first models, featuring the revolutionary Trinitron picture tube technology.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Sony_Trinitron_KV-1311CR.jpg/1024px-Sony_Trinitron_KV-1311CR.jpg',
    category: 'video'
  },
  {
    id: '3',
    title: 'Philips Senseo',
    description: 'The Philips Senseo was one of the first pod-based coffee makers, introducing a new way to make single-serve coffee at home.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Philips_Senseo.jpg/1024px-Philips_Senseo.jpg',
    category: 'appliances'
  }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/300x200/cccccc/333333?text=Нет+изображения';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:image')) return imagePath;
  return getStaticUrl(imagePath);
};

const FIXED_CATEGORIES = [
  'Разное',
  'Аудиотехника',
  'Видеотехника',
  'Бытовая техника'
];

const Exhibits = () => {
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);
  const toast = useToast();
  const [categories, setCategories] = useState([]);

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
      offset: 100,
      easing: 'ease-out-cubic'
    });
    
    // Initialize parallax effect
    const parallaxCleanup = initParallax();
    
    // Load exhibits on component mount
    loadExhibits();
    
    // Add event listener for storage events (if using localStorage)
    const handleStorage = (e) => {
      if (e.key === 'exhibits') {
        loadExhibits();
      }
    };
    
    window.addEventListener('storage', handleStorage);
    
    // Cleanup event listeners and parallax
    return () => {
      window.removeEventListener('storage', handleStorage);
      if (typeof parallaxCleanup === 'function') {
        parallaxCleanup();
      }
    };
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const filteredExhibits = exhibits.filter(exhibit => {
    const matchesSearch = exhibit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exhibit.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
      (exhibit.categoryId && String(exhibit.categoryId) === String(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  // Отладочная информация
  useEffect(() => {
    console.log(`Текущая выбранная категория: ${selectedCategory}`);
    console.log('Доступные экспонаты:', exhibits);
    console.log('Отфильтрованные экспонаты:', filteredExhibits);
  }, [selectedCategory, exhibits, filteredExhibits]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <div className="exhibits-section">
      {/* Hero Section */}
      <div className="exhibits-hero uk-section uk-light" ref={heroRef}>
        <div className="uk-container">
          <div className="hero-content">
            <div className="hero-text" data-aos="fade-right" data-aos-delay="100">
              <span className="exhibits-badge">Виртуальная коллекция</span>
              <h1 className="uk-heading-medium">Экспонаты музея электроники</h1>
              <p className="uk-text-large">Исследуйте важнейшие инновации и открытия в мире электронных устройств, изменивших нашу жизнь.</p>
              <div className="uk-margin">
                <span className="uk-label uk-margin-small-right" data-aos="fade-up" data-aos-delay="200">
                  {exhibits.length} экспонатов
                </span>
              </div>
            </div>
            <div className="hero-image-wrapper" data-aos="fade-left" data-aos-delay="200">
              <div className="hero-image-container">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Macintosh_128k_transparency.png" 
                  alt="Винтажный компьютер" 
                  className="hero-image"
                  loading="lazy"
                />
                <div className="hero-image-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="uk-container uk-margin-large-top">
        {/* Search and Filter Controls */}
        <div className="filter-card uk-card uk-card-default uk-margin-medium-bottom" data-aos="fade-up">
          <div className="uk-card-body">
            <div className="uk-grid-small uk-flex-middle" data-uk-grid="true">
              <div className="uk-width-expand@s">
                <div className="uk-search uk-search-default uk-width-1-1">
                  <span data-uk-search-icon="true"></span>
                  <input 
                    className="uk-search-input" 
                    type="search" 
                    placeholder="Поиск экспонатов..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="uk-width-auto@s uk-text-right">
                <select
                  className="uk-select"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{ minWidth: 180 }}
                >
                  <option value="">Все категории</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="uk-text-center uk-margin-medium-top uk-padding uk-padding-large">
            <div className="uk-spinner-wrapper">
              <div uk-spinner="ratio: 3"></div>
            </div>
            <p className="uk-text-lead uk-margin-medium-top">Загрузка экспонатов...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="uk-alert-danger uk-padding uk-card uk-card-default" uk-alert="true">
            <h3><span uk-icon="icon: warning; ratio: 1.5" className="uk-margin-small-right"></span> Возникла ошибка</h3>
            <p>{error}</p>
            <button 
              className="uk-button uk-button-primary uk-margin-small-top" 
              onClick={loadExhibits}
            >
              <span uk-icon="icon: refresh" className="uk-margin-small-right"></span>
              Попробовать снова
            </button>
          </div>
        )}
        
        {/* Exhibits Grid */}
        {!loading && !error && (
          <>
            <div className="uk-margin-medium-bottom uk-flex uk-flex-middle uk-flex-between">
              <h2 className="uk-heading-bullet">
                {selectedCategory === '' ? 'Все экспонаты' : selectedCategory}
                <span className="uk-text-muted uk-margin-left">({filteredExhibits.length})</span>
              </h2>
              
              {filteredExhibits.length > 0 && (
                <div className="uk-text-meta uk-visible@s">
                  <span data-uk-icon="icon: grid" className="uk-margin-small-right"></span>
                  Отображение {filteredExhibits.length} из {exhibits.length} экспонатов
                </div>
              )}
            </div>
            
            {filteredExhibits.length === 0 ? (
              <div className="empty-state uk-text-center uk-padding uk-padding-large uk-card uk-card-default uk-card-body" data-aos="fade-up">
                <span data-uk-icon="icon: search; ratio: 3" className="uk-margin-medium-bottom"></span>
                <h3>Экспонаты не найдены</h3>
                <p className="uk-text-muted">По вашему запросу ничего не найдено. Попробуйте изменить критерии поиска.</p>
                <button 
                  className="uk-button uk-button-primary uk-margin-small-top" 
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                  }}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="exhibits-grid">
                {filteredExhibits.map((exhibit, index) => (
                  <div key={exhibit.id || index} data-aos="fade-up" data-aos-delay={100 + (index % 5) * 50}>
                    <div className="exhibit-card uk-card uk-card-default uk-card-hover">
                      <div className="uk-card-media-top">
                        <div className="exhibit-image-container">
                          <img 
                            src={getImageUrl(exhibit.image)} 
                            alt={exhibit.title}
                            className="exhibit-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/600x400/cccccc/333333?text=Нет+изображения';
                            }}
                          />
                          <div className="exhibit-image-overlay">
                            <Link to={`/exhibits/${exhibit.id}`} className="uk-position-cover"></Link>
                          </div>
                        </div>
                      </div>
                      <div className="uk-card-body">
                        <div className="uk-card-badge uk-label">
                          {exhibit.category}
                        </div>
                        <h3 className="uk-card-title">{exhibit.title}</h3>
                        {(exhibit.category || exhibit.categoryId) && (
                          <div className="uk-text-meta uk-margin-small-bottom">
                            <span style={{
                              background: '#ffe066',
                              color: '#222',
                              fontWeight: 600,
                              fontSize: 15,
                              borderRadius: 6,
                              padding: '2px 10px',
                              display: 'inline-block',
                              letterSpacing: 0.5,
                              boxShadow: '0 1px 4px #e0e7ff55'
                            }}>
                              {exhibit.category || (categories.find(cat => cat.id === exhibit.categoryId)?.name) || 'Без категории'}
                            </span>
                          </div>
                        )}
                        <p className="exhibit-description">
                          {exhibit.shortDescription || 
                           (exhibit.description && exhibit.description.length > 120 
                             ? `${exhibit.description.substring(0, 120)}...` 
                             : exhibit.description)
                          }
                        </p>
                      </div>
                      <div className="uk-card-footer">
                        <Link 
                          to={`/exhibits/${exhibit.id}`} 
                          className="uk-button uk-button-text"
                        >
                          Подробнее <span data-uk-icon="icon: chevron-right"></span>
                        </Link>
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
  