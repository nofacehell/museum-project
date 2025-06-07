import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuiz } from '../utils/api';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/quiz.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Загрузка данных викторины
  useEffect(() => {
    console.log('QuizPage: Current quiz ID:', id);
    
    const loadQuiz = async () => {
      if (!id) {
        console.error('QuizPage: No quiz ID provided');
        setError('ID викторины не указан');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('QuizPage: Fetching quiz with ID:', id);
        // Получаем викторину по ID через API
        const quizData = await fetchQuiz(id);
        console.log('QuizPage: Received quiz data:', quizData);
        
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

    loadQuiz();
    
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

  const handleOptionSelect = (option) => {
    if (!isChecked) {
      setSelectedOption(option);
    }
  };

  const checkAnswer = () => {
    if (selectedOption !== null) {
      const correct = selectedOption === quiz.questions[currentQuestionIndex].correctAnswer;
      setIsCorrect(correct);
      setIsChecked(true);
      if (correct) {
        setScore(score + 1);
      }
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      setCompleted(true);
      setTimerActive(false); // Останавливаем таймер при завершении
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
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
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2>{quiz.title}</h2>
          <div className="quiz-progress">
            <div className="quiz-progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </span>
          </div>
          {timeLeft > 0 && (
            <div className={`quiz-timer ${timeLeft < 10 ? 'warning' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className="quiz-content">
          <div className="quiz-question">
            <h3>{currentQuestion.text || currentQuestion.question}</h3>
            
            {currentQuestion.image && (
              <div className="question-image">
                <img 
                  src={currentQuestion.image} 
                  alt="Изображение к вопросу" 
                  className="question-img"
                />
              </div>
            )}

            <div className="options-grid">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedOption === index ? 'selected' : ''} 
                    ${isChecked ? (index === currentQuestion.correctAnswer ? 'correct' : 
                      selectedOption === index ? 'incorrect' : '') : ''}`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isChecked}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {isChecked && index === currentQuestion.correctAnswer && (
                    <FaCheck className="result-icon correct" />
                  )}
                  {isChecked && selectedOption === index && index !== currentQuestion.correctAnswer && (
                    <FaTimes className="result-icon incorrect" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-actions">
            <button
              className="check-answer-button"
              onClick={checkAnswer}
              disabled={selectedOption === null || isChecked}
            >
              {isChecked ? 'Ответ проверен' : 'Проверить ответ'}
            </button>

            {isChecked && (
              <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? 'Правильно! Молодец!' : 'Неправильно. Попробуйте еще раз!'}
              </div>
            )}

            {isChecked && (
              <button 
                className="next-question-button"
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
    </div>
  );
};

export default QuizPage; 