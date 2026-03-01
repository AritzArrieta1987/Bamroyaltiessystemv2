root@ubuntu:/var/www/bigartist/server# # Ver el código del servidor
cat /var/www/bigartist/server/server.js | head -20

# Verificar que dotenv está instalado
cd /var/www/bigartist/server
npm list dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist-jwt-secret';

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist',
  waitForConnections: true,
bigartist-server@1.0.0 /var/www/bigartist/server
└── dotenv@16.6.1

root@ubuntu:/var/www/bigartist/server# # Ver el .env con caracteres ocultos
cat -A /var/www/bigartist/server/.env

# Eliminar el proceso PM2 completamente
pm2 delete bigartist-api
pm2 save --force

# Iniciar el servidor MANUALMENTE para ver si carga el .env
cd /var/www/bigartist/server
node server.js
PORT=3001$
DB_HOST=localhost$
DB_USER=root$
DB_PASSWORD=BigArtist2018!@?$
DB_NAME=bigartist$
JWT_SECRET=bigartist-jwt-secret-2026$
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
🚀 BIGARTIST API running on port 3001
^C
root@ubuntu:/var/www/bigartist/server# curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"Admin123!"}' && echo ""
curl: (7) Failed to connect to localhost port 3001 after 0 ms: Couldn't connect to server
root@ubuntu:/var/www/bigartist/server# 
