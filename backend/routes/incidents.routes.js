import express from 'express';
import pool from '../database/conexion.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { checkRole } from '../middlewares/authorization.js';
import { logActivity } from '../services/audit.service.js';

const router = express.Router();

// [PÚBLICA] Obtener estadísticas generales de todos los reportes
router.get('/stats', async (req, res) => {
  try {
    // Solo enviamos prioridad y fecha, nada de datos sensibles o descripciones
    const result = await pool.query(
      `SELECT priority, created_at FROM incidents WHERE is_deleted = false`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stats', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// [PROTEGIDA] Obtener incidentes (Admin/Operador: Todos | User: Solo los suyos)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      // Admin ve absolutamente todo (incluyendo eliminados)
      result = await pool.query(
        `SELECT i.*, u.full_name as reporter_name 
         FROM incidents i 
         JOIN users u ON i.user_id = u.id 
         ORDER BY i.created_at DESC`
      );
    } else if (req.user.role === 'operador') {
      // Operador ve todo pero SOLO los NO eliminados
      result = await pool.query(
        `SELECT i.*, u.full_name as reporter_name 
         FROM incidents i 
         JOIN users u ON i.user_id = u.id 
         WHERE i.is_deleted = false
         ORDER BY i.created_at DESC`
      );
    } else {
      // Usuario normal ve SOLO los suyos y NO eliminados
      result = await pool.query(
        `SELECT i.*, u.full_name as reporter_name 
         FROM incidents i 
         JOIN users u ON i.user_id = u.id 
         WHERE i.user_id = $1 AND i.is_deleted = false
         ORDER BY i.created_at DESC`,
         [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching incidents', err);
    res.status(500).json({ error: 'Error al obtener incidentes' });
  }
});

// [PROTEGIDA] Obtener MIS incidentes (User)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM incidents WHERE user_id = $1 AND is_deleted = false ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching my incidents', err);
    res.status(500).json({ error: 'Error al obtener mis incidentes' });
  }
});

// [PROTEGIDA] Crear un nuevo reporte (Cualquier usuario)
router.post('/', authenticateToken, async (req, res) => {
  const { description, lat, lng, image_data, priority, location_text } = req.body;
  const user_id = req.user.id;
  const incPriority = priority || 'medium';

  try {
    const result = await pool.query(
      `INSERT INTO incidents (user_id, description, lat, lng, image_data, status, priority, location_text) 
       VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7) RETURNING *`,
      [user_id, description, lat, lng, image_data, incPriority, location_text]
    );
    const incident = result.rows[0];
    await logActivity(user_id, 'CREATE_INCIDENT', JSON.stringify({ incident_id: incident.id, priority: incPriority }));
    res.status(201).json(incident);
  } catch (err) {
    console.error('Error creating incident', err);
    res.status(500).json({ error: 'Error al crear el incidente' });
  }
});

// [PROTEGIDA] Editar la descripción del reporte (Solo si es pending y autor)
router.put('/:id/edit', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  
  try {
    const incidentRes = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
    const incident = incidentRes.rows[0];
    
    if (!incident || incident.is_deleted) return res.status(404).json({ error: 'Incidente no encontrado' });
    
    // Solo el autor o admin pueden editar
    if (incident.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para editar este incidente' });
    }
    
    if (incident.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ error: 'Solo se pueden editar incidentes pendientes' });
    }

    if (req.user.role !== 'admin') {
      const createdAt = new Date(incident.created_at);
      const minutesDiff = (new Date() - createdAt) / (1000 * 60);
      if (minutesDiff > 10) {
        return res.status(400).json({ error: 'Ya no puedes editar este reporte (han pasado más de 10 minutos)' });
      }
    }

    const result = await pool.query(
      'UPDATE incidents SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );
    await logActivity(req.user.id, 'EDIT_INCIDENT', JSON.stringify({ incident_id: id }));
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error editing incident', err);
    res.status(500).json({ error: 'Error al editar el incidente' });
  }
});

// [PROTEGIDA] Actualizar estado de un incidente (Admin y Operador)
router.put('/:id', authenticateToken, checkRole(['admin', 'operador']), async (req, res) => {
  const { id } = req.params;
  const { status, priority, ai_analysis, resolution_comment } = req.body;

  try {
    const result = await pool.query(
      `UPDATE incidents 
       SET status = COALESCE($1, status), 
           priority = COALESCE($2, priority),
           ai_analysis = COALESCE($3, ai_analysis),
           resolution_comment = CASE WHEN $1 = 'resolved' THEN $4 ELSE resolution_comment END,
           resolved_at = CASE WHEN $1 = 'resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END
       WHERE id = $5 RETURNING *`,
      [status, priority, ai_analysis, resolution_comment, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    const incident = result.rows[0];
    let duration = null;

    if (status === 'resolved' && incident.created_at && incident.resolved_at) {
      const created = new Date(incident.created_at);
      const resolved = new Date(incident.resolved_at);
      const diffMs = resolved - created;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      duration = `${hours}h ${mins}m`;
    }
    
    await logActivity(req.user.id, 'UPDATE_INCIDENT_STATUS', JSON.stringify({ 
      incident_id: id, 
      status, 
      priority,
      duration,
      resolution_comment
    }));
    res.json(incident);
  } catch (err) {
    console.error('Error updating incident', err);
    res.status(500).json({ error: 'Error al actualizar el incidente' });
  }
});

// [PROTEGIDA] Eliminar incidente (Soft Delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const incidentRes = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
    const incident = incidentRes.rows[0];

    if (!incident) return res.status(404).json({ error: 'Incidente no encontrado' });

    // Permisos para eliminar
    const isAdmin = req.user.role === 'admin';
    const isOwner = incident.user_id === req.user.id;
    
    if (req.user.role === 'operador') {
      return res.status(403).json({ error: 'Los operadores no tienen permiso para eliminar incidentes' });
    }

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este incidente' });
    }

    // Regla de 24 horas para estudiantes
    if (!isAdmin) {
      const createdAt = new Date(incident.created_at);
      const now = new Date();
      const minutesDiff = (now - createdAt) / (1000 * 60);
      
      if (minutesDiff > 10) {
        return res.status(400).json({ error: 'Ya no puedes eliminar este reporte (han pasado más de 10 minutos)' });
      }

      if (incident.status === 'resolved') {
        return res.status(400).json({ error: 'No puedes eliminar un reporte que ya ha sido resuelto' });
      }
    }

    const result = await pool.query(
      'UPDATE incidents SET is_deleted = true, deleted_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    
    await logActivity(req.user.id, 'DELETE_INCIDENT', JSON.stringify({ incident_id: id }));
    res.json({ mensaje: 'Incidente eliminado lógicamente de forma exitosa' });
  } catch (err) {
    console.error('Error deleting incident', err);
    res.status(500).json({ error: 'Error al eliminar el incidente' });
  }
});

export default router;
