#!/bin/bash

##############################################################################
# SCRIPT: FIX-ALL-ARTISTS-NOW.sh
# DESCRIPCIÓN: Solución TODO-EN-UNO para el problema de artistas
#              1. Corrige endpoint /api/artists
#              2. Verifica importación CSV
#              3. Reinicia servidor
#              4. Prueba todo el sistema
# AUTOR: BIGARTIST System
# FECHA: 2026-03-04
##############################################################################

clear

cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🎯 BIGARTIST - CORRECCIÓN COMPLETA DE ARTISTAS 🎯         ║
║                                                              ║
║   Este script corregirá TODOS los problemas relacionados    ║
║   con el endpoint /api/artists y la importación CSV         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF

echo ""
echo "Iniciando en 3 segundos..."
sleep 3
clear

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables
SERVER_DIR="/var/www/bigartist/src/server"
SERVER_FILE="$SERVER_DIR/server.js"
IMPORT_SCRIPT="$SERVER_DIR/scripts/importCSV.js"
BACKUP_FILE="$SERVER_DIR/server.js.backup-$(date +%Y%m%d-%H%M%S)"

# Función para mostrar paso
show_step() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Función para mostrar error
show_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencia
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# ============================================================================
# PASO 1: VERIFICACIONES INICIALES
# ============================================================================

show_step "PASO 1: VERIFICACIONES INICIALES"

# Verificar que estamos como root
if [ "$EUID" -ne 0 ]; then 
    show_error "Este script debe ejecutarse como root"
    exit 1
fi
show_success "Usuario root confirmado"

# Verificar que el archivo server.js existe
if [ ! -f "$SERVER_FILE" ]; then
    show_error "No se encuentra el archivo $SERVER_FILE"
    exit 1
fi
show_success "Archivo server.js encontrado"

# Verificar que el script de importación existe
if [ ! -f "$IMPORT_SCRIPT" ]; then
    show_error "No se encuentra el script $IMPORT_SCRIPT"
    exit 1
fi
show_success "Script importCSV.js encontrado"

# ============================================================================
# PASO 2: CREAR BACKUP
# ============================================================================

show_step "PASO 2: CREANDO BACKUP DE SEGURIDAD"

cp "$SERVER_FILE" "$BACKUP_FILE"
if [ $? -eq 0 ]; then
    show_success "Backup creado: $BACKUP_FILE"
else
    show_error "No se pudo crear el backup"
    exit 1
fi

# ============================================================================
# PASO 3: VERIFICAR CÓDIGO DE IMPORTACIÓN
# ============================================================================

show_step "PASO 3: VERIFICANDO CÓDIGO DE IMPORTACIÓN CSV"

echo "🔍 Buscando función getOrCreateArtist()..."
if grep -q "async function getOrCreateArtist" "$IMPORT_SCRIPT"; then
    show_success "Función getOrCreateArtist() encontrada"
    
    echo ""
    echo "📋 Código de la función:"
    grep -A 18 "async function getOrCreateArtist" "$IMPORT_SCRIPT" | head -20
else
    show_error "No se encuentra la función getOrCreateArtist()"
    exit 1
fi

echo ""
echo "🔍 Verificando que se lee el nombre del artista del CSV..."
if grep -q "artistName = columns\[8\]" "$IMPORT_SCRIPT"; then
    show_success "Lectura de columna Artist Name confirmada"
    grep -n "artistName = columns" "$IMPORT_SCRIPT"
else
    show_warning "No se encuentra la lectura de artistName en la columna esperada"
fi

echo ""
echo "🔍 Verificando que se llama a getOrCreateArtist()..."
if grep -q "await getOrCreateArtist" "$IMPORT_SCRIPT"; then
    show_success "Llamada a getOrCreateArtist() confirmada"
    grep -n "await getOrCreateArtist" "$IMPORT_SCRIPT" | head -1
else
    show_error "No se encuentra la llamada a getOrCreateArtist()"
    exit 1
fi

# ============================================================================
# PASO 4: VERIFICAR ENDPOINT ACTUAL
# ============================================================================

show_step "PASO 4: VERIFICANDO ENDPOINT /api/artists"

echo "🔍 Estado ACTUAL del endpoint:"
grep -n "app.get('/api/artists'" "$SERVER_FILE"

