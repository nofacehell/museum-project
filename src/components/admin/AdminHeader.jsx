import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const AdminHeader = ({ onSearch, onFilter, title, icon }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    date: ''
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    onFilter({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      date: ''
    });
    onFilter({});
  };

  return (
    <div className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-title">
          {icon && <span className="admin-header-icon">{icon}</span>}
          <h2>{title}</h2>
        </div>
        
        <div className="admin-header-actions">
          <div className="admin-search">
            <FaSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={handleSearch}
              className="admin-search-input"
            />
          </div>
          
          <button
            className={`admin-filter-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            <span>Фильтры</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="admin-filters">
          <div className="admin-filters-content">
            <div className="admin-filter-group">
              <label>Категория</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="admin-filter-select"
              >
                <option value="">Все категории</option>
                <option value="electronics">Электроника</option>
                <option value="computers">Компьютеры</option>
                <option value="telecommunications">Телекоммуникации</option>
              </select>
            </div>

            <div className="admin-filter-group">
              <label>Статус</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="admin-filter-select"
              >
                <option value="">Все статусы</option>
                <option value="active">Активные</option>
                <option value="draft">Черновики</option>
                <option value="archived">Архивные</option>
              </select>
            </div>

            <div className="admin-filter-group">
              <label>Дата</label>
              <select
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="admin-filter-select"
              >
                <option value="">Все даты</option>
                <option value="today">Сегодня</option>
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
                <option value="year">За год</option>
              </select>
            </div>

            <button
              className="admin-clear-filters"
              onClick={clearFilters}
            >
              <FaTimes />
              <span>Сбросить</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeader; 