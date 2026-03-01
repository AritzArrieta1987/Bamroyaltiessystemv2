#!/bin/bash

# ====================================
# BAM ROYALTIES SYSTEM - Quick Deploy
# Deployment rápido sin interacción
# ====================================

SERVER_IP="94.143.141.241"
SERVER_USER="root"
REPO_URL="https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 BAM Royalties - Quick Deploy${NC}\n"

# Deploy en el servidor
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    set -e
    
    echo "🧹 Limpiando instalación anterior..."
    rm -rf /var/www/bigartist
    
    echo "📥 Clonando código..."
    cd /var/www
    git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git bigartist
    cd bigartist
    
    echo "📦 Instalando dependencias..."
    npm install --silent
    
    echo "🏗️  Compilando frontend..."
    npm run build
    
    echo "⚙️  Configurando backend..."
    cd server
    npm install --production --silent
    
    # Crear .env si no existe
    if [ ! -f ".env" ]; then
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
    fi
    
    # Inicializar DB si existe el script
    if [ -f "init-database.sql" ]; then
        mysql -u root -p'BigArtist2018!@?' < init-database.sql 2>/dev/null || true
    fi
    
    # Crear admin si existe el script
    if [ -f "create-admin.js" ]; then
        node create-admin.js 2>/dev/null || true
    fi
    
    echo "🚀 Reiniciando servicios..."
    
    # Reiniciar API
    pm2 describe bigartist-api > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        pm2 restart bigartist-api
    else
        pm2 start server.js --name bigartist-api
        pm2 save
    fi
    
    # Permisos para Nginx
    chown -R www-data:www-data /var/www/bigartist/dist
    chmod -R 755 /var/www/bigartist/dist
    
    # Reiniciar Nginx
    systemctl reload nginx
    
    echo ""
    echo "✅ Deployment completado!"
    echo "🌐 URL: https://app.bigartist.es"
    
ENDSSH

echo ""
echo -e "${GREEN}════════════════════════════════${NC}"
echo -e "${GREEN}✅  DEPLOYMENT EXITOSO${NC}"
echo -e "${GREEN}════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}🌐 Abre: ${NC}https://app.bigartist.es"
echo -e "${YELLOW}👤 Usuario: ${NC}admin@bigartist.es"
echo -e "${YELLOW}🔑 Password: ${NC}Admin123!"
echo ""
