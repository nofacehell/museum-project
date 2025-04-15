import React, { useState, useEffect } from 'react';
import questionsData from '../data/artistGameData';

const ArtistGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  
  const questions = questionsData;
  const totalQuestions = questions.length;

  // Перемешивание вариантов ответов
  useEffect(() => {
    if (questions[currentQuestion]) {
      // Создаем массив с правильной компанией и 3 случайными
      const correctCompany = questions[currentQuestion].artist;
      
      // Берем все названия компаний, кроме правильной
      const otherCompanies = questions
        .map(q => q.artist)
        .filter(company => company !== correctCompany);
      
      // Выбираем 3 случайных компании из списка
      const wrongCompanies = [];
      for (let i = 0; i < 3; i++) {
        if (otherCompanies.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherCompanies.length);
          wrongCompanies.push(otherCompanies[randomIndex]);
          otherCompanies.splice(randomIndex, 1);
        }
      }
      
      // Объединяем правильный ответ с неправильными и перемешиваем
      const allAnswers = [correctCompany, ...wrongCompanies];
      setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
    }
  }, [currentQuestion, questions]);

  const handleAnswer = (selectedCompany) => {
    setSelectedAnswer(selectedCompany);
    setAnswered(true);
    
    if (selectedCompany === questions[currentQuestion].artist) {
      setScore(score + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setGameOver(true);
    }
  };

  return (
    <div className="artist-game-container" style={{ 
      padding: '100px 0 40px',
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
              maxWidth: '600px',
              margin: '40px auto'
            }}
          >
            <h2 style={{ color: '#333' }}>Игра окончена!</h2>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>Ваш результат: {score} из {totalQuestions}</p>
            
            <div style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'space-around', 
              margin: '20px 0' 
            }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '15px', 
                borderRadius: '10px', 
                background: '#f0f8ff',
                width: '30%' 
              }}>
                <p style={{ margin: '0', color: '#666' }}>Правильных</p>
                <h3 style={{ margin: '10px 0 0', color: '#333' }}>{score}</h3>
              </div>
              <div style={{ 
                textAlign: 'center', 
                padding: '15px', 
                borderRadius: '10px', 
                background: '#f0f8ff',
                width: '30%' 
              }}>
                <p style={{ margin: '0', color: '#666' }}>Неправильных</p>
                <h3 style={{ margin: '10px 0 0', color: '#333' }}>{totalQuestions - score}</h3>
              </div>
            </div>
            
            <p style={{ color: '#666', margin: '20px 0' }}>
              {score === totalQuestions 
                ? 'Отлично! Вы превосходно знаете историю электроники!' 
                : score > totalQuestions / 2 
                  ? 'Хороший результат! Вы хорошо знаете производителей электроники.' 
                  : 'Вы можете улучшить свой результат. Попробуйте еще раз!'}
            </p>
            
            <button 
              onClick={() => window.location.reload()}
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
                <h2 style={{ margin: '0', color: '#333' }}>Кто производитель?</h2>
                <p style={{ margin: '5px 0 0', color: '#666' }}>
                  Угадайте, какая компания создала это устройство
                </p>
              </div>
              <div style={{ 
                padding: '8px 15px', 
                borderRadius: '8px', 
                background: '#f0f8ff', 
                color: '#333' 
              }}>
                <span style={{ fontWeight: 'bold' }}>Вопрос: </span> 
                {currentQuestion + 1} из {totalQuestions}
              </div>
            </div>
            
            <div 
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                marginBottom: '30px'
              }}
            >
              <div style={{ 
                height: '400px',
                position: 'relative'
              }}>
                <img 
                  src={questions[currentQuestion].image} 
                  alt="Electronic device" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    background: 'white',
                    padding: '20px'
                  }}
                />
              </div>
              
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  margin: '0 0 10px', 
                  color: '#333',
                  textAlign: 'center' 
                }}>
                  {questions[currentQuestion].title}
                </h3>
              </div>
            </div>
            
            <div className="uk-grid uk-child-width-1-2@s uk-grid-small" data-uk-grid>
              {shuffledAnswers.map((company, index) => (
                <div key={index}>
                  <button 
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: answered
                        ? company === questions[currentQuestion].artist
                          ? 'linear-gradient(145deg, #4ed9a6 0%, #3dd991 100%)'
                          : selectedAnswer === company && selectedAnswer !== questions[currentQuestion].artist
                            ? 'linear-gradient(145deg, #d94e4e 0%, #d93d3d 100%)'
                            : 'white'
                        : 'white',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      textAlign: 'left',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => !answered && handleAnswer(company)}
                    className="uk-flex uk-flex-middle"
                    disabled={answered}
                  >
                    <div style={{
                      marginRight: '15px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      background: answered
                        ? company === questions[currentQuestion].artist
                          ? 'rgba(255, 255, 255, 0.3)'
                          : selectedAnswer === company && selectedAnswer !== questions[currentQuestion].artist
                            ? 'rgba(255, 255, 255, 0.3)'
                            : '#f0f8ff'
                        : '#f0f8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: answered
                        ? company === questions[currentQuestion].artist || 
                           (selectedAnswer === company && selectedAnswer !== questions[currentQuestion].artist)
                          ? 'white'
                          : '#333'
                        : '#333'
                    }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span style={{ 
                      fontSize: '1.1rem',
                      color: answered
                        ? company === questions[currentQuestion].artist || 
                           (selectedAnswer === company && selectedAnswer !== questions[currentQuestion].artist)
                          ? 'white'
                          : '#333'
                        : '#333'
                    }}>
                      {company}
                    </span>
                    
                    {answered && company === questions[currentQuestion].artist && (
                      <span 
                        style={{ 
                          position: 'absolute', 
                          right: '20px',
                          color: 'white' 
                        }} 
                        uk-icon="icon: check; ratio: 1.2"
                      ></span>
                    )}
                    
                    {answered && selectedAnswer === company && company !== questions[currentQuestion].artist && (
                      <span 
                        style={{ 
                          position: 'absolute', 
                          right: '20px',
                          color: 'white' 
                        }} 
                        uk-icon="icon: close; ratio: 1.2"
                      ></span>
                    )}
                  </button>
                </div>
              ))}
            </div>
            
            {answered && (
              <div 
                style={{
                  marginTop: '30px',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                }}
              >
                <h3 style={{ margin: '0 0 10px', color: '#333' }}>
                  {selectedAnswer === questions[currentQuestion].artist 
                    ? 'Правильно!' 
                    : 'Неправильно!'}
                </h3>
                <p style={{ margin: '0 0 15px', color: '#666' }}>
                  {questions[currentQuestion].description}
                </p>
                <button 
                  onClick={goToNextQuestion}
                  style={{
                    padding: '10px 25px',
                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {currentQuestion < totalQuestions - 1 ? 'Следующий вопрос' : 'Завершить игру'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistGame; 