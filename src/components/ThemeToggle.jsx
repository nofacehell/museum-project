import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [initialTheme, setInitialTheme] = useState(theme);
  const isProcessingThemeChange = useRef(false);
  const isAdminLoginPage = window.location.pathname === '/admin' && !window.location.hash.includes('/admin/');
  
  // Синхронизация с localStorage только при первом рендере
  useEffect(() => {
    // Проверяем localStorage для всех возможных ключей темы
    const adminDarkMode = localStorage.getItem('adminDarkMode');
    const darkTheme = localStorage.getItem('darkTheme');
    const currentTheme = theme;
    
    if ((adminDarkMode === 'true' || darkTheme === 'true') && currentTheme !== 'dark') {
      // Обновляем контекст темы без создания нового события
      console.log("ThemeToggle: Инициализация темы в dark на основе localStorage");
      toggleTheme('dark', false);
      setInitialTheme('dark');
    } else if ((adminDarkMode === 'false' && darkTheme === 'false') && currentTheme !== 'light') {
      console.log("ThemeToggle: Инициализация темы в light на основе localStorage");
      toggleTheme('light', false);
      setInitialTheme('light');
    } else {
      // Сохраняем текущую тему как начальную
      setInitialTheme(currentTheme);
    }
  }, []);
  
  // Отслеживаем изменения темы и распространяем их, но только если это не страница входа в админ-панель
  useEffect(() => {
    if (theme !== initialTheme && !isProcessingThemeChange.current && !isAdminLoginPage) {
      isProcessingThemeChange.current = true;
      console.log("ThemeToggle: Тема изменилась на", theme);
      
      // Обновляем localStorage
      const isDark = theme === 'dark';
      localStorage.setItem('darkTheme', isDark.toString());
      localStorage.setItem('adminDarkMode', isDark.toString());
      
      // Применяем тему к header напрямую
      const headers = document.querySelectorAll('header, .header');
      headers.forEach(header => {
        if (isDark) {
          header.classList.add('dark-theme-header');
          header.setAttribute('data-theme', 'dark');
          header.style.backgroundColor = '#1F2937';
          header.style.color = '#F9FAFB';
          
          // Обновляем все навигационные ссылки и логотип
          const links = header.querySelectorAll('a, .nav-link');
          links.forEach(link => {
            link.style.color = '#F9FAFB';
          });
          
          const logo = header.querySelector('.logo');
          if (logo) logo.style.color = '#F9FAFB';
          
        } else {
          header.classList.remove('dark-theme-header');
          header.setAttribute('data-theme', 'light');
          header.style.backgroundColor = '#FFFFFF';
          header.style.color = '#1F2937';
          
          // Обновляем все навигационные ссылки и логотип
          const links = header.querySelectorAll('a, .nav-link');
          links.forEach(link => {
            link.style.color = '#1e3a8a';
          });
          
          const logo = header.querySelector('.logo');
          if (logo) logo.style.color = '#1e3a8a';
        }
      });
      
      // Создаем событие изменения темы
      const themeEvent = new CustomEvent('themechange', { detail: { dark: isDark } });
      document.dispatchEvent(themeEvent);
      
      // Сбрасываем флаг
      setTimeout(() => {
        isProcessingThemeChange.current = false;
      }, 100);
    }
  }, [theme, initialTheme, isAdminLoginPage]);

  // Обработчик переключения темы
  const handleToggleTheme = () => {
    // Если мы уже обрабатываем изменение темы или находимся на странице логина админ-панели, не обрабатываем
    if (isProcessingThemeChange.current || isAdminLoginPage) return;
    
    isProcessingThemeChange.current = true;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log("ThemeToggle: Пользователь переключил тему на", newTheme);
    
    // Обновляем контекст темы
    toggleTheme(newTheme);
    
    // Обновляем localStorage
    const isDark = newTheme === 'dark';
    localStorage.setItem('darkTheme', isDark.toString());
    localStorage.setItem('adminDarkMode', isDark.toString());
    
    // Применяем тему к header напрямую для немедленного эффекта
    const headers = document.querySelectorAll('header, .header');
    headers.forEach(header => {
      if (isDark) {
        header.classList.add('dark-theme-header');
        header.setAttribute('data-theme', 'dark');
        header.style.backgroundColor = '#1F2937';
        header.style.color = '#F9FAFB';
        
        // Обновляем все навигационные ссылки и логотип
        const links = header.querySelectorAll('a, .nav-link');
        links.forEach(link => {
          link.style.color = '#F9FAFB';
        });
        
        const logo = header.querySelector('.logo');
        if (logo) logo.style.color = '#F9FAFB';
        
      } else {
        header.classList.remove('dark-theme-header');
        header.setAttribute('data-theme', 'light');
        header.style.backgroundColor = '#FFFFFF';
        header.style.color = '#1F2937';
        
        // Обновляем все навигационные ссылки и логотип
        const links = header.querySelectorAll('a, .nav-link');
        links.forEach(link => {
          link.style.color = '#1e3a8a';
        });
        
        const logo = header.querySelector('.logo');
        if (logo) logo.style.color = '#1e3a8a';
      }
    });
    
    // Создаем событие изменения темы
    const themeEvent = new CustomEvent('themechange', { detail: { dark: isDark } });
    document.dispatchEvent(themeEvent);
    
    // Сбрасываем флаг с небольшой задержкой
    setTimeout(() => {
      isProcessingThemeChange.current = false;
    }, 100);
  };

  return (
    <div className="theme-toggle-wrapper">
      <button
        className="theme-toggle"
        onClick={handleToggleTheme}
        aria-label={`Переключить на ${theme === 'light' ? 'темную' : 'светлую'} тему`}
      >
        <div className="toggle-track">
          <div className="toggle-icon sun">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" fill="currentColor"/>
              <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19.7782 4.22266L18.364 5.63687" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5.63657 18.3643L4.22235 19.7785" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19.7782 19.7783L18.364 18.3641" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5.63657 5.63656L4.22235 4.22235" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="toggle-icon moon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 16C11.2089 16 10.4355 15.7654 9.77772 15.3259C9.11992 14.8864 8.60723 14.2616 8.30448 13.5307C8.00173 12.7998 7.92252 11.9956 8.07686 11.2196C8.2312 10.4437 8.61216 9.73098 9.17157 9.17157C9.73098 8.61216 10.4437 8.2312 11.2196 8.07686C11.9956 7.92252 12.7998 8.00173 13.5307 8.30448C14.2616 8.60723 14.8864 9.11992 15.3259 9.77772C15.7654 10.4355 16 11.2089 16 12C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="toggle-thumb"></div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle; 