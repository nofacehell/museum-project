import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLandmark,
  FaQuestionCircle,
  FaGamepad,
  FaSearch,
  FaArrowRight,
  FaHistory,
  FaCalendarAlt
} from 'react-icons/fa';
import './Home.css';

const emojiMessages = [
  { emoji: '😉', text: 'Улыбнитесь! Не забудьте посмотреть новые экспонаты!' },
  { emoji: '😃', text: 'Загляните в раздел "О нас" — там много интересного!' },
  { emoji: '😄', text: 'Проверьте свои знания в наших викторинах!' },
  { emoji: '😁', text: 'Попробуйте сыграть в одну из наших игр!' },
];

function getRandomEmojiMsg() {
  return emojiMessages[Math.floor(Math.random() * emojiMessages.length)];
}

const EmojiPopup = () => {
  const [visible, setVisible] = useState(true);
  const [msg, setMsg] = useState(getRandomEmojiMsg());

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <>
      <style>{`
        @keyframes fadeInUpEmoji {
          0% { opacity: 0; transform: translateY(40px) scale(0.9); }
          60% { opacity: 1; transform: translateY(-8px) scale(1.08); }
          80% { transform: translateY(0) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes emojiWiggle {
          0%, 100% { transform: rotate(0deg) scale(1.15); }
          20% { transform: rotate(-6deg) scale(1.18); }
          40% { transform: rotate(6deg) scale(1.16); }
          60% { transform: rotate(-4deg) scale(1.14); }
          80% { transform: rotate(4deg) scale(1.15); }
        }
        .emoji-popup {
          position: fixed;
          bottom: 40px;
          right: 40px;
          z-index: 9999;
          background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(60,60,120,0.18);
          padding: 1.3rem 2.2rem 1.3rem 1.5rem;
          display: flex;
          align-items: center;
          font-size: 1.25rem;
          min-width: 240px;
          max-width: 350px;
          animation: fadeInUpEmoji 1.2s cubic-bezier(.23,1,.32,1.01);
          border: 1.5px solid #e0e7ff;
          backdrop-filter: blur(2px);
        }
        .emoji-popup-emoji {
          font-size: 2.5rem;
          margin-right: 18px;
          animation: emojiWiggle 2.2s cubic-bezier(.36,.07,.19,.97) 0.2s 1;
          filter: drop-shadow(0 2px 8px #c7d2fe);
        }
        .emoji-popup-close {
          margin-left: 16px;
          background: linear-gradient(135deg, #e0e7ff 60%, #f8fafc 100%);
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
          border-radius: 50%;
          width: 2.2rem;
          height: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(100,116,139,0.08);
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .emoji-popup-close:hover {
          background: #e0e7ff;
          color: #1e293b;
          transform: scale(1.15);
        }
      `}</style>
      <div className="emoji-popup">
        <span className="emoji-popup-emoji">{msg.emoji}</span>
        <span style={{ flex: 1 }}>{msg.text}</span>
        <button className="emoji-popup-close" onClick={() => setVisible(false)} title="Закрыть">×</button>
      </div>
    </>
  );
};

const heroSlogans = [
  'Откройте для себя историю технологий',
  'Погрузитесь в мир инноваций',
  'Узнайте больше о великих изобретениях',
  'Проверьте свои знания в викторинах',
];

const HeroSloganSlider = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % heroSlogans.length), 3500);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="hero-slogan-slider">{heroSlogans[index]}</span>
  );
};

// Анимированный эмодзи-компонент, теперь внутри hero-content
const AnimatedEmoji = () => (
  <span className="hero-emoji" role="img" aria-label="молния">⚡</span>
);

