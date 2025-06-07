import React, { useState, useEffect } from 'react';
import { getExhibits, createExhibit, updateExhibit, deleteExhibit, getCategories } from '../../utils/api';
import { getStaticUrl } from '../../utils/config';
import UIkit from 'uikit';
import axios from 'axios';

const ExhibitsManager = () => {
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExhibit, setSelectedExhibit] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    images: [],
    year: '',
    manufacturer: '',
    historicalContext: '',
    technicalSpecs: [{ key: '', value: '' }],
    featured: false
  });
  const [backups, setBackups] = useState([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchExhibits();
    fetchBackups();
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const fetchExhibits = async () => {
    try {
      const data = await getExhibits();
      setExhibits(data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке экспонатов');
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await axios.get('/api/admin/backups');
      setBackups(res.data.backups || []);
    } catch (e) {
      UIkit.notification({ message: 'Ошибка при получении списка бэкапов', status: 'danger', pos: 'top-right' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'technicalSpecs') {
      try {
        const specs = JSON.parse(value);
        setFormData(prev => ({
          ...prev,
          [name]: specs
        }));
      } catch {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleSpecChange = (idx, field, value) => {
    setFormData(prev => {
      const specs = [...prev.technicalSpecs];
      specs[idx][field] = value;
      return { ...prev, technicalSpecs: specs };
    });
  };

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      technicalSpecs: [...prev.technicalSpecs, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpec = (idx) => {
    setFormData(prev => ({
      ...prev,
      technicalSpecs: prev.technicalSpecs.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { images, ...rest } = formData;
      const formDataToSend = new FormData();
      // Добавляем остальные поля
      Object.entries(rest).forEach(([key, value]) => {
        if (key === 'technicalSpecs') {
          formDataToSend.append('technicalSpecs', JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });
      // Добавляем файлы
      const newFiles = images.filter(img => img instanceof File);
      if (newFiles.length > 0) {
        formDataToSend.append('image', newFiles[0]);
        newFiles.slice(1).forEach(file => formDataToSend.append('additionalImages', file));
      }
      // Выводим FormData в консоль для отладки
      for (let [key, value] of formDataToSend.entries()) {
        console.log('FormData:', key, value);
      }
      if (selectedExhibit) {
        await updateExhibit(selectedExhibit.id, formDataToSend);
        UIkit.notification({
          message: 'Экспонат успешно обновлен',
          status: 'success',
          pos: 'top-right',
          timeout: 3000
        });
      } else {
        await createExhibit(formDataToSend);
        UIkit.notification({
          message: 'Экспонат успешно создан',
          status: 'success',
          pos: 'top-right',
          timeout: 3000
        });
      }
      fetchExhibits();
      resetForm();
    } catch (err) {
      setError(err.message || 'Ошибка при сохранении экспоната');
      UIkit.notification({
        message: 'Ошибка при сохранении экспоната',
        status: 'danger',
        pos: 'top-right',
        timeout: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await UIkit.modal.confirm('Вы уверены, что хотите удалить этот экспонат?').then(async () => {
        await deleteExhibit(id);
      fetchExhibits();
        UIkit.notification({
          message: 'Экспонат успешно удален',
          status: 'success',
          pos: 'top-right',
          timeout: 3000
        });
      });
    } catch (err) {
      setError('Ошибка при удалении экспоната');
      UIkit.notification({
        message: 'Ошибка при удалении экспоната',
        status: 'danger',
        pos: 'top-right',
        timeout: 3000
      });
    }
  };

  const handleEdit = (exhibit) => {
    // Безопасно формируем массив изображений (пути к уже загруженным)
    let images = [];
    if (exhibit.image) {
      images = [exhibit.image];
      let additional = [];
      if (Array.isArray(exhibit.additional_images)) {
        additional = exhibit.additional_images;
      } else if (typeof exhibit.additional_images === 'string') {
        try {
          if (exhibit.additional_images.trim().startsWith('[')) {
            additional = JSON.parse(exhibit.additional_images);
          } else if (exhibit.additional_images.trim() !== '') {
            additional = [exhibit.additional_images];
          }
        } catch {
          additional = [exhibit.additional_images];
        }
      }
      images = images.concat(additional);
    }
    // technicalSpecs всегда массив
    let technicalSpecs = [];
    if (Array.isArray(exhibit.technical_specs)) {
      technicalSpecs = exhibit.technical_specs;
    } else if (typeof exhibit.technical_specs === 'string') {
      try {
        technicalSpecs = JSON.parse(exhibit.technical_specs);
      } catch {
        technicalSpecs = [];
      }
    }
    setSelectedExhibit(exhibit);
    setFormData({
      title: exhibit.title,
      description: exhibit.description,
      shortDescription: exhibit.shortDescription,
      categoryId: exhibit.categoryId || (exhibit.category && exhibit.category.id) || '',
      images, // только строки (пути)
      year: exhibit.year,
      manufacturer: exhibit.manufacturer,
      historicalContext: exhibit.historical_context || exhibit.historicalContext || '',
      technicalSpecs,
      featured: exhibit.featured
    });
  };

  const resetForm = () => {
    setSelectedExhibit(null);
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      categoryId: '',
      images: [],
      year: '',
      manufacturer: '',
      historicalContext: '',
      technicalSpecs: [{ key: '', value: '' }],
      featured: false
    });
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      await axios.post('/api/admin/backup-db');
      UIkit.notification({ message: 'Бэкап успешно создан', status: 'success', pos: 'top-right' });
      fetchBackups();
    } catch (e) {
      UIkit.notification({ message: 'Ошибка при создании бэкапа', status: 'danger', pos: 'top-right' });
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async (backupFile) => {
    if (!window.confirm(`Восстановить базу из бэкапа ${backupFile}? Это перезапишет текущие данные!`)) return;
    setBackupLoading(true);
    try {
      await axios.post('/api/admin/restore-db', { backupFile });
      UIkit.notification({ message: 'База данных восстановлена. Перезапустите сервер!', status: 'success', pos: 'top-right', timeout: 5000 });
    } catch (e) {
      UIkit.notification({ message: 'Ошибка при восстановлении базы', status: 'danger', pos: 'top-right' });
    } finally {
      setBackupLoading(false);
    }
  };

  if (loading) return (
    <div className="uk-flex uk-flex-center uk-flex-middle uk-height-medium">
      <div className="uk-text-center">
        <p className="uk-margin-small-top uk-text-muted">Загрузка экспонатов...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="uk-container uk-container-small uk-margin-large-top">
      <div className="uk-alert-danger" uk-alert>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="uk-container uk-container-expand" style={{ maxWidth: '100vw', width: '100%' }}>
      {/* --- BACKUP PANEL --- */}
      <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, marginBottom: 24, boxShadow: '0 2px 12px #e0e7ff55', transform: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', overflowX: 'auto', transform: 'none' }}>
          <button className="uk-button uk-button-primary" onClick={handleBackup} disabled={backupLoading} style={{ transform: 'none' }}>
            {backupLoading ? 'Создание...' : 'Сделать бэкап'}
          </button>
          <span style={{ fontWeight: 500, whiteSpace: 'nowrap', transform: 'none' }}>Доступные бэкапы:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', transform: 'none' }}>
            {backups.length === 0 && <span style={{ color: '#64748b', transform: 'none' }}>Нет бэкапов</span>}
            {backups.map(file => (
              <span key={file} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e0e7ff', borderRadius: 6, padding: '2px 8px', marginBottom: 4, transform: 'none' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', transform: 'none' }}>{file}</span>
                <button className="uk-button uk-button-default uk-button-small" style={{ marginLeft: 4, transform: 'none' }} onClick={() => handleRestore(file)} disabled={backupLoading}>Восстановить</button>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* --- END BACKUP PANEL --- */}

      {/* Заголовок */}
      <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
        <h3 className="uk-card-title uk-heading-divider">
          <span uk-icon="icon: image; ratio: 1.3" className="uk-margin-small-right"></span>
          Управление экспонатами
        </h3>
      </div>

      {/* Форма */}
      <div className="uk-card uk-card-default uk-card-body uk-margin-medium-bottom">
        <h4 className="uk-card-title">
          <span uk-icon="icon: plus-circle" className="uk-margin-small-right"></span>
          {selectedExhibit ? 'Редактировать экспонат' : 'Создать новый экспонат'}
        </h4>
        
        <form onSubmit={handleSubmit} className="uk-form-stacked">
          <div className="uk-grid-small" uk-grid>
            <div className="uk-width-1-2@m">
              <div className="uk-margin">
                <label className="uk-form-label">Название:</label>
                <div className="uk-form-controls">
                  <div className="uk-inline uk-width-1-1">
                    <span className="uk-form-icon" uk-icon="icon: tag"></span>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="uk-input"
                      placeholder="Введите название экспоната"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="uk-width-1-2@m">
              <div className="uk-margin">
                <label className="uk-form-label">Категория:</label>
                <div className="uk-form-controls">
                  <div className="uk-inline uk-width-1-1">
                    <span className="uk-form-icon" uk-icon="icon: folder"></span>
                    <select
                      name="categoryId"
                      value={formData.categoryId || ''}
                      onChange={handleInputChange}
                      required
                      className="uk-select"
                    >
                      <option value="" disabled>Выберите категорию</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          

          <div className="uk-margin">
            <label className="uk-form-label">Описание:</label>
            <div className="uk-form-controls">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="uk-textarea"
                rows="4"
                placeholder="Введите подробное описание экспоната"
              />
            </div>
          </div>

          <div className="uk-grid-small" uk-grid>
            <div className="uk-width-1-2@m">
              <div className="uk-margin">
                <label className="uk-form-label">Год создания:</label>
                <div className="uk-form-controls">
                  <div className="uk-inline uk-width-1-1">
                    <span className="uk-form-icon" uk-icon="icon: calendar"></span>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="uk-input"
                      placeholder="Введите год"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="uk-width-1-2@m">
              <div className="uk-margin">
                <label className="uk-form-label">Производитель:</label>
                <div className="uk-form-controls">
                  <div className="uk-inline uk-width-1-1">
                    <span className="uk-form-icon" uk-icon="icon: location"></span>
                    <input
                      type="text"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      required
                      className="uk-input"
                      placeholder="Введите производителя"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label">Изображения:</label>
            <div className="uk-form-controls">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
              />
              <div className="uk-flex uk-flex-wrap uk-margin-small-top">
                {formData.images && formData.images.map((file, idx) => (
                  <div key={idx} className="uk-position-relative uk-margin-right">
                    <img
                      src={file instanceof File ? URL.createObjectURL(file) : file}
                      alt="preview"
                      style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="uk-button uk-button-danger uk-button-small uk-position-absolute uk-position-top-right"
                      onClick={() => handleRemoveImage(idx)}
                      style={{ zIndex: 2 }}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label">Исторический контекст:</label>
            <textarea
              name="historicalContext"
              value={formData.historicalContext}
              onChange={handleInputChange}
              className="uk-textarea"
              rows="3"
              placeholder="Введите исторический контекст"
            />
          </div>

          <div className="uk-margin">
            <label className="uk-form-label">Технические характеристики:</label>
            {formData.technicalSpecs && formData.technicalSpecs.map((spec, idx) => (
              <div className="uk-flex uk-flex-middle uk-margin-small" key={idx}>
                <input
                  className="uk-input uk-width-1-3"
                  placeholder="Ключ"
                  value={spec.key}
                  onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                />
                <input
                  className="uk-input uk-width-1-2 uk-margin-left"
                  placeholder="Значение"
                  value={spec.value}
                  onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                />
                <button
                  type="button"
                  className="uk-button uk-button-danger uk-margin-left"
                  onClick={() => handleRemoveSpec(idx)}
                >Удалить</button>
              </div>
            ))}
            <button
              type="button"
              className="uk-button uk-button-default"
              onClick={handleAddSpec}
            >Добавить характеристику</button>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="uk-checkbox"
              />
              <span className="uk-margin-small-left">Рекомендуемый экспонат</span>
            </label>
          </div>

          <div className="uk-margin uk-flex uk-flex-middle">
            <button type="submit" className="uk-button uk-button-primary">
              <span uk-icon="icon: check"></span>
              <span className="uk-margin-small-left">
                {selectedExhibit ? 'Сохранить изменения' : 'Создать экспонат'}
              </span>
            </button>
            {selectedExhibit && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="uk-button uk-button-default uk-margin-small-left"
              >
                <span uk-icon="icon: close"></span>
                <span className="uk-margin-small-left">Отмена</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Список экспонатов */}
      <div className="uk-section uk-section-default">
        <div className="uk-container">
          <h4 className="uk-heading-bullet">Список экспонатов</h4>
          <div className="uk-margin uk-width-1-1 uk-flex uk-flex-middle">
            <input
              className="uk-input uk-width-1-2"
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </div>
          <div className="admin-exhibits-grid">
            {exhibits
              .filter(exhibit =>
                exhibit.title.toLowerCase().includes(search.toLowerCase()) ||
                exhibit.description.toLowerCase().includes(search.toLowerCase())
              )
              .map(exhibit => (
                <div className="admin-exhibit-card" key={exhibit.id}>
                  <div className="admin-exhibit-image">
                    <img
                      src={exhibit.image ? getStaticUrl(exhibit.image) : 'https://placehold.co/400x300?text=Нет+изображения'}
                      alt={exhibit.title}
                    />
                  </div>
                  <div className="admin-exhibit-content">
                    <h5 className="admin-exhibit-title">{exhibit.title}</h5>
                    <div className="admin-exhibit-category">{exhibit.category} • {exhibit.year}</div>
                    <div className="admin-exhibit-description">{exhibit.shortDescription}</div>
                    <div className="admin-exhibit-actions">
                      {exhibit.featured && <span className="uk-label uk-label-success">Избранное</span>}
                      <button
                        className="admin-exhibit-edit"
                        onClick={() => handleEdit(exhibit)}
                      >
                        <span uk-icon="icon: pencil"></span>
                      </button>
                      <button
                        className="admin-exhibit-delete"
                        onClick={() => handleDelete(exhibit.id)}
                      >
                        <span uk-icon="icon: trash"></span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitsManager; 