cd /var/www/bigartist/server

# Hacer backup
cp server.js server.js.backup_ERROR

# Descargar el servidor.js correcto directamente
cat > server.js << 'ENDOFFILE'
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist_secret_key_2024';

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const authenticateToken = (req, res, next) => {
  console.log('🔐 Verificando token...');
  const authHeader = req.headers['authorization'];
  console.log('📋 Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('❌ No hay token');
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  console.log('🔑 Token extraído:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuario:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(403).json({ success: false, message: 'Token inválido' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt for email:', email);
  console.log('📝 Password received:', '***' + (password?.length || 0) + ' chars***');

  try {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const user = users[0];
    console.log('👤 Usuario encontrado:', user.id, user.email);

    const isValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password válido:', isValid);

    if (!isValid) {
      console.log('❌ Password incorrecto');
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('🎉 Login exitoso, token generado');

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

app.get('/api/royalties', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const [royalties] = await pool.execute(`
      SELECT 
        rd.id,
        a.name as artist_name,
        t.title as track_title,
        t.isrc,
        p.name as platform_name,
        ter.code as territory_code,
        ter.name as territory_name,
        rt.name as royalty_type,
        per.year,
        per.month,
        rd.quantity,
        rd.revenue,
        rd.net_receipts,
        rd.created_at
      FROM royalty_details rd
      LEFT JOIN tracks t ON rd.track_id = t.id
      LEFT JOIN artists a ON t.artist_id = a.id
      LEFT JOIN platforms p ON rd.platform_id = p.id
      LEFT JOIN territories ter ON rd.territory_id = ter.id
      LEFT JOIN royalty_types rt ON rd.royalty_type_id = rt.id
      LEFT JOIN periods per ON rd.period_id = per.id
      ORDER BY rd.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    res.json({
      success: true,
      royalties,
      total: royalties.length
    });
  } catch (error) {
    console.error('Error obteniendo royalties:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo royalties' });
  }
});

app.get('/api/royalties/stats', authenticateToken, async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM artists) as total_artists,
        (SELECT COUNT(*) FROM tracks) as total_tracks,
        (SELECT COUNT(*) FROM platforms) as total_platforms,
        (SELECT COUNT(*) FROM territories) as total_territories,
        (SELECT COUNT(*) FROM royalty_details) as total_royalties,
        (SELECT COALESCE(SUM(net_receipts), 0) FROM royalty_details) as total_revenue
    `);

    res.json({
      success: true,
      stats: stats[0]
    });
  } catch (error) {
    console.error('Error obteniendo stats:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo estadísticas' });
  }
});

app.get('/api/artists', authenticateToken, async (req, res) => {
  try {
    const [artists] = await pool.execute(`
      SELECT 
        a.id,
        a.name,
        COUNT(DISTINCT t.id) as total_tracks,
        COALESCE(SUM(rd.net_receipts), 0) as total_revenue,
        a.created_at
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
      LEFT JOIN royalty_details rd ON t.id = rd.track_id
      GROUP BY a.id, a.name, a.created_at
      ORDER BY total_revenue DESC
    `);

    res.json({
      success: true,
      artists
    });
  } catch (error) {
    console.error('Error obteniendo artistas:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo artistas' });
  }
});

const upload = multer({ dest: '/tmp/' });

app.post('/api/royalties/import', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No se proporcionó archivo' });
  }

  const filePath = req.file.path;
  const scriptPath = path.join(__dirname, 'scripts', 'importCSV.js');

  console.log('📤 Iniciando importación de CSV:', req.file.originalname);
  console.log('📁 Archivo temporal:', filePath);
  console.log('🔧 Script:', scriptPath);

  exec(`node "${scriptPath}" "${filePath}"`, async (error, stdout, stderr) => {
    fs.unlinkSync(filePath);

    if (error) {
      console.error('❌ Error ejecutando script:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error importando CSV',
        error: error.message,
        output: stdout,
        errors: stderr
      });
    }

    console.log('✅ Importación completada exitosamente');

    try {
      const [stats] = await pool.execute(`
        SELECT 
          (SELECT COUNT(*) FROM artists) as artists,
          (SELECT COUNT(*) FROM tracks) as tracks,
          (SELECT COUNT(*) FROM platforms) as platforms,
          (SELECT COUNT(*) FROM territories) as territories,
          (SELECT COUNT(*) FROM royalty_details) as royalties,
          (SELECT COALESCE(SUM(net_receipts), 0) FROM royalty_details) as totalRevenue
      `);

      res.json({
        success: true,
        message: 'Archivo CSV importado exitosamente',
        stats: stats[0],
        output: stdout
      });
    } catch (dbError) {
      console.error('❌ Error obteniendo estadísticas:', dbError);
      res.json({
        success: true,
        message: 'Archivo CSV importado exitosamente',
        output: stdout
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
ENDOFFILE

# Reiniciar PM2
pm2 restart bigartist-api
sleep 2

echo ""
echo "✅ Servidor actualizado"
echo ""
echo "Probando login..."

curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'

echo ""
echo "🎉 ¡Listo! Ahora intenta hacer login en app.bigartist.es"