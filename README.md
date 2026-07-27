# CampusAlert

**CampusAlert** es una plataforma moderna para el reporte de incidentes y daños en infraestructura universitaria (como laboratorios, aulas y pasillos). El sistema permite a estudiantes y profesores reportar daños en tiempo real (con fotos, ubicación GPS y descripciones), y utiliza **Inteligencia Artificial (Gemini)** para analizar la urgencia del reporte.

---

## Características Principales

- Captura de Evidencias: Permite tomar fotos directamente desde la cámara web o subir imágenes del dispositivo.
- Geolocalización: Ubica automáticamente el incidente usando el GPS del usuario para mostrar coordenadas exactas.
- Análisis por IA: Integración con Google Gemini para evaluar los reportes, asignar prioridades automáticas y resumir el problema para el equipo de mantenimiento.
- Modo Offline: Aplicación Web Progresiva (PWA). Si el usuario no tiene internet en el campus, el reporte se guarda localmente en IndexedDB y se sincroniza automáticamente al recuperar la conexión.
- Asistente Virtual (Chatbot): Un bot impulsado por IA para resolver dudas frecuentes y ayudar a los usuarios.
- Panel de Administración (Dashboard): Vista exclusiva para administradores donde pueden ver estadísticas en vivo, atender incidentes y generar reportes de auditoría.
- Seguridad y Auditoría: Autenticación con JWT, Google Login y un registro de logs inmutable para cumplir con estándares ISO.

---

## Tecnologías Usadas

**Frontend:**
- React 18 con Vite
- Tailwind CSS (Estilos) y Framer Motion (Animaciones)
- Lucide React (Íconos)
- PWA (Vite PWA Plugin) & IndexedDB

**Backend:**
- Node.js y Express
- PostgreSQL (Base de datos alojada en Supabase)
- Google Gemini AI SDK
- Nodemailer (Correos transaccionales)
- JSON Web Tokens (JWT) & bcrypt

---

## Instrucciones para desarrollo local

### 1. Clonar e Instalar
Clona este repositorio en tu máquina y luego instala las dependencias:

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 2. Configurar Base de Datos y Variables de Entorno
1. Crea una base de datos en PostgreSQL.
2. Ejecuta el script `server/scripts/campusalert.sql` en tu base de datos para crear todas las tablas, vistas y funciones necesarias.
3. En la carpeta `/server`, renombra el archivo `.env.example` a `.env` y llena los datos con tus credenciales (Base de datos, JWT Secret, Token de Gemini, etc).

### 3. Levantar los servidores
Se necesitan dos terminales corriendo simultáneamente:

- **Terminal 1 (Backend):**
  ```bash
  cd server
  npm start
  ```
  
- **Terminal 2 (Frontend):**
  ```bash
  npm run dev
  ```
  Abre el enlace local (usualmente `http://localhost:5173`).

---

## Integrantes del Equipo

- **Andy Laglaguano**
