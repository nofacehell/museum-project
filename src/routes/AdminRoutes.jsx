import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ExhibitsManager from '../pages/admin/ExhibitsManager';
import ReviewsManager from '../pages/admin/ReviewsManager';
import Login from '../pages/admin/Login';
import QuizzesManager from '../pages/admin/QuizzesManager';

const AdminRoutes = () => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/exhibits" element={<ExhibitsManager />} />
        <Route path="/quizzes" element={<QuizzesManager />} />
        <Route path="/reviews" element={<ReviewsManager />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 