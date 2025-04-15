import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getQuizzes } from '../utils/api';
import '../styles/quizzes.css';

// Fallback data to use when API is unavailable
const fallbackQuizzes = [
  {
    _id: '1',
    title: 'История компьютерной техники',
    description: 'Проверьте свои знания об истории компьютеров, от первых вычислительных машин до современных устройств.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Apple_Macintosh_Plus_computer.jpg/640px-Apple_Macintosh_Plus_computer.jpg',
    category: 'История',
    difficulty: 'Средняя',
    questionCount: 10,
    estimatedTime: '15 минут'
  },
  {
    _id: '2',
    title: 'Знаете ли вы мобильные устройства?',
    description: 'Тест на знание истории и технических характеристик знаковых мобильных устройств, изменивших мир.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Nokia_3310_Blue_R7309170_%28retouch%29.png/640px-Nokia_3310_Blue_R7309170_%28retouch%29.png',
    category: 'Гаджеты',
    difficulty: 'Легкая', 
    questionCount: 8,
    estimatedTime: '10 минут'
  },
  {
    _id: '3',
    title: 'Эволюция аудиотехники',
    description: 'От граммофонов до цифровых аудиоплееров — проверьте, насколько хорошо вы знаете историю аудиотехники.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Walkman_TPS-L2.JPG/640px-Walkman_TPS-L2.JPG',
    category: 'Аудио',
    difficulty: 'Сложная',
    questionCount: 12,
    estimatedTime: '20 минут'
  },
  {
    _id: '4',
    title: 'Видеоигры и консоли',
    description: 'Тест по истории игровых консолей и знаковых видеоигр, от первых аркадных автоматов до современных систем.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/NES-Console-Set.jpg/640px-NES-Console-Set.jpg',
    category: 'Игры',
    difficulty: 'Средняя',
    questionCount: 15,
    estimatedTime: '25 минут'
  }
];

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load quizzes from API or use fallback data
  const loadQuizzes = async () => {
    setLoading(true);
    try {
      console.log('Attempting to fetch quizzes from API...');
      const data = await getQuizzes();
      console.log('API response:', data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        setQuizzes(data);
        console.log('Successfully loaded quizzes from API');
      } else {
        console.log('API returned empty data, using fallback quizzes');
        setQuizzes(fallbackQuizzes);
      }
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError('Не удалось загрузить данные квизов. Используем локальные данные.');
      setQuizzes(fallbackQuizzes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
    AOS.init({
      duration: 800,
      once: true,
      mirror: false
    });
  }, []);

  // Get all unique categories for filter dropdown
  const categories = ['all', ...new Set(quizzes.map(quiz => quiz.category))];

  // Filter quizzes based on category and search query
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="quizzes-container uk-container uk-margin-large-top uk-margin-large-bottom">
      <h1 className="uk-heading-medium uk-text-center uk-margin-medium-bottom" data-aos="fade-up">
        Квизы по электронике
      </h1>
      
      {error && (
        <div className="uk-alert uk-alert-warning" data-aos="fade-up">
          <p>{error}</p>
        </div>
      )}
      
      <div className="quiz-filters uk-margin-medium-bottom" data-aos="fade-up">
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
              placeholder="Поиск квизов..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="uk-text-center uk-margin-large">
          <div uk-spinner="ratio: 2"></div>
          <p className="uk-text-muted">Загрузка квизов...</p>
        </div>
      ) : (
        <>
          {filteredQuizzes.length === 0 ? (
            <div className="uk-alert uk-alert-primary" data-aos="fade-up">
              <p>По вашему запросу не найдено квизов. Попробуйте изменить параметры поиска.</p>
            </div>
          ) : (
            <div className="uk-grid uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid="masonry: true">
              {filteredQuizzes.map((quiz, index) => (
                <div key={quiz._id || index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="quiz-card uk-card uk-card-default">
                    <div className="quiz-card-image-container">
                      <img 
                        className="quiz-card-image" 
                        src={quiz.image} 
                        alt={quiz.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
                        }}
                      />
                    </div>
                    <div className="uk-card-body">
                      <div className="quiz-card-badges">
                        <span className="uk-label quiz-category-badge">{quiz.category}</span>
                        <span className="uk-label quiz-difficulty-badge">{quiz.difficulty}</span>
              </div>
                <h3 className="quiz-card-title">{quiz.title}</h3>
                <p className="quiz-card-description">{quiz.description}</p>
                <div className="quiz-card-meta">
                        <div className="quiz-card-meta-item">
                          <span uk-icon="icon: question"></span>
                          <span>{quiz.questionCount} вопросов</span>
                        </div>
                        <div className="quiz-card-meta-item">
                          <span uk-icon="icon: clock"></span>
                          <span>{quiz.estimatedTime}</span>
                        </div>
                      </div>
                </div>
                    <div className="uk-card-footer">
                      <Link 
                        to={`/quizzes/${quiz._id}`} 
                        className="uk-button uk-button-primary uk-width-1-1"
                >
                        Начать квиз
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
  );
};

export default Quizzes;