import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/footer.css';

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`footer-section ${theme}`}>
      <div className="decorative-circle" style={{ top: '10%', left: '5%' }}></div>
      <div className="decorative-circle" style={{ bottom: '20%', right: '10%' }}></div>
      <div className="noise"></div>
      
      <div className="uk-container">
        <div className="uk-grid-large uk-child-width-1-4@m uk-child-width-1-2@s" data-uk-grid>
          {/* О музее */}
          <div>
            <h4>
              <span className="uk-margin-small-right" data-uk-icon="icon: album"></span>
              О музее
            </h4>
            <p className="uk-text-small">
              Виртуальный музей искусств - это уникальное пространство, где классическое и современное искусство встречаются с цифровыми технологиями.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h4>
              <span className="uk-margin-small-right" data-uk-icon="icon: list"></span>
              Навигация
            </h4>
            <ul className="uk-list">
              <li><Link to="/exhibits" className="pulse-on-hover">Экспонаты</Link></li>
              <li><Link to="/quizzes" className="pulse-on-hover">Викторины</Link></li>
              <li><Link to="/games" className="pulse-on-hover">Игры</Link></li>
              <li><Link to="/reviews" className="pulse-on-hover">Отзывы</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4>
              <span className="uk-margin-small-right" data-uk-icon="icon: receiver"></span>
              Контакты
            </h4>
            <ul className="uk-list">
              <li>
                <a href="mailto:info@museum.ru" className="uk-flex uk-flex-middle">
                  <span className="uk-margin-small-right" data-uk-icon="icon: mail"></span>
                  info@museum.ru
                </a>
              </li>
              <li>
                <a href="tel:+79991234567" className="uk-flex uk-flex-middle">
                  <span className="uk-margin-small-right" data-uk-icon="icon: phone"></span>
                  +7 (999) 123-45-67
                </a>
              </li>
            </ul>
          </div>

          {/* Социальные сети */}
          <div>
            <h4>
              <span className="uk-margin-small-right" data-uk-icon="icon: social"></span>
              Социальные сети
            </h4>
            <div className="uk-flex uk-flex-middle">
              <a href="#" className="uk-icon-button uk-margin-small-right animated-icon" data-uk-icon="twitter"></a>
              <a href="#" className="uk-icon-button uk-margin-small-right animated-icon" data-uk-icon="facebook"></a>
              <a href="#" className="uk-icon-button uk-margin-small-right animated-icon" data-uk-icon="instagram"></a>
              <a href="#" className="uk-icon-button animated-icon" data-uk-icon="youtube"></a>
            </div>
          </div>
        </div>

        <hr className="uk-divider-icon uk-margin-medium" />

        <div className="uk-text-center uk-text-small">
          <p>© 2024 Музей Онлайн. Все права защищены.</p>
          <p>Создано с <span className="uk-margin-small-right" data-uk-icon="icon: heart"></span> для образования</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 