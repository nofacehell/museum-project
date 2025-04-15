import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import { getGameById, createGame, updateGame } from '../../utils/api';

const GameEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState({
    title: '',
    description: '',
    shortDescription: '',
    type: 'puzzle',
    difficulty: 'easy',
    thumbnail: '',
    featured: false,
    estimatedTime: 15
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isNewGame = id === 'new' || !id;

  useEffect(() => {
    if (isNewGame) {
      setLoading(false);
      return;
    }

    const loadGame = async () => {
      try {
        setLoading(true);
        const foundGame = await getGameById(id);
        
        if (!foundGame) {
          setError('Игра не найдена');
          setLoading(false);
          return;
        }

        setGame(foundGame);
        setLoading(false);
      } catch (err) {
        console.error("GameEdit: Ошибка при загрузке:", err);
        setError('Ошибка при загрузке игры');
        setLoading(false);
      }
    };

    loadGame();
  }, [id, isNewGame]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isNewGame) {
        // Создание новой игры через API
        await createGame(game);
        
        UIkit.notification({
          message: 'Игра успешно создана',
          status: 'success',
          pos: 'top-center',
          timeout: 3000
        });
      } else {
        // Обновление существующей игры через API
        await updateGame(id, game);
        
        UIkit.notification({
          message: 'Игра успешно обновлена',
          status: 'success',
          pos: 'top-center',
          timeout: 3000
        });
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("GameEdit: Ошибка при сохранении:", err);
      UIkit.notification({
        message: 'Ошибка при сохранении игры: ' + (err.response?.data?.message || err.message),
        status: 'danger',
        pos: 'top-center',
        timeout: 3000
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGame({ ...game, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="uk-container">
        <div className="uk-text-center">
          <div className="uk-spinner" data-uk-spinner="ratio: 2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="uk-container">
        <div className="uk-alert uk-alert-danger">
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
    <div className="uk-container">
      <h1 className="uk-heading-medium">
        {isNewGame ? 'Создание новой игры' : 'Редактирование игры'}
      </h1>
      
      <form onSubmit={handleSubmit} className="uk-form-stacked">
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="title">Название игры</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="title"
              type="text"
              value={game.title}
              onChange={(e) => setGame({ ...game, title: e.target.value })}
              required
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
              value={game.description}
              onChange={(e) => setGame({ ...game, description: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="category">Категория</label>
          <div className="uk-form-controls">
            <select
              className="uk-select"
              id="category"
              value={game.category}
              onChange={(e) => setGame({ ...game, category: e.target.value })}
              required
            >
              <option value="головоломка">Головоломка</option>
              <option value="викторина">Викторина</option>
              <option value="пазл">Пазл</option>
              <option value="другое">Другое</option>
            </select>
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="difficulty">Сложность</label>
          <div className="uk-form-controls">
            <select
              className="uk-select"
              id="difficulty"
              value={game.difficulty}
              onChange={(e) => setGame({ ...game, difficulty: e.target.value })}
              required
            >
              <option value="лёгкий">Лёгкий</option>
              <option value="средний">Средний</option>
              <option value="сложный">Сложный</option>
            </select>
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="image">Изображение</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {game.image && (
              <div className="uk-margin-small-top">
                <img
                  src={game.image}
                  alt={game.title}
                  className="uk-width-1-3"
                />
              </div>
            )}
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="link">Ссылка на игру</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="link"
              type="url"
              value={game.link}
              onChange={(e) => setGame({ ...game, link: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="uk-margin">
          <button type="submit" className="uk-button uk-button-primary">
            {isNewGame ? 'Создать игру' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            className="uk-button uk-button-default uk-margin-left"
            onClick={() => navigate('/admin/dashboard')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameEdit; 