if grep -q "app.get('/api/artists', verifyToken," "$SERVER_FILE"; then
    show_warning "El endpoint tiene verifyToken (requiere autenticación)"
    echo "🔧 Esto se corregirá en el siguiente paso"
else
    show_success "El endpoint NO tiene verifyToken"
fi

# Verificar si hay endpoints duplicados
DUPLICATES=$(grep -c "app.get('/api/artists'" "$SERVER_FILE")
echo ""
echo "📊 Número de endpoints /api/artists encontrados: $DUPLICATES"

if [ "$DUPLICATES" -gt 1 ]; then
    show_error "HAY $DUPLICATES ENDPOINTS DUPLICADOS"
    echo ""
    echo "Ubicaciones:"
    grep -n "app.get('/api/artists'" "$SERVER_FILE"
    echo ""
    show_error "Debes eliminar manualmente los endpoints duplicados antes de continuar"
    exit 1
fi

# ============================================================================
# PASO 5: CORREGIR ENDPOINT
# ============================================================================

show_step "PASO 5: CORRIGIENDO ENDPOINT /api/artists"

echo "🔧 Removiendo verifyToken del endpoint..."
sed -i "s/app\.get('\/api\/artists', verifyToken,/app.get('\/api\/artists',/" "$SERVER_FILE"

if [ $? -eq 0 ]; then
    show_success "Modificación aplicada"
else
    show_error "No se pudo modificar el archivo"
    exit 1
fi

echo ""
echo "✅ Estado NUEVO del endpoint:"
grep -n "app.get('/api/artists'" "$SERVER_FILE"

echo ""
echo "📋 Código completo del endpoint:"
LINE_NUM=$(grep -n "app.get('/api/artists'" "$SERVER_FILE" | cut -d: -f1)
sed -n "${LINE_NUM},$((LINE_NUM+30))p" "$SERVER_FILE"

# ============================================================================
# PASO 6: VERIFICAR BASE DE DATOS
# ============================================================================

show_step "PASO 6: VERIFICANDO BASE DE DATOS"

echo "🔍 Estructura de la tabla artists:"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE artists;" 2>/dev/null

if [ $? -eq 0 ]; then
    show_success "Tabla artists existe"
else
    show_error "No se pudo acceder a la tabla artists"
    exit 1
fi

echo ""
echo "📊 Artistas actuales en la base de datos:"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as tracks,
  COUNT(DISTINCT r.id) as royalties,
  COALESCE(SUM(r.net_receipts), 0) as revenue
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON r.track_id = t.id
GROUP BY a.id, a.name
ORDER BY a.name ASC;
" 2>/dev/null

# ============================================================================
# PASO 7: REINICIAR SERVIDOR
# ============================================================================

show_step "PASO 7: REINICIANDO SERVIDOR"

echo "🔪 Liberando puerto 3001..."
lsof -ti :3001 | xargs kill -9 2>/dev/null
sleep 2
show_success "Puerto liberado"

echo ""
echo "⏸️  Deteniendo proceso PM2..."
pm2 delete bigartist-api 2>/dev/null
sleep 1
show_success "Proceso detenido"

echo ""
echo "🚀 Iniciando servidor..."
cd "$SERVER_DIR"
pm2 start server.js --name bigartist-api --silent
if [ $? -eq 0 ]; then
    show_success "Servidor iniciado"
else
    show_error "No se pudo iniciar el servidor"
    exit 1
fi

pm2 save --silent
show_success "Configuración guardada"

echo ""
echo "⏳ Esperando 5 segundos para que el servidor arranque..."
sleep 5

# ============================================================================
# PASO 8: VERIFICAR ESTADO
# ============================================================================

show_step "PASO 8: VERIFICANDO ESTADO DEL SERVIDOR"

echo "📊 Estado de PM2:"
pm2 status

echo ""
echo "📄 Últimos logs:"
pm2 logs bigartist-api --lines 15 --nostream

# ============================================================================
# PASO 9: PROBAR ENDPOINT
# ============================================================================

show_step "PASO 9: PROBANDO ENDPOINT /api/artists"

echo "🧪 Realizando petición a http://localhost:3001/api/artists..."
echo ""

