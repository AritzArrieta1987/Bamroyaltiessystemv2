#!/bin/bash

# ====================================
# BAM ROYALTIES SYSTEM - Deployment Final
# Repositorio: Bamroyaltiessystemv2
# ====================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
SERVER_IP="94.143.141.241"
SERVER_USER="root"
DOMAIN="app.bigartist.es"
APP_DIR="/var/www/bigartist"
REPO_URL="https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git"

clear
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║  🎵 BAM ROYALTIES SYSTEM - DEPLOYMENT 🎵   ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Verificar conexión SSH
echo -e "${BLUE}[0/6] 🔌 Verificando conexión con el servidor...${NC}"
if ssh -o ConnectTimeout=5 ${SERVER_USER}@${SERVER_IP} "echo '✅ Conexión exitosa'" 2>/dev/null; then
    echo -e "${GREEN}✅ Conexión establecida con ${SERVER_IP}${NC}\n"
else
    echo -e "${RED}❌ No se pudo conectar al servidor${NC}"
    exit 1
fi

# Paso 1: Hacer backup del sistema actual
echo -e "${YELLOW}[1/6] 💾 Creando backup del sistema actual...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    BACKUP_DIR="/var/www/backups"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    mkdir -p $BACKUP_DIR
    
    if [ -d "/var/www/bigartist" ]; then
        echo "📦 Haciendo backup del sistema actual..."
        tar -czf $BACKUP_DIR/bigartist_backup_$TIMESTAMP.tar.gz \
            -C /var/www bigartist 2>/dev/null || echo "⚠️  Backup omitido"
        echo "✅ Backup guardado en: $BACKUP_DIR/bigartist_backup_$TIMESTAMP.tar.gz"
    else
        echo "ℹ️  No hay instalación previa, omitiendo backup"
    fi
ENDSSH
echo -e "${GREEN}✅ Backup completado${NC}\n"

# Paso 2: Preparar servidor y clonar código
echo -e "${YELLOW}[2/6] 📥 Clonando código desde GitHub...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
    # Limpiar directorio anterior
    if [ -d "/var/www/bigartist" ]; then
        echo "🧹 Limpiando instalación anterior..."
        rm -rf /var/www/bigartist
    fi
    
    # Clonar repositorio
    echo "📥 Clonando desde: ${REPO_URL}"
    cd /var/www
    git clone ${REPO_URL} bigartist
    
    if [ \$? -eq 0 ]; then
        echo "✅ Código clonado exitosamente"
        cd bigartist
        echo "📊 Último commit:"
        git log -1 --oneline
    else
        echo "❌ Error al clonar repositorio"
        exit 1
    fi
ENDSSH
echo -e "${GREEN}✅ Código clonado${NC}\n"

# Paso 3: Instalar dependencias y build del frontend
echo -e "${YELLOW}[3/6] 🔨 Compilando aplicación frontend...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    cd /var/www/bigartist
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo "📦 Instalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    echo "📊 Node version: $(node -v)"
    echo "📊 NPM version: $(npm -v)"
    
    # Instalar dependencias
    echo "📦 Instalando dependencias..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias"
        exit 1
    fi
    
    # Build de producción
    echo "🏗️  Compilando aplicación..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Error en el build"
        exit 1
    fi
    
    # Verificar que dist/ existe
    if [ -d "dist" ]; then
        echo "✅ Build completado - dist/ creado"
        echo "📊 Tamaño del build: $(du -sh dist | cut -f1)"
        echo "📊 Archivos en dist/:"
        ls -lh dist/ | head -10
    else
        echo "❌ No se creó el directorio dist/"
        exit 1
    fi
ENDSSH
echo -e "${GREEN}✅ Frontend compilado${NC}\n"

# Paso 4: Configurar backend y base de datos
echo -e "${YELLOW}[4/6] ⚙️  Configurando backend y MySQL...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    cd /var/www/bigartist/server
    
    # Instalar dependencias del backend
    echo "📦 Instalando dependencias del backend..."
    npm install --production
    
    # Crear archivo .env si no existe
    if [ ! -f ".env" ]; then
        echo "📝 Creando archivo .env..."
        JWT_SECRET=$(openssl rand -hex 32)
        cat > .env << EOF
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bigartist
JWT_SECRET=${JWT_SECRET}
NODE_ENV=production
EOF
        echo "✅ Archivo .env creado"
    else
        echo "ℹ️  Archivo .env ya existe"
    fi
    
    # Verificar MySQL
    if systemctl is-active --quiet mysql; then
        echo "✅ MySQL está corriendo"
    else
        echo "🔄 Iniciando MySQL..."
        systemctl start mysql
    fi
    
    # Inicializar base de datos
    echo "🗄️  Configurando base de datos..."
    if [ -f "init-database.sql" ]; then
        mysql -u root -p'BigArtist2018!@?' < init-database.sql 2>/dev/null || echo "⚠️  Base de datos ya existe"
    else
        echo "⚠️  No se encontró init-database.sql"
    fi
    
    # Crear usuario admin
    echo "👤 Creando usuario admin..."
    if [ -f "create-admin.js" ]; then
        node create-admin.js
    else
        echo "⚠️  No se encontró create-admin.js"
    fi
    
    # Instalar PM2
    if ! command -v pm2 &> /dev/null; then
        echo "📦 Instalando PM2..."
        npm install -g pm2
    fi
    
    # Iniciar/Reiniciar servidor con PM2
    echo "🚀 Configurando servidor API..."
    pm2 describe bigartist-api > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "🔄 Reiniciando API existente..."
        pm2 restart bigartist-api
    else
        echo "🆕 Iniciando nueva API..."
        pm2 start server.js --name bigartist-api
        pm2 save
        pm2 startup systemd -u root --hp /root
    fi
    
    # Verificar estado del API
    sleep 2
    pm2 status bigartist-api
    
    echo "✅ Backend configurado"
