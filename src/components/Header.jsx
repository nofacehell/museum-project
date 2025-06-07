import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  FaUserCog,
  FaBars,
  FaTimes,
  FaHome,
  FaLandmark,
  FaQuestionCircle,
  FaCommentAlt,
  FaInfoCircle,
  FaGamepad
} from 'react-icons/fa';
import { MdMuseum } from 'react-icons/md';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobile = () => {
    setMobileOpen(open => !open);
    document.body.style.overflow = mobileOpen ? 'auto' : 'hidden';
  };

  const closeMobile = () => {
    setMobileOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''} ${isDark ? 'header--dark' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={closeMobile}>
          <MdMuseum className="header__logo-icon" />
          <span className="header__logo-text">Музей электричества</span>
        </Link>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__list">
            <li>
              <NavLink to="/" end className="header__link" onClick={closeMobile}>
                <FaHome /> Главная
              </NavLink>
            </li>
            <li>
              <NavLink to="/exhibits" className="header__link" onClick={closeMobile}>
                <FaLandmark /> Экспонаты
              </NavLink>
            </li>
            <li>
              <NavLink to="/games" className="header__link" onClick={closeMobile}>
                <FaGamepad /> Игры
              </NavLink>
            </li>
            <li>
              <NavLink to="/quizzes" className="header__link" onClick={closeMobile}>
                <FaQuestionCircle /> Викторины
              </NavLink>
            </li>
            <li>
              <NavLink to="/reviews" className="header__link" onClick={closeMobile}>
                <FaCommentAlt /> Отзывы
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="header__link" onClick={closeMobile}>
                <FaInfoCircle /> О нас
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="header__controls">
          <ThemeToggle />
          <Link to="/admin" className="header__admin">
            <FaUserCog /> 
          </Link>
          <button className="header__toggle-btn" onClick={toggleMobile} aria-label="Меню">
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
