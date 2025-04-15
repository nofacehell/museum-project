import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StyleGame.css';

const StyleGame = () => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isActive, setIsActive] = useState(false);

  const rounds = [
    {
      id: 1,
      image: '/images/art/impressionism.jpg',
      correctStyle: 'Импрессионизм',
      styles: ['Импрессионизм', 'Кубизм', 'Сюрреализм', 'Барокко']
    },
    {
      id: 2,
      image: '/images/art/cubism.jpg',
      correctStyle: 'Кубизм',
      styles: ['Кубизм', 'Импрессионизм', 'Ренессанс', 'Модернизм']
    },
    {
      id: 3,
      image: '/images/art/surrealism.jpg',
      correctStyle: 'Сюрреализм',
      styles: ['Сюрреализм', 'Барокко', 'Кубизм', 'Импрессионизм']
    },
    {
      id: 4,
      image: '/images/art/baroque.jpg',
      correctStyle: 'Барокко',
      styles: ['Барокко', 'Ренессанс', 'Модернизм', 'Сюрреализм']
    },
    {
      id: 5,
      image: '/images/art/renaissance.jpg',
      correctStyle: 'Ренессанс',
      styles: ['Ренессанс', 'Модернизм', 'Барокко', 'Кубизм']
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleAnswer(null);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startGame = () => {
    setCurrentRound(0);
    setScore(0);
    setGameComplete(false);
    setSelectedStyle(null);
    setShowResult(false);
    setTimer(30);
    setIsActive(true);
  };

  const handleAnswer = (style) => {
    setIsActive(false);
    setSelectedStyle(style);
    setShowResult(true);

    if (style === rounds[currentRound].correctStyle) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentRound < rounds.length - 1) {
        setCurrentRound(currentRound + 1);
        setSelectedStyle(null);
        setShowResult(false);
        setTimer(30);
        setIsActive(true);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const currentRoundData = rounds[currentRound];

  return (
    <div className="style-game-container">
      <div className="style-game-header">
        <h1 className="style-game-title">Угадай стиль</h1>
        <p className="style-game-description">
          Определите художественный стиль по характерным элементам картины
        </p>
      </div>

      <div className="style-game-stats">
        <div className="stat-item">
          <span className="uk-icon" data-uk-icon="icon: clock; ratio: 1.2"></span>
          <span>{timer} сек</span>
        </div>
        <div className="stat-item">
          <span className="uk-icon" data-uk-icon="icon: star; ratio: 1.2"></span>
          <span>{score} из {rounds.length}</span>
        </div>
        <button className="style-game-button" onClick={startGame}>
          Начать заново
        </button>
      </div>

      {!gameComplete ? (
        <div className="style-game-content">
          <div className="style-game-round">
            <h2>Раунд {currentRound + 1} из {rounds.length}</h2>
            <div className="style-game-image">
              <img src={currentRoundData.image} alt="Произведение искусства" />
            </div>
            <div className="style-game-options">
              {currentRoundData.styles.map((style) => (
                <button
                  key={style}
                  className={`style-game-option ${
                    selectedStyle === style ? 'selected' : ''
                  } ${
                    showResult
                      ? style === currentRoundData.correctStyle
                        ? 'correct'
                        : selectedStyle === style
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  onClick={() => !showResult && handleAnswer(style)}
                  disabled={showResult}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="style-game-complete">
          <h2>Игра завершена!</h2>
          <p>Ваш результат: {score} из {rounds.length}</p>
          <div className="style-game-actions">
            <button className="style-game-button" onClick={startGame}>
              Играть снова
            </button>
            <Link to="/games" className="style-game-button secondary">
              К списку игр
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleGame; 