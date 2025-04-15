import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для прокрутки страницы вверх при изменении маршрута
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop; 