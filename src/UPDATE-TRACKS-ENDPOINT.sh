#!/bin/bash

# Script para actualizar el endpoint de tracks en el servidor
# Este script sube el server.js actualizado al servidor de producción

echo "=========================================="
echo "🚀 ACTUALIZANDO ENDPOINT /api/tracks"
echo "=========================================="

SERVER_IP="94.143.141.241"
SERVER_USER="root"
SERVER_PATH="/var/www/bigartist/server"

echo ""
echo "1️⃣ Copiando server.js al servidor..."
scp server/server.js ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/server.js

echo ""
echo "2️⃣ Reiniciando PM2..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /var/www/bigartist/server
pm2 restart bigartist-api
pm2 logs bigartist-api --lines 20 --nostream
ENDSSH

echo ""
echo "=========================================="
echo "✅ ACTUALIZACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "🔍 Ahora puedes probar el endpoint:"
echo "   curl -H 'Authorization: Bearer TU_TOKEN' https://app.bigartist.es/api/tracks"
echo ""
