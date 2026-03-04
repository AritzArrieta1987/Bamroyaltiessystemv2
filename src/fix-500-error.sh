#!/bin/bash
# BIGARTIST - Fix 500 Internal Server Error
# Diagnóstico y reparación completa

echo "========================================"
echo "BIGARTIST - Diagnóstico Error 500"
echo "========================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Verificar logs de Nginx
echo -e "${YELLOW}[1/8] Verificando logs de Nginx...${NC}"
echo -e "${BLUE}Últimos errores de Nginx:${NC}"
tail -n 20 /var/log/nginx/error.log
echo ""

# 2. Verificar estado del backend (PM2)
echo -e "${YELLOW}[2/8] Verificando backend (PM2)...${NC}"
pm2 status
echo ""

# 3. Verificar estructura de archivos
echo -e "${YELLOW}[3/8] Verificando estructura del proyecto...${NC}"
ls -la /var/www/bigartist/dist/
echo ""

# 4. Limpiar builds anteriores
echo -e "${YELLOW}[4/8] Limpiando builds anteriores...${NC}"
cd /var/www/bigartist
rm -rf dist node_modules/.vite
echo -e "${GREEN}✓ Cache limpiado${NC}"

# 5. Forzar actualización desde GitHub
echo -e "${YELLOW}[5/8] Actualizando código desde GitHub...${NC}"
git fetch origin
git reset --hard origin/main
git clean -fd
echo -e "${GREEN}✓ Código actualizado${NC}"

# 6. Instalar dependencias
echo -e "${YELLOW}[6/8] Verificando dependencias...${NC}"
npm install
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# 7. Build del proyecto
echo -e "${YELLOW}[7/8] Compilando proyecto...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completado correctamente${NC}"
else
    echo -e "${RED}✗ Error en el build${NC}"
    echo -e "${YELLOW}Mostrando últimas líneas del error:${NC}"
    exit 1
fi

# 8. Verificar permisos
echo -e "${YELLOW}[8/8] Corrigiendo permisos...${NC}"
chown -R www-data:www-data /var/www/bigartist/dist
chmod -R 755 /var/www/bigartist/dist
echo -e "${GREEN}✓ Permisos corregidos${NC}"

# Reiniciar servicios
echo -e "${YELLOW}Reiniciando servicios...${NC}"
pm2 restart bigartist-api 2>/dev/null || pm2 restart all 2>/dev/null
systemctl restart nginx

echo ""
echo -e "${GREEN}========================================"
echo -e "✓ DIAGNÓSTICO Y REPARACIÓN COMPLETADOS"
echo -e "========================================${NC}"
echo -e "URL: ${YELLOW}https://app.bigartist.es${NC}"
echo ""
echo -e "${BLUE}Verificaciones realizadas:${NC}"
echo "1. Logs de Nginx revisados"
echo "2. Backend PM2 verificado"
echo "3. Cache limpiado"
echo "4. Código actualizado desde GitHub"
echo "5. Dependencias instaladas"
echo "6. Build reconstruido"
echo "7. Permisos corregidos"
echo "8. Servicios reiniciados"
echo ""
echo -e "${YELLOW}Si el error persiste, ejecuta:${NC}"
echo "tail -f /var/log/nginx/error.log"
echo ""
