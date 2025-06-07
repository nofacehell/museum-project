import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/games.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaMemory, FaHistory, FaPuzzlePiece, FaGamepad, FaSearch, FaClock } from 'react-icons/fa';
import GameCard from '../components/GameCard';

// Локальные данные игр
const fallbackGames = [
  {
    _id: 'memory',
    title: 'Найди пару (Memory Game, open-source)',
    description: 'Классическая игра на поиск пар. Открытый исходный код, MIT License. Тематика: ретро-компьютеры и техника.',
    image: 'https://images.unsplash.com/photo-1614032686163-bdc24c13d0b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Память',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    icon: <FaMemory />
  },
  {
    _id: 'timeline',
    title: 'Pac-Man (HTML5, itch.io)',
    description: 'Легендарная аркада Pac-Man. Почти оригинал, работает прямо в браузере. Управление: стрелки, Shift (кредит), Enter (старт).',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Аркада',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    icon: <FaGamepad />
  },
  {
    _id: 'puzzle',
    title: 'Собери пазл',
    description: 'Соберите классические пазлы. Не торопитесь, просто расслабьтесь и наслаждайтесь процессом!',
    image: 'https://images.unsplash.com/photo-1612611741189-a9b9eb01d515?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Пазл',
    difficulty: 'Сложная',
    estimatedTime: '15 минут',
    icon: <FaPuzzlePiece />
  },
  {
    _id: '2048',
    title: '2048 (open-source)',
    description: 'Классическая головоломка на сложение чисел. Открытый исходный код, MIT License. Встроена через iframe.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Головоломка',
    difficulty: 'Средняя',
    estimatedTime: '5 минут',
    icon: <FaGamepad />
  },
  {
    _id: 'inventions-timeline',
    title: 'Найди слово',
    description: 'Найдите нужные слова среди множества букв.',
    image: 'https://images.unsplash.com/photo-1597392582469-a697322d5c16?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Образовательная',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    icon: <FaHistory />
  },
  {
    _id: 'devices-creators',
    title: 'Кроссворд',
    description: 'Отгадывайте слова по горизонтали и вертикали, отвечая на интересные вопросы!',
    image: 'https://images.unsplash.com/photo-1600120203738-3e66b02bf318?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Образовательная',
    difficulty: 'Средняя',
    estimatedTime: '8 минут',
    icon: <FaGamepad />
  },
  {
    _id: 'computer-evolution',
    title: 'Электрический "пазл"',
    description: 'Выберите нужные электрические приборы и соберите полную картину!',
    image: 'https://plus.unsplash.com/premium_photo-1716999684556-f2f310f27e3a?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Образовательная',
    difficulty: 'Легкая',
    estimatedTime: '7 минут',
    icon: <FaHistory />
  },
  {
    _id: 'future-tech',
    title: 'Электрические загадки',
    description: 'Разгадывайте загадки, связанные с электричеством и не только, собирая по частям изображение!',
    image: 'https://images.unsplash.com/photo-1413882353314-73389f63b6fd?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Образовательная',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    icon: <FaGamepad />
  },
  {
    _id: 'planetary-terraformer',
    title: 'Planetary Terraformer',
    description: 'Создавайте и управляйте своей собственной планетой! Терраформируйте поверхность, создавайте океаны и горы, наблюдайте за развитием экосистемы.',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Симулятор',
    difficulty: 'Средняя',
    estimatedTime: '15 минут',
    icon: <FaGamepad />
  },
  {
    _id: 'words-of-wonders',
    title: 'Words of Wonders',
    description: 'Увлекательная игра в слова, где вам предстоит составлять слова из букв и разгадывать головоломки. Проверьте свой словарный запас и логическое мышление!',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Слова',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    icon: <FaGamepad />
  },
  {
    _id: 'cryptoword',
    title: 'Cryptoword',
    description: 'Захватывающая криптографическая головоломка, где вам предстоит разгадывать зашифрованные слова. Используйте логику и дедукцию, чтобы раскрыть секретные сообщения!',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Головоломка',
    difficulty: 'Сложная',
    estimatedTime: '15 минут',
    icon: <FaGamepad />
  },
  {
    _id: 'whats-the-difference',
    title: 'What\'s the Difference Online',
    description: 'Увлекательная игра на внимательность! Найдите все различия между двумя, казалось бы, одинаковыми картинками. Развивайте наблюдательность и скорость реакции!',
    image: 'https://plus.unsplash.com/premium_photo-1682309582909-e2a33b6e380c?q=80&w=3612&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Внимательность',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    icon: <FaGamepad />
  }
];

const Games = () => {
  const [games] = useState(fallbackGames);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false
    });
  }, []);

  const categories = ['all', ...new Set(games.map(game => game.category))];

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="games-page">
      {/* Hero Section */}
      <div className="games-hero">
        <div className="uk-container">
          <div className="games-hero-content" data-aos="fade-right">
            <span className="games-badge">Ретро игры</span>
            <h1 className="uk-heading-medium">Игры старых времен и не только</h1>
            <p className="uk-text-large">Расслабьте играя в классические игры!</p>
            <div className="uk-margin">
              <span className="uk-label uk-margin-small-right">{games.length} игр</span>
              <span className="uk-label uk-label-success">{categories.length - 1} категорий</span>
            </div>
          </div>
          <div className="games-hero-image" data-aos="fade-left">
            <img 
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Ретро электроника"
            />
          </div>
        </div>
      </div>

      <div className="uk-container uk-margin-large-top">
        {/* Search and Filter Controls */}
        <div className="filter-card uk-card uk-card-default uk-margin-medium-bottom" data-aos="fade-up">
          <div className="uk-card-body">
            <div className="uk-grid-small uk-flex-middle" data-uk-grid>
              <div className="uk-width-expand@s">
                <div className="uk-search uk-search-default uk-width-1-1">
                  <span data-uk-search-icon></span>
                  <input 
                    className="uk-search-input" 
                    type="search" 
                    placeholder="Поиск игр..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="uk-width-auto@s">
                <select 
                  className="uk-select" 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="games-grid" data-aos="fade-up">
          {filteredGames.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
  