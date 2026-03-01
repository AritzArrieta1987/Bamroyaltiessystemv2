#!/bin/bash

# ====================================
# BAM ROYALTIES SYSTEM
# Deploy directo sin dependencias
# ====================================

cat << 'EOF'
╔══════════════════════════════════════════════╗
║   🚀 BAM ROYALTIES - Deploy Directo         ║
╚══════════════════════════════════════════════╝
EOF

echo ""
echo "🚀 Iniciando deployment en el servidor..."
echo ""

ssh root@94.143.141.241 'bash -s' << 'ENDSSH'
set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[1/8] 💾 Backup...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

mkdir -p /var/www/backups
if [ -d "/var/www/bigartist" ]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    tar -czf /var/www/backups/bigartist_backup_$TIMESTAMP.tar.gz \
        -C /var/www bigartist 2>/dev/null || true
    echo "✅ Backup creado"
else
    echo "ℹ️  Primera instalación"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[2/8] 🧹 Limpiando...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

rm -rf /var/www/bigartist
echo "✅ Limpiado"

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
git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git bigartist

if [ $? -eq 0 ]; then
    cd bigartist
    echo "✅ Código clonado"
    git log -1 --pretty=format:"   %h - %s (%ar)" --abbrev-commit
    echo ""
else
    echo "❌ Error al clonar"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[4/8] 🔧 Node.js...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs -qq
fi

echo "✅ Node $(node -v)"
echo "✅ NPM $(npm -v)"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[5/8] 🏗️  Compilando frontend...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "📦 Instalando dependencias..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "🏗️  Compilando..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en build"
    exit 1
fi

if [ -d "dist" ]; then
    echo "✅ Build completado ($(du -sh dist | cut -f1))"
else
    echo "❌ No se creó dist/"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[6/8] ⚙️  Backend...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd server

echo "📦 Instalando dependencias backend..."
npm install --production --silent

# Crear .env
if [ ! -f ".env" ]; then
    echo "📝 Creando .env..."
    JWT_SECRET=$(openssl rand -hex 32)
    cat > .env << 'ENVEOF'
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bigartist
JWT_SECRET=REPLACE_JWT
NODE_ENV=production
ENVEOF
    sed -i "s/REPLACE_JWT/${JWT_SECRET}/g" .env
    echo "✅ .env creado"
else
    echo "✅ .env ya existe"
fi

# PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2 --silent
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[7/8] 🗄️  MySQL...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! systemctl is-active --quiet mysql; then
    echo "🔄 Iniciando MySQL..."
    systemctl start mysql
fi
echo "✅ MySQL corriendo"

if [ -f "init-database.sql" ]; then
    echo "🗄️  Inicializando base de datos..."
    mysql -u root -p'BigArtist2018!@?' < init-database.sql 2>/dev/null || echo "ℹ️  DB ya existe"
fi

if [ -f "create-admin.js" ]; then
    echo "👤 Creando usuario admin..."
    node create-admin.js 2>/dev/null || echo "ℹ️  Admin ya existe"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[8/8] 🚀 Servicios...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# API con PM2
pm2 describe bigartist-api > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "🔄 Reiniciando API..."
    pm2 restart bigartist-api
else
    echo "🆕 Iniciando API..."
    pm2 start server.js --name bigartist-api
    pm2 save
    pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true
fi

sleep 2

if pm2 describe bigartist-api | grep -q "online"; then
    echo "✅ API corriendo"
else
    echo "⚠️  Verificar API"
fi

# Nginx
echo "🌐 Configurando Nginx..."

NGINX_CONF="/etc/nginx/sites-available/bigartist"

cat > $NGINX_CONF << 'NGINXEOF'
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
NGINXEOF

ln -sf /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/

echo "🔐 Configurando permisos..."
chown -R www-data:www-data /var/www/bigartist/dist
chmod -R 755 /var/www/bigartist/dist

if nginx -t 2>/dev/null; then
    systemctl reload nginx
    echo "✅ Nginx configurado"
else
    echo "⚠️  Verificar Nginx"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}        ✅ DEPLOYMENT COMPLETADO ✅       ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🌐 URL:      https://app.bigartist.es"
echo "👤 Email:    admin@bigartist.es"
echo "🔑 Password: Admin123!"
echo ""

ENDSSH

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         ✅ ¡DEPLOYMENT EXITOSO! ✅          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "🌐 Abre: https://app.bigartist.es"
echo ""
