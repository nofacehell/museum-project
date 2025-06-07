import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-container">
      {/* Заголовок страницы */}
      <div className="about-section">
        {/* Декоративные элементы */}
        <div className="decorative-circle decorative-circle-1" />
        <div className="decorative-circle decorative-circle-2" />
        <div className="decorative-dot decorative-dot-1" />
        <div className="decorative-dot decorative-dot-2" />

        <div className="uk-text-center" data-aos="fade-up">
          <span className="about-badge">
            Научно-технический музей
          </span>
          <h1 className="about-heading uk-heading-medium">
            Музей электричества
          </h1>
          <p className="about-text">
            Исследуем прошлое, настоящее и будущее электричества
          </p>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="about-section">
        <div className="about-content" data-aos="fade-right">
          <h2 className="about-heading">История музея</h2>
          <p className="about-text">
            Музей электричества был открыт 19 декабря 2020 года согласно распоряжению № 396 от 18.12.2020. За время своего существования музей стал важным центром научно-технического просвещения, привлекая внимание как местных жителей, так и гостей города.
          </p>
          <p className="about-text">
            Наша коллекция постоянно развивается, демонстрируя эволюцию электричества от первых открытий до современных технологий.
          </p>
          
          <div className="about-list-container">
            <h3>Ключевые показатели</h3>
            <ul className="about-list">
              <li>Общая площадь музея: 35 м²</li>
              <li>Количество предметов основного фонда: 111</li>
              <li>Общее количество экспонатов: 220</li>
              <li>Из них научно-вспомогательных: 38</li>
              <li>Проведено экскурсий: 138</li>
              <li>Посетило музей: 2758 человек</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Миссия и ценности */}
      <div className="about-section">
        <h2 className="about-heading">
          Наша миссия и ценности
        </h2>
        
        <div className="about-grid-3">
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="about-card">
              <div className="about-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                  <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="currentColor"/>
                  <path d="M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Научно-техническое просвещение</h3>
              <p>
                Мы стремимся сделать сложные научные концепции доступными и интересными для всех посетителей, независимо от возраста и уровня подготовки.
              </p>
            </div>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="about-card">
              <div className="about-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2ZM14.85 13.1L14 13.7V16H10V13.7L9.15 13.1C7.8 12.16 7 10.63 7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 10.63 16.2 12.16 14.85 13.1Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Интерактивное обучение</h3>
              <p>
                Наши экспозиции включают интерактивные элементы, позволяющие посетителям на практике понять принципы работы электричества и его роль в современном мире.
              </p>
            </div>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="300">
            <div className="about-card">
              <div className="about-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill="currentColor"/>
                </svg>
              </div>
              <h3>Сохранение истории</h3>
              <p>
                Мы бережно храним и демонстрируем исторические экспонаты, связанные с развитием электричества, чтобы сохранить память о важных научных открытиях и изобретениях.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Команда */}
      <div className="team-section" style={{ textAlign: 'center' }}>
        <h2 className="about-heading" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Наша команда
        </h2>
        
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '600px' }} data-aos="fade-up">
            <div className="team-member" style={{ 
              padding: '3rem', 
              background: 'var(--background-color)',
              borderRadius: '12px',
              boxShadow: '0 4px 6px var(--shadow-color)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ 
                width: '250px', 
                height: '250px', 
                margin: '0 auto 2rem',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--border-color)'
              }}>
                {/* SVG-иконка человека */}
                <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="#e2e8f0"/>
                  <ellipse cx="32" cy="26" rx="12" ry="14" fill="#a0aec0"/>
                  <ellipse cx="32" cy="50" rx="18" ry="10" fill="#cbd5e1"/>
                  <ellipse cx="32" cy="26" rx="8" ry="10" fill="#f7fafc"/>
                  <ellipse cx="32" cy="24" rx="4" ry="5" fill="#a0aec0"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '2rem', 
                marginBottom: '1rem', 
                textAlign: 'center',
                color: 'var(--text-color)'
              }}>
                Высоцкая Ольга Климентьевна
              </h3>
              <p style={{ 
                fontSize: '1.3rem', 
                textAlign: 'center', 
                marginBottom: '1.5rem',
                color: 'var(--text-secondary-color)'
              }}>
                Руководитель музея
              </p>
              <p style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.8', 
                textAlign: 'center',
                color: 'var(--text-color)',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Возглавляет музей с момента его основания. Обладает глубокими знаниями в области истории науки и техники, активно участвует в развитии музейного дела.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className="contact-section">
        <div className="contact-grid">
          <div data-aos="fade-right">
            <h2 className="about-heading">Посетите наш музей</h2>
            <p className="about-text">
              Мы приглашаем вас посетить наш музей и погрузиться в увлекательный мир электричества. Наши экскурсоводы помогут вам лучше понять историю и значение этого важного открытия.
            </p>
            
            <div className="contact-info-container">
              <div className="contact-info">
                <h4>Адрес</h4>
                <p>231045, Гродненская область, г. Сморгонь, ул. Ленина, 33</p>
              </div>
              
              <div className="contact-info">
                <h4>Контакты</h4>
                <p>
                  Телефон: +375 (1592) 4-68-10<br />
                  Email: Sch2@smorgon-edu.gov.by<br />
                  Руководитель: +375 (29) 659-76-92
                </p>
              </div>
            </div>
          </div>
          
          <div data-aos="fade-left">
            <div className="map-container">
              <div className="about-image">
                <iframe 
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3A9ff07375d02c0fddac9861e064010058cf6a31d5a1ad84decd03cea1c885a390&amp;source=constructor" 
                  width="100%" 
                  height="400"
                  frameBorder="0"
                  title="Карта расположения музея - Яндекс Карты"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 