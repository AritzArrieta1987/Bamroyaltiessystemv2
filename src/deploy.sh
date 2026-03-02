#!/bin/bash

# Script de deploy para BIGARTIST Royalties System
# Servidor: 94.143.141.241
# Dominio: app.bigartist.es

echo "🚀 Iniciando deploy de BIGARTIST Royalties System..."
echo "=================================================="

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables de configuración
SERVER_IP="94.143.141.241"
SERVER_USER="root"
REPO_URL="https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git"
PROJECT_DIR="/root/bamroyalties"
WEB_DIR="/var/www/bigartist/dist"
BACKEND_DIR="/var/www/bigartist/backend"

echo -e "${YELLOW}📋 Configuración:${NC}"
echo "   Servidor: $SERVER_IP"
echo "   Usuario: $SERVER_USER"
echo "   Repositorio: $REPO_URL"
echo "   Directorio proyecto: $PROJECT_DIR"
echo "   Directorio web: $WEB_DIR"
echo ""

# Función para ejecutar comandos en el servidor
run_remote() {
    ssh $SERVER_USER@$SERVER_IP "$1"
}

# Función para mostrar errores y salir
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}"
    exit 1
}

echo -e "${YELLOW}1️⃣  Conectando al servidor...${NC}"
ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo '✅ Conexión establecida'" || error_exit "No se pudo conectar al servidor"

echo -e "${YELLOW}2️⃣  Actualizando código desde GitHub...${NC}"
run_remote "cd $PROJECT_DIR && git pull origin main" || error_exit "Error al hacer pull del repositorio"

echo -e "${YELLOW}3️⃣  Instalando dependencias del frontend...${NC}"
run_remote "cd $PROJECT_DIR && npm install" || error_exit "Error al instalar dependencias"

echo -e "${YELLOW}4️⃣  Compilando aplicación React/Vite...${NC}"
run_remote "cd $PROJECT_DIR && npm run build" || error_exit "Error al compilar la aplicación"

echo -e "${YELLOW}5️⃣  Copiando archivos compilados al directorio web...${NC}"
run_remote "rm -rf $WEB_DIR/* && cp -r $PROJECT_DIR/dist/* $WEB_DIR/" || error_exit "Error al copiar archivos"

echo -e "${YELLOW}6️⃣  Ajustando permisos...${NC}"
run_remote "chown -R www-data:www-data $WEB_DIR && chmod -R 755 $WEB_DIR" || error_exit "Error al ajustar permisos"

echo -e "${YELLOW}7️⃣  Reiniciando backend Node.js con PM2...${NC}"
run_remote "cd $BACKEND_DIR && pm2 restart bigartist-api || pm2 start server.js --name bigartist-api" || echo "⚠️  Advertencia: No se pudo reiniciar PM2"

echo -e "${YELLOW}8️⃣  Recargando Nginx...${NC}"
run_remote "nginx -t && systemctl reload nginx" || error_exit "Error al recargar Nginx"

echo ""
echo -e "${GREEN}✅ ¡Deploy completado exitosamente!${NC}"
echo "=================================================="
echo -e "${GREEN}🌐 La aplicación está disponible en:${NC}"
echo -e "   ${GREEN}https://app.bigartist.es${NC}"
echo ""
echo -e "${YELLOW}📊 Verificación:${NC}"
run_remote "pm2 status" || true
echo ""
echo -e "${GREEN}✨ Deploy finalizado$(date '+%Y-%m-%d %H:%M:%S')${NC}"
