import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import '../App.css';

// Импорт компонентов страниц
import Exhibits from '../pages/Exhibits';
import ExhibitDetail from '../pages/ExhibitDetail';
import Quizzes from '../pages/Quizzes';
import QuizPage from '../pages/QuizPage';
import Games from '../pages/Games';
import ArtistGame from '../pages/ArtistGame';
import MemoryGame from '../pages/MemoryGame';
import StyleGame from '../pages/StyleGame';
import TimelineGame from '../pages/TimelineGame';
import About from '../pages/About';
import Reviews from '../pages/Reviews';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Импорт компонентов админ-панели
import Admin from '../pages/Admin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ExhibitEdit from '../pages/admin/ExhibitEdit';
import QuizEdit from '../pages/admin/QuizEdit';
import GameEdit from '../pages/admin/GameEdit';
import AdminLogin from '../pages/AdminLogin';
import AuthCheck from './AuthCheck';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminPanel from '../pages/admin/AdminPanel';
import CategoryEdit from '../pages/admin/CategoryEdit';

// Импорт общих компонентов
import ScrollToTop from '../utils/ScrollToTop';

function MainApp() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="app">
        <Header />
        <main className="main-content">
          <ScrollToTop />
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Home />} />
            <Route path="/exhibits" element={<Exhibits />} />
            <Route path="/exhibits/:id" element={<ExhibitDetail />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:id" element={<QuizPage />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/artist" element={<ArtistGame />} />
            <Route path="/games/memory" element={<MemoryGame />} />
            <Route path="/games/style" element={<StyleGame />} />
            <Route path="/games/timeline" element={<TimelineGame />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Маршруты админ-панели */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminPanel initialTab="dashboard" />} />
              <Route path="exhibits" element={<AdminPanel initialTab="exhibits" />} />
              <Route path="categories" element={<AdminPanel initialTab="categories" />} />
              <Route path="category/new" element={<CategoryEdit />} />
              <Route path="category/:id" element={<CategoryEdit />} />
              <Route path="quizzes" element={<AdminPanel initialTab="quizzes" />} />
              <Route path="games" element={<AdminPanel initialTab="games" />} />
              <Route path="reviews" element={<AdminPanel initialTab="reviews" />} />
              <Route path="exhibit/:id" element={<ExhibitEdit />} />
              <Route path="exhibit/new" element={<ExhibitEdit isNew={true} />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AuthCheck>
                <AdminDashboard />
              </AuthCheck>
            } />
            <Route path="/admin/exhibits" element={
              <AuthCheck>
                <AdminDashboard activeTab="exhibits" />
              </AuthCheck>
            } />
            <Route path="/admin/quizzes" element={
              <AuthCheck>
                <AdminDashboard activeTab="quizzes" />
              </AuthCheck>
            } />
            <Route path="/admin/games" element={
              <AuthCheck>
                <AdminDashboard activeTab="games" />
              </AuthCheck>
            } />
            <Route path="/admin/reviews" element={
              <AuthCheck>
                <AdminDashboard activeTab="reviews" />
              </AuthCheck>
            } />
            
            {/* Маршруты для редактирования и создания */}
            <Route path="/admin/exhibit/new" element={
              <AuthCheck>
                <ExhibitEdit />
              </AuthCheck>
            } />
            <Route path="/admin/exhibit/:id" element={
              <AuthCheck>
                <ExhibitEdit />
              </AuthCheck>
            } />
            <Route path="/admin/quiz/new" element={
              <AuthCheck>
                <QuizEdit />
              </AuthCheck>
            } />
            <Route path="/admin/quiz/:id" element={
              <AuthCheck>
                <QuizEdit />
              </AuthCheck>
            } />
            <Route path="/admin/game/new" element={
              <AuthCheck>
                <GameEdit />
              </AuthCheck>
            } />
            <Route path="/admin/game/:id" element={
              <AuthCheck>
                <GameEdit />
              </AuthCheck>
            } />
            
            {/* Маршрут для несуществующих страниц */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </I18nextProvider>
  );
}

export default MainApp; 