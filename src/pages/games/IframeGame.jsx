import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/iframeGame.css';

const IframeGame = ({ gameId, title, description, onExit }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const iframeUrl = `https://learningapps.org/watch?app=${gameId}`;

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setError('Не удалось загрузить игру. Пожалуйста, попробуйте позже.');
    setLoading(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="iframe-game-intro">
        <div className="iframe-game-intro-content">
          <Link to="/games" className="back-button">
            <FaArrowLeft /> Назад к играм
          </Link>
          
          <div className="intro-header">
            <h1>{title}</h1>
            <p className="intro-description">
              {description}
            </p>
          </div>

          <button className="start-game-button" onClick={startGame}>
            Начать игру
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="iframe-game-container">
      <div className="game-header">
        <Link to="/games" className="back-button" onClick={onExit}>
          <FaArrowLeft /> Выход
        </Link>
        <h2>{title}</h2>
      </div>

      <div className="game-content">
        {loading && (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Загрузка игры...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <p>{error}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Попробовать снова
            </button>
          </div>
        )}

        <iframe
          src={iframeUrl}
          className="game-iframe"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};

export default IframeGame; 