import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import '../../styles/admin-new.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

// Initialize UIkit icons
UIkit.use(Icons);

/**
 * Компонент макета для админ-панели
 * Обеспечивает проверку авторизации и базовую структуру для всех страниц админ-панели
 */
const AdminLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("AdminLayout: Initializing...");
    try {
      // Check if user is logged in as admin
      const isAdminAuth = localStorage.getItem('isAdminAuthenticated') === 'true' || 
                          localStorage.getItem('adminAuth') === 'true';
      
      console.log("AdminLayout: Auth check result:", isAdminAuth);
      console.log("AdminLayout: adminAuth value:", localStorage.getItem('adminAuth'));
      console.log("AdminLayout: isAdminAuthenticated value:", localStorage.getItem('isAdminAuthenticated'));
      
      if (!isAdminAuth) {
        console.log("AdminLayout: Not authorized, redirecting to login");
        // Сначала установим значения состояния
        setIsAuthorized(false);
        setLoading(false);
        // Затем выполним переход
        navigate('/admin/login');
        return;
      }
      
      // Add admin mode class to body
      document.body.classList.add('admin-mode');
      console.log("AdminLayout: Added admin-mode class to body");
      
      // Установка основных состояний после успешной авторизации
      setIsAuthorized(true);
      setLoading(false);
      console.log("AdminLayout: Setup complete, authorized=true");
    } catch (err) {
      console.error("AdminLayout: Error during initialization:", err);
      setError(err.message);
      setLoading(false);
    }
    
    return () => {
      // Cleanup when component unmounts
      console.log("AdminLayout: Unmounting, removing admin-mode class");
      document.body.classList.remove('admin-mode');
    };
  }, [navigate]);
  
  // Упрощенный вариант рендеринга для отладки
  console.log("AdminLayout: Render state - loading:", loading, "authorized:", isAuthorized, "error:", error);
  
  // В случае загрузки показываем индикатор
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p className="admin-text">Загрузка админ-панели...</p>
      </div>
    );
  }
  
  // В случае ошибки показываем сообщение
  if (error) {
    return (
      <div className="admin-card admin-error">
        <h2 className="admin-heading">Ошибка при загрузке админ-панели</h2>
        <p className="admin-text">{error}</p>
        <button 
          className="admin-button admin-button-primary"
          onClick={() => navigate('/admin/login')}
        >
          Вернуться на страницу входа
        </button>
      </div>
    );
  }
  
  // Не авторизован - перенаправляем на страницу входа
  if (!isAuthorized) {
    console.log("AdminLayout: Not authorized, rendering null");
    return null;
  }
  
  // Основной вывод для авторизованных пользователей
  console.log("AdminLayout: Rendering admin content");
  return (
    <div id="admin-content" 
         className="admin-root admin-mode"
         style={{
           display: 'flex',
           width: '100vw',
           height: '100vh',
           overflow: 'hidden'
         }}>
      <Outlet />
    </div>
  );
};

export default AdminLayout; 