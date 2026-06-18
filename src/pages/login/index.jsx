import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/auth-service';
import styles from './login.module.css';

// Componente de inicio de sesión de la aplicación
const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Manejo del envío del formulario de credenciales
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Petición al servidor y asignación de la sesión activa
      const user = await loginUser(username, password);
      setAuth(user);
      navigate('/calculadora');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Iniciar Sesión</h2>
        <p>Bienvenido de nuevo a EcoMetrics SPA</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Entrar</button>
        </form>
        
        <div className={styles.footer}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
