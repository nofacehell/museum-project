import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './App.css';

// Импорт компонентов страниц
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Exhibits from './pages/Exhibits';
import ExhibitDetail from './pages/ExhibitDetail';
import Quizzes from './pages/Quizzes';
import QuizPage from './pages/QuizPage';
import Games from './pages/Games';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import GamePage from './pages/GamePage';

// Импорт компонентов админ-панели
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExhibitsManager from './pages/admin/ExhibitsManager';
import ReviewsManager from './pages/admin/ReviewsManager';
import QuizzesManager from './pages/admin/QuizzesManager';
import AdminLogin from './pages/AdminLogin';

// Импорт общих компонентов
import ScrollToTop from './utils/ScrollToTop';

// Компонент для защиты админ-маршрутов
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true' ||
                         localStorage.getItem('isAdminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ChakraProvider>
      <I18nextProvider i18n={i18n}>
        <ScrollToTop />
        <Routes>
          {/* Админ маршруты */}
          <Route path="/admin">
            <Route path="login" element={<AdminLogin />} />
            <Route element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="exhibits" element={<ExhibitsManager />} />
              <Route path="quizzes" element={<QuizzesManager />} />
              <Route path="reviews" element={<ReviewsManager />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          {/* Публичные маршруты */}
          <Route path="/" element={
            <>
              <Header />
              <main className="main-content">
                <Home />
              </main>
              <Footer />
            </>
          } />
          
          <Route element={
            <>
              <Header />
              <main className="main-content">
                <Outlet />
              </main>
              <Footer />
            </>
          }>
            <Route path="/exhibits" element={<Exhibits />} />
            <Route path="/exhibits/:id" element={<ExhibitDetail />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:id" element={<QuizPage />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:gameId" element={<GamePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Маршрут для несуществующих страниц */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </I18nextProvider>
    </ChakraProvider>
  );
}

export default App;