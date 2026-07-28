-- Tabla: users
-- Propósito: Almacena credenciales de acceso de los usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: calculations
-- Propósito: Registra el historial de mediciones de huella de carbono por usuario
CREATE TABLE IF NOT EXISTS calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    kwh DECIMAL(10,2) NOT NULL,
    gallons DECIMAL(10,2) NOT NULL,
    gas DECIMAL(10,2) DEFAULT 0,
    waste DECIMAL(10,2) DEFAULT 0,
    flights DECIMAL(10,2) DEFAULT 0,
    total_emissions DECIMAL(10,2) NOT NULL,
    trees_needed INT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
