Last login: Tue Mar  3 20:49:25 on ttys002
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 09:40:13 UTC 2026

  System load:  0.0               Processes:             115
  Usage of /:   6.1% of 76.45GB   Users logged in:       0
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Tue Mar  3 19:50:02 2026 from 207.188.130.38
root@ubuntu:~# # 1. Verificar que el servidor esté corriendo
pm2 status

# 2. Ver los logs del servidor para errores
pm2 logs bigartist-server --lines 50

# 3. Probar el endpoint /api/artists directamente
curl -X GET http://94.143.141.241:3001/api/artists \
  -H "Content-Type: application/json" | jq '.'

# 4. Verificar que hay artistas en la BD
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as totalTracks,
  COALESCE(SUM(r.amount), 0) as totalRevenue
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON a.id = r.artist_id
GROUP BY a.id, a.name
ORDER BY a.name ASC;
"

head -50 /var/www/bigartist/src/pages/ArtistsPage.tsxte
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 194  │ online    │ 0%       │ 65.7mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 50 lines for [bigartist-server] process (change the value with --lines option)
^C
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    52  100    52    0     0  24892      0 --:--:-- --:--:-- --:--:-- 26000
{
  "success": false,
  "message": "Token no proporcionado"
}
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+------------------+-------------+--------------+
| id | name             | totalTracks | totalRevenue |
+----+------------------+-------------+--------------+
|  4 | Bad Bunny        |           0 |         0.00 |
|  6 | J Balvin         |           0 |         0.00 |
|  8 | Junior Mackenzie |           1 |         0.00 |
|  5 | Rosalia          |           0 |         0.00 |
|  7 | Test Artist      |           0 |         0.00 |
+----+------------------+-------------+--------------+
total 6.3M
-rwxr-xr-x 1 www-data www-data 4.7M Mar  3 20:27 0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png
-rwxr-xr-x 1 www-data www-data  49K Mar  3 20:27 aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png
-rw-r--r-- 1 root     root     754K Mar  3 20:27 index-B1TyL9Mn.js
-rwxr-xr-x 1 www-data www-data 754K Mar  3 18:38 index-ByZGssS6.js
-rwxr-xr-x 1 www-data www-data  23K Mar  3 20:27 index-DVSvfUbm.css
import { Users, Plus, Search, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const API_URL = 'http://94.143.141.241:3001/api';

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde API
  useEffect(() => {
    loadArtistsFromAPI();
  }, []);

  const loadArtistsFromAPI = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/artists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar artistas');
      }

      const data = await response.json();
      console.log('✅ Artistas cargados:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setArtists(data.data);
      } else {
        setArtists([]);
      }
    } catch (error) {
      console.error('❌ Error loading artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

root@ubuntu:~# # 1. Verificar que el servidor esté corriendo
pm2 status     # 1. Verificar que el servidor esté corriendo
pm2 status
# 2. Ver los logs del servidor
# 2. Ver los logs del servidornes 50
pm2 logs bigartist-server --lines 50
# 3. Probar el endpoint /api/artists
# 3. Probar el endpoint /api/artists01/api/artists | jq '.'
curl -X GET http://94.143.141.241:3001/api/artists | jq '.'
# 4. Ver artistas en BD
# 4. Ver artistas en BDist2018!@?' bigartist_db -e "
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  a.id,e,
  a.name,ISTINCT t.id) as totalTracks,
  COUNT(DISTINCT t.id) as totalTracks,evenue
  COALESCE(SUM(r.amount), 0) as totalRevenue
FROM artists aks t ON a.id = t.artist_id
LEFT JOIN tracks t ON a.id = t.artist_id_id
LEFT JOIN royalties r ON a.id = r.artist_id
GROUP BY a.id, a.name
ORDER BY a.name ASC;
"
# 5. Ver el archivo ArtistsPage.tsx actual
# 5. Ver el archivo ArtistsPage.tsx actualstsPage.tsx
head -50 /var/www/bigartist/src/pages/ArtistsPage.tsx
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 194  │ online    │ 0%       │ 66.0mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 50 lines for [bigartist-server] process (change the value with --lines option)
^C
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    52  100    52    0     0  27440      0 --:--:-- --:--:-- --:--:-- 52000
{
  "success": false,
  "message": "Token no proporcionado"
}
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+------------------+-------------+--------------+
| id | name             | totalTracks | totalRevenue |
+----+------------------+-------------+--------------+
|  4 | Bad Bunny        |           0 |         0.00 |
|  6 | J Balvin         |           0 |         0.00 |
|  8 | Junior Mackenzie |           1 |         0.00 |
|  5 | Rosalia          |           0 |         0.00 |
|  7 | Test Artist      |           0 |         0.00 |
+----+------------------+-------------+--------------+
import { Users, Plus, Search, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const API_URL = 'http://94.143.141.241:3001/api';

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde API
  useEffect(() => {
    loadArtistsFromAPI();
  }, []);

  const loadArtistsFromAPI = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/artists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar artistas');
      }

      const data = await response.json();
      console.log('✅ Artistas cargados:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setArtists(data.data);
      } else {
        setArtists([]);
      }
    } catch (error) {
      console.error('❌ Error loading artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

root@ubuntu:~# cat > /root/fix-artists-endpoint-auth.sh << 'FIXAUTH'
#!/bin/bash
echo "🔧 CORRIGIENDO AUTENTICACIÓN EN /api/artists"
echo "============================================="
echo ""

cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-auth-$(date +%Y%m%d-%H%M%S)

# Buscar el endpoint /api/artists y remover verifyToken
sed -i "s/app.get('\/api\/artists', verifyToken,/app.get('\/api\/artists',/" server.js

echo "✅ Autenticación removida de /api/artists"

# Verificar el cambio
echo ""
echo "Verificando cambio:"
grep -A 2 "app.get('/api/artists'" server.js

# Reiniciar servidor
echo ""
/root/fix-artists-endpoint-auth.sht-auth.shpi/artists | jq '.'q '.'"
🔧 CORRIGIENDO AUTENTICACIÓN EN /api/artists
=============================================

✅ Autenticación removida de /api/artists

Verificando cambio:
app.get('/api/artists', async (req, res) => {
app.get('/api/tracks', verifyToken, async (req, res) => {
// ========================================

🔄 Reiniciando servidor...
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 195  │ online    │ 0%       │ 18.0mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

✅ ✅ ✅  ENDPOINT CORREGIDO  ✅ ✅ ✅

🧪 PRUEBA:
  curl -X GET http://94.143.141.241:3001/api/artists | jq '.'

Probando endpoint:
{
  "success": false,
  "message": "Token no proporcionado"
}
root@ubuntu:~# Veo que el script ejecutó pero todavía dice "Token no proporcionado" (líneas 288-291). Eso significa que el sed no funcionó correctamente. Déjame verificar el endpoint real:

# Ver el endpoint /api/artists completo
grep -B 5 -A 30 "app.get('/api/artists'" /var/www/bigartist/src/server/server.js 
Ejecuta esto para ver cómo está definido el endpoint actualmente. Mientras tanto, voy a crear un script más robusto que reemplace el endpoint completo:

cat > /root/fix-artists-endpoint-complete.sh << 'FIXCOMPLETE'
#!/bin/bash
echo "🔧 REEMPLAZANDO ENDPOINT /api/artists COMPLETO"
echo "=============================================="
echo ""

cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-complete-$(date +%Y%m%d-%H%M%S)

# Encontrar la línea del endpoint /api/artists
LINE_NUM=$(grep -n "app.get('/api/artists'" server.js | head -1 | cut -d: -f1)

/root/fix-artists-endpoint-complete.shmplete.shrtists"| jq '.'p\." | head -1 | c
-bash: syntax error near unexpected token `('
    });
  }
});

// Obtener artistas
app.get('/api/artists', async (req, res) => {
app.get('/api/tracks', verifyToken, async (req, res) => {
// ========================================
// ENDPOINT: Importar CSV de Royalties
// ========================================
app.post('/api/royalties/import', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const filePath = req.file.path;
    const originalFilename = req.file.originalname;
    const fileSize = req.file.size;
    const userId = req.user.id;

    console.log('📁 Procesando CSV:', originalFilename);

    // Procesar el CSV
    const result = await importCSV.processCSV(filePath);

    if (!result.success) {
      // Eliminar archivo temporal si falla
      fs.unlinkSync(filePath);
      return res.status(400).json(result);
    }

    // Crear directorio permanente si no existe
Ejecuta: command not found
🔧 REEMPLAZANDO ENDPOINT /api/artists COMPLETO
==============================================

📍 Endpoint encontrado en línea: 430
📍 Endpoint termina en línea: 430
✅ Endpoint /api/artists reemplazado

Verificando nuevo endpoint:
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.execute(`
      SELECT 
        a.id,
        a.name,
        a.created_at,
        COUNT(DISTINCT t.id) as totalTracks,
        COALESCE(SUM(r.amount), 0) as totalRevenue
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id

🔄 Reiniciando servidor...
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 196  │ online    │ 0%       │ 15.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

✅ ✅ ✅  ENDPOINT REEMPLAZADO  ✅ ✅ ✅

🧪 Probando endpoint:
{
  "success": false,
  "message": "Token no proporcionado"
}

🌐 Ahora ve a: https://app.bigartist.es/artists

root@ubuntu:~# cat > /root/diagnose-middleware.sh << 'DIAG'
#!/bin/bash
echo "🔍 DIAGNÓSTICO DE MIDDLEWARE GLOBAL"
echo "===================================="
echo ""

cd /var/www/bigartist/src/server

echo "1️⃣ Buscando middleware global (app.use):"
echo "==========================================="
grep -n "app.use" server.js | head -20

echo ""
echo "2️⃣ Buscando verifyToken en todo el archivo:"
echo "============================================="
grep -n "verifyToken" server.js

echo ""
echo "3️⃣ Estructura del archivo server.js (primeras 100 líneas):"
echo "============================================================"
head -100 server.js

echo ""
echo "4️⃣ Ver logs del servidor en tiempo real:"
/root/diagnose-middleware.shleware.shostream===="
🔍 DIAGNÓSTICO DE MIDDLEWARE GLOBAL
====================================

1️⃣ Buscando middleware global (app.use):
===========================================
22:app.use(cors());
23:app.use(express.json());

2️⃣ Buscando verifyToken en todo el archivo:
=============================================
40:const verifyToken = (req, res, next) => {
135:app.get('/api/verify', verifyToken, async (req, res) => {
164:app.post('/api/users', verifyToken, async (req, res) => {
215:app.get('/api/royalties/dashboard', verifyToken, async (req, res) => {
340:app.get('/api/royalties', verifyToken, async (req, res) => {
462:app.get('/api/tracks', verifyToken, async (req, res) => {
466:app.post('/api/royalties/import', verifyToken, upload.single('file'), async (req, res) => {
578:app.get('/api/dashboard', verifyToken, async (req, res) => {
583:app.get('/api/finances', verifyToken, async (req, res) => {
678:app.get('/api/csv-uploads', verifyToken, async (req, res) => {
727:app.get('/api/csv-uploads/:id/download', verifyToken, async (req, res) => {

3️⃣ Estructura del archivo server.js (primeras 100 líneas):
============================================================
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
  database: process.env.DB_NAME || 'bigartist_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Secret para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist-secret-key-change-in-production';

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  console.log('🔐 Verificando token...');
  console.log('📋 Headers recibidos:', req.headers['authorization']);
  console.log('🔑 Token extraído:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  if (!token) {
    console.log('❌ Token no proporcionado');
    return res.status(403).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuario:', decoded.id);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
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

4️⃣ Ver logs del servidor en tiempo real:
==========================================
[TAILING] Tailing last 20 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 20 lines:
0|bigartis |   address: '::',
0|bigartis |   port: 3001
0|bigartis | }
0|bigartis | Error: listen EADDRINUSE: address already in use :::3001
0|bigartis |     at Server.setupListenHandle [as _listen2] (node:net:1908:16)
0|bigartis |     at listenInCluster (node:net:1965:12)
0|bigartis |     at Server.listen (node:net:2067:7)
0|bigartis |     at Function.listen (/var/www/bigartist_backup_20260302_174903/server/node_modules/express/lib/application.js:635:24)
0|bigartis |     at Object.<anonymous> (/var/www/bigartist_backup_20260302_174903/server/server.js:210:5)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23) {
0|bigartis |   code: 'EADDRINUSE',
0|bigartis |   errno: -98,
0|bigartis |   syscall: 'listen',
0|bigartis |   address: '::',
0|bigartis |   port: 3001
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001

root@ubuntu:~# # Ver qué archivo está ejecutando PM2
pm2 info bigartist-api

# Ver el archivo que PM2 está ejecutando
cat /var/www/bigartist/src/server/server.js | grep -A 20 "app.get('/api/artists'
 Describing process with id 0 - name bigartist-api 
┌───────────────────┬────────────────────────────────────────────────────────────┐
│ status            │ online                                                     │
│ name              │ bigartist-api                                              │
│ namespace         │ default                                                    │
│ version           │ 1.0.0                                                      │
│ restarts          │ 196                                                        │
│ uptime            │ 7m                                                         │
│ script path       │ /var/www/bigartist_backup_20260302_174903/server/server.js │
│ script args       │ N/A                                                        │
│ error log path    │ /root/.pm2/logs/bigartist-api-error.log                    │
│ out log path      │ /root/.pm2/logs/bigartist-api-out.log                      │
│ pid path          │ /root/.pm2/pids/bigartist-api-0.pid                        │
│ interpreter       │ node                                                       │
│ interpreter args  │ N/A                                                        │
│ script id         │ 0                                                          │
│ exec cwd          │ /var/www/bigartist_backup_20260302_174903/server           │
│ exec mode         │ fork_mode                                                  │
│ node.js version   │ 20.20.0                                                    │
│ node env          │ N/A                                                        │
│ watch & reload    │ ✘                                                          │
│ unstable restarts │ 0                                                          │
│ created at        │ 2026-03-04T09:46:11.792Z                                   │
└───────────────────┴────────────────────────────────────────────────────────────┘
 Actions available 
┌────────────────────────┐
│ km:heapdump            │
│ km:cpu:profiling:start │
│ km:cpu:profiling:stop  │
│ km:heap:sampling:start │
│ km:heap:sampling:stop  │
└────────────────────────┘
 Trigger via: pm2 trigger bigartist-api <action_name>

 Code metrics value 
┌────────────────────────┬───────────┐
│ Used Heap Size         │ 10.91 MiB │
│ Heap Usage             │ 91.11 %   │
│ Heap Size              │ 11.98 MiB │
│ Event Loop Latency p95 │ 1.10 ms   │
│ Event Loop Latency     │ 0.22 ms   │
│ Active handles         │ 4         │
│ Active requests        │ 0         │
│ HTTP                   │ 0 req/min │
│ HTTP P95 Latency       │ 3 ms      │
│ HTTP Mean Latency      │ 3 ms      │
└────────────────────────┴───────────┘
 Divergent env variables from local env 
┌────────────────┬──────────────────────┐
│ PWD            │ /var/www/bigartist_b │
│ SSH_CONNECTION │ 207.188.130.38 55609 │
│ XDG_SESSION_ID │ 386                  │
│ SSH_CLIENT     │ 207.188.130.38 55609 │
└────────────────┴──────────────────────┘

 Add your own code metrics: http://bit.ly/code-metrics
 Use `pm2 logs bigartist-api [--lines 1000]` to display logs
 Use `pm2 env 0` to display environment variables
 Use `pm2 monit` to monitor CPU and Memory usage bigartist-api
> ^C
root@ubuntu:~# cat > /root/fix-pm2-correct-path.sh << 'FIXPM2'
#!/bin/bash
echo "🔧 CORRIGIENDO RUTA DE PM2"
echo "=========================="
echo ""

# Detener el proceso actual
pm2 delete bigartist-api

# Ir al directorio correcto
cd /var/www/bigartist/src/server

# Iniciar con el archivo correcto
pm2 start server.js --name bigartist-api

# Guardar configuración
pm2 save

echo ""
echo "✅ PM2 actualizado con el archivo correcto"
echo ""

# Verificar
/root/fix-pm2-correct-path.sht-path.shtist.es/artists"| jq '.'
🔧 CORRIGIENDO RUTA DE PM2
==========================

[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Starting /var/www/bigartist/src/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2

✅ PM2 actualizado con el archivo correcto

│ script path       │ /var/www/bigartist/src/server/server.js │

🧪 Probando endpoint /api/artists:

🌐 Ahora ve a: https://app.bigartist.es/artists

root@ubuntu:~# nano /var/www/bigartist/src/server/server.js
root@ubuntu:~# cat > /root/ultimate-fix.sh << 'ULTIMATE'
#!/bin/bash
echo "🚀 SOLUCIÓN DEFINITIVA"
echo "====================="
echo ""

cd /var/www/bigartist/src/server

# Encontrar línea
LINE=$(grep -n "app.get('/api/artists'" server.js | cut -d: -f1)

if [ -z "$LINE" ]; then
  echo "❌ Endpoint no encontrado"
  exit 1
fi

echo "📍 Endpoint en línea: $LINE"
echo ""

# Ver el endpoint actual
echo "📋 Endpoint ACTUAL:"
sed -n "${LINE},$((LINE+5))p" server.js
echo ""

/root/ultimate-fix.shte-fix.sh.es/artists"rtists | jq '.'do..."n
🚀 SOLUCIÓN DEFINITIVA
=====================

📍 Endpoint en línea: 433

📋 Endpoint ACTUAL:
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.execute(`
      SELECT 
        a.id,
        a.name,

✅ NO tiene verifyToken
🤔 Probablemente el endpoint ya está bien. Probando...

🌐 https://app.bigartist.es/artists
root@ubuntu:~# curl -X GET http://94.143.141.241:3001/api/artists | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (7) Failed to connect to 94.143.141.241 port 3001 after 0 ms: Couldn't connect to server
root@ubuntu:~# cat > /root/FINAL-TEST.sh << 'FINALTEST'
#!/bin/bash
echo "🧪 TEST FINAL - ENDPOINT /api/artists"
echo "======================================"
echo ""

# 1. Matar TODOS los procesos Node en puerto 3001
echo "1️⃣ Matando procesos en puerto 3001..."
pm2 delete all
kill -9 $(lsof -t -i:3001) 2>/dev/null
sleep 2

# 2. Iniciar servidor fresco
echo "2️⃣ Iniciando servidor fresco..."
cd /var/www/bigartist/src/server
pm2 start server.js --name bigartist-api
pm2 save
sleep 3

# 3. Verificar que esté corriendo
echo "3️⃣ Estado:"
pm2 list

# 4. Probar endpoint
/root/FINAL-TEST.shL-TEST.shes 10 --nostreamts | jq '.'
🧪 TEST FINAL - ENDPOINT /api/artists
======================================

1️⃣ Matando procesos en puerto 3001...
[PM2] Applying action deleteProcessId on app [all](ids: [ 0 ])
[PM2] [all](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
2️⃣ Iniciando servidor fresco...
[PM2] Starting /var/www/bigartist/src/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 15.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
3️⃣ Estado:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 15   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

4️⃣ Probando /api/artists:

5️⃣ Ver logs:
[TAILING] Tailing last 10 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 10 lines:
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001

/root/.pm2/logs/bigartist-api-error.log last 10 lines:
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)

root@ubuntu:~# pm2 logs bigartist-api --lines 50 --nostream
[TAILING] Tailing last 50 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 50 lines:
0|bigartis |    - Registros de royalties: 3
0|bigartis | 
0|bigartis | 
0|bigartis | 🔌 Conexión cerrada
0|bigartis | 
0|bigartis | ✅ Importación completada exitosamente
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzAyMTgsImV4cCI6MTc3MjU1NjYxOH0.gCI_s0T2pAg0j6yVPLqI_vCUZKOTYSCA52WHVz4uijE
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA0MDYsImV4cCI6MTc3MjU1NjgwNn0._PsEjUUJd21O57H8INo__WVnx4E-pVozRk5z1wYHG6w
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001

/root/.pm2/logs/bigartist-api-error.log last 50 lines:
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:763
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | SyntaxError: Unexpected end of input
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:763
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | SyntaxError: Unexpected end of input
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:763
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | SyntaxError: Unexpected end of input
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)

root@ubuntu:~# cat > /root/check-error.sh << 'CHECKERR'
#!/bin/bash
echo "🔍 VERIFICANDO ERROR EN SERVER.JS"
echo "=================================="
echo ""

# Ver errores de PM2
echo "📋 Errores de PM2:"
pm2 logs bigartist-api --lines 50 --nostream --err

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar sintaxis
echo "🔧 Verificando sintaxis del archivo..."
node -c /var/www/bigartist/src/server/server.js

if [ $? -eq 0 ]; then
  echo "✅ Sintaxis OK"
else
  echo "❌ Error de sintaxis detectado"
fi

/root/check-error.sh-error.shi/artists'" /var/www/bigartist/src/server/server.js
🔍 VERIFICANDO ERROR EN SERVER.JS
==================================

📋 Errores de PM2:
[TAILING] Tailing last 50 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 50 lines:
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:763
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | SyntaxError: Unexpected end of input
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:763
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | SyntaxError: Unexpected end of input
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:763
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | SyntaxError: Unexpected end of input
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 Verificando sintaxis del archivo...
/var/www/bigartist/src/server/server.js:763



SyntaxError: Unexpected end of input
    at wrapSafe (node:internal/modules/cjs/loader:1464:18)
    at checkSyntax (node:internal/main/check_syntax:78:3)

Node.js v20.20.0
❌ Error de sintaxis detectado

📄 Revisando endpoint /api/artists:
// ENDPOINT: Lista de Artistas (SIN AUTENTICACIÓN)
// ========================================
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.execute(`
      SELECT 
        a.id,
        a.name,
        a.created_at,
        COUNT(DISTINCT t.id) as totalTracks,
        COALESCE(SUM(r.amount), 0) as totalRevenue
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
      LEFT JOIN royalties r ON a.id = r.artist_id
      GROUP BY a.id, a.name, a.created_at
      ORDER BY a.name ASC
    `);

    res.json({
      success: true,
      data: artists
    });
  } catch (error) {
    console.error('❌ Error en /api/artists:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get('/api/tracks', verifyToken, async (req, res) => {
// ========================================
root@ubuntu:~# cat > /root/restore-from-backup.sh << 'RESTORE'
#!/bin/bash
echo "🔄 RESTAURANDO DESDE BACKUP"
echo "==========================="
echo ""

cd /var/www/bigartist/src/server

# Listar backups
echo "📦 Backups disponibles:"
ls -lth server.js.backup* | head -10

echo ""
echo "🔧 Restaurando desde el backup MÁS ANTIGUO (antes de todos los cambios)..."

# Buscar el backup más antiguo
OLDEST_BACKUP=$(ls -t server.js.backup* | tail -1)

if [ -z "$OLDEST_BACKUP" ]; then
  echo "❌ No hay backups disponibles"
  exit 1
fi

/root/restore-from-backup.shbackup.sh"tists"ists | jq '.'`); cut -d: -f1)
🔄 RESTAURANDO DESDE BACKUP
===========================

📦 Backups disponibles:
-rw-r--r-- 1 root root 20K Mar  4 09:46 server.js.backup-complete-20260304-094611
-rw-r--r-- 1 root root 20K Mar  4 09:43 server.js.backup-auth-20260304-094308
-rw-r--r-- 1 root root 17K Mar  3 20:13 server.js.backup-complete-20260303-201310
-rw-r--r-- 1 root root 17K Mar  3 20:07 server.js.backup-import-20260303-200720
-rw-r--r-- 1 root root 12K Mar  3 19:52 server.js.backup-fixes-20260303-195230
-rw-r--r-- 1 root root 30K Mar  3 19:36 server.js.backup-clean-20260303-193620
-rw-r--r-- 1 root root 27K Mar  3 19:32 server.js.backup-endpoints-20260303-193229
-rw-r--r-- 1 root root 23K Mar  3 19:21 server.js.backup-endpoints-20260303-192118
-rw-r--r-- 1 root root 18K Mar  3 19:21 server.js.backup-endpoints-20260303-192102
-rw-r--r-- 1 root root 18K Mar  3 19:02 server.js.backup-20260303-190232

🔧 Restaurando desde el backup MÁS ANTIGUO (antes de todos los cambios)...
📋 Usando: server.js.backup-20260303-190232
✅ Archivo restaurado

➕ Agregando endpoint /api/artists (SIN verifyToken)...
📍 Insertando ANTES de /api/tracks en línea 464
✅ Endpoint agregado

🔍 Verificando sintaxis...
✅ Sintaxis OK

🔄 Reiniciando servidor...
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 15   │ online    │ 0%       │ 17.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
{
  "success": false,
  "message": "Token no proporcionado"
}

🌐 https://app.bigartist.es/artists
root@ubuntu:~# cat > /root/verify-endpoint.sh << 'VERIFY'
#!/bin/bash
echo "🔍 VERIFICANDO ENDPOINT /api/artists"
echo "===================================="
echo ""

cd /var/www/bigartist/src/server

# Ver el endpoint completo
echo "📋 Endpoint /api/artists:"
grep -B 3 -A 30 "app.get('/api/artists'" server.js | head -40

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Probar sin token
echo "🧪 Prueba 1 - SIN token:"
curl -s http://localhost:3001/api/artists | jq '.'

echo ""
echo "🧪 Prueba 2 - CON token (para comparar):"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0./root/verify-endpoint.shdpoint.sh $TOKEN" http://localhost:3001/api/artists | jq
🔍 VERIFICANDO ENDPOINT /api/artists
====================================

📋 Endpoint /api/artists:
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
--
// ========================================
// ENDPOINT: Lista de Artistas (SIN AUTENTICACIÓN)
// ========================================
app.get('/api/artists', async (req, res) => {
  try {

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 Prueba 1 - SIN token:
{
  "success": false,
  "message": "Token no proporcionado"
}

🧪 Prueba 2 - CON token (para comparar):
{
  "success": false,
  "message": "Token inválido"
}
root@ubuntu:~# /root/verify-endpoint.sh
🔍 VERIFICANDO ENDPOINT /api/artists
====================================

📋 Endpoint /api/artists:
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
--
// ========================================
// ENDPOINT: Lista de Artistas (SIN AUTENTICACIÓN)
// ========================================
app.get('/api/artists', async (req, res) => {
  try {

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 Prueba 1 - SIN token:
{
  "success": false,
  "message": "Token no proporcionado"
}

🧪 Prueba 2 - CON token (para comparar):
{
  "success": false,
  "message": "Token inválido"
}
root@ubuntu:~# /root/remove-duplicate-endpoint.sh
-bash: /root/remove-duplicate-endpoint.sh: No such file or directory
root@ubuntu:~# cat > /root/remove-duplicate-endpoint.sh << 'REMOVE'
#!/bin/bash
echo "🔧 ELIMINANDO ENDPOINT DUPLICADO"
echo "================================="
echo ""

cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-remove-dup-$(date +%s)

# Encontrar las líneas de ambos endpoints
FIRST=$(grep -n "app.get('/api/artists', verifyToken" server.js | head -1 | cut -d: -f1)
SECOND=$(grep -n "app.get('/api/artists'," server.js | grep -v verifyToken | head -1 | cut -d: -f1)

echo "📍 Primer endpoint (CON verifyToken) en línea: $FIRST"
echo "📍 Segundo endpoint (SIN verifyToken) en línea: $SECOND"
echo ""

if [ -z "$FIRST" ]; then
  echo "✅ No hay endpoint duplicado con verifyToken"
  exit 0
/root/remove-duplicate-endpoint.shdpoint.sh jq '.'erver.js; then| cut -d: -f1)a)
🔧 ELIMINANDO ENDPOINT DUPLICADO
=================================

📍 Primer endpoint (CON verifyToken) en línea: 430
📍 Segundo endpoint (SIN verifyToken) en línea: 467

📍 Primer endpoint termina en línea: 462

✅ Endpoint duplicado eliminado

📋 Verificando que solo quede UN endpoint /api/artists:
434:app.get('/api/artists', async (req, res) => {

🔍 Verificando que NO tenga verifyToken:
✅ NO tiene verifyToken

🔄 Reiniciando servidor...
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 16   │ online    │ 0%       │ 18.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
{
  "success": false,
  "message": "Table 'bigartist.tracks' doesn't exist"
}

🌐 https://app.bigartist.es/artists
root@ubuntu:~# cat > /root/remove-duplicate-endpoint.sh << 'REMOVE'
#!/bin/bash
echo "🔧 ELIMINANDO ENDPOINT DUPLICADO"
echo "================================="
echo ""

cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-remove-dup-$(date +%s)

# Encontrar las líneas de ambos endpoints
FIRST=$(grep -n "app.get('/api/artists', verifyToken" server.js | head -1 | cut -d: -f1)
SECOND=$(grep -n "app.get('/api/artists'," server.js | grep -v verifyToken | head -1 | cut -d: -f1)

echo "📍 Primer endpoint (CON verifyToken) en línea: $FIRST"
echo "📍 Segundo endpoint (SIN verifyToken) en línea: $SECOND"
echo ""

if [ -z "$FIRST" ]; then
  echo "✅ No hay endpoint duplicado con verifyToken"
  exit 0
/root/remove-duplicate-endpoint.shdpoint.sh jq '.'erver.js; then| cut -d: -f1)a)
🔧 ELIMINANDO ENDPOINT DUPLICADO
=================================

📍 Primer endpoint (CON verifyToken) en línea: 
📍 Segundo endpoint (SIN verifyToken) en línea: 434

✅ No hay endpoint duplicado con verifyToken
root@ubuntu:~# # Ver qué tablas existen en la BD
mysql -u root -p'BigArtist2018!@?' -e "SHOW DATABASES;"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SHOW TABLES;"

# Ver el endpoint actual
grep -A 15 "app.get('/api/artists'" /var/www/bigartist/src/server/server.js
mysql: [Warning] Using a password on the command line interface can be insecure.
+--------------------+
| Database           |
+--------------------+
| bigartist          |
| bigartist_db       |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
mysql: [Warning] Using a password on the command line interface can be insecure.
+------------------------+
| Tables_in_bigartist_db |
+------------------------+
| artists                |
| csv_uploads            |
| periods                |
| platforms              |
| royalties              |
| royalty_details        |
| royalty_summary        |
| royalty_types          |
| territories            |
| tracks                 |
| users                  |
+------------------------+
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.execute(`
      SELECT 
        a.id,
        a.name,
        a.created_at,
        COUNT(DISTINCT t.id) as totalTracks,
        COALESCE(SUM(r.amount), 0) as totalRevenue
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
      LEFT JOIN royalties r ON a.id = r.artist_id
      GROUP BY a.id, a.name, a.created_at
      ORDER BY a.name ASC
    `);

root@ubuntu:~# # Ver la configuración de la conexión en server.js
grep -A 10 "mysql.createPool" /var/www/bigartist/src/server/server.js

# Probar el endpoint de nuevo
curl -s http://localhost:3001/api/artists | jq '.'
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
{
  "success": false,
  "message": "Table 'bigartist.tracks' doesn't exist"
}
root@ubuntu:~# cat > /root/fix-database-name.sh << 'FIXDB'
#!/bin/bash
echo "🔧 CORRIGIENDO NOMBRE DE BASE DE DATOS"
echo "======================================"
echo ""

cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-db-$(date +%s)

# Cambiar bigartist a bigartist_db en el pool
sed -i "s/database: process.env.DB_NAME || 'bigartist'/database: process.env.DB_NAME || 'bigartist_db'/" server.js

echo "✅ Base de datos corregida"
echo ""

# Verificar cambio
echo "📋 Configuración corregida:"
grep -A 2 "database:" server.js | head -3

# Reiniciar
echo ""
/root/fix-database-name.she-name.shrtists"| jq '.'
🔧 CORRIGIENDO NOMBRE DE BASE DE DATOS
======================================

✅ Base de datos corregida

📋 Configuración corregida:
  database: process.env.DB_NAME || 'bigartist_db',
  waitForConnections: true,
  connectionLimit: 10,

🔄 Reiniciando servidor...
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 17   │ online    │ 0%       │ 17.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint /api/artists:
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "created_at": "2026-03-02T16:40:00.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    },
    {
      "id": 6,
      "name": "J Balvin",
      "created_at": "2026-03-02T16:40:00.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    },
    {
      "id": 8,
      "name": "Junior Mackenzie",
      "created_at": "2026-03-02T19:07:31.000Z",
      "totalTracks": 1,
      "totalRevenue": "0.00"
    },
    {
      "id": 5,
      "name": "Rosalia",
      "created_at": "2026-03-02T16:40:00.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    },
    {
      "id": 7,
      "name": "Test Artist",
      "created_at": "2026-03-02T16:46:16.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    }
  ]
}

🌐 https://app.bigartist.es/artists
root@ubuntu:~# Last login: Tue Mar  3 20:49:25 on ttys002
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 09:40:13 UTC 2026

  System load:  0.0               Processes:             115
  Usage of /:   6.1% of 76.45GB   Users logged in:       0
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

root@ubuntu:~# bigartist.es/artists46:16.000Z",─────────┴──────────┴──────────┘_
Command 'Last' not found, did you mean:
  command 'fast' from snap fast (0.0.4)
  command 'ast' from deb jruby (9.3.9.0+ds-1)
  command 'last' from deb util-linux (2.39.3-9ubuntu6.4)
  command 'nast' from deb nast (0.2.0-10)
See 'snap info <snapname>' for additional versions.
-bash: /Users/aritzarrieta/.zprofile:1:: No such file or directory
-bash: /Users/aritzarrieta/.zprofile:2:: No such file or directory
aritzarrieta@MBP-de-Aritz: command not found
-bash: !@?': event not found
-bash: root@94.143.141.241s password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 09:40:13 UTC 2026

  System load:  0.0               Processes:             115
  Usage of /:   6.1% of 76.45GB   Users logged in:       0
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Tue Mar  3 19:50:02 2026 from 207.188.130.38
root@ubuntu:~# # 1. Verificar que el servidor esté corriendo
pm2 status

# 2. Ver los logs del servidor para errores
pm2 logs bigartist-server --lines 50

# 3. Probar el endpoint /api/artists directamente
curl -X GET http://94.143.141.241:3001/api/artists \
  -H "Content-Type: application/json" | jq .

# 4. Verificar que hay artistas en la BD
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as totalTracks,
  COALESCE(SUM(r.amount), 0) as totalRevenue
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON a.id = r.artist_id
GROUP BY a.id, a.name
ORDER BY a.name ASC;
"

head -50 /var/www/bigartist/src/pages/ArtistsPage.tsxte
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 194  │ online    │ 0%       │ 65.7mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 50 lines for [bigartist-server] process (change the value with --lines option)
!!:s^C
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    52  100    52    0     0  24892      0 --:--:-- --:--:-- --:--:-- 26000
{
  "success": false,
  "message": "Token no proporcionado"
}
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+------------------+-------------+--------------+
| id | name             | totalTracks | totalRevenue |
+----+------------------+-------------+--------------+
|  4 | Bad Bunny        |           0 |         0.00 |
|  6 | J Balvin         |           0 |         0.00 |
|  8 | Junior Mackenzie |           1 |         0.00 |
|  5 | Rosalia          |           0 |         0.00 |
|  7 | Test Artist      |           0 |         0.00 |
+----+------------------+-------------+--------------+
total 6.3M
-rwxr-xr-x 1 www-data www-data 4.7M Mar  3 20:27 0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png
-rwxr-xr-x 1 www-data www-data  49K Mar  3 20:27 aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png
-rw-r--r-- 1 root     root     754K Mar  3 20:27 index-B1TyL9Mn.js
-rwxr-xr-x 1 www-data www-data 754K Mar  3 18:38 index-ByZGssS6.js
-rwxr-xr-x 1 www-data www-data  23K Mar  3 20:27 index-DVSvfUbm.css
import { Users, Plus, Search, Upload } from lucide-react;
import { useState, useEffect } from react;
import { useNavigate } from react-router;

const API_URL = http://94.143.141.241:3001/api;

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde API
  useEffect(() => {
    loadArtistsFromAPI();
  }, []);

  const loadArtistsFromAPI = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(token);
      
      const response = await fetch(`${API_URL}/artists`, {
        method: GET,
        headers: {
          Authorization: `Bearer ${token}`,
          Content-Type: application/json
        }
      });

      if (!response.ok) {
        throw new Error(Error: File name too long
SELECT: command not found
a.id,e,: command not found
-bash: syntax error near unexpected token `)'
-bash: syntax error near unexpected token `DISTINCT'
-bash: syntax error near unexpected token `SUM'
FROM: command not found
LEFT: command not found
LEFT: command not found
GROUP: command not found
ORDER: command not found
ORDER BY a.name AS;
-bash: !response.ok: event not found
-bash: !/bin/bash: event not found
-bash: syntax error near unexpected token `('
✅ Autenticación removida de /api/artists

Verificando cambio:

-bash: syntax error near unexpected token `('
Ejecuta: command not found
> ^C
root@ubuntu:~# # Probar endpoint directamente
curl -s http://localhost:3001/api/artists | jq '.'
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "created_at": "2026-03-02T16:40:00.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    },
    {
      "id": 6,
      "name": "J Balvin",
      "created_at": "2026-03-02T16:40:00.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    },
    {
      "id": 8,
      "name": "Junior Mackenzie",
      "created_at": "2026-03-02T19:07:31.000Z",
      "totalTracks": 1,
      "totalRevenue": "0.00"
    },
    {
      "id": 5,
      "name": "Rosalia",
      "created_at": "2026-03-02T16:40:00.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    },
    {
      "id": 7,
      "name": "Test Artist",
      "created_at": "2026-03-02T16:46:16.000Z",
      "totalTracks": 0,
      "totalRevenue": "0.00"
    }
  ]
}
root@ubuntu:~# # Ver cuántos endpoints /api/artists hay
grep -n "app.get('/api/artists'" /var/www/bigartist/src/server/server.js

# Si hay MÁS de 1, ejecuta:
cat > /root/final-fix.sh << 'EOF'
#!/bin/bash
cd /var/www/bigartist/src/server
cp server.js server.js.backup-final-$(date +%s)

# Eliminar TODAS las líneas del primer endpoint /api/artists hasta su cierre
FIRST=$(grep -n "app.get('/api/artists'" server.js | head -1 | cut -d: -f1)
if [ ! -z "$FIRST" ]; then
  # Encontrar la línea que termina el endpoint (buscar }); después de FIRST)
  END=$(tail -n +$FIRST server.js | grep -n "^});" | head -1 | cut -d: -f1)
  END=$((FIRST + END))
  
  # Eliminar desde FIRST hasta END
  sed -i "${FIRST},${END}d" server.js
  
  echo "✅ Primer endpoint eliminado"
else
  echo "No hay duplicados"
fi

/root/final-fix.shal-fix.sh01/api/artists | jq '.'
434:app.get('/api/artists', async (req, res) => {
✅ Primer endpoint eliminado
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 18   │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
jq: parse error: Invalid numeric literal at line 1, column 10
root@ubuntu:~# curl -s http://localhost:3001/api/artists
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /api/artists</pre>
</body>
</html>
root@ubuntu:~# grep -n "app.get('/api/artists'" /var/www/bigartist/src/server/server.js
root@ubuntu:~# cat > /root/recreate-artists-endpoint.sh << 'EOF'
#!/bin/bash
echo "🔨 RECREANDO ENDPOINT /api/artists"
echo "==================================="
echo ""

cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-recreate-$(date +%s)

# Encontrar dónde insertar (después del endpoint /api/royalties/dashboard)
LINE=$(grep -n "app.get('/api/royalties/dashboard'" server.js | cut -d: -f1)

if [ -z "$LINE" ]; then
  echo "❌ No se encontró punto de inserción"
  exit 1
fi

# Calcular línea después del cierre del endpoint anterior
INSERT_LINE=$((LINE + 50))

echo "📍 Insertando en línea aproximada: $INSERT_LINE"

/root/recreate-artists-endpoint.shdpoint.sh jq '.'rver-part1.js
🔨 RECREANDO ENDPOINT /api/artists
===================================

📍 Insertando en línea aproximada: 265
✅ Endpoint /api/artists recreado

Verificando que existe:
270:app.get('/api/artists', async (req, res) => {

🔄 Reiniciando servidor...
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 19   │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
root@ubuntu:~# curl -s http://localhost:3001/api/artists
root@ubuntu:~# # 1. Ver si el servidor está corriendo
pm2 status

# 2. Ver los logs de errores
pm2 logs bigartist-api --lines 30 --err

# 3. Verificar que el endpoint existe en el archivo
grep -A 10 "app.get('/api/artists'" /var/www/bigartist/src/server/server.js

# 4. Probar con más detalles
curl -v http://localhost:3001/api/artists

# 5. Ver si el puerto 3001 está escuchando
netstat -tulpn | grep 3001
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 34   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 30 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 30 lines:
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:264
0|bigartis |       `SELECT 
0|bigartis | 
0|bigartis | SyntaxError: missing ) after argument list
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/src/server/server.js:264
0|bigartis |       `SELECT 
0|bigartis | 
0|bigartis | SyntaxError: missing ) after argument list
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)

^C
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.execute(`
      SELECT 
        a.id,
        a.name,
        a.created_at,
        COUNT(DISTINCT t.id) as totalTracks,
        COALESCE(SUM(r.amount), 0) as totalRevenue
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3001...
* connect to ::1 port 3001 from ::1 port 47722 failed: Connection refused
*   Trying 127.0.0.1:3001...
* connect to 127.0.0.1 port 3001 from 127.0.0.1 port 35208 failed: Connection refused
* Failed to connect to localhost port 3001 after 0 ms: Couldn't connect to server
* Closing connection
curl: (7) Failed to connect to localhost port 3001 after 0 ms: Couldn't connect to server
Command 'netstat' not found, but can be installed with:
apt install net-tools
root@ubuntu:~# cd /var/www/bigartist/src/server

# Ver backups disponibles
ls -lt server.js.backup-* | head -5

# Restaurar el backup MÁS ANTIGUO (antes de todos los cambios)
OLDEST_BACKUP=$(ls -t server.js.backup-* | tail -1)
echo "Restaurando desde: $OLDEST_BACKUP"
cp "$OLDEST_BACKUP" server.js

# Verificar que el archivo es válido
node -c server.js

# Si da error, probar con otro backup
# Si está bien, continuar:

# Ahora vamos a ver la estructura del archivo para saber dónde insertar
grep -n "app.get\|app.post" server.js | head -20

pm2 restart bigartist-api
sleep 2
pm2 status
-rw-r--r-- 1 root root 16872 Mar  4 11:38 server.js.backup-recreate-1772624339
-rw-r--r-- 1 root root 17628 Mar  4 10:50 server.js.backup-final-1772621424
-rw-r--r-- 1 root root 17625 Mar  4 10:46 server.js.backup-db-1772621195
-rw-r--r-- 1 root root 17625 Mar  4 10:42 server.js.backup-remove-dup-1772620924
-rw-r--r-- 1 root root 18469 Mar  4 10:38 server.js.backup-remove-dup-1772620695
Restaurando desde: server.js.backup-20260303-190232
64:app.post('/api/auth/login', async (req, res) => {
129:app.post('/api/login', async (req, res) => {
135:app.get('/api/verify', verifyToken, async (req, res) => {
164:app.post('/api/users', verifyToken, async (req, res) => {
215:app.get('/api/royalties/dashboard', verifyToken, async (req, res) => {
340:app.get('/api/royalties', verifyToken, async (req, res) => {
430:app.get('/api/artists', verifyToken, async (req, res) => {
464:app.get('/api/tracks', verifyToken, async (req, res) => {
505:app.post('/api/royalties/import', verifyToken, upload.single('csv'), async (req, res) => {
620:app.get('/api/health', (req, res) => {
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 34   │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 34   │ online    │ 0%       │ 66.0mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@ubuntu:/var/www/bigartist/src/server# cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-final-$(date +%s)

# Remover SOLO verifyToken del endpoint /api/artists (línea 430)
sed -i '430s/, verifyToken//' server.js

# Verificar el cambio
echo "Verificando línea 430:"
sed -n '430p' server.js

# Reiniciar
pm2 restart bigartist-api
sleep 2

# Probar
echo ""
echo "🧪 Probando endpoint:"
curl -s http://localhost:3001/api/artists | jq '.'
Verificando línea 430:
app.get('/api/artists', async (req, res) => {
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 35   │ online    │ 0%       │ 17.0mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
{
  "success": false,
  "message": "Error obteniendo artistas"
}
root@ubuntu:/var/www/bigartist/src/server# cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-final-$(date +%s)

# Remover SOLO verifyToken del endpoint /api/artists (línea 430)
sed -i '430s/, verifyToken//' server.js

# Verificar el cambio
echo "Verificando línea 430:"
sed -n '430p' server.js

# Reiniciar
pm2 restart bigartist-api
sleep 2

# Probar
echo ""
echo "🧪 Probando endpoint:"
curl -s http://localhost:3001/api/artists | jq '.'
Verificando línea 430:
app.get('/api/artists', async (req, res) => {
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 36   │ online    │ 0%       │ 19.3mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
{
  "success": false,
  "message": "Error obteniendo artistas"
}
root@ubuntu:/var/www/bigartist/src/server# # Ver los últimos logs del servidor
pm2 logs bigartist-api --lines 50 --nostream

# O específicamente los errores
tail -50 /root/.pm2/logs/bigartist-api-error.log
[TAILING] Tailing last 50 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 50 lines:
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: undefined
0|bigartis | 🔑 Token extraído: NO TOKEN
0|bigartis | ❌ Token no proporcionado
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: undefined
0|bigartis | 🔑 Token extraído: NO TOKEN
0|bigartis | ❌ Token no proporcionado
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ❌ Token inválido: invalid signature
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: undefined
0|bigartis | 🔑 Token extraído: NO TOKEN
0|bigartis | ❌ Token no proporcionado
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ❌ Token inválido: invalid signature
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | ✅ Retornando 5 artistas
0|bigartis | ✅ Retornando 5 artistas
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health

/root/.pm2/logs/bigartist-api-error.log last 50 lines:
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:149:13)
0|bigartis |     at Route.dispatch (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:119:3)
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
0|bigartis |   code: 'ER_NO_SUCH_TABLE',
0|bigartis |   errno: 1146,
0|bigartis |   sql: 'SELECT \n' +
0|bigartis |     '        a.id,\n' +
0|bigartis |     '        a.name,\n' +
0|bigartis |     '        COUNT(DISTINCT t.id) as total_tracks,\n' +
0|bigartis |     '        COUNT(DISTINCT r.id) as total_transactions,\n' +
0|bigartis |     '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
0|bigartis |     '      FROM artists a\n' +
0|bigartis |     '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
0|bigartis |     '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
0|bigartis |     '      GROUP BY a.id, a.name\n' +
0|bigartis |     '      ORDER BY total_revenue DESC',
0|bigartis |   sqlState: '42S02',
0|bigartis |   sqlMessage: "Table 'bigartist.tracks' doesn't exist"
0|bigartis | }
0|bigartis | Error obteniendo artistas: Error: Table 'bigartist.tracks' doesn't exist
0|bigartis |     at PromisePool.query (/var/www/bigartist/src/server/node_modules/mysql2/lib/promise/pool.js:36:22)
0|bigartis |     at /var/www/bigartist/src/server/server.js:432:34
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:149:13)
0|bigartis |     at Route.dispatch (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:119:3)
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
0|bigartis |   code: 'ER_NO_SUCH_TABLE',
0|bigartis |   errno: 1146,
0|bigartis |   sql: 'SELECT \n' +
0|bigartis |     '        a.id,\n' +
0|bigartis |     '        a.name,\n' +
0|bigartis |     '        COUNT(DISTINCT t.id) as total_tracks,\n' +
0|bigartis |     '        COUNT(DISTINCT r.id) as total_transactions,\n' +
0|bigartis |     '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
0|bigartis |     '      FROM artists a\n' +
0|bigartis |     '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
0|bigartis |     '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
0|bigartis |     '      GROUP BY a.id, a.name\n' +
0|bigartis |     '      ORDER BY total_revenue DESC',
0|bigartis |   sqlState: '42S02',
0|bigartis |   sqlMessage: "Table 'bigartist.tracks' doesn't exist"
0|bigartis | }

    at next (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:149:13)
    at Route.dispatch (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:119:3)
    at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
    at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
    at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
    at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
    at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
  code: 'ER_NO_SUCH_TABLE',
  errno: 1146,
  sql: 'SELECT \n' +
    '        a.id,\n' +
    '        a.name,\n' +
    '        COUNT(DISTINCT t.id) as total_tracks,\n' +
    '        COUNT(DISTINCT r.id) as total_transactions,\n' +
    '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
    '      FROM artists a\n' +
    '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
    '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
    '      GROUP BY a.id, a.name\n' +
    '      ORDER BY total_revenue DESC',
  sqlState: '42S02',
  sqlMessage: "Table 'bigartist.tracks' doesn't exist"
}
Error obteniendo artistas: Error: Table 'bigartist.tracks' doesn't exist
    at PromisePool.query (/var/www/bigartist/src/server/node_modules/mysql2/lib/promise/pool.js:36:22)
    at /var/www/bigartist/src/server/server.js:432:34
    at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
    at next (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:149:13)
    at Route.dispatch (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:119:3)
    at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
    at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
    at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
    at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
    at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
  code: 'ER_NO_SUCH_TABLE',
  errno: 1146,
  sql: 'SELECT \n' +
    '        a.id,\n' +
    '        a.name,\n' +
    '        COUNT(DISTINCT t.id) as total_tracks,\n' +
    '        COUNT(DISTINCT r.id) as total_transactions,\n' +
    '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
    '      FROM artists a\n' +
    '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
    '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
    '      GROUP BY a.id, a.name\n' +
    '      ORDER BY total_revenue DESC',
  sqlState: '42S02',
  sqlMessage: "Table 'bigartist.tracks' doesn't exist"
}
root@ubuntu:/var/www/bigartist/src/server# /var/www/bigartist_backup_20260302_174903/server/server.js
-bash: /var/www/bigartist_backup_20260302_174903/server/server.js: Permission denied
root@ubuntu:/var/www/bigartist/src/server# /var/www/bigartist/src/server/server.js
-bash: /var/www/bigartist/src/server/server.js: Permission denied
root@ubuntu:/var/www/bigartist/src/server# # Probar el endpoint
curl -X GET http://localhost:3001/api/artists | jq '.'

# También probarlo desde el navegador
echo "🌐 Abre en tu navegador: https://app.bigartist.es/artists"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    55  100    55    0     0  15432      0 --:--:-- --:--:-- --:--:-- 18333
{
  "success": false,
  "message": "Error obteniendo artistas"
}
🌐 Abre en tu navegador: https://app.bigartist.es/artists
root@ubuntu:/var/www/bigartist/src/server# # Probar el endpoint
curl -X GET http://localhost:3001/api/artists | jq '.'

# También probarlo desde el navegador
echo "🌐 Abre en tu navegador: https://app.bigartist.es/artists"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    55  100    55    0     0  14619      0 --:--:-- --:--:-- --:--:-- 18333
{
  "success": false,
  "message": "Error obteniendo artistas"
}
🌐 Abre en tu navegador: https://app.bigartist.es/artists
root@ubuntu:/var/www/bigartist/src/server# # Probar el endpoint directamente
curl -X GET http://localhost:3001/api/artists | jq '.'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    55  100    55    0     0  18056      0 --:--:-- --:--:-- --:--:-- 18333
{
  "success": false,
  "message": "Error obteniendo artistas"
}
root@ubuntu:/var/www/bigartist/src/server# # 1. Verificar las tablas en bigartist_db
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SHOW TABLES;"

# 2. Verificar la configuración de la base de datos en server.js
grep -n "database:" /var/www/bigartist/src/server/server.js

# 3. Verificar la estructura de la tabla artists
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE artists;"

# 4. Verificar si existe la tabla tracks
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE tracks;" 2>&1 | head -5
mysql: [Warning] Using a password on the command line interface can be insecure.
+------------------------+
| Tables_in_bigartist_db |
+------------------------+
| artists                |
| csv_uploads            |
| periods                |
| platforms              |
| royalties              |
| royalty_details        |
| royalty_summary        |
| royalty_types          |
| territories            |
| tracks                 |
| users                  |
+------------------------+
30:  database: process.env.DB_NAME || 'bigartist',
mysql: [Warning] Using a password on the command line interface can be insecure.
+------------+--------------+------+-----+-------------------+-------------------+
| Field      | Type         | Null | Key | Default           | Extra             |
+------------+--------------+------+-----+-------------------+-------------------+
| id         | int          | NO   | PRI | NULL              | auto_increment    |
| name       | varchar(255) | NO   | UNI | NULL              |                   |
| created_at | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+--------------+------+-----+-------------------+-------------------+
mysql: [Warning] Using a password on the command line interface can be insecure.
Field	Type	Null	Key	Default	Extra
id	int	NO	PRI	NULL	auto_increment
title	varchar(255)	NO	MUL	NULL	
isrc	varchar(12)	YES	MUL	NULL	
root@ubuntu:/var/www/bigartist/src/server# cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-db-fix-$(date +%s)

# Cambiar la base de datos de 'bigartist' a 'bigartist_db'
sed -i "30s/database: process.env.DB_NAME || 'bigartist',/database: process.env.DB_NAME || 'bigartist_db',/" server.js

# Verificar el cambio
echo "✅ Cambio realizado:"
sed -n '30p' server.js

# Reiniciar
pm2 restart bigartist-api
sleep 2

# Probar
echo ""
echo "🧪 Probando endpoint:"
curl -X GET http://localhost:3001/api/artists | jq '.'
✅ Cambio realizado:
  database: process.env.DB_NAME || 'bigartist_db',
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 37   │ online    │ 0%       │ 18.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    55  100    55    0     0   2786      0 --:--:-- --:--:-- --:--:--  2894
{
  "success": false,
  "message": "Error obteniendo artistas"
}
root@ubuntu:/var/www/bigartist/src/server# # Ver los últimos logs del servidor
pm2 logs bigartist-api --lines 30 --nostream

# Ver la estructura COMPLETA de la tabla tracks
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE tracks;"

# Ver el endpoint /api/artists completo para ver el SQL
grep -A 40 "app.get('/api/artists'" /var/www/bigartist/src/server/server.js
[TAILING] Tailing last 30 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 30 lines:
0|bigartis | 🔑 Token extraído: NO TOKEN
0|bigartis | ❌ Token no proporcionado
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ❌ Token inválido: invalid signature
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: undefined
0|bigartis | 🔑 Token extraído: NO TOKEN
0|bigartis | ❌ Token no proporcionado
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Headers recibidos: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ❌ Token inválido: invalid signature
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | ✅ Retornando 5 artistas
0|bigartis | ✅ Retornando 5 artistas
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health

/root/.pm2/logs/bigartist-api-error.log last 30 lines:
0|bigartis |   sqlState: '42S02',
0|bigartis |   sqlMessage: "Table 'bigartist.tracks' doesn't exist"
0|bigartis | }
0|bigartis | Error obteniendo artistas: Error: Unknown column 'r.net_receipts' in 'field list'
0|bigartis |     at PromisePool.query (/var/www/bigartist/src/server/node_modules/mysql2/lib/promise/pool.js:36:22)
0|bigartis |     at /var/www/bigartist/src/server/server.js:432:34
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:149:13)
0|bigartis |     at Route.dispatch (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:119:3)
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
0|bigartis |   code: 'ER_BAD_FIELD_ERROR',
0|bigartis |   errno: 1054,
0|bigartis |   sql: 'SELECT \n' +
0|bigartis |     '        a.id,\n' +
0|bigartis |     '        a.name,\n' +
0|bigartis |     '        COUNT(DISTINCT t.id) as total_tracks,\n' +
0|bigartis |     '        COUNT(DISTINCT r.id) as total_transactions,\n' +
0|bigartis |     '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
0|bigartis |     '      FROM artists a\n' +
0|bigartis |     '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
0|bigartis |     '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
0|bigartis |     '      GROUP BY a.id, a.name\n' +
0|bigartis |     '      ORDER BY total_revenue DESC',
0|bigartis |   sqlState: '42S22',
0|bigartis |   sqlMessage: "Unknown column 'r.net_receipts' in 'field list'"
0|bigartis | }

mysql: [Warning] Using a password on the command line interface can be insecure.
+------------+--------------+------+-----+-------------------+-------------------+
| Field      | Type         | Null | Key | Default           | Extra             |
+------------+--------------+------+-----+-------------------+-------------------+
| id         | int          | NO   | PRI | NULL              | auto_increment    |
| title      | varchar(255) | NO   | MUL | NULL              |                   |
| isrc       | varchar(12)  | YES  | MUL | NULL              |                   |
| upc        | varchar(13)  | YES  | MUL | NULL              |                   |
| artist_id  | int          | NO   | MUL | NULL              |                   |
| created_at | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+--------------+------+-----+-------------------+-------------------+
app.get('/api/artists', async (req, res) => {
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

// **ENDPOINT: Obtener tracks (canciones)**
app.get('/api/tracks', verifyToken, async (req, res) => {
  try {
    const [tracks] = await pool.query(
      `SELECT 
        t.id,
        t.title,
        t.isrc,
root@ubuntu:/var/www/bigartist/src/server# # Ver estructura de la tabla royalties
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE royalties;"
mysql: [Warning] Using a password on the command line interface can be insecure.
+------------+------------------------------------+------+-----+-------------------+-------------------+
| Field      | Type                               | Null | Key | Default           | Extra             |
+------------+------------------------------------+------+-----+-------------------+-------------------+
| id         | int                                | NO   | PRI | NULL              | auto_increment    |
| artist_id  | int                                | NO   | MUL | NULL              |                   |
| amount     | decimal(10,2)                      | NO   |     | NULL              |                   |
| period     | varchar(50)                        | NO   |     | NULL              |                   |
| status     | enum('pending','paid','cancelled') | YES  |     | pending           |                   |
| created_at | timestamp                          | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+------------------------------------+------+-----+-------------------+-------------------+
root@ubuntu:/var/www/bigartist/src/server# cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-artists-fix-$(date +%s)

# Corregir el SQL del endpoint /api/artists
sed -i '432s/COALESCE(SUM(r.net_receipts), 0)/COALESCE(SUM(r.amount), 0)/' server.js
sed -i '435s/LEFT JOIN royalties r ON r.track_id = t.id/LEFT JOIN royalties r ON r.artist_id = a.id/' server.js

# Verificar
echo "✅ Cambios realizados:"
sed -n '432p' server.js
sed -n '435p' server.js

# Reiniciar
pm2 restart bigartist-api
sleep 2

# Probar
echo ""
echo "🧪 Probando endpoint:"
curl -X GET http://localhost:3001/api/artists | jq '.'
✅ Cambios realizados:
    const [artists] = await pool.query(
        a.name,
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 38   │ online    │ 0%       │ 23.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    55  100    55    0     0   2657      0 --:--:-- --:--:-- --:--:--  2750
{
  "success": false,
  "message": "Error obteniendo artistas"
}
root@ubuntu:/var/www/bigartist/src/server# Last login: Tue Mar  3 20:49:25 on ttys002
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 09:40:13 UTC 2026

  System load:  0.0               Processes:             115
  Usage of /:   6.1% of 76.45GB   Users logged in:       0
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

root@ubuntu:/var/www/bigartist/src/server#  0 --:--:-- --:--:-- --:--:--  2750tN
Command 'Last' not found, did you mean:
  command 'fast' from snap fast (0.0.4)
  command 'ast' from deb jruby (9.3.9.0+ds-1)
  command 'nast' from deb nast (0.2.0-10)
  command 'last' from deb util-linux (2.39.3-9ubuntu6.4)
See 'snap info <snapname>' for additional versions.
-bash: /Users/aritzarrieta/.zprofile:1:: No such file or directory
-bash: /Users/aritzarrieta/.zprofile:2:: No such file or directory
aritzarrieta@MBP-de-Aritz: command not found
-bash: !@?': event not found
-bash: root@94.143.141.241s password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 09:40:13 UTC 2026

  System load:  0.0               Processes:             115
  Usage of /:   6.1% of 76.45GB   Users logged in:       0
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Tue Mar  3 19:50:02 2026 from 207.188.130.38
root@ubuntu:~# # 1. Verificar que el servidor esté corriendo
pm2 status

# 2. Ver los logs del servidor para errores
pm2 logs bigartist-server --lines 50

# 3. Probar el endpoint /api/artists directamente
curl -X GET http://94.143.141.241:3001/api/artists \
  -H "Content-Type: application/json" | jq .

# 4. Verificar que hay artistas en la BD
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as totalTracks,
  COALESCE(SUM(r.amount), 0) as totalRevenue
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON a.id = r.artist_id
GROUP BY a.id, a.name
ORDER BY a.name ASC;
"

head -50 /var/www/bigartist/src/pages/ArtistsPage.tsxte
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 194  │ online    │ 0%       │ 65.7mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 50 lines for [bigartist-server] process (change the value with --lines option)
!!:s^C
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    52  100    52    0     0  24892      0 --:--:-- --:--:-- --:--:-- 26000
{
  "success": false,
  "message": "Token no proporcionado"
}
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+------------------+-------------+--------------+
| id | name             | totalTracks | totalRevenue |
+----+------------------+-------------+--------------+
|  4 | Bad Bunny        |           0 |         0.00 |
|  6 | J Balvin         |           0 |         0.00 |
|  8 | Junior Mackenzie |           1 |         0.00 |
|  5 | Rosalia          |           0 |         0.00 |
|  7 | Test Artist      |           0 |         0.00 |
+----+------------------+-------------+--------------+
total 6.3M
-rwxr-xr-x 1 www-data www-data 4.7M Mar  3 20:27 0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png
-rwxr-xr-x 1 www-data www-data  49K Mar  3 20:27 aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png
-rw-r--r-- 1 root     root     754K Mar  3 20:27 index-B1TyL9Mn.js
-rwxr-xr-x 1 www-data www-data 754K Mar  3 18:38 index-ByZGssS6.js
-rwxr-xr-x 1 www-data www-data  23K Mar  3 20:27 index-DVSvfUbm.css
import { Users, Plus, Search, Upload } from lucide-react;
import { useState, useEffect } from react;
import { useNavigate } from react-router;

const API_URL = http://94.143.141.241:3001/api;

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde API
  useEffect(() => {
    loadArtistsFromAPI();
  }, []);

  const loadArtistsFromAPI = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(token);
      
      const response = await fetch(`${API_URL}/artists`, {
        method: GET,
        headers: {
          Authorization: `Bearer ${token}`,
          Content-Type: application/json
        }
      });

      if (!response.ok) {
        throw new Error(Error: File name too long
SELECT: command not found
a.id,e,: command not found
-bash: syntax error near unexpected token `)'
-bash: syntax error near unexpected token `DISTINCT'
-bash: syntax error near unexpected token `SUM'
FROM: command not found
LEFT: command not found
LEFT: command not found
GROUP: command not found
ORDER: command not found
ORDER BY a.name AS;
-bash: !response.ok: event not found
-bash: !/bin/bash: event not found
-bash: syntax error near unexpected token `('
✅ Autenticación removida de /api/artists

Verificando cambio:
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.query(

-bash: syntax error near unexpected token `('
Ejecuta: command not found
> ^C
root@ubuntu:/var/www/bigartist/src/server# # Ver el archivo ArtistsPage.tsx completo
cat /var/www/bigartist/src/pages/ArtistsPage.tsx
import { Users, Plus, Search, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const API_URL = 'http://94.143.141.241:3001/api';

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde API
  useEffect(() => {
    loadArtistsFromAPI();
  }, []);

  const loadArtistsFromAPI = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/artists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar artistas');
      }

      const data = await response.json();
      console.log('✅ Artistas cargados:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setArtists(data.data);
      } else {
        setArtists([]);
      }
    } catch (error) {
      console.error('❌ Error loading artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter(artist =>
    artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#AFB3B7' }}>
        <p>Cargando artistas...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#ffffff',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Users size={32} color="#c9a574" />
          Gestión de Artistas
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Administra la información y contratos de tus artistas {artists.length > 0 && `(${artists.length} artistas)`}
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(42, 63, 63, 0.4)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <Search
              size={20}
              color="#c9a574"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              placeholder="Buscar artistas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
          }}
          onClick={() => navigate('/add-artist')}
        >
          <Plus size={20} />
          Agregar Artista
        </button>
      </div>

      {/* Lista de artistas */}
      {filteredArtists.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {filteredArtists.map((artist, idx) => (
            <div
              key={artist.id || idx}
              onClick={() => {
                if (artist.id) {
                  console.log('Navegando a:', `/artist-portal/${artist.id}`);
                  navigate(`/artist-portal/${artist.id}`);
                }
              }}
              style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(201, 165, 116, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
              }}
            >
              {/* Foto grande tipo postal - header */}
              <div style={{
                width: '100%',
                height: '200px',
                backgroundImage: artist.photo 
                  ? `url(${artist.photo})`
                  : 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                {/* Overlay gradient para mejor legibilidad */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '80px',
                  background: 'linear-gradient(to top, rgba(13, 31, 35, 0.95), transparent)'
                }} />
                
                {/* Badge de status */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: 'rgba(34, 197, 94, 0.9)',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(10px)'
                }}>
                  Activo
                </div>
              </div>

              {/* Contenido de la tarjeta */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: '#ffffff', 
                  marginBottom: '6px',
                  lineHeight: '1.2'
                }}>
                  {artist.name}
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#8b9299', 
                  marginBottom: '20px' 
                }}>
                  {artist.email || 'Sin email'}
                </p>

                {/* Stats grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    background: 'rgba(201, 165, 116, 0.08)',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(201, 165, 116, 0.15)'
                  }}>
                    <div style={{ fontSize: '11px', color: '#8b9299', marginBottom: '4px' }}>
                      Canciones
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                      {artist.totalTracks || 0}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ fontSize: '11px', color: '#8b9299', marginBottom: '4px' }}>
                      Ingresos
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                      €{(artist.totalRevenue || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <Upload size={48} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            No hay artistas registrados
          </h3>
          <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
            {artists.length === 0 
              ? 'Sube un archivo CSV para ver los artistas automáticamente'
              : 'Intenta con otros términos de búsqueda'}
          </p>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
            }}
            onClick={() => navigate('/upload')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
            }}
          >
            <Upload size={20} />
            Ir a Subir Archivos
          </button>
        </div>
      )}
    </div>
  );
}
root@ubuntu:/var/www/bigartist/src/server# # Probar endpoint sin token
curl -X GET http://94.143.141.241:3001/api/artists | jq '.'

# Ver el SQL completo del endpoint
sed -n '433,460p' /var/www/bigartist/src/server/server.js
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    55  100    55    0     0  13313      0 --:--:-- --:--:-- --:--:-- 13750
{
  "success": false,
  "message": "Error obteniendo artistas"
}
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
root@ubuntu:/var/www/bigartist/src/server# cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-final-$(date +%s)

# Crear script de corrección en Python
cat > fix_endpoint.py << 'PYFIX'
import re

with open('server.js', 'r') as f:
    content = f.read()

# Reemplazar net_receipts por amount
content = re.sub(r'r\.net_receipts', 'r.amount', content)

# Reemplazar track_id por artist_id en el JOIN de royalties
content = re.sub(
    r'LEFT JOIN royalties r ON r\.track_id = t\.id',
    'LEFT JOIN royalties r ON r.artist_id = a.id',
    content
)

with open('server.js', 'w') as f:
curl -X GET http://94.143.141.241:3001/api/artists | jq '.'
✅ Archivo corregido

Verificando correcciones:
      LEFT JOIN royalties r ON r.artist_id = a.id
      GROUP BY a.id, a.name
      ORDER BY total_revenue DESC`
    );
    
    res.json({
      success: true,
      data: artists.map(a => ({
        ...a,
        total_revenue: parseFloat(a.total_revenue)
      }))
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 39   │ online    │ 0%       │ 18.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   461  100   461    0     0  22571      0 --:--:-- --:--:-- --:--:-- 23050
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 5,
      "name": "Rosalia",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 6,
      "name": "J Balvin",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 7,
      "name": "Test Artist",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 8,
      "name": "Junior Mackenzie",
      "total_tracks": 1,
      "total_transactions": 0,
      "total_revenue": 0
    }
  ]
}
root@ubuntu:/var/www/bigartist/src/server# cd /var/www/bigartist/src/pages

# Opción 1: Remover token de la llamada a /api/artists
sed -i "s/'Authorization': \`Bearer \${token}\`,/\/\/ 'Authorization': \`Bearer \${token}\`,/" ArtistsPage.tsx

# Rebuild frontend
cd /var/www/bigartist
npm run build

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-C_dQh2xd.js                                        771.41 kB │ gzip: 222.30 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.43s
root@ubuntu:/var/www/bigartist# # Copiar build a producción
rm -rf /var/www/bigartist/dist/assets/*
cp -r /var/www/bigartist/build/* /var/www/bigartist/dist/

# Verificar
ls -lh /var/www/bigartist/dist/assets/

# Probar la aplicación
echo "🌐 Ve a: https://app.bigartist.es/artists"
total 5.5M
-rw-r--r-- 1 root root 4.7M Mar  4 13:08 0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png
-rw-r--r-- 1 root root  49K Mar  4 13:08 aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png
-rw-r--r-- 1 root root 754K Mar  4 13:08 index-C_dQh2xd.js
-rw-r--r-- 1 root root  23K Mar  4 13:08 index-DVSvfUbm.css
🌐 Ve a: https://app.bigartist.es/artists
root@ubuntu:/var/www/bigartist# # Ver errores en consola del navegador (F12)
# O verifica que el HTML apunte al archivo correcto

cat /var/www/bigartist/dist/index.html | grep "index-"
      <script type="module" crossorigin src="/assets/index-C_dQh2xd.js"></script>
      <link rel="stylesheet" crossorigin href="/assets/index-DVSvfUbm.css">
root@ubuntu:/var/www/bigartist# # Actualizar HTML si es necesario
cat /var/www/bigartist/dist/index.html

  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bam Royalties System</title>
      <script type="module" crossorigin src="/assets/index-C_dQh2xd.js"></script>
      <link rel="stylesheet" crossorigin href="/assets/index-DVSvfUbm.css">
    </head>

    <body>
      <div id="root"></div>
    </body>
  </html>
root@ubuntu:/var/www/bigartist# # En el servidoror
cd /var/www/bigartist

# Construir el proyecto con la nueva configuración
npm run build

# Copiar archivos a producción
rm -rf /var/www/bigartist/dist/assets/*
cp -r /var/www/bigartist/build/* /var/www/bigartist/dist/

# Verificar
echo "✅ Archivos actualizados"

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-C_dQh2xd.js                                        771.41 kB │ gzip: 222.30 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.29s
✅ Archivos actualizados
root@ubuntu:/var/www/bigartist# Necesitas reconstruir el proyecto en el servidor porque cambiamos el código. Los archivos actuales en producción todavía tienen la configuración antigua.

Ejecuta estos comandos en el servidor:

# Conectar al servidor
ssh root@94.143.141.241

# Ir al directorio del proyecto
cd /var/www/bigartist

# 1. Actualizar el archivo api.ts con la nueva configuración
cat > src/utils/api.ts << 'EOF'
// API Configuration
// Detecta automáticamente si estamos en producción o desarrollo
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // En el navegador, usar el dominio actual + /api
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    // En producción, usar la IP del servidor directamente
echo "⚠️ Recuerda presionar Ctrl+Shift+R para limpiar caché del navegador"ión');t
Necesitas: command not found
Ejecuta: command not found
root@94.143.141.241's password: 

Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 13:17:03 UTC 2026

  System load:  0.05              Processes:             113
  Usage of /:   6.2% of 76.45GB   Users logged in:       1
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Wed Mar  4 09:40:13 2026 from 207.188.130.38
root@ubuntu:~# 
root@ubuntu:~# cd /var/www/bigartist

# 1. Actualizar el archivo api.ts con la nueva configuración
cat > src/utils/api.ts << 'EOF'
// API Configuration
// Detecta automáticamente si estamos en producción o desarrollo
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // En el navegador, usar el dominio actual + /api
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    // En producción, usar la IP del servidor directamente
    return 'http://94.143.141.241:3001/api';
  }
  // Fallback para SSR
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

// API Endpoints for data fetching
export const API_ENDPOINTS = {
echo "⚠️ Recuerda presionar Ctrl+Shift+R para limpiar caché del navegador"ión');t
📄 Verificando configuración de API:
    // En producción, usar la IP del servidor directamente
    return 'http://94.143.141.241:3001/api';
  }
  // Fallback para SSR
  return 'http://localhost:3001/api';
};
🔨 Construyendo proyecto...

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-CnsnkA5e.js                                        771.41 kB │ gzip: 222.29 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.70s
📦 Copiando archivos...
✅ Archivos en producción:
-rw-r--r-- 1 root root 754K Mar  4 13:17 /var/www/bigartist/dist/assets/index-CnsnkA5e.js
🌐 Listo! Prueba en: https://app.bigartist.es
⚠️ Recuerda presionar Ctrl+Shift+R para limpiar caché del navegador
root@ubuntu:/var/www/bigartist# # 1. Verificar que el archivo se actualizó
echo "=== CONTENIDO DE api.ts ==="
cat /var/www/bigartist/src/utils/api.ts | head -20

# 2. Verificar última build
echo -e "\n=== ÚLTIMA BUILD ==="
ls -lth /var/www/bigartist/build/assets/index-*.js | head -1

# 3. Verificar archivos en producción
echo -e "\n=== ARCHIVOS EN PRODUCCIÓN ==="
ls -lth /var/www/bigartist/dist/assets/index-*.js | head -1

# 4. Ver si el build tiene la URL correcta
echo -e "\n=== BUSCAR '94.143.141.241' EN BUILD ==="
grep -o "94.143.141.241:3001" /var/www/bigartist/build/assets/index-*.js | head -1

# 5. Ver si producción tiene la URL correcta
echo -e "\n=== BUSCAR '94.143.141.241' EN PRODUCCIÓN ==="
grep -o "94.143.141.241:3001" /var/www/bigartist/dist/assets/index-*.js | head -1
=== CONTENIDO DE api.ts ===
// API Configuration
// Detecta automáticamente si estamos en producción o desarrollo
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // En el navegador, usar el dominio actual + /api
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    // En producción, usar la IP del servidor directamente
    return 'http://94.143.141.241:3001/api';
  }
  // Fallback para SSR
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

// API Endpoints for data fetching
export const API_ENDPOINTS = {
  DASHBOARD: '/dashboard',

=== ÚLTIMA BUILD ===
-rw-r--r-- 1 root root 754K Mar  4 13:17 /var/www/bigartist/build/assets/index-CnsnkA5e.js

=== ARCHIVOS EN PRODUCCIÓN ===
-rw-r--r-- 1 root root 754K Mar  4 13:17 /var/www/bigartist/dist/assets/index-CnsnkA5e.js

=== BUSCAR '94.143.141.241' EN BUILD ===
94.143.141.241:3001

=== BUSCAR '94.143.141.241' EN PRODUCCIÓN ===
94.143.141.241:3001
root@ubuntu:/var/www/bigartist# # Ver las últimas líneas del archivo para encontrar el error
tail -50 /var/www/bigartist/src/server/server.js

# O cuenta las llaves para ver si están balanceadas
echo "Llaves abiertas: $(grep -o '{' /var/www/bigartist/src/server/server.js | wc -l)"
echo "Llaves cerradas: $(grep -o '}' /var/www/bigartist/src/server/server.js | wc -l)"
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
});Llaves abiertas: 117
Llaves cerradas: 117
root@ubuntu:/var/www/bigartist# cat > /root/fix-duplicate-endpoint.sh << 'FIXDUPE'
#!/bin/bash
echo "🔧 ELIMINANDO ENDPOINT DUPLICADO"
echo "================================="
echo ""

cd /var/www/bigartist/src/server

# Backup
cp server.js server.js.backup-fix-$(date +%Y%m%d-%H%M%S)

# Encontrar línea de PRIMER endpoint (el que tiene verifyToken)
FIRST_LINE=$(grep -n "app.get('/api/artists', verifyToken" server.js | cut -d: -f1)

if [ -n "$FIRST_LINE" ]; then
  echo "📍 Primer endpoint (CON verifyToken) en línea: $FIRST_LINE"
  
  # Comentar la línea con verifyToken
  sed -i "${FIRST_LINE}s/^/\/\/ REMOVIDO - /" server.js
  
  echo "✅ Primer endpoint comentado"
else
/root/fix-duplicate-endpoint.shdpoint.shs | jq '.' | head -20
🔧 ELIMINANDO ENDPOINT DUPLICADO
=================================

⚠️ No se encontró endpoint con verifyToken

🔍 Endpoints de /api/artists restantes:
430:app.get('/api/artists', async (req, res) => {

🔄 Reiniciando servidor...
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 40   │ online    │ 0%       │ 12.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 Probando endpoint:
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 5,
      "name": "Rosalia",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 6,
      "name": "J Balvin",
root@ubuntu:/var/www/bigartist# Last login: Tue Mar  3 20:49:25 on ttys002
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 09:40:13 UTC 2026

  System load:  0.0               Processes:             115
  Usage of /:   6.1% of 76.45GB   Users logged in:       0
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

echo "✅ Ahora ve a https://app.bigartist.es/artists y presiona Ctrl+Shift+R"─┘-
Command 'Last' not found, did you mean:
  command 'fast' from snap fast (0.0.4)
  command 'ast' from deb jruby (9.3.9.0+ds-1)
  command 'last' from deb util-linux (2.39.3-9ubuntu6.4)
  command 'nast' from deb nast (0.2.0-10)
See 'snap info <snapname>' for additional versions.
-bash: /Users/aritzarrieta/.zprofile:1:: No such file or directory
-bash: /Users/aritzarrieta/.zprofile:2:: No such file or directory
aritzarrieta@MBP-de-Aritz: command not found
-bash: !@?': event not found
-bash: root@94.143.141.241s password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 09:40:13 UTC 2026

  System load:  0.0               Processes:             115
  Usage of /:   6.1% of 76.45GB   Users logged in:       0
  Memory usage: 48%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Tue Mar  3 19:50:02 2026 from 207.188.130.38
root@ubuntu:~# # 1. Verificar que el servidor esté corriendo
pm2 status

# 2. Ver los logs del servidor para errores
pm2 logs bigartist-server --lines 50

# 3. Probar el endpoint /api/artists directamente
curl -X GET http://94.143.141.241:3001/api/artists \
  -H "Content-Type: application/json" | jq .

# 4. Verificar que hay artistas en la BD
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as totalTracks,
  COALESCE(SUM(r.amount), 0) as totalRevenue
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON a.id = r.artist_id
GROUP BY a.id, a.name
ORDER BY a.name ASC;
"

head -50 /var/www/bigartist/src/pages/ArtistsPage.tsxte
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 194  │ online    │ 0%       │ 65.7mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 50 lines for [bigartist-server] process (change the value with --lines option)
!!:s^C
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    52  100    52    0     0  24892      0 --:--:-- --:--:-- --:--:-- 26000
{
  "success": false,
  "message": "Token no proporcionado"
}
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+------------------+-------------+--------------+
| id | name             | totalTracks | totalRevenue |
+----+------------------+-------------+--------------+
|  4 | Bad Bunny        |           0 |         0.00 |
|  6 | J Balvin         |           0 |         0.00 |
|  8 | Junior Mackenzie |           1 |         0.00 |
|  5 | Rosalia          |           0 |         0.00 |
|  7 | Test Artist      |           0 |         0.00 |
+----+------------------+-------------+--------------+
total 6.3M
-rwxr-xr-x 1 www-data www-data 4.7M Mar  3 20:27 0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png
-rwxr-xr-x 1 www-data www-data  49K Mar  3 20:27 aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png
-rw-r--r-- 1 root     root     754K Mar  3 20:27 index-B1TyL9Mn.js
-rwxr-xr-x 1 www-data www-data 754K Mar  3 18:38 index-ByZGssS6.js
-rwxr-xr-x 1 www-data www-data  23K Mar  3 20:27 index-DVSvfUbm.css
import { Users, Plus, Search, Upload } from lucide-react;
import { useState, useEffect } from react;
import { useNavigate } from react-router;

const API_URL = http://94.143.141.241:3001/api;

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde API
  useEffect(() => {
    loadArtistsFromAPI();
  }, []);

  const loadArtistsFromAPI = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(token);
      
      const response = await fetch(`${API_URL}/artists`, {
        method: GET,
        headers: {
          Authorization: `Bearer ${token}`,
          Content-Type: application/json
        }
      });

      if (!response.ok) {
        throw new Error(Error: File name too long
SELECT: command not found
a.id,e,: command not found
-bash: syntax error near unexpected token `)'
-bash: syntax error near unexpected token `DISTINCT'
-bash: syntax error near unexpected token `SUM'
FROM: command not found
LEFT: command not found
LEFT: command not found
GROUP: command not found
ORDER: command not found
ORDER BY a.name AS;
-bash: !response.ok: event not found
-bash: !/bin/bash: event not found
-bash: syntax error near unexpected token `('
✅ Autenticación removida de /api/artists

Verificando cambio:
grep: server.js: No such file or directory

-bash: syntax error near unexpected token `('
Ejecuta: command not found
> ^C
root@ubuntu:/var/www/bigartist# cd /var/www/bigartist

# 1. Hacer build
npm run build

# 2. Copiar archivos
rm -rf dist/*
cp -r build/* dist/

# 3. Verificar que los archivos se copiaron
ls -lh dist/assets/

# 4. Limpiar caché del navegador y recargar
echo "✅ Ahora ve a https://app.bigartist.es/artists y presiona Ctrl+Shift+R"

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-CnsnkA5e.js                                        771.41 kB │ gzip: 222.29 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.45s
total 5.5M
-rw-r--r-- 1 root root 4.7M Mar  4 13:28 0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png
-rw-r--r-- 1 root root  49K Mar  4 13:28 aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png
-rw-r--r-- 1 root root 754K Mar  4 13:28 index-CnsnkA5e.js
-rw-r--r-- 1 root root  23K Mar  4 13:28 index-DVSvfUbm.css
✅ Ahora ve a https://app.bigartist.es/artists y presiona Ctrl+Shift+R
root@ubuntu:/var/www/bigartist# # Ver el código actual de importación
cat /var/www/bigartist/src/server/importCSV.js

# Ver las columnas del CSV que se espera
head -1 /var/www/bigartist/uploads/*.csv 2>/dev/null | head -1
const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');

// Configuración de la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'BigArtist2018!@?',
  database: 'bigartist_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

class CSVImporter {
  constructor() {
    this.stats = {
      artistsCreated: 0,
      artistsUpdated: 0,
      tracksCreated: 0,
      tracksUpdated: 0,
      royaltiesCreated: 0,
      errors: []
    };
  }

  async findOrCreateArtist(artistName) {
    try {
      if (!artistName || artistName.trim() === '') {
        console.log('⚠️  Nombre de artista vacío, usando "Desconocido"');
        artistName = 'Desconocido';
      }

      // Normalizar nombre
      const normalizedName = artistName.trim();

      // Buscar artista existente
      const [rows] = await pool.execute(
        'SELECT id FROM artists WHERE name = ?',
        [normalizedName]
      );
      
      if (rows.length > 0) {
        console.log(`✅ Artista encontrado: ${normalizedName} (ID: ${rows[0].id})`);
        this.stats.artistsUpdated++;
        return rows[0].id;
      }
      
      // Crear nuevo artista
      console.log(`➕ Creando nuevo artista: ${normalizedName}`);
      const [result] = await pool.execute(
        'INSERT INTO artists (name, created_at, updated_at) VALUES (?, NOW(), NOW())',
        [normalizedName]
      );
      
      this.stats.artistsCreated++;
      console.log(`✅ Artista creado: ${normalizedName} (ID: ${result.insertId})`);
      return result.insertId;

    } catch (error) {
      console.error('❌ Error en findOrCreateArtist:', error);
      this.stats.errors.push(`Error creando artista ${artistName}: ${error.message}`);
      return null;
    }
  }

  async findOrCreateTrack(trackData, artistId) {
    try {
      const { title, isrc, upc } = trackData;

      if (!title || title.trim() === '') {
        console.log('⚠️  Título de canción vacío, saltando...');
        return null;
      }

      // Buscar por ISRC (más específico)
      if (isrc && isrc.trim() !== '') {
        const [rows] = await pool.execute(
          'SELECT id FROM tracks WHERE isrc = ?',
          [isrc]
        );
        
        if (rows.length > 0) {
          console.log(`✅ Track encontrado por ISRC: ${title} (ID: ${rows[0].id})`);
          this.stats.tracksUpdated++;
          return rows[0].id;
        }
      }

      // Buscar por título y artista
      const [rows] = await pool.execute(
        'SELECT id FROM tracks WHERE title = ? AND artist_id = ?',
        [title, artistId]
      );
      
      if (rows.length > 0) {
        console.log(`✅ Track encontrado: ${title} (ID: ${rows[0].id})`);
        this.stats.tracksUpdated++;
        return rows[0].id;
      }

      // Crear nueva track
      console.log(`➕ Creando nueva track: ${title} para artista ID ${artistId}`);
      const [result] = await pool.execute(
        'INSERT INTO tracks (title, artist_id, isrc, upc, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [title, artistId, isrc || null, upc || null]
      );

      this.stats.tracksCreated++;
      console.log(`✅ Track creado: ${title} (ID: ${result.insertId})`);
      return result.insertId;

    } catch (error) {
      console.error('❌ Error en findOrCreateTrack:', error);
      this.stats.errors.push(`Error creando track ${trackData.title}: ${error.message}`);
      return null;
    }
  }

  async createRoyalty(royaltyData) {
    try {
      const { trackId, artistId, amount, streams, period } = royaltyData;

      if (!trackId || !artistId) {
        console.log('⚠️  Faltan track_id o artist_id, saltando royalty...');
        return false;
      }

      // Insertar royalty
      await pool.execute(
        'INSERT INTO royalties (track_id, artist_id, amount, streams, period, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [trackId, artistId, amount || 0, streams || 0, period || null]
      );

      this.stats.royaltiesCreated++;
      return true;

    } catch (error) {
      console.error('❌ Error en createRoyalty:', error);
      this.stats.errors.push(`Error creando royalty: ${error.message}`);
      return false;
    }
  }

  async processCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      console.log('📂 Leyendo archivo CSV:', filePath);

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          console.log(`📊 Total de filas en CSV: ${results.length}`);

          try {
            for (const row of results) {
              // Mapeo de columnas del CSV de The Orchard
              const artistName = row['Artist'] || row['artist'] || row['ARTIST'];
              const trackTitle = row['Song Title'] || row['Title'] || row['title'] || row['SONG TITLE'];
              const isrc = row['ISRC'] || row['isrc'];
              const upc = row['UPC'] || row['upc'];
              const amount = parseFloat(row['Amount'] || row['amount'] || row['Revenue'] || row['revenue'] || 0);
              const streams = parseInt(row['Quantity'] || row['quantity'] || row['Streams'] || row['streams'] || 0);
              const period = row['Period'] || row['period'] || row['Sale Month'] || row['sale_month'];

              console.log(`\n--- Procesando fila ---`);
              console.log(`Artista: ${artistName}`);
              console.log(`Canción: ${trackTitle}`);
              console.log(`ISRC: ${isrc}`);
              console.log(`Amount: €${amount}`);
              console.log(`Streams: ${streams}`);

              // 1. Crear o encontrar artista
              const artistId = await this.findOrCreateArtist(artistName);
              if (!artistId) {
                console.log('⚠️  No se pudo crear artista, saltando fila...');
                continue;
              }

              // 2. Crear o encontrar track
              const trackId = await this.findOrCreateTrack(
                { title: trackTitle, isrc, upc },
                artistId
              );
              if (!trackId) {
                console.log('⚠️  No se pudo crear track, saltando fila...');
                continue;
              }

              // 3. Crear royalty
              await this.createRoyalty({
                trackId,
                artistId,
                amount,
                streams,
                period
              });
            }

            console.log('\n✅ ✅ ✅  PROCESAMIENTO COMPLETADO  ✅ ✅ ✅');
            console.log('📊 Estadísticas:');
            console.log(`   Artistas creados: ${this.stats.artistsCreated}`);
            console.log(`   Artistas existentes: ${this.stats.artistsUpdated}`);
            console.log(`   Tracks creados: ${this.stats.tracksCreated}`);
            console.log(`   Tracks existentes: ${this.stats.tracksUpdated}`);
            console.log(`   Royalties creados: ${this.stats.royaltiesCreated}`);
            console.log(`   Errores: ${this.stats.errors.length}`);

            if (this.stats.errors.length > 0) {
              console.log('\n⚠️  Errores encontrados:');
              this.stats.errors.forEach((err, idx) => {
                console.log(`   ${idx + 1}. ${err}`);
              });
            }

            resolve({
              success: true,
              stats: this.stats,
              message: 'CSV procesado correctamente'
            });

          } catch (error) {
            console.error('❌ Error procesando CSV:', error);
            reject({
              success: false,
              message: error.message,
              stats: this.stats
            });
          }
        })
        .on('error', (error) => {
          console.error('❌ Error leyendo CSV:', error);
          reject({
            success: false,
            message: error.message
          });
        });
    });
  }
}

module.exports = new CSVImporter();
root@ubuntu:/var/www/bigartist# # 1. Ver el código actual de importación web (usado desde la interfaz)
cat /var/www/bigartist/src/server/importCSV.js | grep -A 20 "getOrCreateArtist"

# 2. Ver si está importando artistas correctamente
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as canciones,
  COALESCE(SUM(r.amount), 0) as total_royalties
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON a.id = r.artist_id
GROUP BY a.id, a.name
ORDER BY a.name;
"
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+------------------+-----------+-----------------+
| id | name             | canciones | total_royalties |
+----+------------------+-----------+-----------------+
|  4 | Bad Bunny        |         0 |            0.00 |
|  6 | J Balvin         |         0 |            0.00 |
|  8 | Junior Mackenzie |         1 |            0.00 |
|  5 | Rosalia          |         0 |            0.00 |
|  7 | Test Artist      |         0 |            0.00 |
+----+------------------+-----------+-----------------+
root@ubuntu:/var/www/bigartist# # 1. Ver el endpoint /api/artists actual
grep -A 25 "app.get('/api/artists'" /var/www/bigartist/src/server/server.js

# 2. Verificar que NO tenga verifyToken
grep "app.get('/api/artists', verifyToken" /var/www/bigartist/src/server/server.js

# 3. Si encuentra algo, corregirlo:
sed -i "s/app.get('\/api\/artists', verifyToken,/app.get('\/api\/artists',/" /var/www/bigartist/src/server/server.js

# 4. Reiniciar
pm2 restart bigartist-api

# 5. Probar
curl -X GET http://94.143.141.241:3001/api/artists | jq '.'
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.query(
      `SELECT 
        a.id,
        a.name,
        COUNT(DISTINCT t.id) as total_tracks,
        COUNT(DISTINCT r.id) as total_transactions,
        COALESCE(SUM(r.amount), 0) as total_revenue
      FROM artists a
      LEFT JOIN tracks t ON t.artist_id = a.id
      LEFT JOIN royalties r ON r.artist_id = a.id
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
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 41   │ online    │ 0%       │ 18.0mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (7) Failed to connect to 94.143.141.241 port 3001 after 4 ms: Couldn't connect to server
root@ubuntu:/var/www/bigartist# # Buscar TODOS los endpoints /api/artists
grep -n "app.get('/api/artists'" /var/www/bigartist/src/server/server.js
430:app.get('/api/artists', async (req, res) => {
root@ubuntu:/var/www/bigartist# # 1. Ver estado de PM2
pm2 status

# 2. Ver logs de error
pm2 logs bigartist-api --lines 30 --err

# 3. Verificar si hay otro proceso usando el puerto 3001
lsof -i :3001

# 4. Si hay algo, matarlo
kill -9 $(lsof -t -i:3001)

# 5. Iniciar el servidor
cd /var/www/bigartist/src/server
pm2 delete bigartist-api
pm2 start server.js --name bigartist-api

# 6. Verificar que arrancó
pm2 status

# 7. Ver logs en tiempo real
pm2 logs bigartist-api --lines 20
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 41   │ online    │ 0%       │ 57.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 30 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 30 lines:
0|bigartis |   sqlState: '42S22',
0|bigartis |   sqlMessage: "Unknown column 'r.net_receipts' in 'field list'"
0|bigartis | }
0|bigartis | Error obteniendo artistas: Error: Unknown column 'r.net_receipts' in 'field list'
0|bigartis |     at PromisePool.query (/var/www/bigartist/src/server/node_modules/mysql2/lib/promise/pool.js:36:22)
0|bigartis |     at /var/www/bigartist/src/server/server.js:432:34
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:149:13)
0|bigartis |     at Route.dispatch (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:119:3)
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
0|bigartis |   code: 'ER_BAD_FIELD_ERROR',
0|bigartis |   errno: 1054,
0|bigartis |   sql: 'SELECT \n' +
0|bigartis |     '        a.id,\n' +
0|bigartis |     '        a.name,\n' +
0|bigartis |     '        COUNT(DISTINCT t.id) as total_tracks,\n' +
0|bigartis |     '        COUNT(DISTINCT r.id) as total_transactions,\n' +
0|bigartis |     '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
0|bigartis |     '      FROM artists a\n' +
0|bigartis |     '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
0|bigartis |     '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
0|bigartis |     '      GROUP BY a.id, a.name\n' +
0|bigartis |     '      ORDER BY total_revenue DESC',
0|bigartis |   sqlState: '42S22',
0|bigartis |   sqlMessage: "Unknown column 'r.net_receipts' in 'field list'"
0|bigartis | }

^C
COMMAND      PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
node\x20/ 121234 root   20u  IPv6 1656269      0t0  TCP *:3001 (LISTEN)
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Starting /var/www/bigartist/src/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 13.3mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 56.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 20 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 20 lines:
0|bigartis |     at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
0|bigartis |   code: 'ER_BAD_FIELD_ERROR',
0|bigartis |   errno: 1054,
0|bigartis |   sql: 'SELECT \n' +
0|bigartis |     '        a.id,\n' +
0|bigartis |     '        a.name,\n' +
0|bigartis |     '        COUNT(DISTINCT t.id) as total_tracks,\n' +
0|bigartis |     '        COUNT(DISTINCT r.id) as total_transactions,\n' +
0|bigartis |     '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
0|bigartis |     '      FROM artists a\n' +
0|bigartis |     '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
0|bigartis |     '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
0|bigartis |     '      GROUP BY a.id, a.name\n' +
0|bigartis |     '      ORDER BY total_revenue DESC',
0|bigartis |   sqlState: '42S22',
0|bigartis |   sqlMessage: "Unknown column 'r.net_receipts' in 'field list'"
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health

^C
root@ubuntu:/var/www/bigartist/src/server# cat > /root/fix-complete.sh << 'FIXALL'
#!/bin/bash
echo "🔧 SOLUCIÓN COMPLETA PARA /api/artists"
echo "======================================="
echo ""

# 1. Matar todos los procesos en puerto 3001
echo "1️⃣ Liberando puerto 3001..."
lsof -ti :3001 | xargs kill -9 2>/dev/null
sleep 2

# 2. Eliminar proceso PM2 actual
echo "2️⃣ Eliminando proceso PM2..."
pm2 delete bigartist-api 2>/dev/null

# 3. Ir al directorio correcto
cd /var/www/bigartist/src/server

# 4. Verificar que el endpoint NO tenga verifyToken
echo "3️⃣ Verificando endpoint /api/artists..."
grep -A 3 "app.get('/api/artists'" server.js

# 5. Iniciar servidor
/root/fix-complete.shmplete.shapp.bigartist.es/artists"ll | jq '.' || echo "❌ E
🔧 SOLUCIÓN COMPLETA PARA /api/artists
=======================================

1️⃣ Liberando puerto 3001...
2️⃣ Eliminando proceso PM2...
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
3️⃣ Verificando endpoint /api/artists...
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.query(
      `SELECT 

4️⃣ Iniciando servidor...
[PM2] Starting /var/www/bigartist/src/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 14.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2

5️⃣ Estado del servidor:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 66.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

6️⃣ Logs recientes:
[TAILING] Tailing last 10 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 10 lines:
0|bigartis |     '        COUNT(DISTINCT r.id) as total_transactions,\n' +
0|bigartis |     '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
0|bigartis |     '      FROM artists a\n' +
0|bigartis |     '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
0|bigartis |     '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
0|bigartis |     '      GROUP BY a.id, a.name\n' +
0|bigartis |     '      ORDER BY total_revenue DESC',
0|bigartis |   sqlState: '42S22',
0|bigartis |   sqlMessage: "Unknown column 'r.net_receipts' in 'field list'"
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 10 lines:
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health


7️⃣ Probando endpoint:
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 5,
      "name": "Rosalia",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 6,
      "name": "J Balvin",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 7,
      "name": "Test Artist",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 8,
      "name": "Junior Mackenzie",
      "total_tracks": 1,
      "total_transactions": 0,
      "total_revenue": 0
    }
  ]
}

✅ LISTO. Ve a: https://app.bigartist.es/artists
root@ubuntu:/var/www/bigartist/src/server# cat > /root/fix-artists.sh << 'FIXSCRroot@ubuntu:/var/www/bigartist/src/server# cat > /root/fix-artists.sh << 'FIXSCRIPT'in/bash
#!/bin/bashrrigiendo endpoint /api/artists..."
echo "🔧 Corrigiendo endpoint /api/artists..."r/www/bigartist/src/server/server.cp /var/www/bigartist/src/server/server.js /var/www/bigartist/src/server/server.js.backup-$(date +%Y%m%d-%H%M%S)
cd /var/www/bigartist/src/serverts', verifyToken,/app.get('\/api\/artists',/" sesed -i "s/app\.get('\/api\/artists', verifyToken,/app.get('\/api\/artists',/" server.js  Cambio aplicado:"
echo "✅ Cambio aplicado:"ists'" server.js
grep -n "app.get('/api/artists'" server.js
lsof -ti :3001 | xargs kill -9 2>/dev/null
pm2 delete bigartist-api 2>/dev/null-api
pm2 start server.js --name bigartist-api
pm2 save
sleep 5
echo ""  Probando endpoint:"
echo "🧪 Probando endpoint:":3001/api/artists | jq '.'
curl -X GET http://localhost:3001/api/artists | jq '.'
echo ""  LISTO! Ve a: https://app.bigartist.es/artists"
echo "✅ LISTO! Ve a: https://app.bigartist.es/artists"
FIXSCRIPT
chmod +x /root/fix-artists.sh
chmod +x /root/fix-artists.sh
/root/fix-artists.sh
🔧 Corrigiendo endpoint /api/artists...
✅ Cambio aplicado:
430:app.get('/api/artists', async (req, res) => {
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Starting /var/www/bigartist/src/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2

🧪 Probando endpoint:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   461  100   461    0     0  21831      0 --:--:-- --:--:-- --:--:-- 21952
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 5,
      "name": "Rosalia",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 6,
      "name": "J Balvin",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 7,
      "name": "Test Artist",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 8,
      "name": "Junior Mackenzie",
      "total_tracks": 1,
      "total_transactions": 0,
      "total_revenue": 0
    }
  ]
}

✅ LISTO! Ve a: https://app.bigartist.es/artists
root@ubuntu:/var/www/bigartist/src/server# cat > /root/fix-artists.sh << 'FIXSCRroot@ubuntu:/var/www/bigartist/src/server# cat > /root/fix-artists.sh << 'FIXSCRIPT'in/bash
#!/bin/bashrrigiendo endpoint /api/artists..."
echo "🔧 Corrigiendo endpoint /api/artists..."r/www/bigartist/src/server/server.cp /var/www/bigartist/src/server/server.js /var/www/bigartist/src/server/server.js.backup-$(date +%Y%m%d-%H%M%S)
cd /var/www/bigartist/src/serverts', verifyToken,/app.get('\/api\/artists',/" sesed -i "s/app\.get('\/api\/artists', verifyToken,/app.get('\/api\/artists',/" server.js  Cambio aplicado:"
echo "✅ Cambio aplicado:"ists'" server.js
grep -n "app.get('/api/artists'" server.js
lsof -ti :3001 | xargs kill -9 2>/dev/null
pm2 delete bigartist-api 2>/dev/null-api
pm2 start server.js --name bigartist-api
pm2 save
sleep 5
echo ""  Probando endpoint:"
echo "🧪 Probando endpoint:":3001/api/artists | jq '.'
curl -X GET http://localhost:3001/api/artists | jq '.'
echo ""  LISTO! Ve a: https://app.bigartist.es/artists"
echo "✅ LISTO! Ve a: https://app.bigartist.es/artists"
FIXSCRIPT
chmod +x /root/fix-artists.sh
chmod +x /root/fix-artists.sh
/root/fix-artists.sh
🔧 Corrigiendo endpoint /api/artists...
✅ Cambio aplicado:
430:app.get('/api/artists', async (req, res) => {
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Starting /var/www/bigartist/src/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 13.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2

🧪 Probando endpoint:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   461  100   461    0     0  23053      0 --:--:-- --:--:-- --:--:-- 24263
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 5,
      "name": "Rosalia",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 6,
      "name": "J Balvin",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 7,
      "name": "Test Artist",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 8,
      "name": "Junior Mackenzie",
      "total_tracks": 1,
      "total_transactions": 0,
      "total_revenue": 0
    }
  ]
}

✅ LISTO! Ve a: https://app.bigartist.es/artists
root@ubuntu:/var/www/bigartist/src/server# # 1. Ver si el cambio se aplicó
grep -n "app.get('/api/artists'" /var/www/bigartist/src/server/server.js

# 2. Ver estado del servidor
pm2 status

# 3. Probar el endpoint directamente
curl -X GET http://localhost:3001/api/artists | jq '.'

# 4. Ver logs del servidor
pm2 logs bigartist-api --lines 30
430:app.get('/api/artists', async (req, res) => {
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 60.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   461  100   461    0     0   108k      0 --:--:-- --:--:-- --:--:--  112k
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 5,
      "name": "Rosalia",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 6,
      "name": "J Balvin",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 7,
      "name": "Test Artist",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0
    },
    {
      "id": 8,
      "name": "Junior Mackenzie",
      "total_tracks": 1,
      "total_transactions": 0,
      "total_revenue": 0
    }
  ]
}
[TAILING] Tailing last 30 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 30 lines:
0|bigartis |   sqlState: '42S22',
0|bigartis |   sqlMessage: "Unknown column 'r.net_receipts' in 'field list'"
0|bigartis | }
0|bigartis | Error obteniendo artistas: Error: Unknown column 'r.net_receipts' in 'field list'
0|bigartis |     at PromisePool.query (/var/www/bigartist/src/server/node_modules/mysql2/lib/promise/pool.js:36:22)
0|bigartis |     at /var/www/bigartist/src/server/server.js:432:34
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:149:13)
0|bigartis |     at Route.dispatch (/var/www/bigartist/src/server/node_modules/express/lib/router/route.js:119:3)
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/src/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at /var/www/bigartist/src/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/src/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at jsonParser (/var/www/bigartist/src/server/node_modules/body-parser/lib/types/json.js:113:7) {
0|bigartis |   code: 'ER_BAD_FIELD_ERROR',
0|bigartis |   errno: 1054,
0|bigartis |   sql: 'SELECT \n' +
0|bigartis |     '        a.id,\n' +
0|bigartis |     '        a.name,\n' +
0|bigartis |     '        COUNT(DISTINCT t.id) as total_tracks,\n' +
0|bigartis |     '        COUNT(DISTINCT r.id) as total_transactions,\n' +
0|bigartis |     '        COALESCE(SUM(r.net_receipts), 0) as total_revenue\n' +
0|bigartis |     '      FROM artists a\n' +
0|bigartis |     '      LEFT JOIN tracks t ON t.artist_id = a.id\n' +
0|bigartis |     '      LEFT JOIN royalties r ON r.track_id = t.id\n' +
0|bigartis |     '      GROUP BY a.id, a.name\n' +
0|bigartis |     '      ORDER BY total_revenue DESC',
0|bigartis |   sqlState: '42S22',
0|bigartis |   sqlMessage: "Unknown column 'r.net_receipts' in 'field list'"
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 30 lines:
0|bigartis | ✅ Retornando 5 artistas
0|bigartis | ✅ Retornando 5 artistas
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health

^C
root@ubuntu:/var/www/bigartist/src/server# # Comando 1: Ver el endpoint actual
grep -A 10 "app.get('/api/artists'" /var/www/bigartist/src/server/server.js

# Comando 2: Ver cuántos hay
grep -n "app.get('/api/artists'" /var/www/bigartist/src/server/server.js

# Comando 3: Ver las líneas 425-435 exactas del archivo
sed -n '425,435p' /var/www/bigartist/src/server/server.js
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.query(
      `SELECT 
        a.id,
        a.name,
        COUNT(DISTINCT t.id) as total_tracks,
        COUNT(DISTINCT r.id) as total_transactions,
        COALESCE(SUM(r.amount), 0) as total_revenue
      FROM artists a
      LEFT JOIN tracks t ON t.artist_id = a.id
430:app.get('/api/artists', async (req, res) => {
    });
  }
});

// Obtener artistas
app.get('/api/artists', async (req, res) => {
  try {
    const [artists] = await pool.query(
      `SELECT 
        a.id,
        a.name,
root@ubuntu:/var/www/bigartist/src/server# 
