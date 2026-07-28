import bcrypt from 'bcryptjs';
import pool from './database/conexion.js';

async function setup() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashAdmin = await bcrypt.hash('admin123', salt);
    const hashOp = await bcrypt.hash('operador123', salt);

    const admin = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@campus.com']);
    if (admin.rows.length === 0) {
      await pool.query('INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)', ['Administrador General', 'admin@campus.com', hashAdmin, 'admin']);
    } else {
      await pool.query('UPDATE users SET password_hash = $1, role = $2 WHERE email = $3', [hashAdmin, 'admin', 'admin@campus.com']);
    }

    const op = await pool.query('SELECT id FROM users WHERE email = $1', ['operador@campus.com']);
    if (op.rows.length === 0) {
      await pool.query('INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4)', ['Operador de Mantenimiento', 'operador@campus.com', hashOp, 'operador']);
    } else {
      await pool.query('UPDATE users SET password_hash = $1, role = $2 WHERE email = $3', [hashOp, 'operador', 'operador@campus.com']);
    }

    console.log('Usuarios configurados exitosamente');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

setup();
