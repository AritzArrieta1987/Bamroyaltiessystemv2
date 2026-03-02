#!/bin/bash

# ========================================================
# 🚀 SCRIPT COMPLETO: ARREGLAR TOKEN Y PROBAR CSV
# ========================================================

echo "=========================================="
echo "🔧 ARREGLANDO TOKEN Y PROBANDO CSV"
echo "=========================================="

ssh root@94.143.141.241 << 'ENDSSH'

cd /var/www/bigartist/server

echo ""
echo "=========================================="
echo "1️⃣ HACIENDO BACKUP DEL SERVIDOR ACTUAL"
echo "=========================================="
cp server.js server.js.backup_$(date +%Y%m%d_%H%M%S)
echo "✅ Backup creado"

echo ""
echo "=========================================="
echo "2️⃣ ACTUALIZANDO server.js CON LOGS"
echo "=========================================="

# Actualizar el middleware verifyToken con logs
cat > /tmp/verifyToken.js << 'EOFVERIFY'
// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  console.log('🔐 Verificando token...');
  console.log('📋 Authorization header:', req.headers['authorization']);
  console.log('🔑 Token extraído:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  if (!token) {
    console.log('❌ Token no proporcionado');
    return res.status(403).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuario:', decoded.id);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};
EOFVERIFY

# Buscar y reemplazar la función verifyToken en server.js
node << 'EOFNODE'
const fs = require('fs');
const content = fs.readFileSync('server.js', 'utf8');

// Buscar la función verifyToken y reemplazarla
const verifyTokenNew = `// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  console.log('🔐 Verificando token...');
  console.log('📋 Authorization header:', req.headers['authorization']);
  console.log('🔑 Token extraído:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  if (!token) {
    console.log('❌ Token no proporcionado');
    return res.status(403).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuario:', decoded.id);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};`;

// Reemplazar usando regex
const regex = /\/\/ Middleware para verificar token[\s\S]*?const verifyToken[\s\S]*?\n\};/;
const newContent = content.replace(regex, verifyTokenNew);

fs.writeFileSync('server.js', newContent, 'utf8');
console.log('✅ Función verifyToken actualizada');
EOFNODE

echo "✅ server.js actualizado"

echo ""
echo "=========================================="
echo "3️⃣ REINICIANDO PM2"
echo "=========================================="
pm2 restart bigartist-api
sleep 3
pm2 status

echo ""
echo "=========================================="
echo "4️⃣ PROBANDO LOGIN Y OBTENIENDO TOKEN"
echo "=========================================="

# Hacer login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}')

echo "Respuesta del login:"
echo $LOGIN_RESPONSE | jq '.' 2>/dev/null || echo $LOGIN_RESPONSE

# Extraer token con diferentes métodos
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "⚠️  Intentando extraer token con jq..."
  TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)
fi

echo ""
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ ERROR: No se pudo obtener el token"
  echo "Verificando logs de PM2..."
  pm2 logs bigartist-api --lines 20 --nostream
  exit 1
else
  echo "✅ Token obtenido exitosamente"
  echo "Token: ${TOKEN:0:30}..."
fi

echo ""
echo "=========================================="
echo "5️⃣ CREANDO CSV DE PRUEBA"
echo "=========================================="

# Crear un CSV de prueba muy simple
cat > /tmp/test_royalties.csv << 'EOFCSV'
Period;Activity Period;Artist Name;Imprint Label;Release Name;Track Name;ISRC;Orchard UPC;Trans Type;DMS;Territory;Quantity;Label Share Net Receipts
2017M10;Oct 2017;Test Artist;Test Label;Test Album;Test Song;USTEST1234567;123456789012;Stream;Spotify;ES;1000;50,75
2017M10;Oct 2017;Test Artist;Test Label;Test Album;Test Song 2;USTEST1234568;123456789012;Stream;Apple Music;US;2000;100,50
EOFCSV

echo "✅ CSV de prueba creado: /tmp/test_royalties.csv"
cat /tmp/test_royalties.csv

echo ""
echo "=========================================="
echo "6️⃣ PROBANDO SUBIDA DE CSV CON TOKEN"
echo "=========================================="

echo "Enviando CSV al endpoint..."
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:3001/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "csv=@/tmp/test_royalties.csv")

echo ""
echo "Respuesta del servidor:"
echo $UPLOAD_RESPONSE | jq '.' 2>/dev/null || echo $UPLOAD_RESPONSE

echo ""
echo "=========================================="
echo "7️⃣ VERIFICANDO LOGS DE PM2"
echo "=========================================="
pm2 logs bigartist-api --lines 50 --nostream

echo ""
echo "=========================================="
echo "8️⃣ VERIFICANDO DATOS EN LA BASE DE DATOS"
echo "=========================================="

mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  (SELECT COUNT(*) FROM artists) as total_artists,
  (SELECT COUNT(*) FROM tracks) as total_tracks,
  (SELECT COUNT(*) FROM platforms) as total_platforms,
  (SELECT COUNT(*) FROM territories) as total_territories,
  (SELECT COUNT(*) FROM royalty_details) as total_royalty_details,
  (SELECT ROUND(SUM(net_receipts), 2) FROM royalty_details) as total_revenue;
"

echo ""
echo "=========================================="
echo "✅ PRUEBA COMPLETADA"
echo "=========================================="
echo ""
echo "📋 RESUMEN:"
echo "  - Servidor actualizado con logs de debugging"
echo "  - Token obtenido: ${TOKEN:0:30}..."
echo "  - CSV de prueba enviado"
echo "  - Verificar respuesta arriba ⬆️"
echo ""
echo "🔍 Para ver logs en tiempo real:"
echo "   pm2 logs bigartist-api"
echo ""
echo "=========================================="

ENDSSH

echo ""
echo "✅ Script ejecutado. Revisa los resultados arriba."
