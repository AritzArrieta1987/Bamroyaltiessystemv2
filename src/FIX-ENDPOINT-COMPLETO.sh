#!/bin/bash

##############################################################################
# SCRIPT: FIX-ENDPOINT-COMPLETO.sh
# DESCRIPCIÓN: Corrige automáticamente el endpoint /api/artists
#              Remueve verifyToken y reinicia el servidor
# AUTOR: BIGARTIST System
# FECHA: 2026-03-04
##############################################################################

clear

cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🔧 CORRECCIÓN AUTOMÁTICA DEL ENDPOINT 🔧             ║
║                    /api/artists                              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF

echo ""
echo "Iniciando corrección en 2 segundos..."
sleep 2

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variables
SERVER_DIR="/var/www/bigartist/src/server"
SERVER_FILE="$SERVER_DIR/server.js"
BACKUP_FILE="$SERVER_DIR/server.js.backup-$(date +%Y%m%d-%H%M%S)"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 1: VERIFICACIÓN INICIAL${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar que existe el archivo
if [ ! -f "$SERVER_FILE" ]; then
    echo -e "${RED}❌ ERROR: No se encuentra $SERVER_FILE${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Archivo encontrado: $SERVER_FILE${NC}"

# Crear backup
echo ""
echo -e "${YELLOW}💾 Creando backup...${NC}"
cp "$SERVER_FILE" "$BACKUP_FILE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup creado: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ ERROR: No se pudo crear backup${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 2: VERIFICAR ESTADO ACTUAL${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "🔍 Buscando endpoint /api/artists..."
echo ""
grep -n "app.get('/api/artists'" "$SERVER_FILE"
echo ""

# Contar cuántos endpoints hay
ENDPOINT_COUNT=$(grep -c "app.get('/api/artists'" "$SERVER_FILE")
echo -e "${BLUE}📊 Número de endpoints encontrados: $ENDPOINT_COUNT${NC}"
echo ""

if [ "$ENDPOINT_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ ERROR: No se encontró el endpoint /api/artists${NC}"
    exit 1
elif [ "$ENDPOINT_COUNT" -gt 1 ]; then
    echo -e "${YELLOW}⚠️  ADVERTENCIA: Hay $ENDPOINT_COUNT endpoints duplicados${NC}"
    echo "Se corregirán todos..."
    echo ""
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 3: APLICAR CORRECCIÓN${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "🔧 Removiendo 'verifyToken' del endpoint..."
echo ""

# Aplicar la corrección con sed (remueve , verifyToken)
sed -i "s/app\.get('\/api\/artists',\s*verifyToken,/app.get('\/api\/artists',/g" "$SERVER_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Corrección aplicada con éxito${NC}"
else
    echo -e "${RED}❌ ERROR: No se pudo aplicar la corrección${NC}"
    echo "Restaurando backup..."
    cp "$BACKUP_FILE" "$SERVER_FILE"
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 4: VERIFICAR CORRECCIÓN${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "✅ Estado NUEVO del endpoint:"
echo ""
grep -n "app.get('/api/artists'" "$SERVER_FILE"
echo ""

# Verificar que ya no tiene verifyToken
if grep -q "app.get('/api/artists', verifyToken," "$SERVER_FILE"; then
    echo -e "${RED}❌ ERROR: El endpoint TODAVÍA tiene verifyToken${NC}"
    echo ""
    echo "Puede haber un formato diferente. Mostrando código completo:"
    echo ""
    LINE_NUM=$(grep -n "app.get('/api/artists'" "$SERVER_FILE" | head -1 | cut -d: -f1)
    sed -n "${LINE_NUM},$((LINE_NUM+5))p" "$SERVER_FILE"
    echo ""
    echo "Restaurando backup..."
    cp "$BACKUP_FILE" "$SERVER_FILE"
    exit 1
else
    echo -e "${GREEN}✅ verifyToken removido correctamente${NC}"
fi

echo ""
echo "📋 Código del endpoint (primeras 10 líneas):"
echo ""
LINE_NUM=$(grep -n "app.get('/api/artists'" "$SERVER_FILE" | head -1 | cut -d: -f1)
sed -n "${LINE_NUM},$((LINE_NUM+10))p" "$SERVER_FILE"
echo ""

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 5: REINICIAR SERVIDOR${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "🔪 Liberando puerto 3001..."
lsof -ti :3001 | xargs kill -9 2>/dev/null
sleep 2
echo -e "${GREEN}✅ Puerto liberado${NC}"

echo ""
echo "⏸️  Deteniendo proceso PM2..."
pm2 delete bigartist-api 2>/dev/null
sleep 1
echo -e "${GREEN}✅ Proceso detenido${NC}"

echo ""
echo "🚀 Iniciando servidor..."
cd "$SERVER_DIR"
pm2 start server.js --name bigartist-api 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Servidor iniciado${NC}"
else
    echo -e "${RED}❌ ERROR: No se pudo iniciar el servidor${NC}"
    pm2 logs bigartist-api --err --lines 10 --nostream
    exit 1
fi

pm2 save 2>&1 > /dev/null
echo -e "${GREEN}✅ Configuración guardada${NC}"

echo ""
echo "⏳ Esperando 5 segundos para que el servidor arranque..."
sleep 5

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 6: VERIFICAR ESTADO DEL SERVIDOR${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "📊 Estado de PM2:"
pm2 status
echo ""

echo "📄 Últimos logs (15 líneas):"
pm2 logs bigartist-api --lines 15 --nostream
echo ""

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 7: PROBAR ENDPOINT${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "🧪 Probando http://localhost:3001/api/artists..."
echo ""

RESPONSE=$(curl -s -X GET http://localhost:3001/api/artists 2>&1)
CURL_EXIT=$?

if [ $CURL_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ Conexión exitosa al servidor${NC}"
    echo ""
    echo "📦 Respuesta del servidor:"
    echo ""
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    echo ""
    
    # Verificar si la respuesta es exitosa
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo ""
        echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                                                              ║${NC}"
        echo -e "${GREEN}║            🎉 ¡ÉXITO! ENDPOINT FUNCIONANDO 🎉               ║${NC}"
        echo -e "${GREEN}║                                                              ║${NC}"
        echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        # Contar artistas
        ARTIST_COUNT=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null)
        if [ ! -z "$ARTIST_COUNT" ] && [ "$ARTIST_COUNT" != "null" ]; then
            echo -e "${BLUE}📊 Artistas encontrados: $ARTIST_COUNT${NC}"
            echo ""
            echo "Lista de artistas:"
            echo "$RESPONSE" | jq -r '.data[] | "  • \(.name) (ID: \(.id))"' 2>/dev/null
        fi
        
        SUCCESS=true
    elif echo "$RESPONSE" | grep -q 'Token no proporcionado'; then
        echo ""
        echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║                                                              ║${NC}"
        echo -e "${RED}║         ❌ ERROR: SIGUE PIDIENDO TOKEN ❌                   ║${NC}"
        echo -e "${RED}║                                                              ║${NC}"
        echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo "Puede haber un endpoint DUPLICADO o un formato diferente."
        echo ""
        echo "Verificando todos los endpoints /api/artists:"
        grep -n "app.get('/api/artists'" "$SERVER_FILE"
        echo ""
        SUCCESS=false
    else
        echo ""
        echo -e "${YELLOW}⚠️  Respuesta inesperada del servidor${NC}"
        SUCCESS=false
    fi
else
    echo -e "${RED}❌ ERROR: No se pudo conectar al servidor${NC}"
    echo ""
    echo "Verificando logs de error..."
    pm2 logs bigartist-api --err --lines 20 --nostream
    SUCCESS=false
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 8: PROBAR DESDE IP EXTERNA${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "🌐 Probando desde http://94.143.141.241:3001/api/artists..."
echo ""

EXTERNAL_RESPONSE=$(curl -s -m 5 -X GET http://94.143.141.241:3001/api/artists 2>&1)
EXTERNAL_EXIT=$?

if [ $EXTERNAL_EXIT -eq 0 ]; then
    if echo "$EXTERNAL_RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Acceso externo funciona correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️  Acceso externo devuelve respuesta inesperada${NC}"
        echo "$EXTERNAL_RESPONSE" | head -5
    fi
else
    echo -e "${YELLOW}⚠️  No se pudo probar desde IP externa (puede ser firewall)${NC}"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PASO 9: VERIFICAR BASE DE DATOS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "📊 Artistas en la base de datos:"
echo ""
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as tracks,
  COALESCE(SUM(r.net_receipts), 0) as revenue
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON r.track_id = t.id
GROUP BY a.id, a.name
ORDER BY a.name ASC;
" 2>/dev/null

echo ""
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                     📋 RESUMEN FINAL 📋                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}✅ Endpoint corregido correctamente${NC}"
    echo -e "${GREEN}✅ Servidor reiniciado y funcionando${NC}"
    echo -e "${GREEN}✅ API respondiendo sin requerir token${NC}"
else
    echo -e "${RED}❌ Hubo problemas con la corrección${NC}"
    echo ""
    echo "🔧 SOLUCIÓN MANUAL:"
    echo ""
    echo "1. Editar el archivo manualmente:"
    echo "   nano $SERVER_FILE"
    echo ""
    echo "2. Buscar: app.get('/api/artists'"
    echo ""
    echo "3. Cambiar de:"
    echo "   app.get('/api/artists', verifyToken, async (req, res) => {"
    echo ""
    echo "4. A:"
    echo "   app.get('/api/artists', async (req, res) => {"
    echo ""
    echo "5. Guardar (Ctrl+X, Y, Enter)"
    echo ""
    echo "6. Reiniciar:"
    echo "   pm2 restart bigartist-api"
    echo ""
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📁 Backup guardado en:"
echo "   $BACKUP_FILE"
echo ""
echo "🔗 Endpoints disponibles:"
echo "   - Interno:     http://localhost:3001/api/artists"
echo "   - Externo:     http://94.143.141.241:3001/api/artists"
echo "   - Producción:  https://app.bigartist.es/artists"
echo ""
echo "📋 Comandos útiles:"
echo "   pm2 status                    # Ver estado"
echo "   pm2 logs bigartist-api        # Ver logs"
echo "   pm2 restart bigartist-api     # Reiniciar"
echo ""
echo "🔄 Para revertir cambios:"
echo "   cp $BACKUP_FILE $SERVER_FILE"
echo "   pm2 restart bigartist-api"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}✨ ¡PROCESO COMPLETADO EXITOSAMENTE! ✨${NC}"
    echo ""
    echo -e "${GREEN}🎯 Ve a: https://app.bigartist.es/artists${NC}"
    echo -e "${GREEN}   Deberías ver la lista de artistas${NC}"
else
    echo -e "${YELLOW}⚠️  Revisa los errores arriba y ejecuta la solución manual${NC}"
fi

echo ""
