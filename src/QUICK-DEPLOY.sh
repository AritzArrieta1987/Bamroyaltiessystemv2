#!/bin/bash

# =========================================
# 🚀 QUICK DEPLOY - CSV UPLOAD
# =========================================

echo ""
echo "======================================"
echo "🚀 QUICK DEPLOY - CSV Upload Feature"
echo "======================================"
echo ""

SERVER="root@94.143.141.241"

echo "📤 Paso 1/3: Subiendo server.js..."
scp server/server.js ${SERVER}:/var/www/bigartist/server/

echo ""
echo "📦 Paso 2/3: Instalando multer..."
ssh ${SERVER} "cd /var/www/bigartist/server && npm install multer"

echo ""
echo "🔄 Paso 3/3: Reiniciando PM2..."
ssh ${SERVER} "pm2 restart bigartist-api"

echo ""
echo "======================================"
echo "✅ DEPLOY COMPLETADO"
echo "======================================"
echo ""
echo "🧪 Probar:"
echo "   1. https://app.bigartist.es/upload"
echo "   2. Arrastra el CSV Oct2017_fullreport_big_artist_EU.csv"
echo "   3. Click en 'Procesar CSV'"
echo ""
echo "📊 Verificar logs:"
echo "   ssh ${SERVER} 'pm2 logs bigartist-api --lines 30'"
echo ""
