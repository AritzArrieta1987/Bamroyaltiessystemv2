-- BIGARTIST ROYALTIES SYSTEM - DATABASE SCHEMA
-- Creado: 2026-03-02

USE bigartist_db;

-- Tabla de artistas
CREATE TABLE IF NOT EXISTS artists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY idx_artist_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de sellos discográficos
CREATE TABLE IF NOT EXISTS labels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  catalog_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY idx_label_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de releases/álbumes
CREATE TABLE IF NOT EXISTS releases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  label_id INT,
  orchard_upc VARCHAR(50),
  manufacturer_upc VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE SET NULL,
  INDEX idx_release_artist (artist_id),
  INDEX idx_release_upc (orchard_upc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tracks/canciones
CREATE TABLE IF NOT EXISTS tracks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  release_id INT NOT NULL,
  artist_id INT NOT NULL,
  isrc VARCHAR(20),
  volume INT DEFAULT 1,
  track_number INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE CASCADE,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  INDEX idx_track_isrc (isrc),
  INDEX idx_track_release (release_id),
  INDEX idx_track_artist (artist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de plataformas (DSP - Digital Service Provider)
CREATE TABLE IF NOT EXISTS platforms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY idx_platform_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de territorios/países
CREATE TABLE IF NOT EXISTS territories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY idx_territory_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de tipos de transacción
CREATE TABLE IF NOT EXISTS transaction_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY idx_trans_type_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar tipos de transacción comunes
INSERT INTO transaction_types (code, description) VALUES
('S', 'Streaming'),
('AS', 'Ad-Supported Streaming'),
('AV', 'Audio/Video Streaming'),
('SV', 'Subscription Video'),
('D', 'Download')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Tabla principal de royalties (transacciones)
CREATE TABLE IF NOT EXISTS royalties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  period VARCHAR(20) NOT NULL,
  activity_period VARCHAR(20) NOT NULL,
  track_id INT NOT NULL,
  platform_id INT NOT NULL,
  territory_id INT NOT NULL,
  transaction_type_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  net_receipts DECIMAL(15, 6) NOT NULL DEFAULT 0.000000,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
  FOREIGN KEY (territory_id) REFERENCES territories(id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id) ON DELETE CASCADE,
  INDEX idx_royalty_period (period),
  INDEX idx_royalty_track (track_id),
  INDEX idx_royalty_platform (platform_id),
  INDEX idx_royalty_territory (territory_id),
  INDEX idx_royalty_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vista para consultas simplificadas
CREATE OR REPLACE VIEW v_royalties_detailed AS
SELECT 
  r.id,
  r.period,
  r.activity_period,
  a.name AS artist_name,
  rel.name AS release_name,
  t.name AS track_name,
  t.isrc,
  p.name AS platform_name,
  ter.name AS territory_name,
  tt.code AS trans_type,
  tt.description AS trans_type_description,
  r.quantity,
  r.net_receipts,
  r.currency,
  r.created_at
FROM royalties r
INNER JOIN tracks t ON r.track_id = t.id
INNER JOIN artists a ON t.artist_id = a.id
INNER JOIN releases rel ON t.release_id = rel.id
INNER JOIN platforms p ON r.platform_id = p.id
INNER JOIN territories ter ON r.territory_id = ter.id
INNER JOIN transaction_types tt ON r.transaction_type_id = tt.id;

-- Índices para optimizar consultas del dashboard
CREATE INDEX idx_royalties_summary ON royalties(period, platform_id, territory_id);
CREATE INDEX idx_tracks_artist_release ON tracks(artist_id, release_id);
