import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout';
import Inicio from './pages/inicio';
import Calculadora from './pages/calculadora';
import Acerca from './pages/acerca';
import Equipo from './pages/equipo';
import Login from './pages/login';
import Registro from './pages/registro';
import { getCurrentUser } from './services/auth-service';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificación de sesión activa al montar el componente
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Visualización de rutas de autenticación en caso de no existir sesión */}
        {!user ? (
          <>
            <Route path="/login" element={<Login setAuth={setUser} />} />
            <Route path="/registro" element={<Registro />} />
            {/* Redirección a la página de login para rutas no autorizadas */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          /* Envolvimiento de rutas privadas con el Layout principal */
          <Route element={<Layout user={user} setAuth={setUser}><OutletWrapper /></Layout>}>
            <Route path="/" element={<Inicio />} />
            <Route path="/calculadora" element={<Calculadora />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/equipo" element={<Equipo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

// Componente auxiliar para la integración de Layout y Outlet
import { Outlet } from 'react-router-dom';
const OutletWrapper = () => <Outlet />;

export default App;
