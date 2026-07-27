import express from 'express';
import pool from '../database/conexion.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { checkRole } from '../middlewares/authorization.js';

const router = express.Router();

// [PROTEGIDA] Obtener el registro de auditoría (Solo Admin)
router.get('/', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.user_id, u.full_name, u.email, a.action, a.details, a.created_at 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching audit logs', err);
    res.status(500).json({ error: 'Error al obtener el registro de auditoría' });
  }
});

export default router;
