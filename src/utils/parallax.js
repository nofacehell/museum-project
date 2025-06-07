export const initParallax = () => {
  const hero = document.querySelector('.exhibits-hero');
  if (!hero) return;

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = hero.getBoundingClientRect();
    
    // Вычисляем относительные координаты мыши внутри hero-секции
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    // Вычисляем смещение для параллакс-эффекта
    const moveX = (x - 0.5) * 20;
    const moveY = (y - 0.5) * 20;
    
    // Применяем трансформации к элементам
    const background = hero.querySelector('.exhibits-hero::before');
    const content = hero.querySelector('.exhibits-hero > div');
    const image = hero.querySelector('.hero-image');
    
    if (content) {
      content.style.transform = `translateZ(0) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
    }
    
    if (image) {
      image.style.transform = `perspective(500px) rotateY(${-moveX * 0.5}deg) rotateX(${moveY * 0.5}deg) translateZ(30px)`;
    }
  };

  const handleMouseLeave = () => {
    const content = hero.querySelector('.exhibits-hero > div');
    const image = hero.querySelector('.hero-image');
    
    if (content) {
      content.style.transform = 'translateZ(0)';
    }
    
    if (image) {
      image.style.transform = 'perspective(500px) rotateY(-10deg) translateZ(30px)';
    }
  };

  hero.addEventListener('mousemove', handleMouseMove);
  hero.addEventListener('mouseleave', handleMouseLeave);

  // Очистка при размонтировании компонента
  return () => {
    hero.removeEventListener('mousemove', handleMouseMove);
    hero.removeEventListener('mouseleave', handleMouseLeave);
  };
}; 