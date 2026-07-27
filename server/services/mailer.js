import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail SMTP
// Note: Requires Google App Password if using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `http://localhost:5173/verify?token=${token}`;
  
  const mailOptions = {
    from: `"CampusAlert AI" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verifica tu cuenta de CampusAlert AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; background-color: #f8fafc;">
        <h2 style="color: #0f172a; text-align: center;">¡Bienvenido a CampusAlert AI!</h2>
        <p style="color: #334155; font-size: 16px;">
          Gracias por registrarte en nuestra plataforma de gestión de incidentes universitarios. Para empezar a reportar y acceder al dashboard, por favor verifica tu correo electrónico.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verificar Mi Cuenta</a>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">
          Si no creaste esta cuenta, puedes ignorar este mensaje.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};
