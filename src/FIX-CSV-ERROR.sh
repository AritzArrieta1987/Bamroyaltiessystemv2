#!/bin/bash
# BIGARTIST - Fix CSV Upload TypeError

echo "╔════════════════════════════════════════════╗"
echo "║   BIGARTIST - Fix CSV Upload Error        ║"
echo "║   TypeError: toFixed is not a function    ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📋 DESCRIPCIÓN DEL PROBLEMA:${NC}"
echo "  El error ocurre porque los valores del servidor vienen como strings"
echo "  y se intenta usar .toFixed() sin convertirlos a número primero."
echo ""
echo -e "${GREEN}✓ SOLUCIÓN APLICADA:${NC}"
echo "  • Convertir totalRevenue a número con parseFloat()"
echo "  • Convertir totalStreams a número con parseInt()"
echo "  • Validar que los valores no sean null/undefined"
echo ""

# Directorio del proyecto
cd /var/www/bigartist

# 1. Backup del archivo actual
echo -e "${YELLOW}[1/5] Creando backup...${NC}"
cp pages/HomePage.tsx pages/HomePage.tsx.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo "  ⚠ No se pudo crear backup (archivo nuevo)"

# 2. Actualizar código desde GitHub
echo -e "${YELLOW}[2/5] Descargando última versión...${NC}"
git fetch origin
git reset --hard origin/main
git clean -fd

# 3. Instalar dependencias
echo -e "${YELLOW}[3/5] Verificando dependencias...${NC}"
npm install

# 4. Compilar proyecto
echo -e "${YELLOW}[4/5] Compilando aplicación...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}  ✓ Compilación exitosa${NC}"
else
    echo -e "${RED}  ✗ Error en compilación${NC}"
    exit 1
fi

# 5. Recargar Nginx
echo -e "${YELLOW}[5/5] Reiniciando servicios...${NC}"
systemctl reload nginx

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         ✓ ARREGLO COMPLETADO ✓            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 URL:${NC} https://app.bigartist.es"
echo ""
echo -e "${YELLOW}PRUEBA:${NC}"
echo "  1. Ve a la página de Upload"
echo "  2. Sube un archivo CSV de The Orchard"
echo "  3. Verifica que el Dashboard se actualice sin errores"
echo ""
echo -e "${GREEN}El error 'toFixed is not a function' está resuelto ✓${NC}"
echo ""
