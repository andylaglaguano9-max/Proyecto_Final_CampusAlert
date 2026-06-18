import styles from './equipo.module.css';
import imgAndy from '../../assets/Laglaguano.png';
import imgLarco from '../../assets/Larco.jpeg';

/**
 * Página Equipo (Estudiante A - Laglaguano)
 * Muestra la información de los desarrolladores del proyecto.
 * Implementa un grid responsivo y carga de imágenes dinámicas desde la carpeta assets.
 */
const Equipo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nuestro Equipo</h1>
        <p className={styles.subtitle}>Las mentes creativas detrás de EcoMetrics</p>
      </div>
      {/* Grid de tarjetas para cada desarrollador */}
      <div className={styles.grid}>
        {/* Tarjeta de Desarrollador Frontend */}
        <div className={styles.card}>
          {/* Contenedor de la foto de perfil */}
          <div className={styles.avatarWrapper}>
            {/* Si la imagen falla en cargar, el onError la oculta y muestra las iniciales por defecto */}
            <img src={imgAndy} alt="Andy Laglaguano" className={styles.avatarImage} onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
            <div className={styles.avatar} style={{display: 'none'}}>AL</div>
          </div>
          <h2>Andy Laglaguano</h2>
          <div className={styles.badge}>Frontend & Diseño</div>
          <p className={styles.description}>Especialista en UI/UX y maquetación interactiva. Creador de la experiencia visual y los componentes dinámicos con React.</p>
        </div>
        
        {/* Tarjeta de Desarrollador Backend */}
        <div className={styles.card}>
          <div className={styles.avatarWrapper}>
            <img src={imgLarco} alt="Esteban Larco" className={styles.avatarImage} onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
            <div className={styles.avatar} style={{display: 'none'}}>EL</div>
          </div>
          <h2>Esteban Larco</h2>
          <div className={styles.badge}>Backend & Datos</div>
          <p className={styles.description}>Arquitecto de bases de datos y lógica de servidor. Responsable de la integración con MySQL y despliegue del API.</p>
        </div>
      </div>
    </div>
  );
};

export default Equipo;
