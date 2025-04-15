import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/quiz.css';
import { getQuizById } from '../utils/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Загрузка данных викторины
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем викторину по ID через API
        const quizData = await getQuizById(id);
        
        if (quizData) {
          setQuiz(quizData);
          // Установим таймер, если он определен в викторине
          if (quizData.timeLimit) {
            setTimeLeft(quizData.timeLimit);
            setTimerActive(true);
          }
        } else {
          throw new Error('Викторина не найдена');
        }
      } catch (err) {
        console.error('Ошибка при загрузке викторины:', err);
        setError('Не удалось загрузить викторину. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadQuiz();
    }
    
    // Инициализация AOS (Animation On Scroll)
    AOS.init({
      duration: 600,
      once: true,
    });
  }, [id]);

  // Эффект для таймера
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            handleTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  // Обработка истечения времени
  const handleTimeUp = () => {
    setTimerActive(false);
    setCompleted(true);
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswerCorrect !== null) return; // Не даем выбрать другой ответ после проверки
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    // Находим текущий вопрос
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    // Проверяем, правильный ли ответ выбран
    // API может возвращать правильный ответ в разных форматах:
    // - либо как индекс правильного ответа в массиве options
    // - либо как булевое значение isCorrect в каждом варианте ответа
    let correct = false;
    
    if (typeof currentQuestion.correctAnswerIndex === 'number') {
      // Если указан индекс правильного ответа
      correct = selectedAnswer === currentQuestion.correctAnswerIndex;
    } else if (Array.isArray(currentQuestion.options) && 
               currentQuestion.options[selectedAnswer]?.isCorrect) {
      // Если в опциях есть поле isCorrect
      correct = currentQuestion.options[selectedAnswer].isCorrect;
    }
    
    setIsAnswerCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      setCompleted(true);
      setTimerActive(false); // Останавливаем таймер при завершении
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setScore(0);
    setCompleted(false);
    
    // Перезапускаем таймер, если он был определен в викторине
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit);
      setTimerActive(true);
    }
  };

  if (loading) {
    return (
      <div className="uk-container uk-margin-large-top uk-text-center">
        <div uk-spinner="ratio: 2"></div>
        <p className="uk-text-lead">Загрузка викторины...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="uk-container uk-margin-large-top uk-text-center">
        <div className="uk-alert uk-alert-danger">
          <h3>Ошибка</h3>
          <p>{error}</p>
          <button 
            className="uk-button uk-button-primary uk-margin-small-top" 
            onClick={() => navigate('/quizzes')}
          >
            Вернуться к списку викторин
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="uk-container uk-margin-large-top uk-text-center">
        <div className="uk-alert uk-alert-warning">
          <h3>Викторина не найдена</h3>
          <p>Запрошенная викторина не существует или была удалена.</p>
          <button 
            className="uk-button uk-button-primary uk-margin-small-top" 
            onClick={() => navigate('/quizzes')}
          >
            Вернуться к списку викторин
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    let resultMessage = '';
    let resultClass = '';
    
    if (percentage >= 80) {
      resultMessage = 'Отличный результат! Вы настоящий эксперт!';
      resultClass = 'high-score';
    } else if (percentage >= 60) {
      resultMessage = 'Хороший результат! Вы многое знаете!';
      resultClass = 'medium-score';
    } else {
      resultMessage = 'Неплохо, но есть куда расти!';
      resultClass = 'low-score';
    }

    return (
      <div className="uk-container uk-container-small quiz-container">
        <div className="quiz-result-card">
          <h2 className="quiz-result-title">Результаты викторины</h2>
          <div className="quiz-result-score-container">
            <div className={`quiz-result-score ${resultClass}`}>
              {score} / {quiz.questions.length}
            </div>
            <div className="quiz-result-percentage">
              {percentage}%
            </div>
          </div>
          <p className="quiz-result-message">{resultMessage}</p>
          
          <div className="quiz-stats">
            <div className="quiz-stat-item">
              <span className="quiz-stat-label">Викторина:</span>
              <span className="quiz-stat-value">{quiz.title}</span>
            </div>
            <div className="quiz-stat-item">
              <span className="quiz-stat-label">Категория:</span>
              <span className="quiz-stat-value">{quiz.category}</span>
            </div>
            <div className="quiz-stat-item">
              <span className="quiz-stat-label">Вопросов:</span>
              <span className="quiz-stat-value">{quiz.questions.length}</span>
            </div>
          </div>
          
          <div className="quiz-result-actions">
            <button 
              className="uk-button uk-button-primary uk-button-large" 
              onClick={restartQuiz}
            >
              Пройти ещё раз
            </button>
            <button 
              className="uk-button uk-button-default uk-button-large" 
              onClick={() => navigate('/quizzes')}
            >
              К списку викторин
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Текущий вопрос
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="uk-container uk-container-small quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="quiz-title">{quiz.title}</h2>
          <div className="quiz-progress">
            <div 
              className="quiz-progress-bar" 
              style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="quiz-meta">
            <span className="quiz-question-counter">
              Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </span>
            {timeLeft > 0 && (
              <span className={`quiz-timer ${timeLeft < 10 ? 'quiz-timer-warning' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
        
        <div className="quiz-question">
          <h3 className="quiz-question-text">{currentQuestion.question}</h3>
          
          {currentQuestion.image && (
            <div className="quiz-question-image-container">
              <img 
                src={currentQuestion.image} 
                alt={`Иллюстрация к вопросу ${currentQuestionIndex + 1}`} 
                className="quiz-question-image"
              />
            </div>
          )}
          
          <div className="quiz-options">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`quiz-option ${selectedAnswer === index ? 'selected' : ''} ${
                  isAnswerCorrect !== null && index === selectedAnswer 
                    ? isAnswerCorrect 
                      ? 'correct' 
                      : 'incorrect' 
                    : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="quiz-option-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="quiz-option-text">
                  {option.text || option}
                </div>
                {isAnswerCorrect !== null && index === selectedAnswer && (
                  <div className="quiz-option-icon">
                    {isAnswerCorrect 
                      ? <span uk-icon="icon: check; ratio: 1.2"></span> 
                      : <span uk-icon="icon: close; ratio: 1.2"></span>
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="quiz-actions">
          {isAnswerCorrect === null ? (
            <button 
              className="uk-button uk-button-primary uk-button-large"
              disabled={selectedAnswer === null}
              onClick={checkAnswer}
            >
              Проверить ответ
            </button>
          ) : (
            <button 
              className="uk-button uk-button-primary uk-button-large"
              onClick={goToNextQuestion}
            >
              {currentQuestionIndex < quiz.questions.length - 1 
                ? 'Следующий вопрос' 
                : 'Завершить викторину'
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 