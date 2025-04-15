import React from "react";
import { Link } from "react-router-dom";
import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/home.css';
import backgroundImage from '../images/museum-bg.jpg';

// Подключаем иконки UIkit
UIkit.use(Icons);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/600x400/cccccc/333333?text=Нет+изображения';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:image')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
  return `${API_URL}/uploads/${imagePath}`;
};

const Home = () => {
  // Инициализация AOS
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
  };
  
  // Добавляем массив популярных экспонатов
  const popularExhibits = [
    {
      id: 1,
      title: "Мона Лиза",
      description: "Одна из самых известных картин в мире, написанная Леонардо да Винчи в начале XVI века. Картина, которая также известна как «Джоконда», привлекает внимание своей загадочной улыбкой.",
      image: "/images/exhibits/mona-lisa.jpg"
    },
    {
      id: 2,
      title: "Звездная ночь",
      description: "Шедевр постимпрессионизма, созданный Винсентом Ван Гогом в 1889 году. Картина изображает вид из окна лечебницы, где находился художник, и отражает его эмоциональное состояние.",
      image: "/images/exhibits/starry-night.jpg"
    },
    {
      id: 3,
      title: "Давид",
      description: "Мраморная статуя работы Микеланджело, созданная между 1501 и 1504 годами. Это один из самых узнаваемых шедевров эпохи Возрождения, символизирующий идеалы красоты и человеческого совершенства.",
      image: "/images/exhibits/david.jpg"
    }
  ];

  return (
    <div className="uk-container">
      {/* Основной контент */}
      <div className="home-section">
        <div className="uk-grid uk-child-width-1-2@m uk-flex-middle uk-grid-large" data-uk-grid>
          <div data-aos="fade-right">
            <h1 className="uk-heading-medium uk-text-bold">
              Добро пожаловать в виртуальный музей
            </h1>
            <p className="uk-text-lead uk-margin-medium-top uk-margin-medium-bottom">
              Исследуйте экспонаты, участвуйте в викторинах и играх, чтобы узнать больше об искусстве.
            </p>
            <div className="uk-margin-medium-top">
              <Link to="/exhibits" className="uk-button uk-button-primary uk-margin-small-right">
                Начать просмотр
              </Link>
              <Link to="/quizzes" className="uk-button uk-button-default">
                Пройти викторину
              </Link>
            </div>
          </div>
          <div className="uk-text-center" data-aos="fade-left">
            <img 
              src={backgroundImage} 
              alt="Музей" 
              className="uk-box-shadow-large" 
              style={{
                borderRadius: "12px",
                maxWidth: "100%",
                height: "auto"
              }}
            />
          </div>
        </div>
      </div>

      {/* Секция с преимуществами */}
      <div className="uk-section">
        <div className="uk-container">
          <div className="uk-grid uk-child-width-1-3@m uk-grid-match" data-uk-grid>
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="feature-card">
                <div className="uk-card-media-top">
                  <span className="feature-icon exhibits" data-uk-icon="icon: image; ratio: 2.5"></span>
                </div>
                <h3>Экспонаты</h3>
                <p>Изучайте уникальные экспонаты из нашей коллекции с подробными описаниями.</p>
              </div>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="feature-card">
                <div className="uk-card-media-top">
                  <span className="feature-icon quizzes" data-uk-icon="icon: question; ratio: 2.5"></span>
                </div>
                <h3>Викторины</h3>
                <p>Проверьте свои знания об искусстве в наших интерактивных викторинах.</p>
              </div>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="feature-card">
                <div className="uk-card-media-top">
                  <span className="feature-icon games" data-uk-icon="icon: play; ratio: 2.5"></span>
                </div>
                <h3>Игры</h3>
                <p>Играйте в образовательные игры и узнавайте новое об искусстве.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Блок с популярными экспонатами */}
      <div className="popular-exhibits">
        <div className="uk-container">
          <h2 className="uk-heading-small uk-text-center" data-aos="fade-up">
            Популярные экспонаты
          </h2>
          <p className="uk-text-lead uk-text-center uk-margin-medium-bottom" data-aos="fade-up">
            Откройте для себя шедевры мирового искусства
          </p>
          
          <div className="uk-grid uk-child-width-1-3@m uk-grid-match" data-uk-grid>
            {popularExhibits.map((exhibit) => (
              <div key={exhibit.id} data-aos="fade-up">
                <div className="exhibit-card">
                  <div className="uk-card-media-top">
                    <img src={getImageUrl(exhibit.image)} alt={exhibit.title} />
                  </div>
                  <div className="uk-card-body">
                    <h3>{exhibit.title}</h3>
                    <p>{exhibit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
