// ThemeToggle.jsx
import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Apply dark-theme class to the button
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      if (isDark) {
        btn.classList.add('dark-theme');
      } else {
        btn.classList.remove('dark-theme');
      }
    }
  }, [isDark]);

  return (
    <button
      className={`theme-toggle ${isDark ? 'dark-theme' : ''} ${className}`}
      onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      data-testid="theme-toggle"
    >
      <FaSun className="icon sun" />
      <FaMoon className="icon moon" />
    </button>
  );
};

export default ThemeToggle;
