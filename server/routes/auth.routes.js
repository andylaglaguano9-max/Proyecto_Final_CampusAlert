import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../database/conexion.js';
import { generarToken } from '../config/jwt.js';
import { sendVerificationEmail } from '../services/mailer.js';
import { OAuth2Client } from 'google-auth-library';
import { logActivity } from '../services/audit.service.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Inicio de Sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (!user.is_verified) {
      return res.status(401).json({ error: 'Por favor verifica tu correo electrónico antes de iniciar sesión.' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Esta cuenta fue creada con Google. Usa el botón de Google para iniciar sesión.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = generarToken(user);
    res.json({ token, role: user.role, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, profile_picture: user.profile_picture } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Registrar Nuevo Usuario
router.post('/register', async (req, res) => {
  const { username, password, full_name, role = 'student' } = req.body;

  if (!username || !password || !full_name) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role, is_verified, verification_token) VALUES ($1, $2, $3, $4, false, $5) RETURNING id, full_name, email, role, profile_picture',
      [full_name, username, hashedPassword, role, verificationToken]
    );

    const user = result.rows[0];
    
    // Registrar actividad
    await logActivity(user.id, 'REGISTER_USER', JSON.stringify({ email: user.email, role: user.role }));

    // Enviar correo de verificación
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      mensaje: 'Registro exitoso. Por favor revisa tu correo institucional para verificar tu cuenta.',
      requiresVerification: true
    });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Error del servidor al registrar' });
  }
});

// Verificar Correo
router.post('/verify', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token de verificación no proporcionado' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    await pool.query('UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1', [user.id]);
    await logActivity(user.id, 'VERIFY_EMAIL', JSON.stringify({ email: user.email }));

    res.json({ mensaje: 'Correo verificado exitosamente. Ya puedes iniciar sesión.' });
  } catch (err) {
    console.error('Verify error', err);
    res.status(500).json({ error: 'Error del servidor al verificar' });
  }
});

// Autenticación con Google
router.post('/auth/google', async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: google_id, picture } = payload;

    // Buscar si el usuario ya existe
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    if (!user) {
      // Registrar al usuario automáticamente si no existe
      const insertResult = await pool.query(
        'INSERT INTO users (full_name, email, role, is_verified, google_id, profile_picture) VALUES ($1, $2, $3, true, $4, $5) RETURNING *',
        [name, email, 'student', google_id, picture]
      );
      user = insertResult.rows[0];
      await logActivity(user.id, 'REGISTER_USER_GOOGLE', JSON.stringify({ email: user.email }));
    } else {
      // Si el usuario existe, pero no tiene google_id vinculado, actualizarlo y marcarlo como verificado
      if (!user.google_id || !user.profile_picture) {
        const updateResult = await pool.query('UPDATE users SET google_id = $1, is_verified = true, profile_picture = COALESCE(profile_picture, $2) WHERE id = $3 RETURNING *', [google_id, picture, user.id]);
        user = updateResult.rows[0];
        await logActivity(user.id, 'LINK_GOOGLE_ACCOUNT', JSON.stringify({ email: user.email }));
      }
    }

    const token = generarToken(user);
    res.json({ token, role: user.role, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, profile_picture: user.profile_picture } });
  } catch (err) {
    console.error('Google Auth error', err);
    res.status(401).json({ error: 'Autenticación con Google fallida' });
  }
});

export default router;
