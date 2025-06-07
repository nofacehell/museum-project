import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrophy, FaRedo, FaImage } from 'react-icons/fa';
import '../../styles/computerAssemblyGame.css';

const COMPONENTS = [
  {
    id: 1,
    name: 'Процессор',
    image: 'https://i.imgur.com/JQpVwpN.jpg',
    description: 'Intel Pentium MMX 200MHz - легендарный процессор 1996 года',
    correctPosition: 1
  },
  {
    id: 2,
    name: 'Материнская плата',
    image: 'https://i.imgur.com/8BXuXxM.jpg',
    description: 'Материнская плата Socket 7 с чипсетом Intel 430TX',
    correctPosition: 2
  },
  {
    id: 3,
    name: 'Оперативная память',
    image: 'https://i.imgur.com/q2DkGXf.jpg',
    description: 'Модули памяти SIMM 72-pin EDO RAM',
    correctPosition: 3
  },
  {
    id: 4,
    name: 'Видеокарта',
    image: 'https://i.imgur.com/YWZkW3L.jpg',
    description: 'S3 ViRGE DX - популярная видеокарта 1996 года',
    correctPosition: 4
  },
  {
    id: 5,
    name: 'Жесткий диск',
    image: 'https://i.imgur.com/VK8QyPN.jpg',
    description: 'Seagate ST31277A - жесткий диск 1.2 GB IDE',
    correctPosition: 5
  },
  {
    id: 6,
    name: 'Блок питания',
    image: 'https://i.imgur.com/L5YqDPH.jpg',
    description: 'Блок питания AT 200W для старых компьютеров',
    correctPosition: 6
  }
];

