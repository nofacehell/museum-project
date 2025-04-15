import React, { useState, useEffect } from 'react';

const QuizGame = ({ quiz, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);

  // Пример вопросов для каждой викторины
  const quizQuestions = {
    1: [ // Искусство Древнего Мира
      {
        id: 1,
        question: "Какая цивилизация построила пирамиды в Гизе?",
        answers: ["Древний Египет", "Древний Рим", "Древняя Греция", "Месопотамия"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Какой материал чаще всего использовался для письма в Древнем Египте?",
        answers: ["Бумага", "Папирус", "Пергамент", "Береста"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Какое животное считалось священным в Древнем Египте?",
        answers: ["Лев", "Крокодил", "Кошка", "Все перечисленные"],
        correctAnswer: 3
      }
    ],
    2: [ // Эпоха Возрождения
      {
        id: 1,
        question: "Кто написал 'Тайную вечерю'?",
        answers: ["Микеланджело", "Леонардо да Винчи", "Рафаэль", "Донателло"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "В каком городе началось итальянское Возрождение?",
        answers: ["Рим", "Венеция", "Флоренция", "Милан"],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Кто расписал потолок Сикстинской капеллы?",
        answers: ["Микеланджело", "Леонардо да Винчи", "Рафаэль", "Боттичелли"],
        correctAnswer: 0
      }
    ],
    3: [ // Современное Искусство
      {
        id: 1,
        question: "Кто является автором картины 'Постоянство памяти' с тающими часами?",
        answers: ["Пабло Пикассо", "Сальвадор Дали", "Василий Кандинский", "Анри Матисс"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Какое направление в искусстве основал Казимир Малевич?",
        answers: ["Импрессионизм", "Кубизм", "Супрематизм", "Футуризм"],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Кто из художников отрезал себе ухо?",
        answers: ["Поль Гоген", "Винсент Ван Гог", "Эдуард Мане", "Клод Моне"],
        correctAnswer: 1
      }
    ],
    4: [ // Импрессионизм
      {
        id: 1,
        question: "Какая картина дала название импрессионизму?",
        answers: ["Водяные лилии", "Впечатление. Восходящее солнце", "Завтрак на траве", "Бульвар Капуцинок"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Кто из этих художников НЕ был импрессионистом?",
        answers: ["Клод Моне", "Пьер-Огюст Ренуар", "Поль Сезанн", "Пабло Пикассо"],
        correctAnswer: 3
      },
      {
        id: 3,
        question: "Какая особенность характерна для импрессионизма?",
        answers: ["Точная прорисовка деталей", "Передача мимолетного впечатления", "Использование темных тонов", "Геометрические формы"],
        correctAnswer: 1
      }
    ]
  };

  useEffect(() => {
    // Инициализация вопросов для текущей викторины
    const currentQuestions = quizQuestions[quiz.id] || [];
    setAnswers(new Array(currentQuestions.length).fill(null));
    
    // Установка таймера
    if (quiz.time) {
      const minutes = parseInt(quiz.time.split(' ')[0]);
      setTimeLeft(minutes * 60);
    }
  }, [quiz]);

  useEffect(() => {
    // Таймер обратного отсчета
    if (timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const questions = quizQuestions[quiz.id] || [];

  const handleAnswer = (answerIndex) => {
    if (!isAnswerConfirmed) {
      setSelectedAnswer(answerIndex);
    }
  };

  const confirmAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setIsAnswerConfirmed(true);
  };

  const goToNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setIsAnswerConfirmed(false);
    } else {
      setShowResults(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setIsAnswerConfirmed(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setIsAnswerConfirmed(false);
    if (quiz.time) {
      const minutes = parseInt(quiz.time.split(' ')[0]);
      setTimeLeft(minutes * 60);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        {timeLeft !== null && (
          <div className="quiz-timer">
            <span data-uk-icon="clock"></span>
            <span className="time-left">{formatTime(timeLeft)}</span>
          </div>
        )}
        <button 
          className="uk-button uk-button-default uk-button-small" 
          onClick={handleClose}
          type="button"
        >
          <span data-uk-icon="close"></span>
        </button>
      </div>

      {!showResults ? (
        <div className="quiz-content">
          <div className="quiz-progress">
            <div 
              className="quiz-progress-bar" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="quiz-question">
            <h3>{questions[currentQuestion].question}</h3>
            <div className="quiz-answers">
              {questions[currentQuestion].answers.map((answer, index) => (
                <button
                  key={index}
                  type="button"
                  className={`quiz-answer-btn ${
                    selectedAnswer === index 
                      ? isAnswerConfirmed
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'correct'
                          : 'incorrect'
                        : 'selected'
                      : ''
                  } ${
                    isAnswerConfirmed && index === questions[currentQuestion].correctAnswer
                      ? 'correct'
                      : ''
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswerConfirmed}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
          <div className="quiz-navigation">
            <button
              type="button"
              className="uk-button uk-button-default"
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <span className="uk-margin-small-right" data-uk-icon="arrow-left"></span>
              Предыдущий
            </button>
            {!isAnswerConfirmed ? (
              <button
                type="button"
                className="uk-button uk-button-primary"
                onClick={confirmAnswer}
                disabled={selectedAnswer === null}
              >
                Подтвердить
              </button>
            ) : (
              <button
                type="button"
                className="uk-button uk-button-primary"
                onClick={goToNextQuestion}
              >
                {currentQuestion === questions.length - 1 ? 'Завершить' : 'Следующий'}
                {currentQuestion !== questions.length - 1 && (
                  <span className="uk-margin-small-left" data-uk-icon="arrow-right"></span>
                )}
              </button>
            )}
          </div>
          <div className="quiz-info-bottom">
            <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
            <span>Правильных ответов: {score}</span>
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <h3>Результаты викторины</h3>
          <div className="quiz-score">
            <div className="score-circle">
              <span className="score-number">{Math.round((score / questions.length) * 100)}%</span>
              <span className="score-text">Правильных ответов</span>
            </div>
            <p>Вы ответили правильно на {score} из {questions.length} вопросов</p>
          </div>
          <button 
            type="button"
            className="uk-button uk-button-primary uk-width-1-1" 
            onClick={restartQuiz}
          >
            Пройти еще раз
            <span className="uk-margin-small-left" data-uk-icon="refresh"></span>
          </button>
          <button 
            type="button"
            className="uk-button uk-button-default uk-width-1-1 uk-margin-small-top" 
            onClick={handleClose}
          >
            Вернуться к списку викторин
            <span className="uk-margin-small-left" data-uk-icon="arrow-left"></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizGame; 