import PropTypes from 'prop-types';
import Header from '../header';
import Footer from '../footer';
import styles from './layout.module.css';

/**
 * Componente Layout (Estudiante A)
 * Envuelve el contenido de la SPA con Header y Footer.
 */
const Layout = ({ user, setAuth, children }) => {
  return (
    <div className={styles.layout}>
      <Header user={user} setAuth={setAuth} />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer text="EcoMetrics SPA" />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  setAuth: PropTypes.func
};

export default Layout;
