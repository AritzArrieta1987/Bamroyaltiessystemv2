const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar multer para subir archivos
const upload = multer({ 
  dest: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB máx
});

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
app.post('/api/auth/login', async (req, res) => {
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
      { id: user.id, email: user.email, role: user.role },
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
        role: user.role
      },
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Mantener el endpoint antiguo por compatibilidad
app.post('/api/login', async (req, res) => {
  req.url = '/api/auth/login';
  return app._router.handle(req, res);
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

// **ENDPOINTS DE ROYALTIES**

// Dashboard - Estadísticas generales
app.get('/api/royalties/dashboard', verifyToken, async (req, res) => {
  try {
    const { period } = req.query;
    
    // Total de ingresos
    const [totalRevenue] = await pool.query(
      `SELECT 
        COALESCE(SUM(net_receipts), 0) as total,
        COUNT(*) as transactions
      FROM royalties
      ${period ? 'WHERE period = ?' : ''}`,
      period ? [period] : []
    );
    
    // Top artistas
    const [topArtists] = await pool.query(
      `SELECT 
        a.name,
        COALESCE(SUM(r.net_receipts), 0) as total_revenue,
        SUM(r.quantity) as total_streams
      FROM artists a
      INNER JOIN tracks t ON t.artist_id = a.id
      INNER JOIN royalties r ON r.track_id = t.id
      ${period ? 'WHERE r.period = ?' : ''}
      GROUP BY a.id, a.name
      ORDER BY total_revenue DESC
      LIMIT 10`,
      period ? [period] : []
    );
    
    // Top canciones
    const [topTracks] = await pool.query(
      `SELECT 
        t.name as track_name,
        a.name as artist_name,
        COALESCE(SUM(r.net_receipts), 0) as total_revenue,
        SUM(r.quantity) as total_streams
      FROM tracks t
      INNER JOIN artists a ON t.artist_id = a.id
      INNER JOIN royalties r ON r.track_id = t.id
      ${period ? 'WHERE r.period = ?' : ''}
      GROUP BY t.id, t.name, a.name
      ORDER BY total_revenue DESC
      LIMIT 10`,
      period ? [period] : []
    );
    
    // Ingresos por plataforma
    const [platformRevenue] = await pool.query(
      `SELECT 
        p.name as platform,
        COALESCE(SUM(r.net_receipts), 0) as revenue,
        SUM(r.quantity) as streams
      FROM platforms p
      INNER JOIN royalties r ON r.platform_id = p.id
      ${period ? 'WHERE r.period = ?' : ''}
      GROUP BY p.id, p.name
      ORDER BY revenue DESC`,
      period ? [period] : []
    );
    
    // Ingresos por territorio
    const [territoryRevenue] = await pool.query(
      `SELECT 
        ter.name as territory,
        COALESCE(SUM(r.net_receipts), 0) as revenue,
        SUM(r.quantity) as streams
      FROM territories ter
      INNER JOIN royalties r ON r.territory_id = ter.id
      ${period ? 'WHERE r.period = ?' : ''}
      GROUP BY ter.id, ter.name
      ORDER BY revenue DESC
      LIMIT 15`,
      period ? [period] : []
    );
    
    // Períodos disponibles
    const [periods] = await pool.query(
      `SELECT DISTINCT period 
      FROM royalties 
      ORDER BY period DESC`
    );
    
    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue: parseFloat(totalRevenue[0].total),
          totalTransactions: totalRevenue[0].transactions
        },
        topArtists: topArtists.map(a => ({
          name: a.name,
          revenue: parseFloat(a.total_revenue),
          streams: parseInt(a.total_streams)
        })),
        topTracks: topTracks.map(t => ({
          trackName: t.track_name,
          artistName: t.artist_name,
          revenue: parseFloat(t.total_revenue),
          streams: parseInt(t.total_streams)
        })),
        platformRevenue: platformRevenue.map(p => ({
          platform: p.platform,
          revenue: parseFloat(p.revenue),
          streams: parseInt(p.streams)
        })),
        territoryRevenue: territoryRevenue.map(t => ({
          territory: t.territory,
          revenue: parseFloat(t.revenue),
          streams: parseInt(t.streams)
        })),
        periods: periods.map(p => p.period)
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo estadísticas' 
    });
  }
});

