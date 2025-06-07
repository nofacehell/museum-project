// 🎛️ Улучшенный AdminDashboard с фиксированной шириной sidebar и адаптивной версткой
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExhibitsManager from './ExhibitsManager';
import DashboardStats from './DashboardStats';
import QuizzesManager from './QuizzesManager';
import ReviewsManager from './ReviewsManager';
import 'uikit/dist/css/uikit.min.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons);

const AdminDashboard = () => {
  const [username, setUsername] = useState('Администратор');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth') === 'true' ||
                    localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    document.body.classList.add('uk-background-muted');
    const savedUsername = localStorage.getItem('adminUsername') || 'Администратор';
    setUsername(savedUsername);

    setTimeout(() => setLoading(false), 500);
    return () => document.body.classList.remove('uk-background-muted');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardStats />;
      case 'exhibits': return <ExhibitsManager />;
      case 'quizzes': return <QuizzesManager />;
      case 'reviews': return <ReviewsManager />;
      default:
        return (
          <div className="uk-card uk-card-default uk-card-body">
            <h2 className="uk-card-title">Панель управления</h2>
            <p>Выберите раздел для управления.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="uk-flex uk-flex-center uk-flex-middle uk-height-viewport">
        <div>
          <span className="uk-spinner uk-margin-small-right" uk-spinner="ratio: 2"></span>
          <span>Загрузка админ-панели...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="uk-flex uk-height-viewport uk-overflow-hidden">
      {/* Sidebar */}
      <aside className="uk-width-small uk-background-default uk-padding-small uk-flex uk-flex-column uk-height-1-1 uk-text-dark">
        <div className="uk-margin-bottom">
          <h4 className="uk-text-bold uk-flex uk-flex-middle">
            <span uk-icon="icon: world; ratio: 1.2" className="uk-margin-small-right"></span>
            Музей Онлайн
          </h4>
          <div className="uk-text-meta uk-text-dark">{username}</div>
        </div>
        <ul className="uk-nav uk-nav-default">
          {[
            { id: 'dashboard', icon: 'table', label: 'Обзор' },
            { id: 'exhibits', icon: 'image', label: 'Экспонаты' },
            { id: 'quizzes', icon: 'question', label: 'Квизы' },
            { id: 'reviews', icon: 'comment', label: 'Отзывы' }
          ].map(tab => (
            <li key={tab.id} className={activeTab === tab.id ? 'uk-active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab(tab.id); }} className="uk-text-dark">
                <span uk-icon={`icon: ${tab.icon}`} className="uk-margin-small-right"></span>
                {tab.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="uk-button uk-button-danger uk-margin-top uk-width-expand"
        >
          <span uk-icon="icon: sign-out" className="uk-margin-small-right"></span>
          Выйти
        </button>
      </aside>

      {/* Main Content */}
      <main className="uk-width-expand uk-padding uk-overflow-auto">
        <div className="uk-card uk-card-default uk-card-body uk-margin-bottom uk-flex uk-flex-between uk-flex-middle">
          <h2 className="uk-card-title uk-margin-remove">
            {{
              dashboard: 'Панель управления',
              exhibits: 'Управление экспонатами',
              quizzes: 'Управление квизами',
              reviews: 'Управление отзывами'
            }[activeTab]}
          </h2>
          <div className="uk-text-right">
            <div className="uk-text-bold">{username}</div>
            <div className="uk-text-meta">Администратор</div>
          </div>
        </div>

        <div className="uk-container uk-container-expand">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
