import { Leaf, Monitor, Database } from 'lucide-react';
import styles from './acerca.module.css';

/**
 * Página Acerca de (Estudiante A)
 */
const Acerca = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Acerca de EcoMetrics</h1>
        <p className={styles.subtitle}>Tecnología al servicio del medio ambiente</p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <Leaf size={48} color="var(--primary-color)" />
          </div>
          <h2>Nuestra Misión</h2>
          <p>
            Proveer una herramienta accesible e intuitiva para concientizar sobre el impacto ambiental, 
            permitiendo calcular la masa de CO2 generada y proporcionar un algoritmo numérico de mitigación.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <Monitor size={48} color="var(--primary-color)" />
          </div>
          <h2>El Proyecto</h2>
          <p>
            EcoMetrics es una Single Page Application (SPA) desarrollada como proyecto académico para la 
            asignatura de Desarrollo Web de 6to Nivel.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.icon}>
            <Database size={48} color="var(--primary-color)" />
          </div>
          <h2>Conexión Real</h2>
          <p>
            Implementamos conexión directa a bases de datos MySQL y consumo de APIs de Intensidad de Carbono (UK) 
            en tiempo real para realizar cálculos ultra precisos.
          </p>
        </div>

        <div className={styles.cardFull}>
          <h2>Algoritmo de Mitigación</h2>
          <p>El sistema utiliza un análisis cuantitativo basado en los siguientes factores de conversión:</p>
          <div className={styles.formulaGrid}>
            <div className={styles.formulaBox}>
              <span className={styles.formulaLabel}>Emisiones Totales</span>
              <code>
                E_total = <br />
                &nbsp;&nbsp;(kWh * Factor_Elec) + <br />
                &nbsp;&nbsp;(Galones * 10.15) + <br />
                &nbsp;&nbsp;(Gas * 6.0) + <br />
                &nbsp;&nbsp;(Vuelos * 90.0) + <br />
                &nbsp;&nbsp;(Desechos * 0.5)
              </code>
            </div>
            <div className={styles.formulaBox}>
              <span className={styles.formulaLabel}>Compensación</span>
              <code>Árboles a plantar = Ceil(E_total_kg / 22)</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acerca;
