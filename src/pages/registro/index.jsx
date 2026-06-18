import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/auth-service';
import styles from '../login/login.module.css';

const Registro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await registerUser(username, password);
      setSuccess('Usuario registrado con éxito. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Crear Cuenta</h2>
        <p>Únete a EcoMetrics para guardar tu historial</p>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="reg-username">Nuevo Usuario</label>
            <input 
              type="text" 
              id="reg-username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="reg-password">Nueva Contraseña</label>
            <input 
              type="password" 
              id="reg-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Registrarse</button>
        </form>
        
        <div className={styles.footer}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;
