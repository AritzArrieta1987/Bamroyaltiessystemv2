#!/bin/bash

echo "=========================================="
echo "🔍 CAPTURANDO RESPUESTA EXACTA DEL ERROR"
echo "=========================================="

# Obtener token
TOKEN=$(curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:50}..."

# Crear CSV de prueba
cat > /tmp/test_upload.csv << 'CSV'
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;Test;Test;Test;TEST99999999;1;1;1000;Stream;50.00;EUR
CSV

echo ""
echo "=========================================="
echo "📤 CAPTURANDO RESPUESTA HTML DEL ERROR:"
echo "=========================================="

# Capturar la respuesta completa
curl -k -s https://app.bigartist.es/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_upload.csv" \
  -o /tmp/error_response.html

echo ""
echo "Contenido de la respuesta:"
cat /tmp/error_response.html

echo ""
echo ""
echo "=========================================="
echo "📋 LOGS DEL BACKEND (últimas 50 líneas):"
echo "=========================================="
pm2 logs bigartist-api --lines 50 --nostream

echo ""
echo ""
echo "=========================================="
echo "🔍 VERIFICAR SI EL BACKEND ESTÁ CORRIENDO:"
echo "=========================================="
pm2 status

echo ""
echo "Probar endpoint de health:"
curl -s http://localhost:3001/api/health && echo "" || echo "❌ Backend NO responde"

echo ""
echo ""
echo "=========================================="
echo "🔧 VERIFICAR ARCHIVO DEL SERVIDOR:"
echo "=========================================="
cd /var/www/bigartist/server

echo "Archivos en /var/www/bigartist/server:"
ls -la

echo ""
echo "¿Existe server.js?"
ls -la server.js 2>/dev/null || echo "❌ NO EXISTE server.js"

echo ""
echo "¿Existe index.js?"
ls -la index.js 2>/dev/null || echo "❌ NO EXISTE index.js"

echo ""
echo "Ver package.json para saber el archivo principal:"
cat package.json | grep "main\|start" | head -5

echo ""
echo ""
echo "=========================================="
echo "🔍 BUSCAR ENDPOINT DE IMPORTACIÓN:"
echo "=========================================="

# Buscar en todos los archivos JS
find . -name "*.js" -not -path "*/node_modules/*" -exec grep -l "royalties/import\|upload.*csv" {} \; 2>/dev/null

echo ""
echo "Contenido del endpoint (si existe):"
find . -name "*.js" -not -path "*/node_modules/*" -exec grep -B 5 -A 10 "royalties/import" {} \; 2>/dev/null | head -30

echo ""
echo ""
echo "=========================================="
echo "⚙️ CONFIGURACIÓN PM2:"
echo "=========================================="
pm2 describe bigartist-api | grep -E "script path|exec cwd|node args"

echo ""
echo ""
echo "=========================================="
echo "📊 ÚLTIMA VERIFICACIÓN:"
echo "=========================================="
echo ""
echo "1. ¿El backend está en /var/www/bigartist/server?"
ls -ld /var/www/bigartist/server 2>/dev/null && echo "✅ Sí existe" || echo "❌ NO existe"

echo ""
echo "2. ¿Cuál es la estructura de carpetas?"
tree -L 2 /var/www/bigartist 2>/dev/null || find /var/www/bigartist -maxdepth 2 -type d 2>/dev/null
