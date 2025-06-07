import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import { getQuizById, createQuiz, updateQuiz } from '../../utils/api';
import '../../styles/fileUpload.css';

const QuizEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'История',
    difficulty: 'medium',
    minAge: 10,
    estimatedTime: 15,
    featured: false,
    image: '',
    questions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isNewQuiz = id === 'new' || !id;

  useEffect(() => {
    if (isNewQuiz) {
      setLoading(false);
      return;
    }

    const loadQuiz = async () => {
      try {
        setLoading(true);
        const foundQuiz = await getQuizById(id);
        
        if (!foundQuiz) {
          setError('Квиз не найден');
          setLoading(false);
          return;
        }

        setQuiz(foundQuiz);
        setLoading(false);
      } catch (err) {
        console.error("QuizEdit: Ошибка при загрузке:", err);
        setError('Ошибка при загрузке квиза');
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, isNewQuiz]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isNewQuiz) {
        // Создание нового квиза через API
        await createQuiz(quiz);
        
        UIkit.notification({
          message: 'Квиз успешно создан',
          status: 'success',
          pos: 'top-center',
          timeout: 3000
        });
      } else {
        // Обновление существующего квиза через API
        await updateQuiz(id, quiz);
        
        UIkit.notification({
          message: 'Квиз успешно обновлен',
          status: 'success',
          pos: 'top-center',
          timeout: 3000
        });
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("QuizEdit: Ошибка при сохранении:", err);
      UIkit.notification({
        message: 'Ошибка при сохранении квиза: ' + (err.response?.data?.message || err.message),
        status: 'danger',
        pos: 'top-center',
        timeout: 3000
      });
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuiz({ ...quiz, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setQuiz({ ...quiz, image: '' });
  };

  if (loading) {
    return (
      <div className="uk-container uk-container-small uk-margin-large-top">
        <div className="uk-text-center">
          <div uk-spinner="ratio: 2"></div>
          <p className="uk-margin-small-top uk-text-muted">Загрузка квиза...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="uk-container uk-container-small uk-margin-large-top">
        <div className="uk-alert-danger" uk-alert="true">
          <p>{error}</p>
        </div>
        <button 
          className="uk-button uk-button-default" 
          onClick={() => navigate('/admin/dashboard')}
        >
          Вернуться в панель администратора
        </button>
      </div>
    );
  }

  return (
    <div className="uk-container uk-container-small uk-margin-large-top">
      <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
        <h1 className="uk-card-title uk-heading-divider">
          {isNewQuiz ? 'Создание нового квиза' : 'Редактирование квиза'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="uk-form-stacked">
        {/* Основная информация */}
        <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
          <h3 className="uk-card-title">Основная информация</h3>
          
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="title">Название квиза</label>
            <div className="uk-form-controls">
              <input
                className="uk-input"
                id="title"
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                required
                placeholder="Введите название квиза"
              />
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="description">Описание</label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea"
                id="description"
                rows="5"
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                required
                placeholder="Введите описание квиза"
              ></textarea>
            </div>
          </div>

          <div className="uk-grid-small" uk-grid="true">
            <div className="uk-width-1-2@m">
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="difficulty">Сложность</label>
                <div className="uk-form-controls">
                  <select
                    className="uk-select"
                    id="difficulty"
                    value={quiz.difficulty}
                    onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}
                    required
                  >
                    <option value="easy">Лёгкий</option>
                    <option value="medium">Средний</option>
                    <option value="hard">Сложный</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-2@m">
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="category">Категория</label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    id="category"
                    type="text"
                    value={quiz.category}
                    onChange={(e) => setQuiz({ ...quiz, category: e.target.value })}
                    required
                    placeholder="Введите категорию"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Изображение обложки */}
        <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
          <h3 className="uk-card-title">Изображение обложки</h3>
          <div className="file-upload-container">
            {quiz.image ? (
              <div className="image-preview-container">
                <img 
                  src={quiz.image} 
                  alt="Предпросмотр" 
                  className="image-preview"
                />
                <button 
                  type="button" 
                  className="uk-button uk-button-danger uk-button-small image-remove-btn" 
                  onClick={removeImage}
                  uk-tooltip="Удалить изображение"
                >
                  <span uk-icon="icon: close"></span>
                </button>
              </div>
            ) : (
              <div className="file-upload-area">
                <div className="file-upload-content">
                  <span uk-icon="icon: cloud-upload; ratio: 2"></span>
                  <p>Перетащите сюда изображение или нажмите для загрузки</p>
                  <input 
                    type="file" 
                    id="quiz-image" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="file-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Вопросы */}
        <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
          <div className="uk-flex uk-flex-middle uk-margin-bottom">
            <h3 className="uk-card-title uk-margin-remove-bottom">Вопросы</h3>
            <button
              type="button"
              className="uk-button uk-button-primary uk-margin-left"
              onClick={addQuestion}
            >
              <span uk-icon="icon: plus"></span> Добавить вопрос
            </button>
          </div>

          <div className="uk-form-controls">
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="uk-card uk-card-default uk-card-body uk-margin">
                <div className="uk-flex uk-flex-middle uk-margin-bottom">
                  <h4 className="uk-card-title uk-margin-remove-bottom">Вопрос {qIndex + 1}</h4>
                  <button
                    type="button"
                    className="uk-button uk-button-danger uk-button-small uk-margin-left"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <span uk-icon="icon: trash"></span>
                  </button>
                </div>

                <div className="uk-margin">
                  <label className="uk-form-label">Текст вопроса</label>
                  <div className="uk-form-controls">
                    <input
                      className="uk-input"
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      required
                      placeholder="Введите текст вопроса"
                    />
                  </div>
                </div>

                <div className="uk-margin">
                  <label className="uk-form-label">Варианты ответов</label>
                  <div className="uk-form-controls">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="uk-margin-small">
                        <div className="uk-inline uk-width-1-1">
                          <input
                            className="uk-input"
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[oIndex] = e.target.value;
                              handleQuestionChange(qIndex, 'options', newOptions);
                            }}
                            required
                            placeholder={`Вариант ответа ${oIndex + 1}`}
                          />
                        </div>
                        <div className="uk-form-controls uk-margin-small-top">
                          <label className="uk-form-label">
                            <input
                              className="uk-radio"
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                            />
                            <span className="uk-margin-small-left">Правильный ответ</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="uk-margin uk-flex uk-flex-middle">
          <button type="submit" className="uk-button uk-button-primary">
            <span uk-icon="icon: check"></span>
            <span className="uk-margin-small-left">
              {isNewQuiz ? 'Создать квиз' : 'Сохранить изменения'}
            </span>
          </button>
          <button
            type="button"
            className="uk-button uk-button-default uk-margin-left"
            onClick={() => navigate('/admin/dashboard')}
          >
            <span uk-icon="icon: close"></span>
            <span className="uk-margin-small-left">Отмена</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizEdit; 