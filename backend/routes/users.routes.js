import express from 'express';
import pool from '../database/conexion.js';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middlewares/authentication.js';
import { checkRole } from '../middlewares/authorization.js';
import { logActivity } from '../services/audit.service.js';

const router = express.Router();

// [PROTEGIDA ADMIN] Obtener todos los usuarios
router.get('/', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// [PROTEGIDA ADMIN/USER] Actualizar usuario
// Un admin puede actualizar a cualquiera. Un usuario normal solo puede actualizarse a sí mismo.
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { full_name, role, password, profile_picture } = req.body;

  // Validación de permisos: Solo admin puede editar otros, y solo admin puede cambiar roles
  if (req.user.role !== 'admin') {
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acceso denegado. No puedes editar a otro usuario.' });
    }
    if (role && role !== req.user.role) {
      return res.status(403).json({ error: 'Acceso denegado. No puedes cambiar tu propio rol.' });
    }
  }

  try {
    const userPrev = await pool.query('SELECT role, email FROM users WHERE id = $1', [id]);
    const oldRole = userPrev.rows[0]?.role;
    const targetEmail = userPrev.rows[0]?.email;

    let updateQuery = 'UPDATE users SET full_name = COALESCE($1, full_name), role = COALESCE($2, role), profile_picture = COALESCE($3, profile_picture)';
    let queryParams = [full_name, role, profile_picture];
    let paramIndex = 4;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += `, password_hash = $${paramIndex}`;
      queryParams.push(hashedPassword);
      paramIndex++;
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING id, full_name, email, role, profile_picture`;
    queryParams.push(id);

    const result = await pool.query(updateQuery, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (req.user.role === 'admin' && role && role !== oldRole) {
      await logActivity(req.user.id, 'CHANGE_ROLE', JSON.stringify({ target_user_id: id, target_email: targetEmail, old_role: oldRole, new_role: role }));
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// [PROTEGIDA ADMIN] Eliminar usuario
router.delete('/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
  const { id } = req.params;
  
  if (req.user.id === parseInt(id)) {
    return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
  }

  try {
    const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [id]);
    const targetEmail = userRes.rows[0]?.email;

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await logActivity(req.user.id, 'DELETE_USER', JSON.stringify({ target_user_id: id, target_email: targetEmail }));
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
