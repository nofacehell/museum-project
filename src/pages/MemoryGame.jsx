import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UIkit from 'uikit';
import 'uikit/dist/css/uikit.min.css';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons);

const MemoryGame = () => {
  // Данные карточек (электронные устройства вместо произведений искусства)
  const electronics = [
    { id: 1, name: 'Apple Macintosh', author: '1984', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Macintosh_128k_transparency.png/800px-Macintosh_128k_transparency.png' },
    { id: 2, name: 'IBM PC', author: '1981', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/IBM_PC-5150.jpg/800px-IBM_PC-5150.jpg' },
    { id: 3, name: 'Nintendo GameBoy', author: '1989', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Game-Boy-FL.jpg/800px-Game-Boy-FL.jpg' },
    { id: 4, name: 'Sony Walkman', author: '1979', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Original_Sony_Walkman_TPS-L2.JPG/800px-Original_Sony_Walkman_TPS-L2.JPG' },
    { id: 5, name: 'Commodore 64', author: '1982', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Commodore-64-Computer-FL.jpg/800px-Commodore-64-Computer-FL.jpg' },
    { id: 6, name: 'Nokia 3310', author: '2000', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Nokia_3310_blue_R7309170_%28retouch%29.png/800px-Nokia_3310_blue_R7309170_%28retouch%29.png' },
    { id: 7, name: 'Atari 2600', author: '1977', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Atari-2600-Wood-4Sw-Set.jpg/800px-Atari-2600-Wood-4Sw-Set.jpg' },
    { id: 8, name: 'iPod Classic', author: '2001', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/IPod_1G.png/800px-IPod_1G.png' },
  ];

  // Состояния игры
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameInfo, setGameInfo] = useState(null);

  // Функция для создания и перемешивания карточек
  const initializeGame = () => {
    // Создаем пары карточек
    const cardPairs = [...electronics, ...electronics].map((device, index) => ({
      ...device,
      id: index,
      flipped: false,
      matched: false
    }));

    // Перемешиваем карточки
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameOver(false);
    setTimer(0);
    setGameStarted(true);
    setGameInfo(null);
  };

  // Эффект для таймера
  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Эффект для проверки окончания игры
  useEffect(() => {
    if (matchedPairs.length === electronics.length && gameStarted) {
      setGameOver(true);
      setGameInfo({
        moves: moves,
        time: timer,
        score: calculateScore(moves, timer)
      });
    }
  }, [matchedPairs, gameStarted, moves, timer]);

  // Функция для обработки клика по карточке
  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || matchedPairs.includes(cardId)) return;

    // Переворачиваем карточку
    const newCards = cards.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    );
    setCards(newCards);

    // Добавляем карточку к перевернутым
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Если перевернуто две карточки, проверяем совпадение
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      // Проверяем совпадение по имени устройства
      if (firstCard.name === secondCard.name) {
        // Если совпали, добавляем в список совпавших пар
        setMatchedPairs([...matchedPairs, firstCardId, secondCardId]);
        setFlippedCards([]);
        
        // Показываем информацию об устройстве
        setGameInfo({
          device: firstCard.name,
          year: firstCard.author,
          image: firstCard.image
        });
        
        // Скрываем информацию через 2 секунды
        setTimeout(() => {
          setGameInfo(null);
        }, 2000);
      } else {
        // Если не совпали, переворачиваем обратно через 1 секунду
        setTimeout(() => {
          const updatedCards = cards.map(card => 
            (card.id === firstCardId || card.id === secondCardId) && !matchedPairs.includes(card.id)
              ? { ...card, flipped: false }
              : card
          );
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Функция расчета очков
  const calculateScore = (moves, time) => {
    const baseScore = 1000;
    const movesPenalty = moves * 10;
    const timePenalty = time * 2;
    return Math.max(baseScore - movesPenalty - timePenalty, 0);
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (gameOver) {
      const modal = UIkit.modal('#game-completed-modal');
      if (modal) {
        modal.show();
      }
    }
  }, [gameOver]);

  // Инициализируем игру при первой загрузке
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="memory-game-container" style={{ 
      padding: '100px 0 40px',  // Увеличил верхний padding, чтобы не перекрывался header
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: '#f5f7fa'
    }}>
      <div className="uk-container">
        {gameOver ? (
          <div 
            className="game-over" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
              maxWidth: '500px',
              margin: '40px auto'
            }}
          >
            <h2 style={{ color: '#333' }}>Игра окончена!</h2>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>Вы нашли все совпадения!</p>
            <p style={{ color: '#666' }}>Счет: {calculateScore(moves, timer)}</p>
            <p style={{ color: '#666' }}>Время: {formatTime(timer)}</p>
            <button 
              onClick={initializeGame}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              Играть снова
            </button>
          </div>
        ) : (
          <div>
            <div className="uk-margin-bottom" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'white',
              padding: '15px 20px',
              borderRadius: '12px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
              marginBottom: '30px'
            }}>
              <div>
                <h2 style={{ margin: '0', color: '#333' }}>Игра "Память: Ретро-гаджеты"</h2>
                <p style={{ margin: '5px 0 0', color: '#666' }}>Найдите все пары культовых электронных устройств</p>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ 
                  padding: '8px 15px', 
                  borderRadius: '8px', 
                  background: '#f0f8ff', 
                  color: '#333' 
                }}>
                  <span style={{ fontWeight: 'bold' }}>Счет: </span> {calculateScore(moves, timer)}
                </div>
                <div style={{ 
                  padding: '8px 15px', 
                  borderRadius: '8px', 
                  background: '#f0f8ff', 
                  color: '#333' 
                }}>
                  <span style={{ fontWeight: 'bold' }}>Время: </span> {formatTime(timer)}
                </div>
              </div>
            </div>
            
            {/* Информация о найденных парах */}
            {gameInfo && gameInfo.device && (
              <div style={{
                padding: '15px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <img 
                  src={gameInfo.image} 
                  alt={gameInfo.device} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <h3 style={{ margin: '0 0 5px', color: '#333' }}>{gameInfo.device}</h3>
                  <p style={{ margin: '0', color: '#666' }}>Год выпуска: {gameInfo.year}</p>
                </div>
              </div>
            )}
            
            <div className="uk-child-width-1-2 uk-child-width-1-4@s uk-grid-small" data-uk-grid>
              {cards.map((card, index) => (
                <div key={index}>
                  <div
                    className="card"
                    onClick={() => !card.flipped && !card.matched && handleCardClick(card.id)}
                    style={{
                      perspective: '1000px',
                      cursor: card.flipped || card.matched ? 'default' : 'pointer',
                      height: '150px',
                      width: '100%',
                      position: 'relative',
                      transform: card.matched ? 'scale(0.95)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                      }}
                    >
                      {/* Обратная сторона карты */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          backgroundColor: card.matched ? '#e0f7fa' : '#3498db',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '24px',
                        }}
                      >
                        <span uk-icon="icon: bolt; ratio: 2"></span>
                      </div>
                      {/* Лицевая сторона карты */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: '#fff',
                        }}
                      >
                        <img
                          src={card.image}
                          alt={card.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame; 