const ComputerAssemblyGame = ({ onExit }) => {
  const [components, setComponents] = useState([]);
  const [placedComponents, setPlacedComponents] = useState(Array(COMPONENTS.length).fill(null));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [message, setMessage] = useState('');
  const [draggedComponent, setDraggedComponent] = useState(null);

  const initializeGame = () => {
    setComponents([...COMPONENTS].sort(() => Math.random() - 0.5));
    setPlacedComponents(Array(COMPONENTS.length).fill(null));
    setScore(0);
    setGameOver(false);
    setAttempts(0);
    setImageErrors({});
    setMessage('');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleImageError = (componentId) => {
    setImageErrors(prev => ({ ...prev, [componentId]: true }));
  };

  const handleDragStart = (e, component) => {
    setDraggedComponent(component);
    e.dataTransfer.setData('text/plain', ''); // Необходимо для Firefox
    const dragImage = new Image();
    dragImage.src = component.image;
    e.dataTransfer.setDragImage(dragImage, 50, 50);

    // Добавляем класс dragging для визуального эффекта
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedComponent(null);
  };

  const handleDragOver = (e, position) => {
    e.preventDefault();
    // Добавляем визуальный эффект при наведении
    if (!placedComponents[position]) {
      e.currentTarget.classList.add('can-drop');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('can-drop');
  };

  const handleDrop = (e, position) => {
    e.preventDefault();
    e.currentTarget.classList.remove('can-drop');
    
    if (!draggedComponent) return;
    
    // Проверяем, не занята ли позиция
    if (placedComponents[position]) {
      setMessage('Это место уже занято! Выберите другое.');
      e.currentTarget.classList.add('wrong-drop');
      setTimeout(() => {
        e.currentTarget.classList.remove('wrong-drop');
      }, 500);
      return;
    }

    setAttempts(prev => prev + 1);

    // Создаем новый массив размещенных компонентов
    const newPlacedComponents = [...placedComponents];
    newPlacedComponents[position] = draggedComponent;
    setPlacedComponents(newPlacedComponents);

    // Проверяем правильность размещения
    if (draggedComponent.correctPosition === position + 1) {
      setScore(prev => prev + 100);
      setMessage(`Отлично! ${draggedComponent.name} установлен правильно!`);
    } else {
      setScore(prev => Math.max(0, prev - 50));
      setMessage(`Неправильно! ${draggedComponent.name} должен быть установлен в другое место.`);
      e.currentTarget.classList.add('wrong-drop');
      setTimeout(() => {
        e.currentTarget.classList.remove('wrong-drop');
      }, 500);
    }

    // Проверяем завершение игры
    const allComponentsPlaced = newPlacedComponents.every(component => component !== null);
    const allCorrect = newPlacedComponents.every((component, index) => 
      component && component.correctPosition === index + 1
    );

    if (allComponentsPlaced && allCorrect) {
      setGameOver(true);
      setMessage('Поздравляем! Вы успешно собрали компьютер!');
    }
  };

  const startGame = () => {
    setShowInstructions(false);
    initializeGame();
  };

  if (showInstructions) {
    return (
      <div className="game-instructions">
        <div className="instructions-content">
          <div className="instructions-header">
            <h2>Собери компьютер</h2>
            <p className="game-description">
              Познакомьтесь с внутренним устройством компьютера 90-х годов! 
              В этой игре вы научитесь правильно собирать компьютер, 
              узнаете о назначении каждого компонента и их взаимодействии.
            </p>
          </div>
          
          <div className="instructions-image">
            <img src="https://i.imgur.com/NQjTxuL.jpg" alt="Сборка компьютера" onError={(e) => e.target.style.display = 'none'} />
          </div>

          <div className="game-details">
            <div className="detail-item">
              <h3>Правила игры:</h3>
              <p>
                Расположите компоненты компьютера в правильном порядке сборки. 
                За каждый правильно установленный компонент вы получаете 100 очков. 
                За ошибку при установке теряете 50 очков.
              </p>
            </div>

            <div className="detail-item">
              <h3>Порядок сборки:</h3>
              <ol>
                <li>Процессор - устанавливается первым в сокет на материнской плате</li>
                <li>Материнская плата - основа компьютера, соединяет все компоненты</li>
                <li>Оперативная память - временное хранилище данных для быстрого доступа</li>
                <li>Видеокарта - отвечает за формирование изображения на экране</li>
                <li>Жесткий диск - постоянное хранилище данных и программ</li>
                <li>Блок питания - обеспечивает электропитание всех компонентов</li>
              </ol>
            </div>

            <div className="detail-item">
              <h3>Советы:</h3>
              <ul>
                <li>Внимательно изучите описание каждого компонента</li>
                <li>Следите за правильной последовательностью установки</li>
                <li>Не торопитесь - важна точность, а не скорость</li>
              </ul>
            </div>
          </div>

          <div className="game-controls">
            <button className="control-button" onClick={startGame}>
              Начать игру
            </button>
            <button className="control-button exit" onClick={onExit}>
              <FaTimes /> Выход
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="computer-assembly-game">
      <div className="game-header">
        <div className="game-stats">
          <span className="stat-badge">Попытки: {attempts}</span>
          <span className="stat-badge">Очки: {score}</span>
        </div>
        {message && <div className="game-message">{message}</div>}
        <div className="game-controls">
          <button className="control-button" onClick={initializeGame}>
            <FaRedo /> Новая игра
          </button>
          <button className="control-button exit" onClick={onExit}>
            <FaTimes /> Выход
          </button>
        </div>
      </div>

      <div className="game-board">
        <div className="components-pool">
          <h3>Доступные компоненты</h3>
          <div className="component-grid">
            {components
              .filter(component => !placedComponents.includes(component))
              .map(component => (
                <div
                  key={component.id}
                  className="component-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  onDragEnd={handleDragEnd}
                >
                  {imageErrors[component.id] ? (
                    <div className="image-placeholder">
                      <FaImage className="placeholder-icon" />
                      <span>{component.name}</span>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={component.image} 
                        alt={component.name}
                        onError={() => handleImageError(component.id)}
                      />
                      <div className="component-info">
                        <h4>{component.name}</h4>
                        <p>{component.description}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="assembly-area">
          <h3>Область сборки</h3>
          <div className="assembly-slots">
            {placedComponents.map((component, index) => (
              <div
                key={index}
                className={`assembly-slot ${component ? 'filled' : ''}`}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                {component ? (
                  <div className="placed-component">
                    {imageErrors[component.id] ? (
                      <div className="image-placeholder">
                        <FaImage className="placeholder-icon" />
                        <span>{component.name}</span>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={component.image} 
                          alt={component.name}
                          onError={() => handleImageError(component.id)}
                        />
                        <div className="component-info">
                          <h4>{component.name}</h4>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <span>Слот {index + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <div className="trophy-icon">
            <FaTrophy />
          </div>
          <h2>Поздравляем!</h2>
          <p>Вы успешно собрали компьютер!</p>
          <p>Количество попыток: {attempts}</p>
          <p>Итоговый счет: {score}</p>
          <button className="control-button" onClick={initializeGame}>
            <FaRedo /> Играть снова
          </button>
        </div>
      )}
    </div>
  );
};

export default ComputerAssemblyGame; 