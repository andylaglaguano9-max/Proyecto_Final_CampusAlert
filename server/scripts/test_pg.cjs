const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'campusalert',
  port: process.env.DB_PORT || 5432,
});

pool.query('SELECT current_database();', (err, res) => {
  if (err) {
    console.error('Error connecting:', err.message);
  } else {
    console.log('Connected to database:', res.rows[0].current_database);
  }
  pool.end();
});
