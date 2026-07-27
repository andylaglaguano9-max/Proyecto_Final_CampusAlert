import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getOfflineIncidents, clearOfflineIncident } from './services/db';
import Navbar from './components/navbar/index.jsx';
import Dashboard from './pages/dashboard/index.jsx';
import Report from './pages/report/index.jsx';
import Login from './pages/login/index.jsx';
import Chatbot from './components/chatbot/index.jsx';
import Home from './pages/home/index.jsx';
import Analytics from './pages/analytics/index.jsx';
import About from './pages/about/index.jsx';
import AuditPanel from './pages/audit/index.jsx';
import UsersPanel from './pages/users/index.jsx';
import Contact from './pages/contact';
import Messages from './pages/messages';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Verify from './pages/verify/index.jsx';
import ProfilePanel from './pages/profile/index.jsx';

// Componente para proteger rutas por rol
const ProtectedRoute = ({ isAllowed, redirectPath = '/dashboard', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (e) {}
    } else {
      setUserRole('student');
    }

    // Axios Interceptor para manejar tokens expirados (401)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          window.location.href = '/login'; // Redirección dura segura
        }
        return Promise.reject(error);
      }
    );

    const handleOnline = async () => {
      const offlineData = await getOfflineIncidents();
      if (offlineData.length > 0) {
        toast('Sincronizando reportes guardados...');
        const currentToken = localStorage.getItem('token');
        for (const inc of offlineData) {
          try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents`, inc, {
              headers: { Authorization: `Bearer ${currentToken}` }
            });
            await clearOfflineIncident(inc.id);
          } catch (err) {
            console.error('Error syncing incident', err);
          }
        }
        toast.success('Sincronización completada con éxito');
      }
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
      axios.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}>
      <Router>
        <div className="min-h-screen bg-transparent text-slate-100 flex flex-col">
          <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <main className="flex-1 p-4 md:p-8 relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/reportar" element={isAuthenticated ? <Report /> : <Navigate to="/login" replace />} />
              <Route path="/profile" element={isAuthenticated ? <ProfilePanel /> : <Navigate to="/login" replace />} />
              <Route path="/verify" element={<Verify />} />

              {/* Rutas Protegidas para Administradores */}
              <Route path="/messages" element={
                <ProtectedRoute isAllowed={isAuthenticated && userRole === 'admin'}>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/audit" element={
                <ProtectedRoute isAllowed={isAuthenticated && userRole === 'admin'}>
                  <AuditPanel />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute isAllowed={isAuthenticated && userRole === 'admin'}>
                  <UsersPanel />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Chatbot />
        <Toaster position="top-right" toastOptions={{ className: 'bg-slate-800 text-white' }} />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
