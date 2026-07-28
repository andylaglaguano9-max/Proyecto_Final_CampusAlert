import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: 'postgresql://postgres:kNimRzgOzmD7r4Gn@db.ucpqxjgmtomzwtktuskp.supabase.co:5432/postgres'
});

async function fixDB() {
  try {
    console.log('Adding missing columns to users table...');
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS profile_picture TEXT;
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    `);
    console.log('Columns added successfully.');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    console.log('Seeding admin user...');
    await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4, true) ON CONFLICT (email) DO NOTHING',
      ['Administrador General', 'admin@campus.com', hashedPassword, 'admin']
    );

    console.log('Seeding staff user...');
    await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role, is_verified) VALUES ($1, $2, $3, $4, true) ON CONFLICT (email) DO NOTHING',
      ['Personal de Mantenimiento', 'staff@campus.com', hashedPassword, 'staff']
    );
    
    console.log('Database fixed and users seeded successfully!');
  } catch (err) {
    console.error('Error fixing DB:', err);
  } finally {
    process.exit(0);
  }
}

fixDB();
