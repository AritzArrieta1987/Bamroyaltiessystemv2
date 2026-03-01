# 🚀 BIGARTIST - Guía de Deployment

## 📋 Pre-requisitos en el servidor Ubuntu 24.04

### 1. Instalar Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Instalar PM2 (gestor de procesos)
```bash
sudo npm install -g pm2
```

### 3. Verificar MySQL
```bash
mysql --version
sudo systemctl status mysql
```

### 4. Instalar Nginx (si no está instalado)
```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
```

### 5. Instalar Certbot para SSL
```bash
sudo apt install certbot python3-certbot-nginx
```

---

## 🔧 Configuración inicial (solo primera vez)

### 1. Clonar repositorio localmente
```bash
git clone https://github.com/AritzArrieta1987/Webappversionfinalv10.git
cd Webappversionfinalv10
```

### 2. Hacer ejecutable el script de deployment
```bash
chmod +x deploy-to-server.sh
```

### 3. Configurar base de datos MySQL en el servidor
```bash
ssh root@94.143.141.241
cd /var/www/bigartist/server
mysql -u root -p < init-database.sql
# Contraseña MySQL: BigArtist2018!@?
```

### 4. Configurar variables de entorno del backend
```bash
cd /var/www/bigartist/server
nano .env
```

Edita con tus valores:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bigartist
JWT_SECRET=GENERA_UN_STRING_ALEATORIO_SEGURO_AQUI
```

### 5. Crear usuario admin
```bash
node create-admin.js
```

Output esperado:
```
✅ Conectado a MySQL
✅ Contraseña hasheada
✅ Usuario admin creado exitosamente

📧 Email: admin@bigartist.es
🔑 Contraseña: Admin123!

⚠️  Cambia la contraseña después del primer login
```

### 6. Iniciar backend con PM2
```bash
pm2 start server.js --name bigartist-api
pm2 save
pm2 startup  # Seguir instrucciones
```

### 7. Configurar SSL con Let's Encrypt
```bash
sudo certbot --nginx -d app.bigartist.es
```

Selecciona:
- Email para notificaciones
- Aceptar términos
- Redirigir HTTP a HTTPS: **Sí**

---

## 🚀 Deployment (actualizaciones)

### Opción 1: Script automático (recomendado)
```bash
# Desde tu máquina local
./deploy-to-server.sh
```

### Opción 2: Manual
```bash
# Build local
npm install
npm run build

# Subir archivos
rsync -avz --delete dist/ root@94.143.141.241:/var/www/bigartist/frontend/dist/

# Reiniciar backend (si hay cambios en el server)
ssh root@94.143.141.241 "cd /var/www/bigartist/server && pm2 restart bigartist-api"
```

---

## 🔍 Verificación

### 1. Estado del backend API
```bash
ssh root@94.143.141.241
pm2 status
pm2 logs bigartist-api
```

### 2. Health check de la API
```bash
curl https://app.bigartist.es/api/health
```

Respuesta esperada:
```json
{"status":"OK","timestamp":"2026-02-28T..."}
```

### 3. Test de login
```bash
curl -X POST https://app.bigartist.es/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"Admin123!"}'
```

### 4. Estado de Nginx
```bash
sudo systemctl status nginx
sudo nginx -t  # Test de configuración
```

### 5. Logs de Nginx
```bash
sudo tail -f /var/log/nginx/bigartist_access.log
sudo tail -f /var/log/nginx/bigartist_error.log
```

---

## 🛠️ Troubleshooting

### El backend no responde
```bash
ssh root@94.143.141.241
pm2 restart bigartist-api
pm2 logs bigartist-api --lines 50
```

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Verificar credenciales en .env
cat /var/www/bigartist/server/.env

# Test de conexión manual
mysql -u root -p bigartist
```

### Frontend no carga
```bash
# Verificar archivos
ls -la /var/www/bigartist/frontend/dist/

# Verificar permisos
sudo chown -R www-data:www-data /var/www/bigartist/frontend/dist/
sudo chmod -R 755 /var/www/bigartist/frontend/dist/

# Recargar Nginx
sudo systemctl reload nginx
```

### SSL no funciona
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew --dry-run

# Forzar renovación
sudo certbot renew --force-renewal
```

---

## 📊 Estructura en el servidor

```
/var/www/bigartist/
├── frontend/
│   └── dist/                 # Build de React/Vite
│       ├── index.html
│       ├── assets/
│       └── ...
├── server/
│   ├── server.js             # API Node.js/Express
│   ├── package.json
│   ├── .env                  # Variables de entorno (NO subir a Git)
│   ├── init-database.sql     # Script SQL inicial
│   ├── create-admin.js       # Script para crear admin
│   └── node_modules/
└── backups/                  # Backups automáticos
    └── backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## 🔐 Seguridad

### 1. Cambiar contraseña del admin después del primer login

### 2. Proteger archivo .env
```bash
chmod 600 /var/www/bigartist/server/.env
```

### 3. Configurar firewall
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 4. Actualizar certificados SSL automáticamente
Certbot ya configura un cron job automático. Verificar:
```bash
sudo systemctl status certbot.timer
```

---

## 📱 Acceso a la aplicación

**URL:** https://app.bigartist.es

**Credenciales iniciales:**
- Email: `admin@bigartist.es`
- Password: `Admin123!`

⚠️ **Cambiar la contraseña después del primer login**

---

## 🔄 Workflow de desarrollo

1. Hacer cambios en local
2. Commitear a GitHub:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
3. Desplegar:
   ```bash
   ./deploy-to-server.sh
   ```
4. Verificar en https://app.bigartist.es

---

## 📞 Comandos útiles

```bash
# Ver logs en tiempo real
ssh root@94.143.141.241 "pm2 logs bigartist-api"

# Reiniciar todo
ssh root@94.143.141.241 "pm2 restart bigartist-api && sudo systemctl reload nginx"

# Backup manual
ssh root@94.143.141.241 "cd /var/www/bigartist && tar -czf backup_manual.tar.gz frontend/dist server"

# Restaurar backup
ssh root@94.143.141.241 "cd /var/www/bigartist && tar -xzf backups/backup_XXXXXX.tar.gz"
```

---

**✅ Todo listo para producción!**
