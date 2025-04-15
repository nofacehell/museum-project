import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TimelineGame.css';

const TimelineGame = () => {
  const [artPieces, setArtPieces] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const pieces = [
      {
        id: 1,
        title: 'Мона Лиза',
        artist: 'Леонардо да Винчи',
        year: 1503,
        image: '/images/art/mona-lisa.jpg'
      },
      {
        id: 2,
        title: 'Звездная ночь',
        artist: 'Винсент ван Гог',
        year: 1889,
        image: '/images/art/starry-night.jpg'
      },
      {
        id: 3,
        title: 'Крик',
        artist: 'Эдвард Мунк',
        year: 1893,
        image: '/images/art/the-scream.jpg'
      },
      {
        id: 4,
        title: 'Девушка с жемчужной сережкой',
        artist: 'Ян Вермеер',
        year: 1665,
        image: '/images/art/girl-with-pearl.jpg'
      },
      {
        id: 5,
        title: 'Постоянство памяти',
        artist: 'Сальвадор Дали',
        year: 1931,
        image: '/images/art/persistence-of-memory.jpg'
      },
      {
        id: 6,
        title: 'Американская готика',
        artist: 'Грант Вуд',
        year: 1930,
        image: '/images/art/american-gothic.jpg'
      }
    ];

    setArtPieces(pieces.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      checkTimeline();
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startGame = () => {
    setSelectedPieces([]);
    setGameComplete(false);
    setScore(0);
    setTimer(300);
    setIsActive(true);
    setArtPieces(prevPieces => [...prevPieces].sort(() => Math.random() - 0.5));
  };

  const handlePieceSelect = (piece) => {
    if (selectedPieces.includes(piece)) {
      setSelectedPieces(selectedPieces.filter(p => p.id !== piece.id));
    } else {
      setSelectedPieces([...selectedPieces, piece]);
    }
  };

  const checkTimeline = () => {
    setIsActive(false);
    const isCorrect = selectedPieces.every((piece, index) => {
      if (index === 0) return true;
      return piece.year >= selectedPieces[index - 1].year;
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    setGameComplete(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timeline-game-container">
      <div className="timeline-game-header">
        <h1 className="timeline-game-title">Хронология искусства</h1>
        <p className="timeline-game-description">
          Расположите произведения искусства в правильном хронологическом порядке
        </p>
      </div>

      <div className="timeline-game-stats">
        <div className="stat-item">
          <span className="uk-icon" data-uk-icon="icon: clock; ratio: 1.2"></span>
          <span>{formatTime(timer)}</span>
        </div>
        <div className="stat-item">
          <span className="uk-icon" data-uk-icon="icon: star; ratio: 1.2"></span>
          <span>{score} очков</span>
        </div>
        <button className="timeline-game-button" onClick={startGame}>
          Начать заново
        </button>
      </div>

      {!gameComplete ? (
        <div className="timeline-game-content">
          <div className="timeline-game-pieces">
            {artPieces.map((piece) => (
              <div
                key={piece.id}
                className={`timeline-game-piece ${selectedPieces.includes(piece) ? 'selected' : ''}`}
                onClick={() => handlePieceSelect(piece)}
              >
                <img src={piece.image} alt={piece.title} />
                <div className="piece-info">
                  <h3>{piece.title}</h3>
                  <p>{piece.artist}</p>
                  <p>{piece.year}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="timeline-game-button check-button"
            onClick={checkTimeline}
            disabled={selectedPieces.length !== artPieces.length}
          >
            Проверить
          </button>
        </div>
      ) : (
        <div className="timeline-game-complete">
          <h2>Игра завершена!</h2>
          <p>Ваш результат: {score} очков</p>
          <div className="timeline-game-actions">
            <button className="timeline-game-button" onClick={startGame}>
              Играть снова
            </button>
            <Link to="/games" className="timeline-game-button secondary">
              К списку игр
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineGame; 