// Массив исторических фактов
const historyFacts = [
  {
    fact: 'В 1879 году Томас Эдисон изобрёл первую коммерчески успешную лампу накаливания.',
    source: 'Энциклопедия электротехники'
  },
  {
    fact: 'Первый персональный компьютер Altair 8800 был выпущен в 1975 году и стал толчком для развития индустрии ПК.',
    source: 'История вычислительной техники'
  },
  {
    fact: 'В 1947 году был изобретён транзистор — ключевой элемент современной электроники.',
    source: 'Bell Labs'
  },
  {
    fact: 'В 1969 году был отправлен первый электронный e-mail.',
    source: 'История интернета'
  },
  {
    fact: 'В 1956 году IBM представила первый жёсткий диск объёмом 5 мегабайт — он весил более тонны.',
    source: 'IBM Archives'
  },
  {
    fact: 'В 1927 году был выпущен первый телевизор для массового рынка — Baird Televisor.',
    source: 'История телевидения'
  },
  {
    fact: 'В 1800 году Алессандро Вольта изобрёл первую электрическую батарею — вольтов столб.',
    source: 'История электричества'
  },
  {
    fact: 'В 1821 году Майкл Фарадей построил первый в мире электрический двигатель.',
    source: 'Биография Майкла Фарадея'
  },
  {
    fact: 'В 1831 году Фарадей открыл явление электромагнитной индукции — основу работы генераторов.',
    source: 'История физики'
  },
  {
    fact: 'В 1888 году Генрих Герц экспериментально доказал существование электромагнитных волн.',
    source: 'История радиосвязи'
  },
  {
    fact: 'В 1895 году Александр Попов провёл первую публичную демонстрацию радиоприёмника.',
    source: 'История радио'
  },
  {
    fact: 'В 1904 году Джон Флеминг изобрёл электронную лампу — диод, что стало основой для развития электроники.',
    source: 'История электроники'
  },
  {
    fact: 'В 1928 году был изобретён первый телевизионный электронный микроскоп.',
    source: 'История телевидения'
  },
  {
    fact: 'В 1941 году в США был запущен первый коммерческий телевизионный канал.',
    source: 'История телевидения'
  },
  {
    fact: 'В 1958 году Джек Килби создал первую интегральную микросхему.',
    source: 'История микросхем'
  },
  {
    fact: 'В 1965 году Гордон Мур сформулировал закон Мура, предсказав экспоненциальный рост числа транзисторов на чипе.',
    source: 'История вычислительной техники'
  },
  {
    fact: 'В 1983 году был представлен первый мобильный телефон Motorola DynaTAC 8000X.',
    source: 'История мобильной связи'
  },
  {
    fact: 'В 1991 году был отправлен первый SMS-сообщение в мире.',
    source: 'История мобильной связи'
  },
  {
    fact: 'В 2004 году был создан первый прототип Wi-Fi роутера для массового рынка.',
    source: 'История беспроводных технологий'
  },
  {
    fact: 'В 2012 году был запущен марсоход Curiosity, оснащённый сложной электроникой и автономными системами.',
    source: 'NASA'
  },
];

function getRandomFact() {
  return historyFacts[Math.floor(Math.random() * historyFacts.length)];
}

// Массив праздников, связанных с электричеством и наукой
const holidays = [
  { date: '01-23', name: 'День рождения электрической лампочки', description: 'В этот день в 1880 году Томас Эдисон получил патент на лампу накаливания.' },
  { date: '02-11', name: 'Международный день женщин и девочек в науке', description: 'Праздник, посвящённый женщинам в науке и технологиях.' },
  { date: '04-22', name: 'День Земли', description: 'Всемирный день защиты окружающей среды и рационального использования энергии.' },
  { date: '05-07', name: 'День радио', description: 'В этот день в 1895 году Александр Попов продемонстрировал первый радиоприёмник.' },
  { date: '06-29', name: 'День изобретателя и рационализатора', description: 'Праздник изобретателей и инженеров.' },
  { date: '10-09', name: 'Всемирный день почты', description: 'Праздник связи, телеграфа и технологий коммуникаций.' },
  { date: '10-10', name: 'Всемирный день науки', description: 'Праздник науки и научных открытий.' },
  { date: '12-20', name: 'День энергетика', description: 'Профессиональный праздник работников энергетики.' },
];

function getTodayHoliday() {
  const today = new Date();
  const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return holidays.find(h => h.date === mmdd);
}

