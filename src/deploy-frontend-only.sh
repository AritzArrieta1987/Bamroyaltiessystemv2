#!/bin/bash

# ====================================
# BIGARTIST - Deploy Frontend Only
# ====================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuración
SERVER_IP="94.143.141.241"
SERVER_USER="root"
DOMAIN="app.bigartist.es"
APP_DIR="/var/www/bigartist"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  BIGARTIST - Frontend Deployment${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Paso 1: Build local
echo -e "${YELLOW}[1/4] Building aplicación...${NC}"
npm install
npm run build
echo -e "${GREEN}✅ Build completado${NC}\n"

# Paso 2: Crear backup en servidor
echo -e "${YELLOW}[2/4] Creando backup en servidor...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    mkdir -p /var/www/bigartist/frontend
    mkdir -p /var/www/bigartist/backups
    
    if [ -d "/var/www/bigartist/frontend/dist" ]; then
        BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
        echo "📦 Backup: backup_${BACKUP_DATE}.tar.gz"
        tar -czf /var/www/bigartist/backups/backup_${BACKUP_DATE}.tar.gz -C /var/www/bigartist/frontend dist 2>/dev/null || true
    fi
ENDSSH
echo -e "${GREEN}✅ Backup creado${NC}\n"

# Paso 3: Subir archivos
echo -e "${YELLOW}[3/4] Subiendo archivos al servidor...${NC}"
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'server' \
    dist/ ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/frontend/dist/
echo -e "${GREEN}✅ Archivos subidos${NC}\n"

# Paso 4: Configurar Nginx
echo -e "${YELLOW}[4/4] Configurando Nginx...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    NGINX_CONF="/etc/nginx/sites-available/bigartist"
    
    # Crear configuración si no existe
    if [ ! -f "$NGINX_CONF" ]; then
        echo "📝 Creando configuración de Nginx..."
        cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;
    
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
    fi
    
    # Establecer permisos
    chown -R www-data:www-data /var/www/bigartist/frontend/dist
    chmod -R 755 /var/www/bigartist/frontend/dist
    
    # Test y reload de Nginx
    if nginx -t 2>/dev/null; then
        systemctl reload nginx
        echo "✅ Nginx configurado y recargado"
    else
        echo "❌ Error en configuración de Nginx"
        exit 1
    fi
ENDSSH

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETADO${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}📋 Acceso:${NC}"
echo -e "   🌐 URL: ${GREEN}http://app.bigartist.es${NC}"
echo -e ""
echo -e "${YELLOW}🔒 Para habilitar HTTPS:${NC}"
echo -e "   ${GREEN}ssh root@${SERVER_IP}${NC}"
echo -e "   ${GREEN}sudo certbot --nginx -d app.bigartist.es${NC}"
echo -e ""
echo -e "${YELLOW}📝 Nota:${NC}"
echo -e "   El login panel está visible pero necesitarás configurar"
echo -e "   el backend para que la autenticación funcione."
echo -e ""
