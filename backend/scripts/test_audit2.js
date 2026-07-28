import pool from './database/conexion.js';
pool.query(`
      SELECT a.id, a.user_id, u.full_name, u.email, a.action, a.details, a.created_at 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 100
`)
  .then(res => { console.log('SUCCESS', res.rows); process.exit(0); })
  .catch(err => { console.error('DB ERROR:', err.message); process.exit(1); });
