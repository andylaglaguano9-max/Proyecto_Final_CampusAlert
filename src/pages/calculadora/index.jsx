import { useState, useEffect } from 'react';
import EmissionForm from '../../components/emission-form';
import HistoryTable from '../../components/history-table';
import { calculateEmissions, fetchHistory } from '../../services/carbon-service';
import styles from './calculadora.module.css';

/**
 * Página Calculadora (Estudiante B)
 * Integra el formulario de emisiones y la tabla de historial.
 * Maneja el estado y los efectos secundarios.
 */
const Calculadora = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar historial al montar el componente
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (err) {
        setError('Error al cargar el historial.');
        console.error(err);
      }
    };
    loadHistory();
  }, []);

  const handleCalculate = async (inputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const savedRecord = await calculateEmissions(inputs);
      setHistory(prev => [...prev, savedRecord]);
    } catch (err) {
      setError('Error al realizar el cálculo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Calculadora de Huella de Carbono</h1>
      {error && <div className={styles.errorAlert}>{error}</div>}
      
      <div className={styles.content}>
        <div className={styles.formSection}>
          <EmissionForm onSubmit={handleCalculate} isLoading={isLoading} />
        </div>
        <div className={styles.historySection}>
          <HistoryTable history={history} />
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
