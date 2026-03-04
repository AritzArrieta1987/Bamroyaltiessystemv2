#!/bin/bash
# BIGARTIST - Fresh Clone y Actualización
# Clona el repo desde GitHub y actualiza producción

echo "========================================"
echo "BIGARTIST - Fresh Clone desde GitHub"
echo "========================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Backup del repo actual
echo -e "${YELLOW}[1/6] Haciendo backup del repo actual...${NC}"
cd /root
if [ -d "Bamroyaltiessystemv2" ]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    mv Bamroyaltiessystemv2 Bamroyaltiessystemv2_backup_$TIMESTAMP
    echo -e "${GREEN}✓ Backup creado: Bamroyaltiessystemv2_backup_$TIMESTAMP${NC}"
fi

# 2. Clone fresco desde GitHub
echo -e "${YELLOW}[2/6] Clonando repositorio desde GitHub...${NC}"
git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Repositorio clonado correctamente${NC}"
else
    echo -e "${RED}✗ Error al clonar el repositorio${NC}"
    exit 1
fi

# 3. Verificar archivo login-panel.tsx
echo -e "${YELLOW}[3/6] Verificando archivos actualizados...${NC}"
if [ -f "/root/Bamroyaltiessystemv2/src/imports/login-panel.tsx" ]; then
    echo -e "${GREEN}✓ login-panel.tsx encontrado en src/imports/${NC}"
    LOGIN_PANEL_SOURCE="/root/Bamroyaltiessystemv2/src/imports/login-panel.tsx"
elif [ -f "/root/Bamroyaltiessystemv2/imports/login-panel.tsx" ]; then
    echo -e "${GREEN}✓ login-panel.tsx encontrado en imports/${NC}"
    LOGIN_PANEL_SOURCE="/root/Bamroyaltiessystemv2/imports/login-panel.tsx"
else
    echo -e "${YELLOW}⚠ login-panel.tsx no encontrado en GitHub${NC}"
    LOGIN_PANEL_SOURCE=""
fi

# 4. Copiar archivos a producción
echo -e "${YELLOW}[4/6] Copiando archivos a producción...${NC}"
cd /var/www/bigartist

# Crear carpeta imports si no existe
mkdir -p src/imports

# Copiar login-panel.tsx si existe
if [ -n "$LOGIN_PANEL_SOURCE" ]; then
    cp "$LOGIN_PANEL_SOURCE" /var/www/bigartist/src/imports/
    echo -e "${GREEN}✓ login-panel.tsx copiado a producción${NC}"
fi

# Actualizar todo el código desde GitHub
git pull origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Código actualizado desde GitHub${NC}"
else
    echo -e "${RED}✗ Error al actualizar desde GitHub${NC}"
    exit 1
fi

# 5. Build del proyecto
echo -e "${YELLOW}[5/6] Compilando proyecto...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completado correctamente${NC}"
else
    echo -e "${RED}✗ Error en el build${NC}"
    exit 1
fi

# 6. Reiniciar Nginx
echo -e "${YELLOW}[6/6] Reiniciando Nginx...${NC}"
systemctl reload nginx

echo ""
echo -e "${GREEN}========================================"
echo -e "✓✓✓ ACTUALIZACIÓN COMPLETADA ✓✓✓"
echo -e "========================================${NC}"
echo -e "Repositorio: ${GREEN}Clonado desde GitHub${NC}"
echo -e "Producción: ${GREEN}/var/www/bigartist${NC}"
echo -e "URL: ${YELLOW}https://app.bigartist.es${NC}"
echo ""
echo -e "${GREEN}Archivos actualizados desde GitHub:${NC}"
ls -lh /root/Bamroyaltiessystemv2/
echo ""
