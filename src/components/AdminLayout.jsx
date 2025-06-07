import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/admin.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Панель администратора</h1>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 