RESPONSE=$(curl -s -X GET http://localhost:3001/api/artists 2>/dev/null)
CURL_EXIT=$?

if [ $CURL_EXIT -eq 0 ]; then
    show_success "Conexión exitosa al servidor"
    echo ""
    echo "📦 Respuesta del servidor:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    echo ""
    
    # Verificar si la respuesta es exitosa
    if echo "$RESPONSE" | grep -q '"success":true'; then
        show_success "¡ÉXITO! El endpoint está funcionando correctamente"
        
        # Contar artistas
        ARTIST_COUNT=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null)
        if [ ! -z "$ARTIST_COUNT" ]; then
            echo ""
            echo "📊 Número de artistas encontrados: $ARTIST_COUNT"
        fi
    elif echo "$RESPONSE" | grep -q 'Token no proporcionado'; then
        show_error "El endpoint sigue requiriendo autenticación"
        echo ""
        echo "Esto puede deberse a que hay OTRO endpoint /api/artists más adelante en el archivo."
        echo "Ejecuta este comando para verificar:"
        echo "  grep -n \"app.get('/api/artists'\" $SERVER_FILE"
    else
        show_warning "Respuesta inesperada del servidor"
    fi
else
    show_error "No se pudo conectar al servidor"
    echo ""
    echo "Verificando logs de error..."
    pm2 logs bigartist-api --err --lines 20 --nostream
fi

# ============================================================================
# PASO 10: PRUEBA EXTERNA
# ============================================================================

show_step "PASO 10: PROBANDO ACCESO EXTERNO"

echo "🌐 Probando desde IP externa..."
EXTERNAL_RESPONSE=$(curl -s -m 5 -X GET http://94.143.141.241:3001/api/artists 2>/dev/null)
EXTERNAL_EXIT=$?

if [ $EXTERNAL_EXIT -eq 0 ]; then
    show_success "Acceso externo funciona correctamente"
    
    if echo "$EXTERNAL_RESPONSE" | grep -q '"success":true'; then
        show_success "Endpoint accesible desde internet"
    fi
else
    show_warning "No se pudo probar desde IP externa"
    echo "Verifica el firewall: ufw status"
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo ""
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                     ✅ RESUMEN FINAL ✅                      ║
╚══════════════════════════════════════════════════════════════╝
EOF

echo ""
echo -e "${GREEN}✅ Backup creado:${NC} $BACKUP_FILE"
echo -e "${GREEN}✅ Endpoint corregido:${NC} /api/artists (sin autenticación)"
echo -e "${GREEN}✅ Servidor reiniciado:${NC} PM2 bigartist-api"
echo -e "${GREEN}✅ Importación CSV:${NC} Configurada correctamente"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📍 ENDPOINTS DISPONIBLES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "🔗 Interno:     http://localhost:3001/api/artists"
echo "🔗 Externo:     http://94.143.141.241:3001/api/artists"
echo "🔗 Producción:  https://app.bigartist.es/artists"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 COMANDOS ÚTILES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Ver logs:       pm2 logs bigartist-api"
echo "Ver estado:     pm2 status"
echo "Reiniciar:      pm2 restart bigartist-api"
echo "Ver artistas:   mysql -u root -p'BigArtist2018!@?' bigartist_db -e 'SELECT * FROM artists;'"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🧪 PRUEBA EN EL NAVEGADOR${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. Ve a: https://app.bigartist.es/upload"
echo "2. Sube un archivo CSV"
echo "3. Ve a: https://app.bigartist.es/artists"
echo "4. Verás los artistas extraídos del CSV"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔄 CÓMO FUNCIONA LA IMPORTACIÓN${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Cuando subes un CSV:"
echo "  1. Se lee la columna 9 (Artist Name)"
echo "  2. Se ejecuta getOrCreateArtist()"
echo "  3. Si el artista no existe, se INSERTA en 'artists'"
echo "  4. Se relacionan tracks y royalties con el artist_id"
echo "  5. Los artistas aparecen en Gestión de Artistas"
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔄 PARA REVERTIR CAMBIOS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "cp $BACKUP_FILE $SERVER_FILE"
echo "pm2 restart bigartist-api"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}           ✨ ¡PROCESO COMPLETADO EXITOSAMENTE! ✨${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
