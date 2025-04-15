import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Импорт компонентов страниц
import Home from './pages/Home';
import Exhibits from './pages/Exhibits';
import ExhibitDetail from './pages/ExhibitDetail';
import Quizzes from './pages/Quizzes';
import QuizPage from './pages/QuizPage';
import Games from './pages/Games';
import ArtistGame from './pages/ArtistGame';
import MemoryGame from './pages/MemoryGame';
import StyleGame from './pages/StyleGame';
import TimelineGame from './pages/TimelineGame';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Импорт компонентов админ-панели
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import ExhibitEdit from './pages/admin/ExhibitEdit';
import QuizEdit from './pages/admin/QuizEdit';
import GameEdit from './pages/admin/GameEdit';
import AdminLogin from './pages/AdminLogin';
import AuthCheck from './components/AuthCheck';

// Импорт общих компонентов
import Header from './components/Header';
import Footer from './components/Footer';

// Импорт утилит
import ScrollToTop from './utils/ScrollToTop';

function App() {
  const location = useLocation();
  // HashRouter использует URL в формате /#/path
  const pathname = location.pathname;
  const isAdminRoute = pathname.includes('/admin');
  
  return (
    <>
      <ScrollToTop />
      
      {/* Отображаем Header только если это не админ-маршрут */}
      {!isAdminRoute && <Header />}
      
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
        <Route path="/admin" element={<Admin />} />
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
        
        {/* Маршрут для неизвестных путей */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Отображаем Footer только если это не админ-маршрут */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;