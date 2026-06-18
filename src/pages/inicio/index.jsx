import { Link } from 'react-router-dom';
import { Leaf, Zap, BarChart3, Globe2, ShieldCheck, ArrowRight } from 'lucide-react';
import styles from './inicio.module.css';

/**
 * Página de Inicio (Estudiante A)
 */
const Inicio = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Leaf size={16} /> <span>Plataforma Sostenible 2026</span>
          </div>
          <h1 className={styles.heroTitle}>
            Mide y Reduce tu <span className={styles.highlight}>Huella de Carbono</span>
          </h1>
          <p className={styles.heroSubtitle}>
            EcoMetrics es la herramienta definitiva para entender tu impacto ambiental. 
            Registra tu consumo, descubre áreas de mejora y contribuye a un futuro más verde.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/calculadora" className={styles.primaryBtn}>
              Comenzar a Medir <ArrowRight size={20} />
            </Link>
            <Link to="/acerca" className={styles.secondaryBtn}>
              Saber más
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>¿Por qué usar EcoMetrics?</h2>
          <p>Diseñado para ofrecer la mejor experiencia de usuario con resultados precisos.</p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Zap size={32} />
            </div>
            <h3>Rápido y Fácil</h3>
            <p>Ingresa tus datos de consumo de energía, gasolina o vuelos y obtén resultados instantáneos y fáciles de entender.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <ShieldCheck size={32} />
            </div>
            <h3>Cálculos Precisos</h3>
            <p>Utilizamos fórmulas y factores de emisión actualizados según los estándares ambientales internacionales.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <BarChart3 size={32} />
            </div>
            <h3>Historial Detallado</h3>
            <p>Lleva un registro automatizado de tus cálculos anteriores para analizar tu progreso y reducir tu huella.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <Globe2 size={48} className={styles.ctaIcon} />
          <h2>El planeta te necesita</h2>
          <p>Pequeñas acciones generan grandes cambios. Empieza hoy mismo a medir tu impacto.</p>
          <Link to="/registro" className={styles.ctaBtn}>
            Crear mi cuenta gratis
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
