import express from 'express';
import pool from '../database/conexion.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { checkRole } from '../middlewares/authorization.js';

const router = express.Router();

// [PÚBLICA] Enviar un mensaje de contacto
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, message]
    );
    res.status(201).json({ success: true, message: 'Mensaje enviado correctamente', data: result.rows[0] });
  } catch (err) {
    console.error('Error enviando mensaje de contacto', err);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

// [PROTEGIDA] Obtener todos los mensajes (Solo Admin)
router.get('/', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo mensajes', err);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

// [PROTEGIDA] Marcar mensaje como leído (Solo Admin)
router.put('/:id/read', authenticateToken, checkRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando mensaje', err);
    res.status(500).json({ error: 'Error al actualizar el mensaje' });
  }
});

export default router;
