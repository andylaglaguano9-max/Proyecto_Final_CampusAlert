# Documentacion de la API de EcoMetrics

API REST para registrar usuarios y almacenar calculos de huella de carbono.

## Resumen

- Version: `1.0.0`
- Base URL: `http://localhost:3001/api`
- Formato: JSON
- Base de datos: MySQL
- Autenticacion: usuario y contrasena con `bcrypt`

## Inicio rapido

1. Configura las variables de entorno en `server/.env`.
2. Inicia el servidor del backend.
3. Usa los endpoints descritos a continuacion para registrar usuarios, iniciar sesion y gestionar calculos.

## Endpoints

### Health Check

`GET /api/health`

Verifica que el servidor este activo.

**Respuesta 200 OK**

```json
{
  "status": "ok",
  "timestamp": "2026-06-17T14:30:00.000Z"
}
```

### Registrar usuario

`POST /api/register`

Crea un nuevo usuario. La contrasena se guarda como hash usando `bcrypt`.

**Body**

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `username` | string | Si | Nombre de usuario unico |
| `password` | string | Si | Contrasena del usuario |

**Ejemplo**

```json
{
  "username": "esteban_larco",
  "password": "secreto123"
}
```

**Respuesta 201 Created**

```json
{
  "id": 1,
  "username": "esteban_larco"
}
```

**Errores comunes**

- `400 Bad Request`: Faltan campos o el nombre de usuario ya existe.
- `500 Internal Server Error`: Error del servidor al crear el usuario.

### Iniciar sesion

`POST /api/login`

Valida las credenciales del usuario y retorna sus datos basicos.

**Body**

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `username` | string | Si | Nombre de usuario |
| `password` | string | Si | Contrasena del usuario |

**Ejemplo**

```json
{
  "username": "esteban_larco",
  "password": "secreto123"
}
```

**Respuesta 200 OK**

```json
{
  "id": 1,
  "username": "esteban_larco"
}
```

**Errores comunes**

- `400 Bad Request`: Faltan campos.
- `401 Unauthorized`: Credenciales invalidas.
- `500 Internal Server Error`: Error del servidor durante el inicio de sesion.

### Obtener calculos

`GET /api/calculos`

Retorna el historial de calculos de huella de carbono.

**Parametros de consulta**

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `user_id` | number | No | Filtra los resultados por id de usuario |

**Ejemplo**

```bash
GET http://localhost:3001/api/calculos?user_id=1
```

**Respuesta 200 OK**

```json
[
  {
    "id": 10,
    "user_id": 1,
    "kwh": 150.5,
    "gallons": 15,
    "gas": 20,
    "waste": 30,
    "flights": 2.5,
    "total_emissions": 245.32,
    "trees_needed": 12,
    "date": "2026-06-17T10:25:00.000Z"
  }
]
```

### Crear calculo

`POST /api/calculos`

Guarda un nuevo calculo en la base de datos.

**Body**

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `user_id` | number | No | Usuario asociado al calculo |
| `kwh` | number | Si | Consumo electrico en kWh |
| `gallons` | number | Si | Consumo de combustible en galones |
| `gas` | number | No | Gas natural en m3. Valor por defecto: `0` |
| `waste` | number | No | Residuos en kg/mes. Valor por defecto: `0` |
| `flights` | number | No | Vuelos en horas. Valor por defecto: `0` |
| `total_emissions` | number | Si | Emisiones totales en kg CO2 |
| `trees_needed` | number | Si | Arboles necesarios para compensacion |
| `date` | string | No | Fecha en formato ISO 8601. Si no se envia, se usa la fecha actual |

**Ejemplo**

```json
{
  "user_id": 1,
  "kwh": 150.5,
  "gallons": 15,
  "gas": 20,
  "waste": 30,
  "flights": 2.5,
  "total_emissions": 245.32,
  "trees_needed": 12,
  "date": "2026-06-17T10:25:00.000Z"
}
```

**Respuesta 201 Created**

```json
{
  "id": 10,
  "user_id": 1,
  "kwh": 150.5,
  "gallons": 15,
  "gas": 20,
  "waste": 30,
  "flights": 2.5,
  "total_emissions": 245.32,
  "trees_needed": 12,
  "date": "2026-06-17T10:25:00.000Z"
}
```

**Errores comunes**

- `500 Internal Server Error`: Error al guardar el calculo.

## Codigos de estado HTTP

| Codigo | Significado | Uso |
| --- | --- | --- |
| `200` | OK | `GET /api/health`, `GET /api/calculos`, `POST /api/login` |
| `201` | Created | `POST /api/register`, `POST /api/calculos` |
| `400` | Bad Request | Errores de validacion o campos faltantes |
| `401` | Unauthorized | Credenciales invalidas en el inicio de sesion |
| `500` | Internal Server Error | Errores de base de datos o del servidor |

## Notas tecnicas

- El pool de conexiones de MySQL se configura mediante variables de entorno.
- Las contrasenas nunca se almacenan en texto plano. Se usan hashes con `bcryptjs` y 10 rondas de sal.
- CORS esta habilitado para el desarrollo local del frontend.
- El servidor cierra el pool de MySQL de forma ordenada al recibir senales de apagado.
- El esquema de la base de datos esta definido en `server/database.sql` con las tablas `users` y `calculations`.

## Variables de entorno

| Variable | Descripcion |
| --- | --- |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contrasena de MySQL |
| `DB_HOST` | Host de MySQL |
| `DB_PORT` | Puerto de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `PORT` | Puerto del backend |
