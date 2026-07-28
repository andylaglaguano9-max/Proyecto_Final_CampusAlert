import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import incidentsRoutes from './routes/incidents.routes.js';
import usersRoutes from './routes/users.routes.js';
import chatRoutes from './routes/chat.routes.js';
import auditRoutes from './routes/audit.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas (MVC)
app.use('/api', authRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});

export default app;
