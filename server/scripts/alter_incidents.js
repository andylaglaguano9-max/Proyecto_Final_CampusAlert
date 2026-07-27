import pool from './database/conexion.js';

async function alterTable() {
  try {
    console.log('Alterando tabla incidents...');
    await pool.query('ALTER TABLE incidents ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;');
    
    // Si ya hay algunos resueltos, pongámosles una fecha aproximada
    await pool.query("UPDATE incidents SET resolved_at = created_at + interval '2 hours' WHERE status = 'resolved' AND resolved_at IS NULL;");
    
    console.log('✅ Columna resolved_at agregada exitosamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error alterando la tabla:', err);
    process.exit(1);
  }
}

alterTable();
