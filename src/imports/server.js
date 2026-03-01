root@ubuntu:/var/www/bigartist/server# # Ver el contenido del server.js
cat /var/www/bigartist/server/server.js

# Si está incompleto, lo recreamos completo:
cat > /var/www/bigartist/server/server.js << 'ENDSERVER'
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'BigArtist2018!@?',
  database: 'bigartist',
curl -s http://localhost:3001/api/healthctsRT}`);rvidor' });o' });erms]_date, en
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
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
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.listen(PORT, () => {
  console.log('API corriendo en puerto ' + PORT);
});
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ cluster  │ 1    │ online    │ 0%       │ 39.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

=== TEST API (después del fix) ===
[]
[]
{"status":"ok","timestamp":"2026-03-01T20:28:25.337Z"}root@ubuntu:/var/www/bigartist/server# 
