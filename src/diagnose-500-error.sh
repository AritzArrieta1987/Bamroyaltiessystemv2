#!/bin/bash

echo "=========================================="
echo "🔍 DIAGNÓSTICO COMPLETO ERROR 500"
echo "=========================================="

# 1. Ver la respuesta REAL que está devolviendo el servidor
echo ""
echo "1️⃣ Ver respuesta HTML completa del error:"
TOKEN=$(curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Crear CSV de prueba
cat > /tmp/test_error.csv << 'CSV'
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;Test;Test;Test;TEST99999999;1;1;1000;Stream;50.00;EUR
CSV

echo ""
echo "Respuesta del servidor (con headers):"
curl -k -v https://app.bigartist.es/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_error.csv" 2>&1 | tee /tmp/curl_response.txt

echo ""
echo ""
echo "=========================================="
echo "2️⃣ Ver logs del backend EN TIEMPO REAL:"
echo "=========================================="
echo ""
echo "Iniciando monitoreo de logs..."
pm2 logs bigartist-api --lines 0 &
LOGS_PID=$!
sleep 2

echo ""
echo "Haciendo petición mientras monitoreamos logs..."
curl -k -s https://app.bigartist.es/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_error.csv" > /dev/null 2>&1

sleep 3
kill $LOGS_PID 2>/dev/null

echo ""
echo ""
echo "=========================================="
echo "3️⃣ Ver estructura del servidor:"
echo "=========================================="
cd /var/www/bigartist/server
ls -la

echo ""
echo "Archivo principal del servidor:"
ls -la server.js index.js app.js 2>/dev/null || echo "❌ No se encuentra archivo principal"

echo ""
echo "=========================================="
echo "4️⃣ Buscar el endpoint de importación:"
echo "=========================================="
grep -rn "royalties/import\|/import\|upload" . --include="*.js" 2>/dev/null | grep -v node_modules | head -20

echo ""
echo "=========================================="
echo "5️⃣ Ver proceso PM2:"
echo "=========================================="
pm2 describe bigartist-api

echo ""
echo "=========================================="
echo "6️⃣ Probar endpoint directamente en localhost:"
echo "=========================================="
curl -v http://localhost:3001/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_error.csv" 2>&1 | head -50

echo ""
echo ""
echo "=========================================="
echo "7️⃣ Ver configuración actual de Nginx:"
echo "=========================================="
cat /etc/nginx/sites-available/bigartist | grep -A 10 "location /api"

echo ""
echo "=========================================="
echo "8️⃣ Ver logs de error de Nginx:"
echo "=========================================="
tail -20 /var/log/nginx/error.log

echo ""
echo "=========================================="
echo "📋 RESUMEN DEL DIAGNÓSTICO"
echo "=========================================="
echo ""
echo "Si ves un error de 'busboy' o 'multipart', el problema está en el backend."
echo "Si ves 'ECONNREFUSED' o 'Bad Gateway', el backend no está corriendo."
echo "Si ves 'upstream timed out', el backend está muy lento."
echo ""
echo "Envía TODA esta salida para analizar el problema."
