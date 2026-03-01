const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración
const ADMIN_EMAIL = 'admin@bigartist.es';
const ADMIN_PASSWORD = 'Admin123!'; // Cambia esto
const ADMIN_NAME = 'Administrador BIGARTIST';

async function createAdmin() {
  let connection;
  
  try {
    // Conectar a MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'BigArtist2018!@?',
      database: process.env.DB_NAME || 'bigartist'
    });

    console.log('✅ Conectado a MySQL');

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    console.log('✅ Contraseña hasheada');

    // Insertar o actualizar admin
    const [result] = await connection.query(
      `INSERT INTO users (email, password_hash, name, type) 
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE 
       password_hash = VALUES(password_hash),
       name = VALUES(name),
       type = 'admin'`,
      [ADMIN_EMAIL, passwordHash, ADMIN_NAME]
    );

    if (result.insertId) {
      console.log('✅ Usuario admin creado exitosamente');
    } else {
      console.log('✅ Usuario admin actualizado exitosamente');
    }

    console.log('\n📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Contraseña:', ADMIN_PASSWORD);
    console.log('\n⚠️  Cambia la contraseña después del primer login\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();
