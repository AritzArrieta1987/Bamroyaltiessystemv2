#!/bin/bash

# ================================
# 🚀 DEPLOY CSV UPLOAD FEATURE
# ================================
# Este script actualiza el servidor con la nueva funcionalidad de upload CSV

echo "======================================"
echo "🚀 DEPLOY: CSV Upload Feature"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
SERVER_USER="root"
SERVER_IP="94.143.141.241"
SERVER_PATH="/var/www/bigartist"

echo -e "${BLUE}📦 Paso 1: Actualizar servidor backend${NC}"
echo "======================================"

# Conectar por SSH y actualizar el backend
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'

echo "✅ Conectado al servidor"
cd /var/www/bigartist/server

echo ""
echo "📝 Instalando dependencia 'multer'..."
npm install multer

echo ""
echo "🔄 Reiniciando PM2..."
pm2 restart bigartist-api

echo ""
echo "📊 Estado del API:"
pm2 list

echo ""
echo "======================================"
echo "✅ Backend actualizado exitosamente"
echo "======================================"

ENDSSH

echo ""
echo -e "${BLUE}📦 Paso 2: Actualizar frontend${NC}"
echo "======================================"

# Build del frontend
echo "🔨 Compilando frontend..."
npm run build

# Subir frontend al servidor
echo "📤 Subiendo frontend al servidor..."
scp -r dist/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/frontend/

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH2'

echo "🔄 Reiniciando Nginx..."
systemctl reload nginx

echo ""
echo "======================================"
echo "✅ Frontend actualizado exitosamente"
echo "======================================"

ENDSSH2

echo ""
echo -e "${GREEN}======================================"
echo "✅ DEPLOY COMPLETADO"
echo "======================================${NC}"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Abre https://app.bigartist.es/upload"
echo "  2. Sube el archivo CSV Oct2017_fullreport_big_artist_EU.csv"
echo "  3. Verifica las estadísticas después de la importación"
echo ""
echo "🔗 URLs útiles:"
echo "  - App: https://app.bigartist.es"
echo "  - API Health: https://app.bigartist.es/api/health"
echo ""
