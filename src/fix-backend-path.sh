#!/bin/bash

echo "=========================================="
echo "🔍 PROBLEMA IDENTIFICADO"
echo "=========================================="
echo "El backend está usando: /var/www/bigartist_backup_20260302_174903/server"
echo "Debería estar en: /var/www/bigartist/server"
echo ""

echo "=========================================="
echo "1️⃣ Ver proceso PM2 actual:"
echo "=========================================="
pm2 describe bigartist-api | grep -E "script path|exec cwd"

echo ""
echo "=========================================="
echo "2️⃣ Detener PM2:"
echo "=========================================="
pm2 delete bigartist-api

echo ""
echo "=========================================="
echo "3️⃣ Verificar estructura correcta:"
echo "=========================================="
ls -la /var/www/bigartist/server/

echo ""
echo "¿Existe server.js?"
ls -la /var/www/bigartist/server/server.js 2>/dev/null && echo "✅ Existe" || echo "❌ NO existe"

echo ""
echo "¿Existe index.js?"
ls -la /var/www/bigartist/server/index.js 2>/dev/null && echo "✅ Existe" || echo "❌ NO existe"

echo ""
echo "Ver package.json:"
cat /var/www/bigartist/server/package.json | grep -E '"main"|"start"' | head -3

echo ""
echo "=========================================="
echo "4️⃣ Reiniciar PM2 con la ruta correcta:"
echo "=========================================="

cd /var/www/bigartist/server

# Verificar cuál es el archivo principal
if [ -f "server.js" ]; then
    MAIN_FILE="server.js"
elif [ -f "index.js" ]; then
    MAIN_FILE="index.js"
else
    echo "❌ No se encuentra archivo principal del servidor"
    exit 1
fi

echo "Archivo principal: $MAIN_FILE"

pm2 start $MAIN_FILE --name bigartist-api
pm2 save

echo ""
echo "=========================================="
echo "5️⃣ Verificar que está corriendo:"
echo "=========================================="
pm2 status

echo ""
echo "Probar health endpoint:"
sleep 2
curl -s http://localhost:3001/api/health && echo "" || echo "❌ Backend no responde"

echo ""
echo "=========================================="
echo "6️⃣ Ver logs:"
echo "=========================================="
pm2 logs bigartist-api --lines 20 --nostream

echo ""
echo "=========================================="
echo "7️⃣ Probar importación CSV:"
echo "=========================================="

# Obtener token
TOKEN=$(curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:50}..."

# Crear CSV de prueba
cat > /tmp/test_final.csv << 'CSV'
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;PRUEBA FINAL;Test Album;Test Song;TEST88888888;1;1;1000;Stream;99.99;EUR
CSV

echo ""
echo "Probando endpoint de importación:"
curl -s http://localhost:3001/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_final.csv" | head -50

echo ""
echo ""
echo "=========================================="
echo "✅ CONFIGURACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "Ahora prueba subir el CSV desde:"
echo "👉 https://app.bigartist.es"
echo ""
echo "Si sigue dando error, ejecuta:"
echo "pm2 logs bigartist-api --lines 0"
echo "Y luego intenta subir para ver el error en tiempo real"
