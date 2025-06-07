// src/pages/admin/CategoryEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UIkit from 'uikit';
import { getCategoryById, createCategory, updateCategory } from '../../utils/api';
import '../../styles/admin-new.css';

const CategoryEdit = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '💻' });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const icons = ['💻','📱','🎧','🎮','📺','📷','⌚','🔌','💾','🖨️','🎵','📻','🎥'];

  useEffect(() => {
    if (!isNew) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCategoryById(id);
      setForm({ name: data.name, slug: data.slug, description: data.description, icon: data.icon });
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const genSlug = () => setForm(f => ({ ...f, slug: f.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      UIkit.notification({ message: 'Имя и slug обязательны', status: 'warning' });
      return;
    }
    setSaving(true);
    try {
      if (isNew) await createCategory(form);
      else await updateCategory(id, form);
      UIkit.notification({ message: 'Сохранено', status: 'success' });
      navigate('/admin/categories');
    } catch (err) {
      UIkit.notification({ message: err.message, status: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loader">Загрузка...</div>;

  return (
    <div className="admin-container">
      <h1>{isNew ? 'Новая категория' : 'Редактировать категорию'}</h1>
      <form onSubmit={onSubmit} className="admin-form">
        <label>Имя*</label>
        <input name="name" value={form.name} onChange={onChange} onBlur={!form.slug ? genSlug : null} required />

        <label>Slug*</label>
        <div className="uk-inline">
          <input name="slug" value={form.slug} onChange={onChange} required />
          <button type="button" uk-icon="icon: refresh" onClick={genSlug}></button>
        </div>

        <label>Описание</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={3} />

        <label>Иконка</label>
        <div className="icon-selector">
          {icons.map(ic => (
            <button
              type="button"
              key={ic}
              className={form.icon === ic ? 'selected' : ''}
              onClick={() => setForm({...form, icon: ic})}
            >{ic}</button>
          ))}
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn" onClick={() => navigate('/admin/categories')} disabled={saving}>Отмена</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Сохраняем...' : 'Сохранить'}</button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;
