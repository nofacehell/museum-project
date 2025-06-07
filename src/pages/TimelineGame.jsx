import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaArrowLeft, FaTrophy, FaHistory } from 'react-icons/fa';
import '../styles/TimelineGame.css';

const TimelineGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300);
  const [isActive, setIsActive] = useState(false);

  const artPieces = [
    {
      id: 1,
      title: 'Первый транзистор',
      year: 1947,
      description: 'Изобретение транзистора в Bell Labs произвело революцию в электронике',
      image: 'https://images.unsplash.com/photo-1631887350005-c87e93b62f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Первая интегральная схема',
      year: 1958,
      description: 'Джек Килби создал первую интегральную схему, открыв эру микроэлектроники',
      image: 'https://images.unsplash.com/photo-1631887351423-8518f0209dda?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Первый микропроцессор Intel 4004',
      year: 1971,
      description: '4-битный процессор положил начало эре современных компьютеров',
      image: 'https://images.unsplash.com/photo-1631887350916-a83b93c6c3f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameComplete(true);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startGame = () => {
    setSelectedPieces([]);
    setGameComplete(false);
    setScore(0);
    setTimer(300);
    setIsActive(true);
    setGameStarted(true);
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

  if (!gameStarted) {
    return (
      <div className="timeline-game-intro">
        <div className="timeline-game-intro-content">
          <Link to="/games" className="back-button">
            <FaArrowLeft /> Назад к играм
          </Link>
          
          <div className="intro-header">
            <div className="intro-icon">
              <FaHistory />
            </div>
            <h1>Хронология электроники</h1>
            <p className="intro-description">
              Расположите ключевые события и изобретения в истории электроники в правильном хронологическом порядке.
            </p>
          </div>

          <div className="game-info-grid">
            <div className="info-card">
              <FaClock className="info-icon" />
              <h3>Время</h3>
              <p>12 минут на выполнение</p>
            </div>
            <div className="info-card">
              <FaTrophy className="info-icon" />
              <h3>Сложность</h3>
              <p>Средняя</p>
            </div>
          </div>

          <button className="start-game-button" onClick={startGame}>
            Начать игру
          </button>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="timeline-game-complete">
        <h2>Игра завершена!</h2>
        <p>Ваш результат: {score} правильных последовательностей</p>
        <div className="timeline-game-actions">
          <button className="game-button primary" onClick={startGame}>
            Играть снова
          </button>
          <Link to="/games" className="game-button secondary">
            К списку игр
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-game-container">
      <div className="timeline-game-header">
        <Link to="/games" className="back-button">
          <FaArrowLeft /> Назад к играм
        </Link>
        <h1>Хронология электроники</h1>
        <div className="game-stats">
          <div className="stat-item">
            <FaClock />
            <span>Осталось времени: {formatTime(timer)}</span>
          </div>
          <div className="stat-item">
            <FaTrophy />
            <span>Счёт: {score}</span>
          </div>
        </div>
      </div>

      <div className="timeline-game-content">
        <div className="timeline-pieces">
          {artPieces.map((piece) => (
            <div
              key={piece.id}
              className={`timeline-piece ${selectedPieces.includes(piece) ? 'selected' : ''}`}
              onClick={() => handlePieceSelect(piece)}
            >
              <div className="piece-image">
                <img src={piece.image} alt={piece.title} />
                <div className="piece-overlay">
                  <span className="piece-year">{piece.year}</span>
                </div>
              </div>
              <div className="piece-info">
                <h3>{piece.title}</h3>
                <p>{piece.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="check-button"
          onClick={checkTimeline}
          disabled={selectedPieces.length !== artPieces.length}
        >
          Проверить последовательность
        </button>
      </div>
    </div>
  );
};

export default TimelineGame; 