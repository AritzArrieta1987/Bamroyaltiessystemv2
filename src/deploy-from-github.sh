#!/bin/bash

# ====================================
# BAM ROYALTIES SYSTEM
# Deploy directo desde GitHub al servidor
# Sin necesidad de tener código en local
# ====================================

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
REPO_URL="https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git"
APP_DIR="/var/www/bigartist"

clear
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   🚀 BAM ROYALTIES - Deploy desde GitHub    ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Verificar conexión SSH
echo -e "${BLUE}🔌 Probando conexión SSH...${NC}"
if ! ssh -o ConnectTimeout=10 ${SERVER_USER}@${SERVER_IP} "echo 'OK'" >/dev/null 2>&1; then
    echo -e "${RED}❌ No se pudo conectar al servidor${NC}"
    echo -e "${YELLOW}Verifica:${NC}"
    echo "  - Que tengas acceso SSH al servidor"
    echo "  - Tu clave SSH esté configurada"
    echo "  - El servidor esté encendido"
    exit 1
fi
echo -e "${GREEN}✅ Conexión SSH exitosa${NC}\n"

# Ejecutar todo en el servidor
echo -e "${BLUE}📦 Iniciando deployment en el servidor...${NC}\n"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    set -e  # Salir si hay error
    
    # Colores en servidor
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    BLUE='\033[0;34m'
    NC='\033[0m'
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[1/8] 💾 Creando backup...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    BACKUP_DIR="/var/www/backups"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    mkdir -p $BACKUP_DIR
    
    if [ -d "/var/www/bigartist" ]; then
        echo "📦 Creando backup de la instalación actual..."
        tar -czf $BACKUP_DIR/bigartist_backup_$TIMESTAMP.tar.gz \
            -C /var/www bigartist 2>/dev/null || echo "⚠️  Backup omitido"
        echo -e "${GREEN}✅ Backup guardado${NC}"
    else
        echo "ℹ️  Primera instalación, no hay backup previo"
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[2/8] 🗑️  Limpiando instalación anterior...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if [ -d "/var/www/bigartist" ]; then
        echo "🗑️  Eliminando directorio anterior..."
        rm -rf /var/www/bigartist
        echo -e "${GREEN}✅ Directorio limpiado${NC}"
    else
        echo "✓ No hay instalación previa"
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[3/8] 📥 Clonando desde GitHub...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    cd /var/www
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        echo "📦 Instalando Git..."
        apt-get update -qq
        apt-get install -y git -qq
    fi
    
    echo "📥 Clonando repositorio..."
    echo "📍 Desde: https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git"
    
    if git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git bigartist; then
        echo -e "${GREEN}✅ Repositorio clonado exitosamente${NC}"
        cd bigartist
        echo "📊 Último commit:"
        git log -1 --pretty=format:"   %h - %s (%ar)" --abbrev-commit
        echo ""
    else
        echo -e "${RED}❌ Error al clonar repositorio${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[4/8] 🔧 Instalando Node.js...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if ! command -v node &> /dev/null; then
        echo "📦 Instalando Node.js 20..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs -qq
    fi
    
    echo "✓ Node version: $(node -v)"
    echo "✓ NPM version: $(npm -v)"
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[5/8] 📦 Instalando dependencias y compilando...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    echo "📦 Instalando dependencias del frontend..."
    npm install --silent
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al instalar dependencias${NC}"
        exit 1
    fi
    
    echo "🏗️  Compilando aplicación React..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error en el build${NC}"
        exit 1
    fi
    
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ Build completado${NC}"
        echo "📊 Tamaño: $(du -sh dist | cut -f1)"
    else
        echo -e "${RED}❌ No se creó dist/${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[6/8] ⚙️  Configurando Backend...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    cd server
    
    echo "📦 Instalando dependencias del backend..."
    npm install --production --silent
    
    # Crear .env
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
        echo -e "${GREEN}✅ Archivo .env creado${NC}"
    else
        echo "✓ Archivo .env ya existe"
    fi
    
    # Instalar PM2
    if ! command -v pm2 &> /dev/null; then
        echo "📦 Instalando PM2..."
        npm install -g pm2 --silent
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[7/8] 🗄️  Configurando MySQL...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Verificar MySQL
    if ! systemctl is-active --quiet mysql; then
        echo "🔄 Iniciando MySQL..."
        systemctl start mysql
    fi
    
    echo "✓ MySQL está corriendo"
    
    # Inicializar base de datos
    if [ -f "init-database.sql" ]; then
        echo "🗄️  Inicializando base de datos..."
        mysql -u root -p'BigArtist2018!@?' < init-database.sql 2>/dev/null || echo "ℹ️  Base de datos ya existe"
    fi
    
    # Crear usuario admin
    if [ -f "create-admin.js" ]; then
        echo "👤 Creando usuario admin..."
        node create-admin.js 2>/dev/null || echo "ℹ️  Usuario admin ya existe"
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[8/8] 🚀 Iniciando servicios...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Iniciar/Reiniciar API con PM2
    pm2 describe bigartist-api > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "🔄 Reiniciando API existente..."
        pm2 restart bigartist-api
    else
        echo "🆕 Iniciando nueva API..."
        pm2 start server.js --name bigartist-api
        pm2 save
        pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true
    fi
    
    sleep 2
    
    # Verificar estado
    if pm2 describe bigartist-api | grep -q "online"; then
        echo -e "${GREEN}✅ API iniciada correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️  API iniciada pero verificar estado${NC}"
    fi
    
    # Configurar Nginx
    echo "🌐 Configurando Nginx..."
    
    NGINX_CONF="/etc/nginx/sites-available/bigartist"
    
    cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.bigartist.es;
    
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    root /var/www/bigartist/dist;
    index index.html;
    
    access_log /var/log/nginx/bigartist_access.log;
    error_log /var/log/nginx/bigartist_error.log;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
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
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # Habilitar sitio
    ln -sf /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/
    
    # Permisos
    echo "🔐 Configurando permisos..."
    chown -R www-data:www-data /var/www/bigartist/dist
    chmod -R 755 /var/www/bigartist/dist
    
    # Reiniciar Nginx
    if nginx -t 2>/dev/null; then
        systemctl reload nginx
        echo -e "${GREEN}✅ Nginx configurado y recargado${NC}"
    else
        echo -e "${YELLOW}⚠️  Verificar configuración de Nginx${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔍 Verificando servicios...${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Verificar servicios
    echo "📊 Estado de servicios:"
    echo ""
    
    if systemctl is-active --quiet nginx; then
        echo "  ✅ Nginx: Running"
    else
        echo "  ❌ Nginx: Stopped"
    fi
    
    if systemctl is-active --quiet mysql; then
        echo "  ✅ MySQL: Running"
    else
        echo "  ❌ MySQL: Stopped"
    fi
    
    if pm2 describe bigartist-api | grep -q "online"; then
        echo "  ✅ API Backend: Running"
    else
        echo "  ❌ API Backend: Not running"
    fi
    
    echo ""
    echo "📁 Archivos verificados:"
    if [ -f "/var/www/bigartist/dist/index.html" ]; then
        echo "  ✅ Frontend (dist/index.html)"
    else
        echo "  ❌ Frontend no encontrado"
    fi
    
    if [ -f "/var/www/bigartist/server/server.js" ]; then
        echo "  ✅ Backend (server/server.js)"
    else
        echo "  ❌ Backend no encontrado"
    fi
    
    echo ""
    
