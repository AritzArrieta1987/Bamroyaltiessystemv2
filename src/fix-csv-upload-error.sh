#!/bin/bash

echo "=========================================="
echo "🔍 DIAGNÓSTICO ERROR 500"
echo "=========================================="

# 1. Ver configuración de Nginx
echo ""
echo "1️⃣ Configuración de Nginx actual:"
cat /etc/nginx/sites-available/bigartist

echo ""
echo "=========================================="
echo "2️⃣ Ver logs de error de Nginx:"
tail -30 /var/log/nginx/error.log

echo ""
echo "=========================================="
echo "3️⃣ Verificar que PM2 está corriendo:"
pm2 status

echo ""
echo "=========================================="
echo "4️⃣ Verificar que el backend responde en localhost:"
curl -s http://localhost:3001/api/health || echo "❌ Backend no responde"

echo ""
echo "=========================================="
echo "5️⃣ Ver rutas del backend:"
cd /var/www/bigartist/server
grep -n "royalties/import\|upload" server.js 2>/dev/null | head -10 || \
grep -n "royalties/import\|upload" index.js 2>/dev/null | head -10 || \
echo "❌ No se encuentra el archivo del servidor"

echo ""
echo "=========================================="
echo "🔧 SOLUCIÓN: ACTUALIZAR NGINX"
echo "=========================================="

# Crear nueva configuración de Nginx con proxy correcto
cat > /etc/nginx/sites-available/bigartist << 'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.bigartist.es;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Aumentar tamaño máximo de archivo para CSV grandes
    client_max_body_size 50M;
    client_body_timeout 300s;

    # Root para archivos estáticos
    root /var/www/bigartist/dist;
    index index.html;

    # API Backend - DEBE IR PRIMERO
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts largos para importación CSV
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Archivos estáticos del frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONFIG

echo "✅ Configuración de Nginx actualizada"

echo ""
echo "=========================================="
echo "🧪 VERIFICAR SINTAXIS DE NGINX"
echo "=========================================="
nginx -t

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "🔄 REINICIAR NGINX"
    echo "=========================================="
    systemctl reload nginx
    echo "✅ Nginx reiniciado"
    
    echo ""
    echo "=========================================="
    echo "🧪 PROBAR ENDPOINT DESDE EL SERVIDOR"
    echo "=========================================="
    
    # Obtener token
    TOKEN=$(curl -s http://localhost:3001/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@bigartist.es","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    echo "Token: ${TOKEN:0:50}..."
    
    # Crear CSV de prueba
    cat > /tmp/test_nginx.csv << 'CSV'
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;NGINX TEST;Test Album;Test Song;TEST99999999;1;1;1000;Stream;50.00;EUR
CSV
    
    echo ""
    echo "Probando a través de Nginx (https://app.bigartist.es):"
    curl -k -s -w "\nHTTP Status: %{http_code}\n" \
      https://app.bigartist.es/api/royalties/import \
      -H "Authorization: Bearer $TOKEN" \
      -F "file=@/tmp/test_nginx.csv" | head -20
    
    echo ""
    echo "=========================================="
    echo "✅ CONFIGURACIÓN COMPLETADA"
    echo "=========================================="
    echo ""
    echo "Ahora prueba subir el CSV desde el navegador:"
    echo "👉 https://app.bigartist.es"
    echo ""
    echo "Si sigue sin funcionar, ejecuta:"
    echo "pm2 logs bigartist-api --lines 0"
    echo "Y luego intenta subir el CSV para ver el error en tiempo real"
    
else
    echo "❌ Error en la configuración de Nginx"
    echo "Revisa los errores arriba"
fi
