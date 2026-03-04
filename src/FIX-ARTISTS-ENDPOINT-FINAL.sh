#!/bin/bash

##############################################################################
# SCRIPT: FIX-ARTISTS-ENDPOINT-FINAL.sh
# DESCRIPCIÓN: Corrige el endpoint /api/artists para que NO requiera autenticación
#              y reinicia el servidor correctamente
# AUTOR: BIGARTIST System
# FECHA: 2026-03-04
##############################################################################

echo "🔧 =============================================="
echo "   CORRECCIÓN DEFINITIVA DEL ENDPOINT /api/artists"
echo "   =============================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
SERVER_DIR="/var/www/bigartist/src/server"
SERVER_FILE="$SERVER_DIR/server.js"
BACKUP_FILE="$SERVER_DIR/server.js.backup-$(date +%Y%m%d-%H%M%S)"

# Verificar que el archivo existe
if [ ! -f "$SERVER_FILE" ]; then
    echo -e "${RED}❌ Error: No se encuentra el archivo $SERVER_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}📂 Trabajando en: $SERVER_FILE${NC}"
echo ""

# Crear backup
echo "💾 Creando backup..."
cp "$SERVER_FILE" "$BACKUP_FILE"
echo -e "${GREEN}✅ Backup creado: $BACKUP_FILE${NC}"
echo ""

# Mostrar la línea ACTUAL del endpoint
echo "🔍 Endpoint ACTUAL:"
grep -n "app.get('/api/artists'" "$SERVER_FILE"
echo ""

# Remover verifyToken del endpoint /api/artists
echo "🔧 Removiendo verifyToken del endpoint..."
sed -i "s/app\.get('\/api\/artists', verifyToken,/app.get('\/api\/artists',/" "$SERVER_FILE"

# Verificar el cambio
echo ""
echo "✅ Endpoint CORREGIDO:"
grep -n "app.get('/api/artists'" "$SERVER_FILE"
echo ""

# Mostrar el código completo del endpoint
echo "📋 Código completo del endpoint:"
LINE_NUM=$(grep -n "app.get('/api/artists'" "$SERVER_FILE" | cut -d: -f1)
sed -n "${LINE_NUM},$((LINE_NUM+35))p" "$SERVER_FILE"
echo ""

# Matar procesos en puerto 3001
echo "🔪 Liberando puerto 3001..."
lsof -ti :3001 | xargs kill -9 2>/dev/null
sleep 2
echo -e "${GREEN}✅ Puerto liberado${NC}"
echo ""

# Detener PM2
echo "⏸️  Deteniendo PM2..."
pm2 delete bigartist-api 2>/dev/null
echo ""

# Reiniciar servidor
echo "🚀 Iniciando servidor..."
cd "$SERVER_DIR"
pm2 start server.js --name bigartist-api
pm2 save
echo ""

# Esperar que arranque
echo "⏳ Esperando 5 segundos para que el servidor arranque..."
sleep 5
echo ""

# Ver estado
echo "📊 Estado del servidor:"
pm2 status
echo ""

# Ver logs
echo "📄 Últimos logs:"
pm2 logs bigartist-api --lines 15 --nostream
echo ""

# Probar el endpoint
echo "🧪 =============================================="
echo "   PROBANDO ENDPOINT /api/artists"
echo "   =============================================="
echo ""

RESPONSE=$(curl -s -X GET http://localhost:3001/api/artists 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conexión exitosa al servidor${NC}"
    echo ""
    echo "📦 Respuesta del servidor:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    echo ""
    
    # Verificar si la respuesta es exitosa
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}🎉 ¡ÉXITO! El endpoint está funcionando correctamente${NC}"
    elif echo "$RESPONSE" | grep -q 'Token no proporcionado'; then
        echo -e "${RED}❌ ERROR: El endpoint sigue requiriendo autenticación${NC}"
        echo ""
        echo "Verificando si hay OTRO endpoint /api/artists duplicado..."
        DUPLICATES=$(grep -c "app.get('/api/artists'" "$SERVER_FILE")
        echo "Número de endpoints encontrados: $DUPLICATES"
        
        if [ "$DUPLICATES" -gt 1 ]; then
            echo -e "${YELLOW}⚠️  HAY ENDPOINTS DUPLICADOS. Mostrando todas las ocurrencias:${NC}"
            grep -n "app.get('/api/artists'" "$SERVER_FILE"
        fi
    else
        echo -e "${YELLOW}⚠️  Respuesta inesperada del servidor${NC}"
    fi
else
    echo -e "${RED}❌ ERROR: No se pudo conectar al servidor${NC}"
    echo "Verificando logs de error..."
    pm2 logs bigartist-api --err --lines 20 --nostream
fi

echo ""
echo "=============================================="
echo "📍 RESUMEN"
echo "=============================================="
echo "✅ Backup creado en: $BACKUP_FILE"
echo "✅ Servidor reiniciado"
echo ""
echo "🌐 Endpoints para probar:"
echo "   - Interno: http://localhost:3001/api/artists"
echo "   - Externo: http://94.143.141.241:3001/api/artists"
echo "   - Producción: https://app.bigartist.es/artists"
echo ""
echo "📋 Comandos útiles:"
echo "   pm2 logs bigartist-api        # Ver logs en tiempo real"
echo "   pm2 restart bigartist-api     # Reiniciar servidor"
echo "   pm2 status                    # Ver estado"
echo ""
echo "🔄 Para revertir cambios:"
echo "   cp $BACKUP_FILE $SERVER_FILE"
echo "   pm2 restart bigartist-api"
echo ""
echo "=============================================="
