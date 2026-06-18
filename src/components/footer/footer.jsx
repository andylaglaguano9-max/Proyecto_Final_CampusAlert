import PropTypes from 'prop-types';
import styles from './footer.module.css';

/**
 * Componente Footer (Estudiante A)
 */
const Footer = ({ text }) => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {year} {text}</p>
        <p className={styles.subtext}>Proyecto Académico - 6to Nivel TI</p>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  text: PropTypes.string.isRequired,
};

Footer.defaultProps = {
  text: 'EcoMetrics SPA',
};

export default Footer;
