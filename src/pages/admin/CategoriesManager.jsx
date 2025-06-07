import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../utils/api';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    slug: ''
  });

  // Загрузка категорий
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке категорий');
      setLoading(false);
    }
  };

  // Обработка изменений формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      // Auto-generate slug when name changes
      if (name === 'name') {
        updates.slug = value.toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      return { ...prev, ...updates };
    });
  };

  // Создание/редактирование категории
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon || '📁',
        slug: formData.slug || formData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      };

      console.log('Sending category data:', dataToSend);

      if (editingCategory) {
        await updateCategory(editingCategory.id, dataToSend);
      } else {
        await createCategory(dataToSend);
      }

      await fetchCategories();
      resetForm();
    } catch (err) {
      console.error('Error saving category:', err.response?.data || err);
      setError(err.response?.data?.message || 'Ошибка при сохранении категории');
    } finally {
      setLoading(false);
    }
  };

  // Удаление категории
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError('Ошибка при удалении категории');
    }
  };

  // Редактирование категории
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      slug: category.slug
    });
  };

  // Сброс формы
  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      slug: ''
    });
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{editingCategory ? 'Редактировать категорию' : 'Добавить новую категорию'}</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Название:</label>
          <select
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="" disabled>— Выберите категорию —</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Иконка:</label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            placeholder="Например: 🎨 или 🖼️"
            style={{ width: '100%', padding: '8px' }}
          />
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
            {editingCategory ? 'Сохранить изменения' : 'Добавить категорию'}
          </button>
          
          {editingCategory && (
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

      <h2>Список категорий</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {categories.map(category => (
          <div key={category._id || category.id} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{category.icon}</div>
            <h3 style={{ margin: '0 0 10px 0' }}>{category.name}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>{category.description}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(category)} style={{
                padding: '5px 10px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Редактировать
              </button>
              <button onClick={() => handleDelete(category._id || category.id)} style={{
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

export default CategoriesManager; 