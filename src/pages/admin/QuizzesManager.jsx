import React, { useState, useEffect } from 'react';
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from '../../utils/api';

const QuizzesManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    difficulty: 'medium',
    questions: [{ 
      text: '', 
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке квизов');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      if (field === 'options') {
        newQuestions[index] = {
          ...newQuestions[index],
          options: value
        };
      } else if (field === 'correctAnswer') {
        newQuestions[index] = {
          ...newQuestions[index],
          correctAnswer: parseInt(value)
        };
      } else {
        newQuestions[index] = {
          ...newQuestions[index],
          [field]: value
        };
      }
      return { ...prev, questions: newQuestions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.image || !formData.difficulty) {
        throw new Error('Пожалуйста, заполните все обязательные поля');
      }

      // Validate questions
      if (!formData.questions || formData.questions.length === 0) {
        throw new Error('Добавьте хотя бы один вопрос');
      }

      for (const q of formData.questions) {
        if (!q.text || !q.options || q.options.length < 4) {
          throw new Error('Каждый вопрос должен иметь текст и 4 варианта ответа');
        }
        if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error('Каждый вопрос должен иметь правильный ответ (0-3)');
        }
      }

      const dataToSend = {
        ...formData,
        difficulty: formData.difficulty || 'medium',
        image: formData.image || 'https://placehold.co/600x400/cccccc/333333?text=Quiz'
      };

      console.log('Sending quiz data:', dataToSend);

      if (selectedQuiz) {
        await updateQuiz(selectedQuiz.id, dataToSend);
      } else {
        await createQuiz(dataToSend);
      }
      fetchQuizzes();
      resetForm();
    } catch (err) {
      console.error('Error saving quiz:', err.response?.data || err);
      setError(err.response?.data?.message || err.message || 'Ошибка при сохранении квиза');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот квиз?')) return;
    
    try {
      await deleteQuiz(id);
      fetchQuizzes();
    } catch (err) {
      setError('Ошибка при удалении квиза');
    }
  };

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      image: quiz.image,
      difficulty: quiz.difficulty,
      questions: quiz.questions
    });
  };

  const resetForm = () => {
    setSelectedQuiz(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      difficulty: 'medium',
      questions: [{ 
        text: '', 
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }]
    });
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{selectedQuiz ? 'Редактировать квиз' : 'Создать новый квиз'}</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Название:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Категория:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Изображение (URL) *:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Сложность:</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="easy">Лёгкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Вопросы:</label>
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '15px',
              marginBottom: '15px' 
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label>Вопрос {qIndex + 1}:</label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Варианты ответов:</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[oIndex] = e.target.value;
                        handleQuestionChange(qIndex, 'options', newOptions);
                      }}
                      required
                      style={{ flex: 1, padding: '8px' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input
                        type="checkbox"
                        checked={question.correctAnswer === oIndex}
                        onChange={(e) => {
                          handleQuestionChange(qIndex, 'correctAnswer', e.target.checked ? oIndex : undefined);
                        }}
                      />
                      Правильный
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Объяснение (необязательно):</label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    questions: prev.questions.filter((_, i) => i !== qIndex)
                  }));
                }}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Удалить вопрос
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                questions: [...prev.questions, {
                  text: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0,
                  explanation: ''
                }]
              }));
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Добавить вопрос
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {selectedQuiz ? 'Сохранить изменения' : 'Создать квиз'}
          </button>
          
          {selectedQuiz && (
            <button type="button" onClick={resetForm} style={{
              padding: '10px 20px',
              backgroundColor: '#gray',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <h2>Список квизов</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {quizzes.map(quiz => (
          <div key={quiz.id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{quiz.title}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>{quiz.description}</p>
            <div style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
              Категория: {quiz.category}
            </div>
            <div style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
              Вопросов: {quiz.questions?.length || 0}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(quiz)} style={{
                padding: '5px 10px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Редактировать
              </button>
              <button onClick={() => handleDelete(quiz.id)} style={{
                padding: '5px 10px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizzesManager; 