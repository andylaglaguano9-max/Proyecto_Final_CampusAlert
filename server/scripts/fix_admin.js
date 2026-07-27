import pool from './database/conexion.js';
import bcrypt from 'bcryptjs';

async function fixAdmin() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    const res = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@campus.com']);
    
    if (res.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (full_name, email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4, true)',
        ['Administrador General', 'admin@campus.com', hash, 'admin']
      );
      console.log('Admin insertado con éxito en PostgreSQL');
    } else {
      await pool.query(
        'UPDATE users SET password_hash = $1, is_verified = true, role = $2 WHERE email = $3',
        [hash, 'admin', 'admin@campus.com']
      );
      console.log('Admin actualizado con éxito en PostgreSQL');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

fixAdmin();
