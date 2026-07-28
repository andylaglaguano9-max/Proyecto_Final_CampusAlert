import pool from './database/conexion.js';
pool.query('SELECT * FROM audit_logs LIMIT 1')
  .then(res => { console.log('SUCCESS', res.rows); process.exit(0); })
  .catch(err => { console.error('DB ERROR:', err.message); process.exit(1); });