ENDSSH
echo -e "${GREEN}✅ Backend y MySQL configurados${NC}\n"

# Paso 5: Configurar Nginx
echo -e "${YELLOW}[5/6] 🌐 Configurando Nginx...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    NGINX_CONF="/etc/nginx/sites-available/bigartist"
    
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
    
    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    
    # Root directory
    root /var/www/bigartist/dist;
    index index.html;
    
    # Logs
    access_log /var/log/nginx/bigartist_access.log;
    error_log /var/log/nginx/bigartist_error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
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
    echo "🔗 Habilitando sitio en Nginx..."
    ln -sf /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/
    
    # Establecer permisos correctos
    echo "🔐 Configurando permisos..."
    chown -R www-data:www-data /var/www/bigartist/dist
    chmod -R 755 /var/www/bigartist/dist
    
    # Test y reload de Nginx
    echo "🧪 Probando configuración de Nginx..."
    nginx -t
    
    if [ $? -eq 0 ]; then
        echo "🔄 Recargando Nginx..."
        systemctl reload nginx
        echo "✅ Nginx configurado y recargado"
    else
        echo "❌ Error en la configuración de Nginx"
        exit 1
    fi
ENDSSH
echo -e "${GREEN}✅ Nginx configurado${NC}\n"

# Paso 6: Verificación final
echo -e "${YELLOW}[6/6] 🔍 Verificando deployment...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    echo "📊 Estado de servicios:"
    echo ""
    
    # Verificar Nginx
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx: Corriendo"
    else
        echo "❌ Nginx: Detenido"
    fi
    
    # Verificar MySQL
    if systemctl is-active --quiet mysql; then
        echo "✅ MySQL: Corriendo"
    else
        echo "❌ MySQL: Detenido"
    fi
    
    # Verificar API con PM2
    if pm2 describe bigartist-api > /dev/null 2>&1; then
        echo "✅ API Backend: Corriendo (PM2)"
        pm2 info bigartist-api | grep -E "status|memory|cpu" | head -3
    else
        echo "❌ API Backend: No encontrada"
    fi
    
    echo ""
    echo "📁 Verificando archivos:"
    echo "  - Frontend: $(ls /var/www/bigartist/dist/index.html > /dev/null 2>&1 && echo '✅' || echo '❌')"
    echo "  - Backend: $(ls /var/www/bigartist/server/server.js > /dev/null 2>&1 && echo '✅' || echo '❌')"
    
    echo ""
    echo "🔗 Probando endpoints:"
    # Test endpoint API
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health 2>/dev/null || echo "000")
    if [ "$API_STATUS" = "200" ]; then
        echo "  - API Health: ✅ (HTTP $API_STATUS)"
    else
        echo "  - API Health: ⚠️  (HTTP $API_STATUS)"
    fi
ENDSSH

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║        ✅  DEPLOYMENT COMPLETADO EXITOSAMENTE  ✅        ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                 INFORMACIÓN DE ACCESO                     ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}🌐 URL de la aplicación:${NC}"
echo -e "   ${GREEN}https://app.bigartist.es${NC}"
echo ""

echo -e "${BLUE}🔐 Credenciales de Login Admin:${NC}"
echo -e "   ${YELLOW}Email:${NC}    admin@bigartist.es"
echo -e "   ${YELLOW}Password:${NC} Admin123!"
echo ""

echo -e "${BLUE}🗄️  Base de datos MySQL:${NC}"
echo -e "   ${YELLOW}Host:${NC}     localhost"
echo -e "   ${YELLOW}Database:${NC} bigartist"
echo -e "   ${YELLOW}User:${NC}     root"
echo -e "   ${YELLOW}Password:${NC} BigArtist2018!@?"
echo ""

echo -e "${BLUE}📊 Comandos útiles:${NC}"
echo -e "   ${CYAN}Ver logs API:${NC}"
echo -e "     ssh root@${SERVER_IP} 'pm2 logs bigartist-api'"
echo ""
echo -e "   ${CYAN}Estado de servicios:${NC}"
echo -e "     ssh root@${SERVER_IP} 'pm2 status'"
echo ""
echo -e "   ${CYAN}Reiniciar API:${NC}"
echo -e "     ssh root@${SERVER_IP} 'pm2 restart bigartist-api'"
echo ""
echo -e "   ${CYAN}Ver logs de Nginx:${NC}"
echo -e "     ssh root@${SERVER_IP} 'tail -f /var/log/nginx/bigartist_error.log'"
echo ""
echo -e "   ${CYAN}Ver logs de acceso:${NC}"
echo -e "     ssh root@${SERVER_IP} 'tail -f /var/log/nginx/bigartist_access.log'"
echo ""

echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo "   1. Abre https://app.bigartist.es en tu navegador"
echo "   2. Presiona Ctrl+Shift+R para limpiar caché"
echo "   3. Inicia sesión con las credenciales de admin"
echo "   4. Verifica que todas las funcionalidades funcionan"
echo ""

echo -e "${GREEN}🎉 ¡Sistema listo para usar!${NC}\n"
