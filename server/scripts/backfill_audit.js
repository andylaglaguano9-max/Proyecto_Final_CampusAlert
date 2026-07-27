import pool from './database/conexion.js';

async function backfill() {
  try {
    console.log('Iniciando backfill de auditoría...');

    // 1. Usuarios
    const usersRes = await pool.query('SELECT id, email, role, created_at FROM users');
    let usersCount = 0;
    for (const user of usersRes.rows) {
      // Verificar si ya existe un log para este usuario
      const logRes = await pool.query("SELECT id FROM audit_logs WHERE user_id = $1 AND action = 'REGISTER_USER'", [user.id]);
      if (logRes.rows.length === 0) {
        await pool.query(
          "INSERT INTO audit_logs (user_id, action, details, created_at) VALUES ($1, 'REGISTER_USER', $2, $3)",
          [user.id, JSON.stringify({ email: user.email, role: user.role }), user.created_at]
        );
        usersCount++;
      }
    }
    console.log(`Backfill de usuarios: ${usersCount} registros insertados.`);

    // 2. Incidentes
    const incidentsRes = await pool.query('SELECT id, user_id, priority, status, created_at FROM incidents');
    let incidentsCount = 0;
    for (const inc of incidentsRes.rows) {
      // Verificar si ya existe un log para este incidente
      const logRes = await pool.query("SELECT id FROM audit_logs WHERE action = 'CREATE_INCIDENT' AND details LIKE $1", [`%${inc.id}%`]);
      if (logRes.rows.length === 0) {
        await pool.query(
          "INSERT INTO audit_logs (user_id, action, details, created_at) VALUES ($1, 'CREATE_INCIDENT', $2, $3)",
          [inc.user_id, JSON.stringify({ incident_id: inc.id, priority: inc.priority }), inc.created_at]
        );
        incidentsCount++;
      }
    }
    console.log(`Backfill de incidentes: ${incidentsCount} registros insertados.`);

    console.log('Backfill completado exitosamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error durante el backfill:', err);
    process.exit(1);
  }
}

backfill();
