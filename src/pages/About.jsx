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
            Наша миссия
          </span>
          <h1 className="about-heading uk-heading-medium">
            О нашем музее
          </h1>
          <p className="about-text">
            Мы делаем искусство доступным для всех, объединяя традиции и инновации
          </p>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="about-section">
        <div className="about-grid-balanced">
          <div className="about-content" data-aos="fade-right">
            <h2 className="about-heading">История музея</h2>
            <p className="about-text">
              Наш музей был основан в 2010 году группой энтузиастов искусства с целью создания пространства, где классические произведения и современные формы искусства могли бы сосуществовать в гармонии. За более чем десятилетие мы превратились в один из ведущих культурных центров, сочетающий традиционные экспозиции с интерактивными технологиями.
            </p>
            <p className="about-text">
              Мы гордимся тем, что наша коллекция постоянно растет и обновляется, включая в себя как признанные шедевры, так и работы молодых талантливых художников.
            </p>
            
            <div className="about-list-container">
              <h3>Ключевые факты</h3>
              <ul className="about-list">
                <li>Более 1000 экспонатов в постоянной коллекции</li>
                <li>Ежегодно проводим 12+ временных выставок</li>
                <li>Образовательные программы для всех возрастов</li>
                <li>Виртуальные туры и интерактивные инсталляции</li>
                <li>Сотрудничество с ведущими музеями мира</li>
              </ul>
            </div>
          </div>
          
          <div className="about-image-gallery" data-aos="fade-left">
            <div className="gallery-main-image">
              <img 
                src="/images/about/museum-building.jpg" 
                alt="Здание музея"
              />
            </div>
            
            <div className="gallery-small-images">
              <div className="gallery-small-image">
                <img 
                  src="/images/about/exhibition-hall.jpg" 
                  alt="Выставочный зал"
                />
              </div>
              <div className="gallery-small-image">
                <img 
                  src="/images/about/interactive-display.jpg" 
                  alt="Интерактивная экспозиция"
                />
              </div>
            </div>
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
              <h3>Доступность искусства</h3>
              <p>
                Мы стремимся сделать искусство доступным для каждого, независимо от возраста, образования или социального положения. Наши программы разработаны таким образом, чтобы каждый посетитель смог найти что-то интересное для себя.
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
              <h3>Образование и инновации</h3>
              <p>
                Мы верим в силу образования и постоянно внедряем инновационные подходы к изучению искусства. Наши интерактивные экспозиции, мастер-классы и образовательные программы помогают глубже понять и оценить мир искусства.
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
              <h3>Сохранение культурного наследия</h3>
              <p>
                Наша важнейшая задача — сохранение и популяризация культурного наследия. Мы тщательно охраняем каждый экспонат и стремимся передать будущим поколениям не только произведения искусства, но и понимание их значимости.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Команда */}
      <div className="team-section">
        <h2 className="about-heading">
          Наша команда
        </h2>
        
        <div className="team-grid">
          <div data-aos="fade-up">
            <div className="team-member">
              <div className="team-member-image">
                <img 
                  src="/images/about/director.jpg" 
                  alt="Директор музея"
                />
              </div>
              <h3>Елена Сергеевна</h3>
              <p className="position">Директор музея</p>
              <p>
                Более 15 лет опыта в управлении культурными учреждениями. Кандидат искусствоведения, автор многочисленных публикаций об искусстве.
              </p>
            </div>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="team-member">
              <div className="team-member-image">
                <img 
                  src="/images/about/curator.jpg" 
                  alt="Главный куратор"
                />
              </div>
              <h3>Андрей Викторович</h3>
              <p className="position">Главный куратор</p>
              <p>
                Искусствовед с международным опытом. Организовал более 30 успешных выставок в России и за рубежом. Специализируется на современном искусстве.
              </p>
            </div>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="team-member">
              <div className="team-member-image">
                <img 
                  src="/images/about/education.jpg" 
                  alt="Руководитель образовательных программ"
                />
              </div>
              <h3>Марина Алексеевна</h3>
              <p className="position">Руководитель образовательных программ</p>
              <p>
                Педагог с 20-летним стажем. Разработала уникальные методики обучения искусству для всех возрастных групп. Автор книг по арт-педагогике.
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
              Мы всегда рады видеть вас в нашем музее. Приходите, чтобы насладиться искусством, принять участие в образовательных программах и специальных мероприятиях.
            </p>
            
            <div className="contact-info-container">
              <div className="contact-info">
                <h4>Адрес</h4>
                <p>г. Сморгонь, ул. Иванова, д. 42</p>
              </div>
              
              <div className="contact-info">
                <h4>Часы работы</h4>
                <p>
                  Вторник — Воскресенье: 10:00 — 20:00<br />
                  Понедельник: выходной
                </p>
              </div>
              
              <div className="contact-info">
                <h4>Контакты</h4>
                <p>
                  Телефон: +7 (123) 456-78-90<br />
                  Email: info@museum-online.ru
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