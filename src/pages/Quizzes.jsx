// src/pages/Quizzes.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuizzes, getCategories } from '@/utils/api';
import '../styles/quizzes.css';

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes,    setQuizzes]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCat,  setFilterCat]  = useState('all');
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    Promise.all([ loadQuizzes(), loadCategories() ])
      .finally(() => setLoading(false));
  }, []);

  async function loadQuizzes() {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить викторины. Попробуйте позже.');
    }
  }

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      console.warn(e);
      setCategories([]);
    }
  }

  const onCategoryChange = e => setFilterCat(e.target.value);
  const onSearchChange   = e => setSearch(e.target.value);

  const formatTime = mins => `${mins ?? 10} мин`;

  const filtered = quizzes.filter(q => {
    const byCat  = filterCat === 'all' || q.category === filterCat;
    const byText = !search
      || q.title.toLowerCase().includes(search.toLowerCase())
      || q.description?.toLowerCase().includes(search.toLowerCase());
    return byCat && byText;
  });

  if (loading) {
    return (
      <div className="uk-text-center uk-margin-large-top">
        <div uk-spinner="ratio: 2"></div>
        <p className="uk-margin-small-top">Загрузка викторин...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="uk-alert-danger" uk-alert="true">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="quizzes-page">
      {/* Hero-блок */}
      <div className="quizzes-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="uk-heading-medium">Проверка знаний</h1>
            <p className="uk-text-lead">
              Погрузитесь в увлекательные викторины по истории электроники. 
              Проверьте свои знания и узнайте новое.
            </p>
          </div>
          <div className="hero-image-container">
            <img
              src="/images/quiz-hero.png"
              alt=""
              className="hero-image"
            />
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="quiz-filters uk-margin">
        <div className="uk-grid-small" uk-grid="true">
          <div className="uk-width-1-3@s">
            <select
              className="uk-select"
              value={filterCat}
              onChange={onCategoryChange}
            >
              <option value="all">Все категории</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="uk-width-2-3@s">
            <input
              className="uk-input"
              type="text"
              placeholder="Поиск викторин..."
              value={search}
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Сетка карточек */}
      {filtered.length === 0 ? (
        <div className="uk-alert-primary" uk-alert="true">
          <p>Викторины не найдены.</p>
        </div>
      ) : (
        <div className="quizzes-grid">
          {filtered.map(quiz => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-card-image-container">
                <img
                  src={quiz.image || '/images/quiz-placeholder.jpg'}
                  className="quiz-card-image"
                  alt={quiz.title}
                  onError={e => (e.target.src = '/images/quiz-placeholder.jpg')}
                />
              </div>
              <div className="quiz-card-body">
                <h3 className="quiz-card-title">{quiz.title}</h3>
                <div className="quiz-card-badges">
                  <span className="quiz-category-badge">{quiz.category}</span>
                  <span className="quiz-difficulty-badge">
                    {quiz.difficulty === 'easy' ? 'Легкий'
                     : quiz.difficulty === 'hard' ? 'Сложный'
                     : 'Средний'}
                  </span>
                </div>
                <p className="quiz-card-description">{quiz.description}</p>
              </div>
              <div className="quiz-card-footer">
                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="uk-button uk-button-primary uk-width-1-1"
                >
                  Начать викторину
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
