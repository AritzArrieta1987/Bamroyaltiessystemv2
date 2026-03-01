const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'BigArtist2018!@?',
  database: process.env.DB_NAME || 'bigartist',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Secret para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist-secret-key-change-in-production';

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(403).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// **ENDPOINT: Login**
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario en la base de datos
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    const user = rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// **ENDPOINT: Verificar token**
app.get('/api/verify', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, name, type FROM users WHERE id = ?',
      [req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      user: rows[0]
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// **ENDPOINT: Crear usuario (solo para admin)**
app.post('/api/users', verifyToken, async (req, res) => {
  try {
    const { email, password, name, type } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'El usuario ya existe' 
      });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, name, type, created_at) VALUES (?, ?, ?, ?, NOW())',
      [email, passwordHash, name, type || 'user']
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Manejo de errores de MySQL
pool.on('error', (err) => {
  console.error('Error en MySQL pool:', err);
});
