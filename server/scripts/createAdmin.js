import pool from './database/conexion.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    const hashed = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      ['Admin', 'admin@universidad.edu', hashed, 'admin']
    );
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
