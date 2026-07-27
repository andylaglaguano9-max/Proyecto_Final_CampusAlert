import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function initDB() {
  console.log('⏳ Conectando a MySQL en el puerto 3307...');
  let connection;
  try {
    // Connect WITHOUT database selected to create it if missing
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || undefined,
      port: process.env.DB_PORT || 3307,
    });

    console.log('✅ Conexión a MySQL exitosa.');

    const dbName = process.env.DB_NAME || 'campusalert';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Base de datos '${dbName}' asegurada.`);

    await connection.query(`USE \`${dbName}\``);

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`full_name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`role\` ENUM('student', 'staff', 'admin') DEFAULT 'student',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla users asegurada.');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`incidents\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT NOT NULL,
        \`description\` TEXT NOT NULL,
        \`lat\` DECIMAL(10, 8),
        \`lng\` DECIMAL(11, 8),
        \`image_data\` LONGTEXT,
        \`status\` ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
        \`priority\` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
        \`ai_analysis\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla incidents asegurada.');

    // Insert Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    try {
      await connection.query(
        'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Administrador General', 'admin@campus.com', hashedPassword, 'admin']
      );
      console.log('✅ Administrador (admin@campus.com) creado correctamente.');
    } catch (insertErr) {
      if (insertErr.code === 'ER_DUP_ENTRY') {
        console.log('⚠️ El admin ya existía.');
      } else {
        throw insertErr;
      }
    }

  } catch (error) {
    console.error('❌ Error crítico inicializando la DB:', error);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

initDB();
