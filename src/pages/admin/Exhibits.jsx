import React, { useEffect } from 'react';

// Проверяем, в темной ли теме сейчас сайт
const isDarkTheme = () => {
  return document.documentElement.classList.contains('dark-theme') || 
         document.body.classList.contains('dark-theme') ||
         document.querySelector('.theme-toggle')?.checked;
};

// Компонент для вывода
const Exhibits = () => {
  // Добавление стилей для темной темы
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Dark theme styles for admin exhibits */
      .dark-theme .admin-exhibits-container {
        background-color: #1e1e1e;
        color: #f3f4f6;
      }
      
      .dark-theme .admin-exhibits-title {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-stat-card {
        background-color: #252525;
      }
      
      .dark-theme .admin-stat-value {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-stat-label {
        color: #94a3b8;
      }
      
      .dark-theme .admin-filter-label {
        color: #e2e8f0;
      }
      
      .dark-theme .admin-filter-select,
      .dark-theme .admin-filter-input {
        background-color: #252525;
        border-color: #4b5563;
        color: #e2e8f0;
      }
      
      .dark-theme .admin-add-button {
        background-color: #065f46;
        color: #d1fae5;
      }
      
      .dark-theme .admin-table {
        background-color: #252525;
      }
      
      .dark-theme .admin-table-head {
        background-color: #1f2937;
        border-bottom: 2px solid #4b5563;
      }
      
      .dark-theme .admin-table-header-cell {
        color: #e2e8f0;
      }
      
      .dark-theme .admin-sort-button {
        color: #e2e8f0;
      }
      
      .dark-theme .admin-table-row {
        border-bottom: 1px solid #374151;
      }
      
      .dark-theme .admin-table-row:hover {
        background-color: #374151;
      }
      
      .dark-theme .admin-table-cell {
        color: #e2e8f0;
      }
      
      .dark-theme .admin-loading {
        color: #94a3b8;
      }
      
      .dark-theme .admin-error {
        color: #f87171;
      }
      
      .dark-theme .admin-edit-button {
        background-color: #1e40af;
        color: #dbeafe;
      }
      
      .dark-theme .admin-delete-button {
        background-color: #7f1d1d;
        color: #fee2e2;
      }
      
      .dark-theme .admin-modal-content {
        background-color: #252525;
        color: #e2e8f0;
        border-color: #4b5563;
      }
      
      .dark-theme .admin-modal-title {
        color: #f3f4f6;
      }
      
      .dark-theme .admin-form-label {
        color: #e2e8f0;
      }
      
      .dark-theme .admin-form-input,
      .dark-theme .admin-form-textarea,
      .dark-theme .admin-form-select {
        background-color: #374151;
        border-color: #4b5563;
        color: #e2e8f0;
      }
      
      .dark-theme .admin-form-submit {
        background-color: #065f46;
        color: #d1fae5;
      }
      
      .dark-theme .admin-form-cancel {
        background-color: #7f1d1d;
        color: #fee2e2;
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="admin-exhibits-container">
      {/* ... existing code ... */}
    </div>
  );
};

export default Exhibits; 