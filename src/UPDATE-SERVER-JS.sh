#!/bin/bash

# ================================
# 🚀 ACTUALIZAR SERVER.JS
# ================================
# Copia el server.js actualizado al servidor

echo "======================================"
echo "🚀 Actualizando server.js en servidor"
echo "======================================"
echo ""

# Variables
SERVER_USER="root"
SERVER_IP="94.143.141.241"
SERVER_PATH="/var/www/bigartist/server"

echo "📤 Subiendo server.js al servidor..."
scp server/server.js ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo ""
echo "🔧 Instalando multer y reiniciando PM2..."

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'

cd /var/www/bigartist/server

echo "✅ Instalando multer..."
npm install multer

echo ""
echo "🔄 Reiniciando PM2..."
pm2 restart bigartist-api

echo ""
echo "📊 Estado del API:"
pm2 list

echo ""
echo "📋 Logs recientes:"
pm2 logs bigartist-api --lines 20 --nostream

ENDSSH

echo ""
echo "======================================"
echo "✅ server.js actualizado"
echo "======================================"
echo ""
echo "🧪 Probar endpoint:"
echo "  curl https://app.bigartist.es/api/health"
echo ""
