import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "uikit/dist/css/uikit.min.css";
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";

// Подключаем иконки UIkit
UIkit.use(Icons);

const AncientArtQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 минут

  const questions = [
    {
      question: "Какая цивилизация построила пирамиды в Гизе?",
      answers: ["Древний Египет", "Древний Рим", "Древняя Греция", "Месопотамия"],
      correctAnswer: 0
    },
    {
      question: "Какой материал чаще всего использовался для письма в Древнем Египте?",
      answers: ["Бумага", "Папирус", "Пергамент", "Береста"],
      correctAnswer: 1
    },
    {
      question: "Какое животное считалось священным в Древнем Египте?",
      answers: ["Лев", "Крокодил", "Кошка", "Все перечисленные"],
      correctAnswer: 3
    },
    {
      question: "Какой древний правитель известен строительством Висячих садов?",
      answers: ["Рамзес II", "Навуходоносор II", "Александр Македонский", "Хаммурапи"],
      correctAnswer: 1
    },
    {
      question: "Где находится Великий Сфинкс?",
      answers: ["Луксор", "Гиза", "Карнак", "Абу-Симбел"],
      correctAnswer: 1
    }
  ];

  useEffect(() => {
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
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answerIndex) => {
    if (!isAnswerConfirmed) {
      setSelectedAnswer(answerIndex);
    }
  };

  const confirmAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setIsAnswerConfirmed(true);
  };

  const goToNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
    } else {
      setShowResults(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsAnswerConfirmed(false);
    setTimeLeft(600);
  };

  return (
    <div className="uk-section uk-section-default">
      <div className="uk-container uk-container-small">
        <div className="quiz-game">
          <div className="quiz-header">
            <h2>Искусство Древнего Мира</h2>
            <div className="quiz-timer">
              <span data-uk-icon="clock"></span>
              <span className="time-left">{formatTime(timeLeft)}</span>
            </div>
            <button 
              className="uk-button uk-button-default uk-button-small" 
              onClick={() => navigate('/quizzes')}
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
                  className="uk-button uk-button-default"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  <span className="uk-margin-small-right" data-uk-icon="arrow-left"></span>
                  Предыдущий
                </button>
                {!isAnswerConfirmed ? (
                  <button
                    className="uk-button uk-button-primary"
                    onClick={confirmAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Подтвердить
                  </button>
                ) : (
                  <button
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
                className="uk-button uk-button-primary uk-width-1-1" 
                onClick={restartQuiz}
              >
                Пройти еще раз
                <span className="uk-margin-small-left" data-uk-icon="refresh"></span>
              </button>
              <button 
                className="uk-button uk-button-default uk-width-1-1 uk-margin-small-top" 
                onClick={() => navigate('/quizzes')}
              >
                Вернуться к списку викторин
                <span className="uk-margin-small-left" data-uk-icon="arrow-left"></span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AncientArtQuiz; 