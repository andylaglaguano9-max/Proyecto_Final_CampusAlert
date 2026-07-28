import pool from './database/conexion.js';

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabla audit_logs creada con éxito.');
  } catch (error) {
    console.error('❌ Error creando tabla audit_logs:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