// Obtener lista de royalties con filtros
app.get('/api/royalties', verifyToken, async (req, res) => {
  try {
    const { period, artist, platform, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let params = [];
    
    if (period) {
      whereConditions.push('r.period = ?');
      params.push(period);
    }
    
    if (artist) {
      whereConditions.push('a.name LIKE ?');
      params.push(`%${artist}%`);
    }
    
    if (platform) {
      whereConditions.push('p.name LIKE ?');
      params.push(`%${platform}%`);
    }
    
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';
    
    const [royalties] = await pool.query(
      `SELECT 
        r.id,
        r.period,
        r.activity_period,
        a.name as artist_name,
        rel.name as release_name,
        t.name as track_name,
        t.isrc,
        p.name as platform_name,
        ter.name as territory_name,
        tt.code as trans_type,
        r.quantity,
        r.net_receipts,
        r.currency
      FROM royalties r
      INNER JOIN tracks t ON r.track_id = t.id
      INNER JOIN artists a ON t.artist_id = a.id
      INNER JOIN releases rel ON t.release_id = rel.id
      INNER JOIN platforms p ON r.platform_id = p.id
      INNER JOIN territories ter ON r.territory_id = ter.id
      INNER JOIN transaction_types tt ON r.transaction_type_id = tt.id
      ${whereClause}
      ORDER BY r.period DESC, r.net_receipts DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total
      FROM royalties r
      INNER JOIN tracks t ON r.track_id = t.id
      INNER JOIN artists a ON t.artist_id = a.id
      INNER JOIN platforms p ON r.platform_id = p.id
      ${whereClause}`,
      params
    );
    
    res.json({
      success: true,
      data: royalties.map(r => ({
        ...r,
        net_receipts: parseFloat(r.net_receipts),
        quantity: parseInt(r.quantity)
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo royalties:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo royalties' 
    });
  }
});

// Obtener artistas
app.get('/api/artists', verifyToken, async (req, res) => {
  try {
    const [artists] = await pool.query(
      `SELECT 
        a.id,
        a.name,
        COUNT(DISTINCT t.id) as total_tracks,
        COUNT(DISTINCT r.id) as total_transactions,
        COALESCE(SUM(r.net_receipts), 0) as total_revenue
      FROM artists a
      LEFT JOIN tracks t ON t.artist_id = a.id
      LEFT JOIN royalties r ON r.track_id = t.id
      GROUP BY a.id, a.name
      ORDER BY total_revenue DESC`
    );
    
    res.json({
      success: true,
      data: artists.map(a => ({
        ...a,
        total_revenue: parseFloat(a.total_revenue)
      }))
    });
    
  } catch (error) {
    console.error('Error obteniendo artistas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo artistas' 
    });
  }
});

// **ENDPOINT: Importar CSV**
app.post('/api/royalties/import', verifyToken, upload.single('csv'), async (req, res) => {
  let tempFilePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    tempFilePath = req.file.path;
    const scriptPath = path.join(__dirname, 'scripts', 'importCSV.js');
    
    console.log('📤 Iniciando importación de CSV:', req.file.originalname);
    console.log('📁 Archivo temporal:', tempFilePath);
    console.log('🔧 Script:', scriptPath);

    // Ejecutar el script de importación
    const importProcess = spawn('node', [scriptPath, tempFilePath], {
      env: { ...process.env }
    });

    let output = '';
    let errorOutput = '';

    importProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(text);
    });

    importProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error(text);
    });

    importProcess.on('close', async (code) => {
      // Limpiar archivo temporal
      try {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (err) {
        console.error('Error eliminando archivo temporal:', err);
      }

      if (code !== 0) {
        console.error('❌ Error en importación, código:', code);
        return res.status(500).json({
          success: false,
          message: 'Error procesando el archivo CSV',
          error: errorOutput
        });
      }

      // Obtener estadísticas después de la importación
      try {
        const [stats] = await pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM artists) as total_artists,
            (SELECT COUNT(*) FROM tracks) as total_tracks,
            (SELECT COUNT(*) FROM platforms) as total_platforms,
            (SELECT COUNT(*) FROM territories) as total_territories,
            (SELECT COUNT(*) FROM royalty_details) as total_royalties,
            (SELECT ROUND(SUM(net_receipts), 2) FROM royalty_details) as total_revenue
        `);

        console.log('✅ Importación completada exitosamente');
        
        res.json({
          success: true,
          message: 'Archivo CSV importado exitosamente',
          stats: {
            artists: stats[0].total_artists,
            tracks: stats[0].total_tracks,
            platforms: stats[0].total_platforms,
            territories: stats[0].total_territories,
            royalties: stats[0].total_royalties,
            totalRevenue: parseFloat(stats[0].total_revenue || 0)
          },
          output: output
        });
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.json({
          success: true,
          message: 'Archivo CSV importado, pero no se pudieron obtener las estadísticas',
          output: output
        });
      }
    });

  } catch (error) {
    console.error('Error en importación CSV:', error);
    
    // Limpiar archivo temporal en caso de error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error('Error eliminando archivo temporal:', err);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error procesando el archivo',
      error: error.message
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