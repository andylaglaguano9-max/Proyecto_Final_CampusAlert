import { useState } from 'react';
import PropTypes from 'prop-types';
import { Zap, Fuel, Flame, Trash2, Plane } from 'lucide-react';
import styles from './emission-form.module.css';

/**
 * Componente EmissionForm (Estudiante B)
 * Formulario interactivo para capturar el consumo y calcular emisiones.
 */
const EmissionForm = ({ onSubmit, isLoading }) => {
  const [kwh, setKwh] = useState('');
  const [gallons, setGallons] = useState('');
  const [gas, setGas] = useState('');
  const [waste, setWaste] = useState('');
  const [flights, setFlights] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const kwhValue = parseFloat(kwh) || 0;
    const gallonsValue = parseFloat(gallons) || 0;
    const gasValue = parseFloat(gas) || 0;
    const wasteValue = parseFloat(waste) || 0;
    const flightsValue = parseFloat(flights) || 0;

    if (kwhValue < 0 || gallonsValue < 0 || gasValue < 0 || wasteValue < 0 || flightsValue < 0) {
      setError('Por favor, ingresa valores numéricos válidos mayores o iguales a 0.');
      return;
    }

    // Call onSubmit passing an object instead of positional parameters
    onSubmit({ kwh: kwhValue, gallons: gallonsValue, gas: gasValue, waste: wasteValue, flights: flightsValue });
    setKwh('');
    setGallons('');
    setGas('');
    setWaste('');
    setFlights('');
  };

  return (
    <div className={styles.formContainer}>
      <h2>Calcular Huella de Carbono</h2>
      {error && <div className={styles.error} role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.inputGroup}>
          <label htmlFor="kwh"><Zap size={18} /> Consumo Eléctrico (kWh):</label>
          <input
            id="kwh"
            type="number"
            step="0.01"
            min="0"
            value={kwh}
            onChange={(e) => setKwh(e.target.value)}
            placeholder="Ej: 150.5"
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="gallons"><Fuel size={18} /> Combustible (Galones):</label>
          <input
            id="gallons"
            type="number"
            step="0.01"
            min="0"
            value={gallons}
            onChange={(e) => setGallons(e.target.value)}
            placeholder="Ej: 15"
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="gas"><Flame size={18} /> Gas Natural (m³):</label>
          <input
            id="gas"
            type="number"
            step="0.01"
            min="0"
            value={gas}
            onChange={(e) => setGas(e.target.value)}
            placeholder="Ej: 20"
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="waste"><Trash2 size={18} /> Residuos (kg/mes):</label>
          <input
            id="waste"
            type="number"
            step="0.01"
            min="0"
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
            placeholder="Ej: 30"
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="flights"><Plane size={18} /> Vuelos (Horas):</label>
          <input
            id="flights"
            type="number"
            step="0.01"
            min="0"
            value={flights}
            onChange={(e) => setFlights(e.target.value)}
            placeholder="Ej: 2.5"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Calculando...' : 'Calcular Emisiones'}
        </button>
      </form>
    </div>
  );
};

EmissionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default EmissionForm;
