import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaArrowLeft } from 'react-icons/fa';
import '../styles/gamePage.css';

// Импортируем компоненты игр
import MemoryGame from './games/MemoryGame';
import TimelineGame from './games/TimelineGame';
import PuzzleGame from './games/PuzzleGame';
import Game2048 from './games/2048Game';
import IframeGame from './games/IframeGame';
// import RetroGames from './games/RetroGames';
// import IdentifyGame from './games/IdentifyGame';

// Импортируем данные игр
const fallbackGames = [
  {
    _id: 'memory',
    title: 'Найди пару',
    description: 'Игра на развитие памяти и внимательности. Найдите парные карточки с изображениями знаковой электронной техники разных эпох.',
    image: '/images/games/memory-game.jpg',
    category: 'Память',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    component: MemoryGame
  },
  {
    _id: 'timeline',
    title: 'Хронология электроники',
    description: 'Расположите ключевые события и изобретения в истории электроники в правильном хронологическом порядке.',
    image: '/images/games/timeline.jpg',
    category: 'История',
    difficulty: 'Средняя',
    estimatedTime: '12 минут',
    component: TimelineGame
  },
  {
    _id: 'puzzle',
    title: 'Собери компьютер',
    description: 'Соберите классический компьютер из его компонентов. Узнайте, как выглядели первые процессоры, оперативная память и другие компоненты.',
    image: '/images/games/computer-assembly.jpg',
    category: 'Пазл',
    difficulty: 'Сложная',
    estimatedTime: '15 минут',
    component: PuzzleGame
  },
  {
    _id: '2048',
    title: '2048',
    description: 'Классическая головоломка на сложение чисел. Открытый исходный код, MIT License.',
    image: 'https://play2048.co/meta/apple-touch-icon.png',
    category: 'Головоломка',
    difficulty: 'Средняя',
    estimatedTime: '5 минут',
    component: Game2048
  },
  {
    _id: 'inventions-timeline',
    title: 'Хронология изобретений',
    description: 'Изучите историю важнейших изобретений в области электроники и технологий. Расположите события в правильном хронологическом порядке.',
    image: 'https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?w=800&auto=format&fit=crop&q=60',
    category: 'История',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    component: (props) => <IframeGame gameId="23741373" title="Хронология изобретений" description={props.description} {...props} />
  },
  {
    _id: 'devices-creators',
    title: 'Устройства и их создатели',
    description: 'Узнайте о великих изобретателях и их вкладе в развитие электроники. Сопоставьте устройства с их создателями.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee21422f9cd1?w=800&auto=format&fit=crop&q=60',
    category: 'Викторина',
    difficulty: 'Средняя',
    estimatedTime: '8 минут',
    component: (props) => <IframeGame gameId="29640999" title="Устройства и их создатели" description={props.description} {...props} />
  },
  {
    _id: 'computer-evolution',
    title: 'Эволюция компьютеров',
    description: 'Проследите за развитием компьютерной техники от первых механических устройств до современных компьютеров.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee21422f9cd1?w=800&auto=format&fit=crop&q=60',
    category: 'История',
    difficulty: 'Легкая',
    estimatedTime: '7 минут',
    component: (props) => <IframeGame gameId="8842269" title="Эволюция компьютеров" description={props.description} {...props} />
  },
  {
    _id: 'future-tech',
    title: 'Технологии будущего',
    description: 'Познакомьтесь с перспективными технологиями и концепциями будущего в области электроники и вычислительной техники.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee21422f9cd1?w=800&auto=format&fit=crop&q=60',
    category: 'Образование',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    component: (props) => <IframeGame gameId="13670771" title="Технологии будущего" description={props.description} {...props} />
  },
  {
    _id: 'planetary-terraformer',
    title: 'Planetary Terraformer',
    description: 'Создавайте и управляйте своей собственной планетой! Терраформируйте поверхность, создавайте океаны и горы, наблюдайте за развитием экосистемы.',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Симулятор',
    difficulty: 'Средняя',
    estimatedTime: '15 минут',
    component: (props) => (
      <div className="game-container" style={{ width: '100%', height: '100vh' }}>
        <iframe 
          src="https://www.crazygames.com/embed/planetary-terraformer" 
          style={{ width: '100%', height: '100%' }} 
          frameBorder="0" 
          allow="gamepad *"
        />
      </div>
    )
  },
  {
    _id: 'words-of-wonders',
    title: 'Words of Wonders',
    description: 'Увлекательная игра в слова, где вам предстоит составлять слова из букв и разгадывать головоломки. Проверьте свой словарный запас и логическое мышление!',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Слова',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    component: (props) => (
      <div className="game-container" style={{ width: '100%', height: '100vh' }}>
        <iframe 
          src="https://www.crazygames.com/embed/words-of-wonders" 
          style={{ width: '100%', height: '100%' }} 
          frameBorder="0" 
          allow="gamepad *"
        />
      </div>
    )
  },
  {
    _id: 'cryptoword',
    title: 'Cryptoword',
    description: 'Захватывающая криптографическая головоломка, где вам предстоит разгадывать зашифрованные слова. Используйте логику и дедукцию, чтобы раскрыть секретные сообщения!',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Головоломка',
    difficulty: 'Сложная',
    estimatedTime: '15 минут',
    component: (props) => (
      <div className="game-container" style={{ width: '100%', height: '100vh' }}>
        <iframe 
          src="https://www.crazygames.com/embed/cryptoword" 
          style={{ width: '100%', height: '100%' }} 
          frameBorder="0" 
          allow="gamepad *"
        />
      </div>
    )
  },
  {
    _id: 'whats-the-difference',
    title: 'What\'s the Difference Online',
    description: 'Увлекательная игра на внимательность! Найдите все различия между двумя, казалось бы, одинаковыми картинками. Развивайте наблюдательность и скорость реакции!',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Внимательность',
    difficulty: 'Средняя',
    estimatedTime: '10 минут',
    component: (props) => (
      <div className="game-container" style={{ width: '100%', height: '100vh' }}>
        <iframe 
          src="https://www.crazygames.com/embed/what-s-the-difference-online" 
          style={{ width: '100%', height: '100%' }} 
          frameBorder="0" 
          allow="gamepad *"
        />
      </div>
    )
  }
];

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      try {
        const gameData = fallbackGames.find(g => g._id === gameId);
        if (gameData) {
          setGame(gameData);
        } else {
          navigate('/games');
        }
      } catch (error) {
        console.error('Error loading game:', error);
        navigate('/games');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId, navigate]);

  if (loading) {
    return (
      <div className="game-page-loading uk-flex uk-flex-center uk-flex-middle">
        <div>
          <div data-uk-spinner="ratio: 2"></div>
          <p className="uk-text-muted">Загрузка игры...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  const GameComponent = game.component;

  return (
    <div className="game-page">
      {!gameStarted ? (
        <div className="game-intro-banner">
          <div className="game-intro-card">
            <button 
              className="back-button"
              onClick={() => navigate('/games')}
            >
              <FaArrowLeft /> Назад к играм
            </button>
            <div className="game-intro-content">
              <div className="game-intro-image-block">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="game-intro-image"
                />
              </div>
              <div className="game-intro-info">
                <h1 className="game-title">{game.title}</h1>
                <p className="game-description">{game.description}</p>
                <div className="game-badges">
                  <span className="game-badge category">{game.category}</span>
                  <span className="game-badge difficulty">{game.difficulty}</span>
                  <span className="game-badge time"><FaClock /> {game.estimatedTime}</span>
                </div>
                <button 
                  className="start-game-button"
                  onClick={() => setGameStarted(true)}
                >
                  Начать игру
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <GameComponent onExit={() => setGameStarted(false)} />
      )}
    </div>
  );
};

export default GamePage; 