# Proyecto P2: Calculadora de Huella de Carbono

Proyecto de Desarrollo Web (Segundo Parcial) para calcular la huella de carbono mensual.

## Integrantes y roles
- Andy Laglaguano: Desarrollo del Frontend (React, Vite, diseño de interfaz) y conexión con la API externa.
- Esteban Larco: Desarrollo del Backend (Node.js, Express), configuración de rutas y Base de datos (MySQL).

## Tecnologías usadas
- Frontend: React con Vite
- Backend: Node.js y Express
- Base de datos: MySQL usando XAMPP

## Instrucciones para correr el proyecto

1. Instalar las dependencias del frontend:
   `npm install`
2. Instalar las dependencias del backend:
   Entrar a la carpeta `/server` y ejecutar `npm install`

## Configuración de Base de datos
1. Prender MySQL en XAMPP.
2. Ir a phpMyAdmin y crear una base de datos llamada `ecometrics`.
3. Copiar el código del archivo `server/database.sql` y ejecutarlo en la pestaña de SQL para crear las tablas.
4. Renombrar el archivo `server/.env.example` a `server/.env`. Si tu MySQL tiene contraseña, ponla ahi.

## Levantar los servidores
Se necesitan abrir dos terminales:

- Terminal 1 (Backend):
  Entrar a la carpeta `/server` y ejecutar `npm start`
  
- Terminal 2 (Frontend):
  En la raíz del proyecto, ejecutar `npm run dev` y abrir el link local.
