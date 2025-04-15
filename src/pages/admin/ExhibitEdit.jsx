import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import { getExhibitById, createExhibit, updateExhibit } from '../../utils/api';

const ExhibitEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exhibit, setExhibit] = useState({
    title: '',
    category: 'Компьютеры',
    description: '',
    shortDescription: '',
    image: '',
    year: '',
    manufacturer: '',
    technicalSpecs: {},
    historicalContext: '',
    additionalImages: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isNewExhibit = id === 'new' || !id;

  useEffect(() => {
    if (isNewExhibit) {
      setLoading(false);
      return;
    }

    const loadExhibit = async () => {
      try {
        setLoading(true);
        const foundExhibit = await getExhibitById(id);
        
        if (!foundExhibit) {
          setError('Экспонат не найден');
          setLoading(false);
          return;
        }

        // Ensure text fields are never null
        const sanitizedExhibit = {
          ...foundExhibit,
          description: foundExhibit.description || '',
          shortDescription: foundExhibit.shortDescription || '',
          historicalContext: foundExhibit.historicalContext || '',
          year: foundExhibit.year || '',
          manufacturer: foundExhibit.manufacturer || ''
        };

        setExhibit(sanitizedExhibit);
        setLoading(false);
      } catch (err) {
        console.error("ExhibitEdit: Ошибка при загрузке:", err);
        setError('Ошибка при загрузке экспоната');
        setLoading(false);
      }
    };

    loadExhibit();
  }, [id, isNewExhibit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Добавляем все поля экспоната в FormData
      Object.keys(exhibit).forEach(key => {
        if (key === 'technicalSpecs' || key === 'additionalImages') {
          formData.append(key, JSON.stringify(exhibit[key]));
        } else if (key !== 'image') {
          formData.append(key, exhibit[key]);
        }
      });
      
      // Добавляем файл изображения, если он есть
      if (imageFile) {
        console.log('Adding image file to FormData:', imageFile);
        formData.append('image', imageFile);
      }
      
      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }
      
      let result;
      if (isNewExhibit) {
        result = await createExhibit(formData);
        
        UIkit.notification({
          message: 'Экспонат успешно создан',
          status: 'success',
          pos: 'top-center',
          timeout: 3000
        });
      } else {
        result = await updateExhibit(id, formData);
        
        UIkit.notification({
          message: 'Экспонат успешно обновлен',
          status: 'success',
          pos: 'top-center',
          timeout: 3000
        });
      }
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("ExhibitEdit: Ошибка при сохранении:", err);
      UIkit.notification({
        message: 'Ошибка при сохранении экспоната: ' + (err.response?.data?.message || err.message),
        status: 'danger',
        pos: 'top-center',
        timeout: 3000
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Создаем URL для предпросмотра
      const previewUrl = URL.createObjectURL(file);
      setExhibit(prev => ({ ...prev, image: previewUrl }));
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
        {isNewExhibit ? 'Создание нового экспоната' : 'Редактирование экспоната'}
      </h1>
      
      <form onSubmit={handleSubmit} className="uk-form-stacked">
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="title">Название экспоната</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="title"
              type="text"
              value={exhibit.title}
              onChange={(e) => setExhibit({ ...exhibit, title: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="shortDescription">Краткое описание</label>
          <div className="uk-form-controls">
            <textarea
              className="uk-textarea"
              id="shortDescription"
              rows="2"
              value={exhibit.shortDescription || ''}
              onChange={(e) => setExhibit({ ...exhibit, shortDescription: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="description">Полное описание</label>
          <div className="uk-form-controls">
            <textarea
              className="uk-textarea"
              id="description"
              rows="5"
              value={exhibit.description || ''}
              onChange={(e) => setExhibit({ ...exhibit, description: e.target.value })}
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
              value={exhibit.category}
              onChange={(e) => setExhibit({ ...exhibit, category: e.target.value })}
              required
            >
              <option value="Компьютеры">Компьютеры</option>
              <option value="Аудиотехника">Аудиотехника</option>
              <option value="Телефоны">Телефоны</option>
              <option value="Игровые консоли">Игровые консоли</option>
              <option value="Другое">Другое</option>
            </select>
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="year">Год</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="year"
              type="text"
              value={exhibit.year || ''}
              onChange={(e) => setExhibit({ ...exhibit, year: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="manufacturer">Производитель</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="manufacturer"
              type="text"
              value={exhibit.manufacturer || ''}
              onChange={(e) => setExhibit({ ...exhibit, manufacturer: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="image">Изображение</label>
          <div className="uk-form-controls">
            <div className="uk-margin" uk-margin="true">
              <div uk-form-custom="target: true">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  required={isNewExhibit}
                />
                <input 
                  className="uk-input uk-form-width-medium" 
                  type="text" 
                  placeholder="Выберите изображение" 
                  disabled
                />
              </div>
              {exhibit.image && (
                <div className="uk-margin">
                  <img 
                    src={exhibit.image} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="historicalContext">Исторический контекст</label>
          <div className="uk-form-controls">
            <textarea
              className="uk-textarea"
              id="historicalContext"
              rows="3"
              value={exhibit.historicalContext || ''}
              onChange={(e) => setExhibit({ ...exhibit, historicalContext: e.target.value })}
            />
          </div>
        </div>

        <div className="uk-margin">
          <button type="submit" className="uk-button uk-button-primary">
            {isNewExhibit ? 'Создать экспонат' : 'Сохранить изменения'}
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

export default ExhibitEdit; 