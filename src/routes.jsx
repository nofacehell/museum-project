import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Exhibits from './pages/Exhibits';
import Quizzes from './pages/Quizzes';
import Games from './pages/Games';
import MemoryGame from './pages/MemoryGame';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/exhibits",
    element: <Exhibits />,
  },
  {
    path: "/quizzes",
    element: <Quizzes />,
  },
  {
    path: "/games",
    element: <Games />,
  },
  {
    path: "/memory-game",
    element: <MemoryGame />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
