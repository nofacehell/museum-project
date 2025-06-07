// src/pages/admin/Categories.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import { getCategories, deleteCategory } from '../../utils/api';
import '../../styles/admin-new.css';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [modal, setModal] = useState({ visible: false, id: null, name: '' });

  // Fetch list
  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить категории.');
      UIkit.notification({ message: err.message, status: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => navigate('/admin/category/new');
  const openEdit = id => navigate(`/admin/category/${id}`);
  const openDelete = (id, name) => setModal({ visible: true, id, name });
  const closeDelete = () => setModal({ visible: false, id: null, name: '' });

  const confirmDelete = async () => {
    const { id, name } = modal;
    setDeleting(d => ({ ...d, [id]: true }));
    try {
      const res = await deleteCategory(id);
      if (res.success) UIkit.notification({ message: `Удалено "${name}"`, status: 'success' });
      else UIkit.notification({ message: res.error || 'Ошибка удаления', status: 'warning' });
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      UIkit.notification({ message: err.message, status: 'danger' });
    } finally {
      setDeleting(d => ({ ...d, [id]: false }));
      closeDelete();
    }
  };

  if (loading) return <div className="admin-loader">Загрузка категорий...</div>;
  if (error) return (
    <div className="admin-alert admin-alert-danger">
      <p>{error}</p>
      <button className="admin-btn" onClick={load}>Повторить</button>
    </div>
  );

  return (
    <div className="admin-container">
      <header className="admin-content-header">
        <h1>Категории</h1>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>Добавить</button>
      </header>

      {!categories.length && (
        <div className="admin-empty">
          <p>Нет категорий</p>
        </div>
      )}

      {categories.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Имя</th><th>Slug</th><th>Описание</th><th>Действия</th></tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.description || '-'}</td>
                <td>
                  <button className="admin-btn-sm" onClick={() => openEdit(cat.id)}>✏️</button>
                  <button
                    className="admin-btn-sm admin-btn-danger"
                    onClick={() => openDelete(cat.id, cat.name)}
                    disabled={deleting[cat.id]}
                  >
                    {deleting[cat.id] ? '🕒' : '🗑️'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal.visible && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={closeDelete}></div>
          <div className="admin-modal-content">
            <h3>Удалить категорию?</h3>
            <p>Вы уверены, что хотите удалить «{modal.name}»?</p>
            <button className="admin-btn" onClick={closeDelete}>Отмена</button>
            <button className="admin-btn admin-btn-danger" onClick={confirmDelete}>Удалить</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;