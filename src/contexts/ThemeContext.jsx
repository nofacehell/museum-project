import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст
const ThemeContext = createContext();

// Провайдер темы
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Проверяем сохраненную тему при инициализации
    const savedTheme = localStorage.getItem('darkTheme') === 'true' ? 'dark' : 
                      (localStorage.getItem('adminDarkMode') === 'true' ? 'dark' : 'light');
    setTheme(savedTheme);
    
    // Применяем тему к документу
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
  }, []);

  // Обновлена функция toggleTheme, теперь принимает второй параметр silent
  // Если silent=true, то тема меняется без генерации событий
  const toggleTheme = (newTheme = null, silent = false) => {
    const updatedTheme = newTheme || (theme === 'light' ? 'dark' : 'light');
    setTheme(updatedTheme);
    
    // Сохраняем тему в localStorage
    localStorage.setItem('darkTheme', updatedTheme === 'dark' ? 'true' : 'false');
    
    // Применяем тему к документу
    if (updatedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
    
    // Если не silent режим, генерируем событие изменения темы
    if (!silent) {
      console.log("ThemeContext: Генерация события смены темы для", updatedTheme);
      const themeEvent = new CustomEvent('themechange', { 
        detail: { dark: updatedTheme === 'dark' } 
      });
      document.dispatchEvent(themeEvent);
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