function getNextHoliday() {
  const today = new Date();
  const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  // Сортируем праздники по дате в году
  const sorted = holidays.slice().sort((a, b) => a.date.localeCompare(b.date));
  // Ищем первый праздник после сегодняшней даты
  const next = sorted.find(h => h.date > mmdd) || sorted[0]; // если не найден — первый в следующем году
  return next;
}

const FactOfTheDay = () => {
  const [fact, setFact] = useState(getRandomFact());
  const todayHoliday = getTodayHoliday();
  const nextHoliday = getNextHoliday();
  // Форматируем дату: дд.мм
  const [mm, dd] = nextHoliday.date.split('-');
  const formattedDate = `${dd}.${mm}`;
  return (
    <section className="fact-of-day-section reveal fade-bottom">
      <div className="fact-of-day-container">
        <div className="fact-icon"><FaHistory size={32} color="#5B8AF5" /></div>
        <div className="fact-content">
          {todayHoliday ? (
            <>
              <div className="fact-title">Сегодня — {todayHoliday.name}!</div>
              <div className="fact-text">{todayHoliday.description}</div>
            </>
          ) : (
            <>
              <div className="fact-title">Факт дня</div>
              <div className="fact-text">{fact.fact}</div>
              <div className="fact-source">Источник: {fact.source}</div>
              <div className="next-holiday">
                <FaCalendarAlt style={{ marginRight: 6, color: '#5B8AF5', verticalAlign: 'middle' }} />
                <span style={{ color: '#64748b' }}>Ближайший праздник:</span>{' '}
                <b style={{ color: '#222' }}>{nextHoliday.name}</b>{' '}
                <span style={{ color: '#5B8AF5' }}>({formattedDate})</span>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        .fact-of-day-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2.5rem 0 2.2rem 0;
          background: linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%);
        }
        .fact-of-day-container {
          display: flex;
          align-items: flex-start;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px #c7d2fe33;
          padding: 2rem 2.5rem;
          max-width: 700px;
          width: 100%;
          gap: 2.2rem;
        }
        .fact-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .fact-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #5B8AF5;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }
        .fact-text {
          font-size: 1.18rem;
          color: #222;
          margin-bottom: 0.5rem;
        }
        .fact-source {
          font-size: 0.98rem;
          color: #64748b;
        }
        .next-holiday {
          margin-top: 0.7rem;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        @media (max-width: 600px) {
          .fact-of-day-container { flex-direction: column; padding: 1.2rem 0.7rem; gap: 1.1rem; }
        }
      `}</style>
    </section>
  );
};

const Home = () => {
  // Reveal‑эффект при скролле
  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 150) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // сработает сразу при монтировании
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      <EmojiPopup />
      <style>{`
        .hero-section {
          position: relative;
          background: linear-gradient(120deg, #60a5fa 0%, #818cf8 50%);
          overflow: hidden;
          padding-top: 88px;
        }
        .hero-bg-img {
          position: absolute;
          z-index: 0;
          filter: blur(12px) saturate(1.2);
          opacity: 0.8;
          pointer-events: none;
          user-select: none;
          transition: opacity 0.5s;
        }
        .hero-bg-img.img1 {
          top: 10%; left: 5%; width: 220px; height: 180px;
          background: url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80') center/cover no-repeat;
        }
        .hero-bg-img.img2 {
          bottom: 8%; right: 8%; width: 180px; height: 160px;
          background: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80') center/cover no-repeat;
        }
        .hero-bg-img.img3 {
          top: 40%; right: 18%; width: 140px; height: 120px;
          background: url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80') center/cover no-repeat;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(120deg, #2563ebcc 0%, #818cf8cc 100%);
          opacity: 0.55;
          pointer-events: none;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 3.5rem 2.5rem;
          background: rgba(255,255,255,0.10);
          border-radius: 32px;
          box-shadow: 0 4px 32px rgba(60,60,120,0.10);
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          animation: fadeInHero 1.2s cubic-bezier(.23,1,.32,1.01);
          z-index: 2;
        }
        @keyframes fadeInHero {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .hero-title-block {
          margin-bottom: 0.5rem;
        }
        .hero-title-highlight {
          font-size: 3.2rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #fff;
          text-shadow: 0 4px 24px #1e293b99, 0 1px 0 #fff;
        }
        .hero-slogan-slider {
          display: block;
          color: #e0e7ff;
          font-size: 1.15rem;
          font-weight: 500;
          margin: 0.7rem 0 1.2rem 0;
          min-height: 2.2em;
          transition: opacity 0.5s;
          text-shadow: 0 1px 8px #64748b44;
        }
        .hero-title-line {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          margin-bottom: 0.2em;
          display: block;
        }
        .hero-description {
          color: #f3f4f6;
          font-size: 1.18rem;
          margin-bottom: 2.2rem;
          max-width: 420px;
          line-height: 1.6;
          opacity: 0.92;
          animation: fadeInHero 1.7s 0.3s both;
        }
        .hero-buttons {
          display: flex;
          flex-direction: row;
          gap: 1.1rem;
          margin-top: 2.5rem;
          animation: fadeInHero 1.7s 0.5s both;
          justify-content: center;
          width: 100%;
        }
        .btn-primary, .btn-secondary {
          position: relative;
          z-index: 2;
          border: 2.5px solid #38bdf8;
          border-radius: 16px;
          background-origin: border-box;
          box-shadow: 0 0 0 2px #7dd3fc55, 0 2px 16px #38bdf855;
          transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
        }
        .btn-primary:hover, .btn-secondary:hover {
          box-shadow: 0 0 0 4px #7dd3fc99, 0 4px 32px #38bdf899;
          border-color: #7dd3fc;
        }
        .btn-primary:hover {
          background: linear-gradient(90deg, #2563eb 0%, #818cf8 100%);
          color: #fff !important;
        }
        .btn-primary {
          background: linear-gradient(90deg, #2563eb 0%, #818cf8 100%);
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          border-radius: 12px;
          padding: 1.1rem 2.2rem;
          border: none;
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          animation: btnPulse 2.5s infinite alternate;
        }
        @keyframes btnPulse {
          0% { box-shadow: 0 2px 12px #2563eb22; }
          100% { box-shadow: 0 6px 32px #2563eb55; transform: scale(1.04); }
        }
        .btn-primary:hover {
          transform: scale(1.06) translateY(-2px);
          box-shadow: 0 6px 24px #2563eb99;
        }
        .btn-primary .arrow-anim {
          display: inline-block;
          transition: transform 0.2s;
        }
        .btn-primary:hover .arrow-anim {
          transform: translateX(7px) scale(1.2);
        }
        .btn-secondary {
          background: linear-gradient(90deg, #2563eb 0%, #818cf8 100%);
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          border-radius: 12px;
          padding: 1.1rem 2.2rem;
          border: none;
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          animation: btnPulse 2.5s infinite alternate;
        }
        .btn-secondary:hover {
          background: linear-gradient(90deg, #1d4ed8 0%, #6366f1 100%);
          color: #fff;
          transform: scale(1.06) translateY(-2px);
          box-shadow: 0 6px 24px #2563eb99;
        }
        @media (max-width: 900px) {
          .hero-content { flex-direction: column; padding: 2rem 1rem; }
          .hero-buttons { margin-left: 0; margin-top: 2rem; }
        }
        @media (max-width: 600px) {
          .hero-title-highlight { font-size: 2.1rem; }
          .hero-title-line { font-size: 1.2rem; }
          .hero-content { padding: 1.2rem 0.5rem; }
        }
        .hero-emoji {
          position: absolute;
          top: -32px;
          right: -32px;
          font-size: 7rem;
          filter: drop-shadow(0 2px 24px #facc15cc);
          transform: rotate(-18deg);
          animation: emojiWiggle 2.5s infinite ease-in-out;
          z-index: 4;
          pointer-events: none;
          user-select: none;
        }
        @keyframes emojiWiggle {
          0%, 100% { transform: rotate(-18deg) scale(1.08); }
          20% { transform: rotate(-12deg) scale(1.13); }
          40% { transform: rotate(-22deg) scale(1.10); }
          60% { transform: rotate(-10deg) scale(1.12); }
          80% { transform: rotate(-20deg) scale(1.09); }
        }
        .cta-section .btn-primary {
          color: #fff !important;
        }
      `}</style>
      {/* Герой‑секция */}
      <section className="hero-section">
        {/* Размытые изображения на фоне */}
        <div className="hero-bg-img img1" />
        <div className="hero-bg-img img2" />
        <div className="hero-bg-img img3" />
        <div className="hero-content reveal fade-bottom" style={{position: 'relative'}}>
          <AnimatedEmoji />
          <div className="hero-title-block">
            <span className="hero-title-highlight">Откройте для себя историю технологий</span>
            <HeroSloganSlider />
          </div>
          <p className="hero-description">
            Исследуйте уникальные экспонаты, проходите увлекательные викторины и погрузитесь 
            в мир инноваций через наши интерактивные сервисы.
          </p>
          <div className="hero-buttons">
            <Link to="/exhibits" className="btn-primary">
              Смотреть экспонаты <span className="arrow-anim">→</span>
            </Link>
            <Link to="/quizzes" className="btn-secondary">
              Пройти викторину
            </Link>
          </div>
        </div>
      </section>

      {/* Факт дня */}
      <FactOfTheDay />

      {/* Фичи */}
      <section className="features-section">
        <div className="section-header reveal fade-bottom">
          <h2>Исследуйте нашу коллекцию</h2>
          <p>Разнообразные варианты взаимодействия с историей технологий</p>
        </div>
        <div className="features-container">
          <div className="feature-card reveal fade-right" style={{ animationDelay: '0.2s' }}>
            <FaLandmark className="feature-icon" />
            <h3>Виртуальные экспозиции</h3>
            <p>Узнавайте историю техники через детальные модели экспонатов.</p>
            <Link to="/exhibits" className="feature-link">
              Смотреть экспонаты <FaArrowRight />
            </Link>
          </div>
          <div className="feature-card reveal fade-right" style={{ animationDelay: '0.4s' }}>
            <FaQuestionCircle className="feature-icon" />
            <h3>Интерактивные викторины</h3>
            <p>Проверьте свои знания и узнайте больше об истории технологий.</p>
            <Link to="/quizzes" className="feature-link">
              Пройти викторину <FaArrowRight />
            </Link>
          </div>
          <div className="feature-card reveal fade-right" style={{ animationDelay: '0.6s' }}>
            <FaGamepad className="feature-icon" />
            <h3>Образовательные игры</h3>
            <p>Погрузитесь в историю через увлекательные игры и задания.</p>
            <Link to="/games" className="feature-link">
              Играть <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="how-section">
        <div className="section-header reveal fade-bottom">
          <h2>Как исследовать музей</h2>
          <p>Простой процесс знакомства с историей технологий</p>
        </div>
        <div className="steps-container">
          {[
            { step: 1, title: 'Исследуйте', text: 'Просматривайте экспонаты через поиск и категории', icon: <FaSearch /> },
            { step: 2, title: 'Узнавайте', text: 'Читайте подробные описания и исторический контекст', icon: <FaHistory /> },
            { step: 3, title: 'Проверяйте', text: 'Закрепите знания в викторинах и играх', icon: <FaQuestionCircle /> }
          ].map(({ step, title, text, icon }, idx) => (
            <div
              key={step}
              className="step-item reveal fade-left"
              style={{ animationDelay: `${0.2 * (idx + 1)}s` }}
            >
              <div className="step-number"><span>{step}</span></div>
              <div className="step-content">
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="step-icon">{icon}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="cta-section reveal fade-up">
        <div className="cta-content">
          <h2>Готовы начать виртуальное путешествие?</h2>
          <p>Присоединяйтесь к тысячам пользователей, изучающих историю технологий.</p>
          <Link to="/exhibits" className="btn-primary">
            Начать исследование <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
