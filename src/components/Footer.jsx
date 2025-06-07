import React from 'react';
import { Link } from 'react-router-dom';
import { FaLandmark, FaEnvelope, FaChevronUp, FaGamepad, FaQuestionCircle, FaHome, FaUser, FaCommentAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  // Скролл наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="footer-simple">
        <div className="footer-copyright">
          © {new Date().getFullYear()} Виртуальный Музей
        </div>
        
        <div className="footer-links">
          <Link to="/"><FaHome /> Главная</Link>
          <Link to="/exhibits"><FaLandmark /> Экспонаты</Link>
          <Link to="/reviews"><FaCommentAlt /> Отзывы</Link>
          <Link to="/quizzes"><FaQuestionCircle /> Викторины</Link>
          <Link to="/games"><FaGamepad /> Игры</Link>
          <Link to="/admin"><FaUser /> Админ</Link>
        </div>
        
        <div className="footer-contact">
          <a href="mailto:info@museum.ru"><FaEnvelope /> info@museum.by</a>
        </div>
      </div>
      
      <div className="scroll-top" onClick={scrollToTop}>
        <FaChevronUp />
      </div>
    </footer>
  );
};

export default Footer; 