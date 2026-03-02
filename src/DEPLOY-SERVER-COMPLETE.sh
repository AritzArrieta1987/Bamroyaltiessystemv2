#!/bin/bash

# ========================================
# DEPLOY COMPLETO EN SERVIDOR UBUNTU
# BIGARTIST - ROYALTIES SYSTEM v2.0.0
# ========================================

echo "🚀 INICIANDO DEPLOYMENT EN SERVIDOR..."
echo "=========================================="
echo ""

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
APP_DIR="/var/www/bamroyalties"
REPO_URL="https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git"
BRANCH="main"

# ========================================
# PASO 1: VERIFICAR DIRECTORIO
# ========================================
echo -e "${BLUE}📂 PASO 1: Verificando directorio...${NC}"
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ ERROR: El directorio $APP_DIR no existe${NC}"
    echo "Creando directorio..."
    mkdir -p $APP_DIR
    cd $APP_DIR
    git clone $REPO_URL .
else
    cd $APP_DIR
    echo -e "${GREEN}✅ Directorio encontrado${NC}"
fi
echo ""

# ========================================
# PASO 2: ACTUALIZAR CÓDIGO DESDE GITHUB
# ========================================
echo -e "${BLUE}📥 PASO 2: Descargando últimos cambios de GitHub...${NC}"
echo "Repositorio: $REPO_URL"
echo "Rama: $BRANCH"
echo ""

# Guardar cambios locales si existen
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Hay cambios locales, guardando...${NC}"
    git stash
fi

# Pull desde GitHub
git fetch origin
git reset --hard origin/$BRANCH
git pull origin $BRANCH

echo -e "${GREEN}✅ Código actualizado desde GitHub${NC}"
echo ""

# ========================================
# PASO 3: INSTALAR DEPENDENCIAS FRONTEND
# ========================================
echo -e "${BLUE}📦 PASO 3: Instalando dependencias del frontend...${NC}"
npm install
echo -e "${GREEN}✅ Dependencias frontend instaladas${NC}"
echo ""

# ========================================
# PASO 4: BUILD DEL FRONTEND
# ========================================
echo -e "${BLUE}🔨 PASO 4: Compilando frontend (Vite)...${NC}"
npm run build
echo -e "${GREEN}✅ Frontend compilado (carpeta dist/)${NC}"
echo ""

# ========================================
# PASO 5: CONFIGURAR BACKEND
# ========================================
echo -e "${BLUE}⚙️  PASO 5: Configurando backend...${NC}"
cd backend

# Instalar dependencias del backend
if [ -f "package.json" ]; then
    echo "Instalando dependencias del backend..."
    npm install
    echo -e "${GREEN}✅ Dependencias backend instaladas${NC}"
fi

# Verificar que existe .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado en backend${NC}"
    echo "Creando .env básico..."
    cat > .env << 'EOL'
DB_HOST=localhost
DB_USER=bamroyalties
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bamroyalties
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=production
EOL
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
fi

cd ..
echo ""

# ========================================
# PASO 6: REINICIAR SERVICIOS CON PM2
# ========================================
echo -e "${BLUE}🔄 PASO 6: Reiniciando servicios con PM2...${NC}"
cd backend

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 no encontrado, instalando...${NC}"
    npm install -g pm2
fi

# Detener proceso anterior si existe
pm2 stop bamroyalties 2>/dev/null || true
pm2 delete bamroyalties 2>/dev/null || true

# Iniciar proceso con PM2
echo "Iniciando backend con PM2..."
pm2 start server.js --name bamroyalties

# Guardar configuración PM2
pm2 save

# Configurar PM2 para inicio automático
pm2 startup

echo -e "${GREEN}✅ Backend reiniciado con PM2${NC}"
echo ""

# Mostrar logs
echo -e "${BLUE}📋 Últimas líneas del log:${NC}"
pm2 logs bamroyalties --lines 10 --nostream

cd ..
echo ""

# ========================================
# PASO 7: CONFIGURAR NGINX
# ========================================
echo -e "${BLUE}🌐 PASO 7: Verificando configuración de Nginx...${NC}"

NGINX_CONFIG="/etc/nginx/sites-available/bamroyalties"

