import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_campusalert_key_123';

export const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, role: usuario.role, username: usuario.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const getJwtSecret = () => JWT_SECRET;
