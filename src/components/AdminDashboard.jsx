import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiUsers, 
  FiImage, 
  FiSettings, 
  FiLogOut, 
  FiSun, 
  FiMoon, 
  FiUser, 
  FiPackage, 
  FiActivity, 
  FiCalendar,
  FiBarChart2,
  FiTrendingUp,
  FiEye,
  FiMessageSquare
} from 'react-icons/fi';
import { FaMuseum } from 'react-icons/fa';
import './AdminDashboard.css';

/**
 * Enhanced AdminDashboard component with modern UI and theme support
 * This component provides a layout wrapper for all admin pages
 */
const AdminDashboard = ({ children, activePage = 'dashboard' }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('admin-theme') === 'dark' || 
    document.documentElement.classList.contains('dark-theme')
  );
  const [username, setUsername] = useState(localStorage.getItem('adminUsername') || 'Администратор');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [activeTab, setActiveTab] = useState(activePage);

  useEffect(() => {
    // Set theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      localStorage.setItem('admin-theme', prefersDark ? 'dark' : 'light');
    }

    // Get username from localStorage if available
    const savedUsername = localStorage.getItem('adminUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Handle window resize for sidebar visibility
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Update theme in localStorage and apply to body and html
    localStorage.setItem('admin-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', darkMode);
    document.documentElement.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  useEffect(() => {
    setActiveTab(activePage);
  }, [activePage]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    // Clear any user-related data from localStorage
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isAdminAuthenticated');
    
    // Redirect to login page
    navigate('/admin');
  };

  const handleNavClick = (page) => {
    setActiveTab(page);
    navigate(`/admin/${page === 'dashboard' ? '' : page}`);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="admin-container">
        {/* Sidebar */}
        <div className={`admin-sidebar ${sidebarOpen ? '' : 'closed'}`}>
          <div className="admin-logo">
            <FaMuseum className="admin-logo-icon" />
            <h1 className="admin-logo-text">Музей Онлайн</h1>
          </div>
          
          <nav className="admin-nav">
            <div 
              className={`admin-nav-button ${activeTab === 'dashboard' ? 'admin-nav-button-active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <FiHome className="admin-nav-icon" />
              <span>Дашборд</span>
            </div>
            
            <div 
              className={`admin-nav-button ${activeTab === 'exhibits' ? 'admin-nav-button-active' : ''}`}
              onClick={() => handleNavClick('exhibits')}
            >
              <FiImage className="admin-nav-icon" />
              <span>Экспонаты</span>
            </div>
            
            <div 
              className={`admin-nav-button ${activeTab === 'quizzes' ? 'admin-nav-button-active' : ''}`}
              onClick={() => handleNavClick('quizzes')}
            >
              <FiActivity className="admin-nav-icon" />
              <span>Квизы</span>
            </div>
            
            <div 
              className={`admin-nav-button ${activeTab === 'games' ? 'admin-nav-button-active' : ''}`}
              onClick={() => handleNavClick('games')}
            >
              <FiPackage className="admin-nav-icon" />
              <span>Игры</span>
            </div>
            
            <div 
              className={`admin-nav-button ${activeTab === 'reviews' ? 'admin-nav-button-active' : ''}`}
              onClick={() => handleNavClick('reviews')}
            >
              <FiMessageSquare className="admin-nav-icon" />
              <span>Отзывы</span>
            </div>
          </nav>
          
          <button className="admin-logout-button" onClick={handleLogout}>
            <FiLogOut />
            <span>Выйти из системы</span>
          </button>
        </div>
        
        {/* Main content */}
        <div className={`admin-content ${!sidebarOpen ? 'full-width' : ''}`}>
          <div className="admin-header">
            <div className="admin-header-left">
              <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? <FiX /> : <FiMenu />}
              </button>
              <h2 className="admin-header-title">
                {activeTab === 'dashboard' && 'Панель управления'}
                {activeTab === 'exhibits' && 'Управление экспонатами'}
                {activeTab === 'quizzes' && 'Управление квизами'}
                {activeTab === 'games' && 'Управление играми'}
                {activeTab === 'reviews' && 'Управление отзывами'}
              </h2>
            </div>
            
            <div className="admin-header-right">
              <button className="admin-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
              
              <div className="admin-user-info">
                <FiUser className="admin-user-avatar" />
                <div className="admin-user-details">
                  <span className="admin-user-name">{username}</span>
                  <span className="admin-user-role">Администратор</span>
                </div>
              </div>
            </div>
          </div>
          
          <main className="admin-main-content">
            {children}
          </main>
          
          <footer className="admin-footer">
            <p className="admin-copyright">© {new Date().getFullYear()} Музей Онлайн. Все права защищены.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 