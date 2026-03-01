#!/bin/bash

# ====================================
# BIGARTIST - Script de Deployment
# ====================================

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración
SERVER_IP="94.143.141.241"
SERVER_USER="root"
DOMAIN="app.bigartist.es"
APP_DIR="/var/www/bigartist"
GITHUB_REPO="https://github.com/AritzArrieta1987/Webappversionfinalv10.git"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  BIGARTIST - Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Paso 1: Build local
echo -e "${YELLOW}[1/6] Building aplicación localmente...${NC}"
npm install
npm run build
echo -e "${GREEN}✅ Build completado${NC}\n"

# Paso 2: Conectar al servidor y preparar directorios
echo -e "${YELLOW}[2/6] Preparando servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    # Crear directorios si no existen
    mkdir -p /var/www/bigartist/{frontend,server,backups}
    
    # Backup de la versión anterior si existe
    if [ -d "/var/www/bigartist/frontend/dist" ]; then
        BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
        echo "📦 Creando backup: backup_${BACKUP_DATE}"
        tar -czf /var/www/bigartist/backups/backup_${BACKUP_DATE}.tar.gz -C /var/www/bigartist/frontend dist 2>/dev/null || true
    fi
    
    echo "✅ Servidor preparado"
ENDSSH
echo -e "${GREEN}✅ Servidor preparado${NC}\n"

# Paso 3: Subir archivos del frontend
echo -e "${YELLOW}[3/6] Subiendo archivos del frontend...${NC}"
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'server' \
    dist/ ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/frontend/dist/
echo -e "${GREEN}✅ Frontend subido${NC}\n"

# Paso 4: Subir archivos del backend
echo -e "${YELLOW}[4/6] Subiendo backend API...${NC}"
rsync -avz \
    --exclude 'node_modules' \
    --exclude '.env' \
    server/ ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/server/
echo -e "${GREEN}✅ Backend subido${NC}\n"

# Paso 5: Configurar backend en el servidor
echo -e "${YELLOW}[5/6] Configurando backend...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    cd /var/www/bigartist/server
    
    # Instalar dependencias si no existen
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias de Node.js..."
        npm install --production
    fi
    
    # Crear .env si no existe
    if [ ! -f ".env" ]; then
        echo "📝 Creando archivo .env..."
        cp .env.example .env
        echo "⚠️  Recuerda configurar las variables en /var/www/bigartist/server/.env"
    fi
    
    # Reiniciar servidor con PM2
    if command -v pm2 &> /dev/null; then
        echo "🔄 Reiniciando API con PM2..."
        pm2 describe bigartist-api > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            pm2 restart bigartist-api
        else
            pm2 start server.js --name bigartist-api
            pm2 save
        fi
    else
        echo "⚠️  PM2 no está instalado. Instálalo con: sudo npm install -g pm2"
    fi
    
    echo "✅ Backend configurado"
ENDSSH
echo -e "${GREEN}✅ Backend configurado${NC}\n"

# Paso 6: Configurar Nginx
echo -e "${YELLOW}[6/6] Verificando configuración de Nginx...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    NGINX_CONF="/etc/nginx/sites-available/bigartist"
    
    # Verificar si existe la configuración
    if [ ! -f "$NGINX_CONF" ]; then
        echo "📝 Creando configuración de Nginx..."
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
    
    # SSL Certificates (configurar con certbot)
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
        proxy_pass http://localhost:3001;
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
        
        # Test de configuración
        nginx -t && systemctl reload nginx
        
        echo "✅ Nginx configurado"
        echo "⚠️  Ejecuta 'sudo certbot --nginx -d app.bigartist.es' para SSL"
    else
        # Solo recargar Nginx
        nginx -t && systemctl reload nginx
        echo "✅ Nginx recargado"
    fi
ENDSSH

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETADO${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}📋 Pasos siguientes:${NC}"
echo -e "1. Configurar base de datos MySQL:"
echo -e "   ${GREEN}ssh root@${SERVER_IP}${NC}"
echo -e "   ${GREEN}cd /var/www/bigartist/server${NC}"
echo -e "   ${GREEN}mysql -u root -p < init-database.sql${NC}"
echo -e ""
echo -e "2. Crear usuario admin:"
echo -e "   ${GREEN}node create-admin.js${NC}"
echo -e ""
echo -e "3. Configurar SSL con Let's Encrypt:"
echo -e "   ${GREEN}sudo certbot --nginx -d app.bigartist.es${NC}"
echo -e ""
echo -e "4. Acceder a la aplicación:"
echo -e "   ${GREEN}https://app.bigartist.es${NC}"
echo -e ""
echo -e "5. Login con credenciales:"
echo -e "   Email: ${GREEN}admin@bigartist.es${NC}"
echo -e "   Password: ${GREEN}Admin123!${NC}"
echo -e ""
