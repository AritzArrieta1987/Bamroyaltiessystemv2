cd /var/www/bigartist-api

# 2. Inicializar proyecto Node.js
npm init -y

# 3. Instalar dependencias necesarias
npm install express mysql2 cors bcrypt jsonwebtoken dotenv

# 4. Crear archivo del servidor API
cat > server.js << 'EOF'
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración MySQL
cat server.jsrchivo creadodo en puerto ${PORT}`);idor' });il, name: user.name } 
Wrote to /var/www/bigartist-api/package.json:

{
  "name": "bigartist-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}




added 96 packages, and audited 97 packages in 4s

27 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'BigArtist2018!@?',
  database: 'bigartist_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Endpoint de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret_temporal', { expiresIn: '24h' });
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});
root@ubuntu:/var/www/bigartist-api# 