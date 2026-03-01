#!/bin/bash

# ====================================
# BIGARTIST - Deployment Completo
# Login + Backend + MySQL
# ====================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
SERVER_IP="94.143.141.241"
SERVER_USER="root"
DOMAIN="app.bigartist.es"
APP_DIR="/var/www/bigartist"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  BIGARTIST - Deployment Completo${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Paso 1: Build del frontend
echo -e "${YELLOW}[1/5] 🔨 Building frontend...${NC}"
npm install
npm run build
echo -e "${GREEN}✅ Frontend build completado${NC}\n"

# Paso 2: Subir frontend
echo -e "${YELLOW}[2/5] 📤 Subiendo frontend al servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${APP_DIR}/{frontend,server,backups}"

rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'server' \
    dist/ ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/frontend/dist/

echo -e "${GREEN}✅ Frontend subido${NC}\n"

# Paso 3: Subir backend
echo -e "${YELLOW}[3/5] 📤 Subiendo backend al servidor...${NC}"
rsync -avz \
    --exclude 'node_modules' \
    --exclude '.env' \
    server/ ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/server/

echo -e "${GREEN}✅ Backend subido${NC}\n"

# Paso 4: Configurar backend en servidor
echo -e "${YELLOW}[4/5] ⚙️  Configurando backend en servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    cd /var/www/bigartist/server
    
    # Instalar Node.js si no existe
    if ! command -v node &> /dev/null; then
        echo "📦 Instalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    echo "📦 Instalando dependencias del backend..."
    npm install --production
    
    # Crear archivo .env
    if [ ! -f ".env" ]; then
        echo "📝 Creando archivo .env..."
        cat > .env << 'EOF'
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bigartist
JWT_SECRET=bigartist-jwt-secret-$(openssl rand -hex 32)
EOF
    fi
    
    # Instalar PM2 si no existe
    if ! command -v pm2 &> /dev/null; then
        echo "📦 Instalando PM2..."
        npm install -g pm2
    fi
    
    # Inicializar base de datos MySQL
    echo "🗄️  Configurando base de datos MySQL..."
    mysql -u root -p'BigArtist2018!@?' < init-database.sql 2>/dev/null || echo "⚠️  Base de datos ya existe o error de conexión"
    
    # Crear usuario admin
    echo "👤 Creando usuario admin..."
    node create-admin.js
    
    # Iniciar/Reiniciar servidor con PM2
    echo "🚀 Iniciando servidor API..."
    pm2 describe bigartist-api > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        pm2 restart bigartist-api
    else
        pm2 start server.js --name bigartist-api
        pm2 save
        pm2 startup systemd -u root --hp /root
    fi
    
    echo "✅ Backend configurado"
ENDSSH
echo -e "${GREEN}✅ Backend configurado y funcionando${NC}\n"

# Paso 5: Configurar Nginx
echo -e "${YELLOW}[5/5] 🌐 Configurando Nginx...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    NGINX_CONF="/etc/nginx/sites-available/bigartist"
    
    cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;
    
    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.bigartist.es;
    
    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    
    # Root directory
    root /var/www/bigartist/frontend/dist;
    index index.html;
    
    # Logs
    access_log /var/log/nginx/bigartist_access.log;
    error_log /var/log/nginx/bigartist_error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # Habilitar sitio
    ln -sf /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/
    
    # Establecer permisos
    chown -R www-data:www-data /var/www/bigartist/frontend/dist
    chmod -R 755 /var/www/bigartist/frontend/dist
    
    # Test y reload de Nginx
    nginx -t && systemctl reload nginx
    
    echo "✅ Nginx configurado"
ENDSSH

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETADO${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}╔════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     INFORMACIÓN DE ACCESO          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}🌐 URL de acceso:${NC}"
echo -e "   ${GREEN}https://app.bigartist.es${NC}\n"

echo -e "${YELLOW}🔐 Credenciales de Login:${NC}"
echo -e "   Email:    ${GREEN}admin@bigartist.es${NC}"
echo -e "   Password: ${GREEN}Admin123!${NC}\n"

echo -e "${YELLOW}🗄️  Base de datos MySQL:${NC}"
echo -e "   Host:     ${GREEN}localhost${NC}"
echo -e "   Database: ${GREEN}bigartist${NC}"
echo -e "   User:     ${GREEN}root${NC}"
echo -e "   Password: ${GREEN}BigArtist2018!@?${NC}\n"

echo -e "${YELLOW}📊 Comandos útiles:${NC}"
echo -e "   Ver logs API:    ${GREEN}ssh root@${SERVER_IP} 'pm2 logs bigartist-api'${NC}"
echo -e "   Estado API:      ${GREEN}ssh root@${SERVER_IP} 'pm2 status'${NC}"
echo -e "   Reiniciar API:   ${GREEN}ssh root@${SERVER_IP} 'pm2 restart bigartist-api'${NC}"
echo -e "   Logs Nginx:      ${GREEN}ssh root@${SERVER_IP} 'tail -f /var/log/nginx/bigartist_error.log'${NC}\n"

echo -e "${YELLOW}✅ Todo listo para usar!${NC}\n"
