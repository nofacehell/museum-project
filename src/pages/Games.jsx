import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/games.css';
import { getGames } from '../utils/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Fallback data to use when API is unavailable
const fallbackGames = [
    {
    _id: 'memory',
    title: 'Найди пару',
    description: 'Игра на развитие памяти и внимательности. Найдите парные карточки с изображениями знаковой электронной техники разных эпох.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/ENIAC_function_table_at_Aberdeen.jpg/640px-ENIAC_function_table_at_Aberdeen.jpg',
    category: 'Память',
    difficulty: 'Средняя',
    estimatedTime: '10 минут'
    },
    {
    _id: 'artist',
    title: 'Оригинал или клон?',
    description: 'Сможете ли вы отличить оригинальные модели гаджетов от их клонов и имитаций? Проверьте свою наблюдательность!',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Apple-II.jpg/640px-Apple-II.jpg',
    category: 'Наблюдательность',
    difficulty: 'Сложная',
    estimatedTime: '15 минут'
    },
    {
    _id: 'timeline',
    title: 'Хронология электроники',
    description: 'Расположите ключевые события и изобретения в истории электроники в правильном хронологическом порядке.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/First_Web_Server.jpg/640px-First_Web_Server.jpg',
    category: 'История',
    difficulty: 'Средняя',
    estimatedTime: '12 минут'
    },
    {
    _id: 'style',
    title: 'Угадай эпоху',
    description: 'По характерным чертам дизайна и технических особенностей определите, к какой эпохе относится электронное устройство.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Commodore64.jpg/640px-Commodore64.jpg',
    category: 'Дизайн',
    difficulty: 'Легкая',
    estimatedTime: '8 минут'
  }
];

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load games from API or use fallback data
  const loadGames = async () => {
    setLoading(true);
    try {
      console.log('Attempting to fetch games from API...');
      const data = await getGames();
      console.log('API response:', data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        setGames(data);
        console.log('Successfully loaded games from API');
      } else {
        console.log('API returned empty data, using fallback games');
        setGames(fallbackGames);
      }
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Не удалось загрузить данные игр. Используем локальные данные.');
      setGames(fallbackGames);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
    AOS.init({
      duration: 800,
      once: true,
      mirror: false
    });
  }, []);

  // Get all unique categories for filter dropdown
  const categories = ['all', ...new Set(games.map(game => game.category))];

  // Filter games based on category and search query
  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="games-container uk-container uk-margin-large-top uk-margin-large-bottom">
      <h1 className="uk-heading-medium uk-text-center uk-margin-medium-bottom" data-aos="fade-up">
        Игры по электронике
      </h1>
      
      {error && (
        <div className="uk-alert uk-alert-warning" data-aos="fade-up">
          <p>{error}</p>
        </div>
      )}
      
      <div className="game-filters uk-margin-medium-bottom" data-aos="fade-up">
        <div className="uk-grid-small" uk-grid="true">
          <div className="uk-width-1-3@s">
            <select 
              className="uk-select" 
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">Все категории</option>
              {categories
                .filter(category => category !== 'all')
                .map(category => (
                  <option key={category} value={category}>{category}</option>
                ))
              }
            </select>
          </div>
          <div className="uk-width-2-3@s">
            <input
              className="uk-input"
              type="text"
              placeholder="Поиск игр..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="uk-text-center uk-margin-large">
          <div uk-spinner="ratio: 2"></div>
          <p className="uk-text-muted">Загрузка игр...</p>
        </div>
      ) : (
        <>
          {filteredGames.length === 0 ? (
            <div className="uk-alert uk-alert-primary" data-aos="fade-up">
              <p>По вашему запросу не найдено игр. Попробуйте изменить параметры поиска.</p>
            </div>
          ) : (
            <div className="uk-grid uk-child-width-1-1 uk-child-width-1-2@m" uk-grid>
              {filteredGames.map((game, index) => (
                <div key={game._id || index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="game-card uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s" uk-grid>
                    <div className="game-card-media-container">
                      <div className="uk-card-media-left uk-cover-container">
                        <img 
                          src={game.image} 
                          alt={game.title} 
                          uk-cover
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="uk-card-body">
                        <div className="game-card-badges uk-margin-small-bottom">
                          <span className="uk-label game-category-badge">{game.category}</span>
                          <span className="uk-label game-difficulty-badge">{game.difficulty}</span>
              </div>
                        <h3 className="uk-card-title game-card-title">{game.title}</h3>
                        <p className="game-card-description">{game.description}</p>
                        
                        <div className="game-card-meta uk-margin-small-bottom">
                          <div className="game-card-meta-item">
                            <span uk-icon="icon: clock"></span>
                <span>{game.estimatedTime}</span>
              </div>
                        </div>
                        
                        <div className="uk-flex uk-flex-center uk-margin-small-top">
              <Link 
                            to={`/games/${game._id}`} 
                            className="uk-button uk-button-primary"
              >
                Начать игру
              </Link>
                        </div>
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
  );
};

export default Games;
  