if [ ! -f "$NGINX_CONFIG" ]; then
    echo -e "${YELLOW}⚠️  Configuración de Nginx no encontrada, creando...${NC}"
    
    cat > $NGINX_CONFIG << 'EOL'
server {
    listen 80;
    server_name app.bigartist.es;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.bigartist.es;

    # SSL configurado por Certbot
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;

    # Directorio del frontend compilado
    root /var/www/bamroyalties/dist;
    index index.html;

    # Frontend - React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API backend
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

    # Logs
    access_log /var/log/nginx/bamroyalties_access.log;
    error_log /var/log/nginx/bamroyalties_error.log;
}
EOL

    # Crear enlace simbólico
    ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/

    echo -e "${GREEN}✅ Configuración de Nginx creada${NC}"
fi

# Verificar configuración
echo "Verificando sintaxis de Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Configuración de Nginx correcta${NC}"
    
    # Reiniciar Nginx
    echo "Reiniciando Nginx..."
    systemctl restart nginx
    echo -e "${GREEN}✅ Nginx reiniciado${NC}"
else
    echo -e "${RED}❌ ERROR en configuración de Nginx${NC}"
    exit 1
fi
echo ""

# ========================================
# PASO 8: VERIFICAR MYSQL
# ========================================
echo -e "${BLUE}🗄️  PASO 8: Verificando MySQL...${NC}"

# Verificar si MySQL está corriendo
if systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✅ MySQL está corriendo${NC}"
    
    # Verificar base de datos
    echo "Verificando base de datos bamroyalties..."
    mysql -u root -p'BigArtist2018!@?' -e "USE bamroyalties; SHOW TABLES;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Base de datos accesible${NC}"
    else
        echo -e "${YELLOW}⚠️  No se pudo verificar la base de datos${NC}"
        echo "Puede que necesites configurar la contraseña de MySQL manualmente"
    fi
else
    echo -e "${RED}❌ MySQL no está corriendo${NC}"
    echo "Iniciando MySQL..."
    systemctl start mysql
fi
echo ""

# ========================================
# PASO 9: VERIFICACIÓN FINAL
# ========================================
echo -e "${BLUE}🔍 PASO 9: Verificación final...${NC}"
echo ""

echo "Estado de servicios:"
echo "-------------------"
echo -n "Nginx: "
systemctl is-active nginx && echo -e "${GREEN}✅ Corriendo${NC}" || echo -e "${RED}❌ Detenido${NC}"

echo -n "MySQL: "
systemctl is-active mysql && echo -e "${GREEN}✅ Corriendo${NC}" || echo -e "${RED}❌ Detenido${NC}"

echo -n "PM2 (Backend): "
pm2 list | grep -q bamroyalties && echo -e "${GREEN}✅ Corriendo${NC}" || echo -e "${RED}❌ Detenido${NC}"

echo ""
echo -e "${BLUE}Archivos generados:${NC}"
echo "- Frontend compilado: $APP_DIR/dist/"
echo "- Backend corriendo en: http://localhost:3001"
echo "- Logs de PM2: pm2 logs bamroyalties"
echo ""

# ========================================
# FINALIZACIÓN
# ========================================
echo ""
echo "=========================================="
echo -e "${GREEN}✅ DEPLOYMENT COMPLETADO EXITOSAMENTE${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}🌐 Tu aplicación está disponible en:${NC}"
echo -e "${GREEN}   👉 https://app.bigartist.es${NC}"
echo ""
echo -e "${BLUE}📱 Para ver en tu móvil:${NC}"
echo "   1. Abre el navegador"
echo "   2. Visita: https://app.bigartist.es"
echo "   3. Limpia la caché del navegador"
echo "   4. ¡Disfruta de tu app optimizada!"
echo ""
echo -e "${BLUE}🔧 Comandos útiles:${NC}"
echo "   - Ver logs backend: pm2 logs bamroyalties"
echo "   - Reiniciar backend: pm2 restart bamroyalties"
echo "   - Ver logs Nginx: tail -f /var/log/nginx/bamroyalties_error.log"
echo "   - Reiniciar Nginx: systemctl restart nginx"
echo ""
echo -e "${BLUE}📊 Estado de PM2:${NC}"
pm2 list
echo ""
echo -e "${GREEN}¡TODO LISTO! 🎉${NC}"
echo ""
