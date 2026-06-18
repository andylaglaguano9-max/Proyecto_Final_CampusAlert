/**
 * Servicio de Base de Datos (Estudiante B)
 * Modificado para conectarse al servidor Backend local (Node + Express + MySQL)
 */
import { getCurrentUser } from './auth-service';

const BACKEND_URL = 'http://localhost:3001/api/calculos';

export const guardarCalculo = async (registro) => {
  const user = getCurrentUser();
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user ? user.id : null,
        kwh: registro.kwh,
        gallons: registro.gallons,
        gas: registro.gas,
        waste: registro.waste,
        flights: registro.flights,
        total_emissions: registro.totalEmissions,
        trees_needed: registro.treesNeeded,
        date: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Error al guardar en el backend');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en guardarCalculo:', error);
    return { ...registro, id: Date.now().toString(), date: new Date().toISOString() };
  }
};

export const obtenerHistorial = async () => {
  const user = getCurrentUser();
  try {
    const url = user ? `${BACKEND_URL}?user_id=${user.id}` : BACKEND_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener historial del backend');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerHistorial:', error);
    return [];
  }
};
