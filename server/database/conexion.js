import pkg from 'pg';
const { Pool, types } = pkg;
import dotenv from 'dotenv';

// Tratar 'timestamp without time zone' (OID 1114) como UTC
types.setTypeParser(1114, str => new Date(str + 'Z'));

dotenv.config();

const pool = new Pool({
  host: (process.env.DB_HOST || 'localhost').trim(),
  user: (process.env.DB_USER || 'postgres').trim(),
  password: (process.env.DB_PASSWORD || 'postgres').trim(),
  database: (process.env.DB_NAME || 'campusalert').trim(),
  port: parseInt((process.env.DB_PORT || '5432').trim(), 10),
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

export default pool;
