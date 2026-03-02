#!/bin/bash

# =========================================
# 🚀 DEPLOY COMPLETO - Backend + Frontend
# =========================================

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🚀 DEPLOY COMPLETO: CSV Upload Feature             ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

SERVER="root@94.143.141.241"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =========================================
# PASO 1: Actualizar Backend
# =========================================
echo -e "${BLUE}┌─────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  📦 PASO 1: Actualizar Backend      │${NC}"
echo -e "${BLUE}└─────────────────────────────────────┘${NC}"
echo ""

echo "📤 Subiendo server.js..."
scp server/server.js ${SERVER}:/var/www/bigartist/server/

echo "📦 Instalando multer..."
ssh ${SERVER} "cd /var/www/bigartist/server && npm install multer"

echo "🔄 Reiniciando PM2..."
ssh ${SERVER} "pm2 restart bigartist-api"

echo -e "${GREEN}✅ Backend actualizado${NC}"
echo ""

# =========================================
# PASO 2: Compilar Frontend
# =========================================
echo -e "${BLUE}┌─────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  🔨 PASO 2: Compilar Frontend       │${NC}"
echo -e "${BLUE}└─────────────────────────────────────┘${NC}"
echo ""

echo "🔨 Compilando React + Vite..."
npm run build

if [ ! -d "dist" ]; then
  echo -e "${YELLOW}⚠️  Error: No se generó la carpeta dist${NC}"
  echo "Verifica que el build sea exitoso"
  exit 1
fi

echo -e "${GREEN}✅ Frontend compilado${NC}"
echo ""

# =========================================
# PASO 3: Subir Frontend
# =========================================
echo -e "${BLUE}┌─────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  📤 PASO 3: Subir Frontend          │${NC}"
echo -e "${BLUE}└─────────────────────────────────────┘${NC}"
echo ""

echo "📤 Subiendo archivos al servidor..."
scp -r dist/* ${SERVER}:/var/www/bigartist/frontend/

echo "🔄 Recargando Nginx..."
ssh ${SERVER} "systemctl reload nginx"

echo -e "${GREEN}✅ Frontend desplegado${NC}"
echo ""

# =========================================
# PASO 4: Verificar
# =========================================
echo -e "${BLUE}┌─────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  ✅ PASO 4: Verificar Deploy        │${NC}"
echo -e "${BLUE}└─────────────────────────────────────┘${NC}"
echo ""

echo "🧪 Probando health check..."
HEALTH_CHECK=$(curl -s https://app.bigartist.es/api/health | grep -o '"status":"OK"')

if [ -n "$HEALTH_CHECK" ]; then
  echo -e "${GREEN}✅ API funcionando correctamente${NC}"
else
  echo -e "${YELLOW}⚠️  API no responde como esperado${NC}"
fi

echo ""
echo "📊 Estado de PM2:"
ssh ${SERVER} "pm2 list | grep bigartist-api"

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║   ✅ DEPLOY COMPLETADO                                ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🎉 Todo listo! Ahora puedes:${NC}"
echo ""
echo "  1. 🌐 Ir a: https://app.bigartist.es/upload"
echo "  2. 📤 Arrastrar: Oct2017_fullreport_big_artist_EU.csv"
echo "  3. ▶️  Click en 'Procesar CSV'"
echo "  4. ⏱️  Esperar 10-30 segundos"
echo "  5. 📊 Ver estadísticas de importación"
echo ""
echo -e "${BLUE}📋 Comandos útiles:${NC}"
echo ""
echo "  Ver logs:      ssh ${SERVER} 'pm2 logs bigartist-api'"
echo "  Reiniciar:     ssh ${SERVER} 'pm2 restart bigartist-api'"
echo "  MySQL:         ssh ${SERVER} 'mysql -u root -p'"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
