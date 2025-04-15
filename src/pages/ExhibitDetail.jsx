import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import '../styles/exhibitDetail.css';
import { getExhibitById } from '../utils/api';
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://placehold.co/600x400/cccccc/333333?text=Нет+изображения';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:image')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
  return `${API_URL}/uploads/${imagePath}`;
};

const ExhibitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exhibit, setExhibit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchExhibit = async () => {
      try {
        setLoading(true);
        
        // Получаем экспонат из API
        console.log(`Загрузка экспоната с ID: ${id}`);
        const data = await getExhibitById(id);
        console.log('Данные экспоната получены:', data);
        
        setExhibit(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке экспоната:', err);
        setError('Не удалось загрузить информацию об экспонате. Пожалуйста, попробуйте позже.');
        
        // Показываем уведомление об ошибке
        UIkit.notification({
          message: 'Ошибка при загрузке экспоната: ' + (err.message || 'Неизвестная ошибка'),
          status: 'danger',
          pos: 'top-center',
          timeout: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchExhibit();
    
    // Инициализация AOS (Animation On Scroll)
    AOS.init({
      duration: 800,
      once: true,
    });
  }, [id]);
  
  // Возврат к странице экспонатов
  const handleBack = () => {
    navigate('/exhibits');
  };
  
  if (loading) {
    return (
      <div className="uk-container uk-container-small uk-margin-large-top uk-margin-large-bottom uk-text-center">
        <div uk-spinner="ratio: 1.5"></div>
        <p>Загрузка информации об экспонате...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="uk-container uk-container-small uk-margin-large-top uk-margin-large-bottom">
        <div className="uk-alert uk-alert-danger">
          <p>{error}</p>
          <button className="uk-button uk-button-primary" onClick={handleBack}>
            Вернуться к экспонатам
          </button>
        </div>
      </div>
    );
  }
  
  if (!exhibit) {
    return (
      <div className="uk-container uk-container-small uk-margin-large-top uk-margin-large-bottom">
        <div className="uk-alert uk-alert-warning">
          <p>Экспонат не найден</p>
          <button className="uk-button uk-button-primary" onClick={handleBack}>
            Вернуться к экспонатам
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="exhibit-detail-container">
      <button 
        className="back-button" 
        onClick={handleBack}
      >
        <span uk-icon="arrow-left"></span> Назад к экспонатам
      </button>
      
      <div className="uk-card uk-card-default" data-aos="fade-up">
        <div className="uk-card-media-top">
          {exhibit.image && (
            <img 
              src={getImageUrl(exhibit.image)} 
              alt={exhibit.title} 
              className="exhibit-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400/cccccc/333333?text=Нет+изображения';
              }}
            />
          )}
        </div>
        
        <div className="uk-card-body">
          <div className="exhibit-header">
            <h1 className="exhibit-title">{exhibit.title}</h1>
            <span className="exhibit-category">{exhibit.category}</span>
          </div>
          
          <div className="uk-grid-small uk-child-width-1-2@s" uk-grid="true">
            <div className="exhibit-metadata">
              <p className="metadata-item"><span className="metadata-label">Год:</span> {exhibit.year || 'Неизвестно'}</p>
              <p className="metadata-item"><span className="metadata-label">Производитель:</span> {exhibit.manufacturer || 'Неизвестно'}</p>
              
              {exhibit.technicalSpecs && Object.keys(exhibit.technicalSpecs).length > 0 && (
                <div className="uk-margin">
                  <h4>Технические характеристики</h4>
                  <ul className="tech-specs-list">
                    {Object.entries(exhibit.technicalSpecs).map(([key, value]) => (
                      <li key={key} className="tech-spec-item">
                        <span className="tech-spec-label">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <div className="uk-margin">
                <h4>Описание</h4>
                <p className="exhibit-description">{exhibit.description}</p>
              </div>
              
              {exhibit.historicalContext && (
                <div className="exhibit-history">
                  <h4>Исторический контекст</h4>
                  <p>{exhibit.historicalContext}</p>
                </div>
              )}
            </div>
          </div>
          
          {exhibit.additionalImages && exhibit.additionalImages.length > 0 && (
            <div className="uk-margin-large-top">
              <h4>Дополнительные изображения</h4>
              <div className="uk-position-relative uk-visible-toggle" tabIndex="-1" uk-slider="center: true">
                <ul className="uk-slider-items uk-grid uk-grid-match" uk-lightbox="animation: fade">
                  {exhibit.additionalImages.map((img, index) => (
                    <li key={index} className="uk-width-3-4">
                      <div className="uk-panel">
                        <a href={img} data-caption={`${exhibit.title} - изображение ${index + 1}`}>
                          <img src={img} alt={`${exhibit.title} - ${index + 1}`} />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
                <a className="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous="true" uk-slider-item="previous"></a>
                <a className="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next="true" uk-slider-item="next"></a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExhibitDetail; 