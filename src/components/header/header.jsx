import { Link, NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Leaf } from 'lucide-react';
import { logoutUser } from '../../services/auth-service';
import styles from './header.module.css';

/**
 * Componente principal de encabezado (Estudiante A)
 * Barra de navegación principal de la aplicación SPA
 */
const Header = ({ title, user, setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setAuth(null);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <span className={styles.icon}><Leaf size={24} /></span> {title}
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li><NavLink to="/" className={({isActive}) => isActive ? styles.active : ''}>Inicio</NavLink></li>
            {user && (
              <li><NavLink to="/calculadora" className={({isActive}) => isActive ? styles.active : ''}>Calculadora</NavLink></li>
            )}
            <li><NavLink to="/acerca" className={({isActive}) => isActive ? styles.active : ''}>Acerca de</NavLink></li>
            <li><NavLink to="/equipo" className={({isActive}) => isActive ? styles.active : ''}>Equipo</NavLink></li>
          </ul>
        </nav>
        
        {user && (
          <div className={styles.userControls}>
            <span className={styles.userGreeting}>Hola, <strong>{user.username}</strong></span>
            <button onClick={handleLogout} className={styles.logoutBtn}>Salir</button>
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  user: PropTypes.object,
  setAuth: PropTypes.func
};

Header.defaultProps = {
  title: 'EcoMetrics SPA'
};

export default Header;
