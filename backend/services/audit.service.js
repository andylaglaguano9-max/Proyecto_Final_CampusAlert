import pool from '../database/conexion.js';

/**
 * Registra una actividad en el sistema para la auditoría.
 * @param {number|null} userId - ID del usuario que realiza la acción (null si es el sistema o usuario no logueado).
 * @param {string} action - Acción realizada (ej. 'CREATE_INCIDENT', 'REGISTER_USER').
 * @param {string} details - Detalles adicionales sobre la acción (en formato JSON string).
 */
export const logActivity = async (userId, action, details) => {
  try {
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [userId, action, details]
    );
  } catch (error) {
    console.error('Error al registrar actividad en audit_logs:', error);
  }
};
