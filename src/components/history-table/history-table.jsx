import PropTypes from 'prop-types';
import { Leaf } from 'lucide-react';
import styles from './history-table.module.css';

/**
 * Componente HistoryTable (Estudiante A)
 * Tabla que muestra el historial de cálculos de huella de carbono.
 */
const HistoryTable = ({ history }) => {
  return (
    <div className={styles.tableContainer}>
      <h2>Historial de Cálculos</h2>
      {history.length === 0 ? (
        <p className={styles.emptyState}>No hay cálculos registrados aún.</p>
      ) : (
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Electricidad (kWh)</th>
                <th>Gasolina (Gal)</th>
                <th>Gas Natural (m³)</th>
                <th>Residuos (kg)</th>
                <th>Vuelos (h)</th>
                <th>Total CO2 (kg)</th>
                <th>Árboles a Plantar</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => (
                <tr key={record.id || index}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.kwh}</td>
                  <td>{record.gallons}</td>
                  <td>{record.gas || 0}</td>
                  <td>{record.waste || 0}</td>
                  <td>{record.flights || 0}</td>
                  <td className={styles.totalCol}>{record.total_emissions || record.totalEmissions}</td>
                  <td className={styles.treesCol}>
                    {record.trees_needed || record.treesNeeded} <Leaf size={16} className={styles.leafIcon} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

HistoryTable.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.string.isRequired,
      kwh: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      gallons: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      gas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      waste: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      flights: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      total_emissions: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalEmissions: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      trees_needed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      treesNeeded: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default HistoryTable;
