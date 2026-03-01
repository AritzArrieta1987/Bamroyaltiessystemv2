-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS bigartist CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bigartist;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('admin', 'user', 'artist', 'manager') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  active BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin por defecto
-- Email: admin@bigartist.es
-- Contraseña: Admin123!
INSERT INTO users (email, password_hash, name, type) VALUES 
('admin@bigartist.es', '$2a$10$rQ8XqKZN5v5Y5YxVZN5Z0OP0fQ8XqKZN5v5Y5YxVZN5Z0OP0fQ8Xq', 'Administrador', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Nota: La contraseña hasheada arriba es temporal. 
-- Ejecuta el script create-admin.js para crear un admin con contraseña real.
