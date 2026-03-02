#!/bin/bash

# ========================================
# 🔧 SCRIPT PARA ARREGLAR EL TOKEN
# ========================================

echo "🚀 Actualizando servidor con fix de token..."

# 1. Conectar al servidor
ssh root@94.143.141.241 << 'ENDSSH'

cd /var/www/bigartist

# 2. Hacer backup
echo "📦 Creando backup..."
cp -r server server_backup_token_fix_$(date +%Y%m%d_%H%M%S)

# 3. Traer los últimos cambios de GitHub
echo "📥 Descargando cambios de GitHub..."
git stash
git pull origin main

# 4. Copiar archivos actualizados
echo "📂 Copiando archivos del servidor..."
cp -f src/server/server.js server/server.js 2>/dev/null || echo "Archivo ya está en su lugar"

# 5. Reiniciar PM2
echo "🔄 Reiniciando servidor..."
pm2 restart bigartist-api

# 6. Ver los logs para verificar
echo ""
echo "📊 Logs del servidor (Ctrl+C para salir):"
pm2 logs bigartist-api --lines 30

ENDSSH
