import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ModelsPage from './pages/ModelsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import RevisionsPage from './pages/RevisionsPage';
import UsersPage from './pages/UsersPage';
import Navbar from './components/Navbar';

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/models" element={<Protected><ModelsPage /></Protected>} />
          <Route path="/assignments" element={<Protected><AssignmentsPage /></Protected>} />
          <Route path="/revisions" element={<Protected><RevisionsPage /></Protected>} />
          <Route path="/users" element={<Protected><UsersPage /></Protected>} />
        </Routes>
      </AdminProvider>
    </AuthProvider>
  );
}