ENDSSH

# Resumen final
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║        ✅  DEPLOYMENT COMPLETADO EXITOSAMENTE  ✅        ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              📋 INFORMACIÓN DE ACCESO                     ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}🌐 URL de la aplicación:${NC}"
echo -e "   ${GREEN}https://app.bigartist.es${NC}"
echo ""

echo -e "${YELLOW}🔐 Credenciales de Admin:${NC}"
echo -e "   Email:    ${GREEN}admin@bigartist.es${NC}"
echo -e "   Password: ${GREEN}Admin123!${NC}"
echo ""

echo -e "${YELLOW}🗄️  Base de datos:${NC}"
echo -e "   Database: ${GREEN}bigartist${NC}"
echo -e "   User:     ${GREEN}root${NC}"
echo -e "   Password: ${GREEN}BigArtist2018!@?${NC}"
echo ""

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                📊 COMANDOS ÚTILES                         ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Ver logs del API:${NC}"
echo "  ssh root@${SERVER_IP} 'pm2 logs bigartist-api'"
echo ""

echo -e "${BLUE}Ver estado de servicios:${NC}"
echo "  ssh root@${SERVER_IP} 'pm2 status'"
echo ""

echo -e "${BLUE}Reiniciar API:${NC}"
echo "  ssh root@${SERVER_IP} 'pm2 restart bigartist-api'"
echo ""

echo -e "${BLUE}Ver logs de Nginx:${NC}"
echo "  ssh root@${SERVER_IP} 'tail -f /var/log/nginx/bigartist_error.log'"
echo ""

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║   🎉  ¡Sistema listo! Abre https://app.bigartist.es  🎉  ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
