import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст
const ThemeContext = createContext();

// Провайдер темы
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Проверяем сохраненную тему при инициализации
    const savedTheme = localStorage.getItem('darkTheme') === 'true' ? 'dark' : 'light';
    setTheme(savedTheme);
    
    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Применяем класс dark-theme к body и html для совместимости с CSS
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
      
      // Добавляем класс dark-theme к основным контейнерам
      const mainContainers = document.querySelectorAll('.uk-container, .uk-section, .uk-card, .uk-navbar-container, .uk-button, .uk-alert, .uk-dropdown, .uk-search-input, .uk-text-muted, .uk-text-lead, .uk-card-title, .uk-card-body, .uk-heading-bullet, .uk-button-text, .exhibit-card, .review-form-card, .reviews-container, .reviews-header, .reviews-badge, .reviews-heading, .reviews-description, .reviews-stat, .review-form-header, .review-form-body, .form-group label, .form-group input, .form-group textarea, .form-group select, .review-image-upload, .review-image-upload p, .admin-sidebar, .admin-nav-button, .admin-nav-text, .admin-logo-text, .admin-review-text, .admin-table td, .admin-table th, .admin-card, .admin-card-title, .admin-card-value, .admin-card-label, .admin-section-title, .admin-header h1, .admin-content, .admin-main-content, .admin-footer, .admin-theme-toggle, .admin-logout-button, .admin-btn, .admin-btn-primary, .admin-btn-secondary, .admin-btn-danger, .admin-status-badge, .admin-status-badge.approved, .admin-status-badge.pending, .admin-status-badge.rejected, .admin-loader, .admin-loader-container, .uk-notification, .uk-notification-message, .uk-notification-close, .uk-notification-message-primary, .uk-notification-message-success, .uk-notification-message-warning, .uk-notification-message-danger, .uk-card-default, .uk-card-hover, .uk-section-default, .uk-button-default, .uk-button-primary, .uk-navbar-nav > li > a, .uk-navbar-nav > li:hover > a, .uk-navbar-nav > li.uk-active > a, .uk-heading-medium, .uk-heading-large, .uk-heading-xlarge, h1, h2, h3, h4, h5, h6, p, .uk-label, .decorative-circle, .noise, .uk-card-hover:hover, .header, .header .logo, .header .nav-link, .header .nav-link:hover, .header .nav-link.active, #admin-content');
      
      mainContainers.forEach(container => {
        container.classList.add('dark-theme');
      });
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
      
      // Удаляем класс dark-theme с основных контейнеров
      const mainContainers = document.querySelectorAll('.uk-container, .uk-section, .uk-card, .uk-navbar-container, .uk-button, .uk-alert, .uk-dropdown, .uk-search-input, .uk-text-muted, .uk-text-lead, .uk-card-title, .uk-card-body, .uk-heading-bullet, .uk-button-text, .exhibit-card, .review-form-card, .reviews-container, .reviews-header, .reviews-badge, .reviews-heading, .reviews-description, .reviews-stat, .review-form-header, .review-form-body, .form-group label, .form-group input, .form-group textarea, .form-group select, .review-image-upload, .review-image-upload p, .admin-sidebar, .admin-nav-button, .admin-nav-text, .admin-logo-text, .admin-review-text, .admin-table td, .admin-table th, .admin-card, .admin-card-title, .admin-card-value, .admin-card-label, .admin-section-title, .admin-header h1, .admin-content, .admin-main-content, .admin-footer, .admin-theme-toggle, .admin-logout-button, .admin-btn, .admin-btn-primary, .admin-btn-secondary, .admin-btn-danger, .admin-status-badge, .admin-status-badge.approved, .admin-status-badge.pending, .admin-status-badge.rejected, .admin-loader, .admin-loader-container, .uk-notification, .uk-notification-message, .uk-notification-close, .uk-notification-message-primary, .uk-notification-message-success, .uk-notification-message-warning, .uk-notification-message-danger, .uk-card-default, .uk-card-hover, .uk-section-default, .uk-button-default, .uk-button-primary, .uk-navbar-nav > li > a, .uk-navbar-nav > li:hover > a, .uk-navbar-nav > li.uk-active > a, .uk-heading-medium, .uk-heading-large, .uk-heading-xlarge, h1, h2, h3, h4, h5, h6, p, .uk-label, .decorative-circle, .noise, .uk-card-hover:hover, .header, .header .logo, .header .nav-link, .header .nav-link:hover, .header .nav-link.active, #admin-content');
      
      mainContainers.forEach(container => {
        container.classList.remove('dark-theme');
      });
    }
  }, []);

  const toggleTheme = (newTheme = null) => {
    const updatedTheme = newTheme || (theme === 'light' ? 'dark' : 'light');
    setTheme(updatedTheme);
    
    // Сохраняем тему в localStorage
    localStorage.setItem('darkTheme', updatedTheme === 'dark' ? 'true' : 'false');
    
    // Применяем тему к документу
    document.documentElement.setAttribute('data-theme', updatedTheme);
    
    // Применяем класс dark-theme к body и html для совместимости с CSS
    if (updatedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
      
      // Добавляем класс dark-theme к основным контейнерам
      const mainContainers = document.querySelectorAll('.uk-container, .uk-section, .uk-card, .uk-navbar-container, .uk-button, .uk-alert, .uk-dropdown, .uk-search-input, .uk-text-muted, .uk-text-lead, .uk-card-title, .uk-card-body, .uk-heading-bullet, .uk-button-text, .exhibit-card, .review-form-card, .reviews-container, .reviews-header, .reviews-badge, .reviews-heading, .reviews-description, .reviews-stat, .review-form-header, .review-form-body, .form-group label, .form-group input, .form-group textarea, .form-group select, .review-image-upload, .review-image-upload p, .admin-sidebar, .admin-nav-button, .admin-nav-text, .admin-logo-text, .admin-review-text, .admin-table td, .admin-table th, .admin-card, .admin-card-title, .admin-card-value, .admin-card-label, .admin-section-title, .admin-header h1, .admin-content, .admin-main-content, .admin-footer, .admin-theme-toggle, .admin-logout-button, .admin-btn, .admin-btn-primary, .admin-btn-secondary, .admin-btn-danger, .admin-status-badge, .admin-status-badge.approved, .admin-status-badge.pending, .admin-status-badge.rejected, .admin-loader, .admin-loader-container, .uk-notification, .uk-notification-message, .uk-notification-close, .uk-notification-message-primary, .uk-notification-message-success, .uk-notification-message-warning, .uk-notification-message-danger, .uk-card-default, .uk-card-hover, .uk-section-default, .uk-button-default, .uk-button-primary, .uk-navbar-nav > li > a, .uk-navbar-nav > li:hover > a, .uk-navbar-nav > li.uk-active > a, .uk-heading-medium, .uk-heading-large, .uk-heading-xlarge, h1, h2, h3, h4, h5, h6, p, .uk-label, .decorative-circle, .noise, .uk-card-hover:hover, .header, .header .logo, .header .nav-link, .header .nav-link:hover, .header .nav-link.active, #admin-content');
      
      mainContainers.forEach(container => {
        container.classList.add('dark-theme');
      });
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
      
      // Удаляем класс dark-theme с основных контейнеров
      const mainContainers = document.querySelectorAll('.uk-container, .uk-section, .uk-card, .uk-navbar-container, .uk-button, .uk-alert, .uk-dropdown, .uk-search-input, .uk-text-muted, .uk-text-lead, .uk-card-title, .uk-card-body, .uk-heading-bullet, .uk-button-text, .exhibit-card, .review-form-card, .reviews-container, .reviews-header, .reviews-badge, .reviews-heading, .reviews-description, .reviews-stat, .review-form-header, .review-form-body, .form-group label, .form-group input, .form-group textarea, .form-group select, .review-image-upload, .review-image-upload p, .admin-sidebar, .admin-nav-button, .admin-nav-text, .admin-logo-text, .admin-review-text, .admin-table td, .admin-table th, .admin-card, .admin-card-title, .admin-card-value, .admin-card-label, .admin-section-title, .admin-header h1, .admin-content, .admin-main-content, .admin-footer, .admin-theme-toggle, .admin-logout-button, .admin-btn, .admin-btn-primary, .admin-btn-secondary, .admin-btn-danger, .admin-status-badge, .admin-status-badge.approved, .admin-status-badge.pending, .admin-status-badge.rejected, .admin-loader, .admin-loader-container, .uk-notification, .uk-notification-message, .uk-notification-close, .uk-notification-message-primary, .uk-notification-message-success, .uk-notification-message-warning, .uk-notification-message-danger, .uk-card-default, .uk-card-hover, .uk-section-default, .uk-button-default, .uk-button-primary, .uk-navbar-nav > li > a, .uk-navbar-nav > li:hover > a, .uk-navbar-nav > li.uk-active > a, .uk-heading-medium, .uk-heading-large, .uk-heading-xlarge, h1, h2, h3, h4, h5, h6, p, .uk-label, .decorative-circle, .noise, .uk-card-hover:hover, .header, .header .logo, .header .nav-link, .header .nav-link:hover, .header .nav-link.active, #admin-content');
      
      mainContainers.forEach(container => {
        container.classList.remove('dark-theme');
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для использования темы
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 