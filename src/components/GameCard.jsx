import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/GameCard.css';

const GameCard = ({ game }) => {
  const {
    _id,
    title,
    description,
    image,
    category,
    difficulty,
    estimatedTime,
    icon
  } = game;

  return (
    <Link to={`/games/${_id}`} className="game-card-link">
      <div className="game-card">
        <div className="game-card-image-container">
          <img 
            src={image} 
            alt={title}
            className="game-card-image"
            loading="lazy"
          />
          <div className="game-card-overlay">
            <div className="game-card-icon">
              {icon}
            </div>
          </div>
        </div>
        <div className="game-card-content">
          <h3 className="game-card-title">{title}</h3>
          <p className="game-card-description">{description}</p>
          <div className="game-card-meta">
            <span className="game-card-badge category">{category}</span>
            <span className="game-card-badge difficulty" data-difficulty={difficulty}>
              {difficulty}
            </span>
            <span className="game-card-badge time">
              <span className="time-icon">⏱</span> {estimatedTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    estimatedTime: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired
  }).isRequired
};

export default GameCard; 