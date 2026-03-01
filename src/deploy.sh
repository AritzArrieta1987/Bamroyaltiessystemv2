#!/bin/bash

################################################################################
# 🚀 SCRIPT DE DEPLOY COMPLETO - BAM ROYALTIES SYSTEM (BIGARTIST)
################################################################################
# 
# Este script debe ejecutarse EN EL SERVIDOR (94.143.141.241)
# 
# USO:
#   ssh root@94.143.141.241
#   cd /var/www/bigartist
#   bash deploy.sh
#
################################################################################

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║     🚀 DEPLOY - BAM ROYALTIES SYSTEM (BIGARTIST)             ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: No se encuentra package.json${NC}"
    echo -e "${YELLOW}Asegúrate de estar en /var/www/bigartist${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Directorio correcto: $(pwd)${NC}\n"

################################################################################
# PASO 1: GIT PULL
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📥 PASO 1: Descargando últimos cambios desde GitHub...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Guardar cambios locales si existen
git stash save "Auto-stash before deploy $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null

# Pull desde GitHub
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: git pull falló${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Código actualizado desde GitHub${NC}\n"

################################################################################
# PASO 2: INSTALAR DEPENDENCIAS FRONTEND
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 PASO 2: Instalando dependencias del Frontend...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

npm install --production=false

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: npm install (frontend) falló${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}\n"

################################################################################
# PASO 3: BUILD DEL FRONTEND
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🏗️  PASO 3: Compilando Frontend (React + Vite)...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: npm run build falló${NC}"
    exit 1
fi

# Verificar que dist/ existe
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ ERROR: La carpeta dist/ no fue creada${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend compilado en /dist${NC}\n"

################################################################################
# PASO 4: PERMISOS DE LA CARPETA DIST
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔒 PASO 4: Configurando permisos de dist/...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

chmod -R 755 dist/
chown -R www-data:www-data dist/

echo -e "${GREEN}✅ Permisos configurados correctamente${NC}\n"

################################################################################
# PASO 5: INSTALAR DEPENDENCIAS DEL BACKEND
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 PASO 5: Instalando dependencias del Backend...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd server

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: No se encuentra server/package.json${NC}"
    exit 1
fi

npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: npm install (backend) falló${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}\n"

################################################################################
# PASO 6: REINICIAR PM2 (BACKEND)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔄 PASO 6: Reiniciando Backend con PM2...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Verificar si el proceso ya existe en PM2
if pm2 list | grep -q "bigartist-api"; then
    echo -e "${YELLOW}♻️  Reiniciando proceso existente...${NC}"
    pm2 restart bigartist-api
else
    echo -e "${YELLOW}🆕 Iniciando nuevo proceso...${NC}"
    cd server
    pm2 start server.js --name bigartist-api
    cd ..
fi

# Guardar configuración de PM2
pm2 save

# Verificar que está corriendo
sleep 2
if pm2 list | grep -q "bigartist-api.*online"; then
    echo -e "${GREEN}✅ Backend corriendo en PM2${NC}"
else
    echo -e "${RED}⚠️  WARNING: Backend podría no estar corriendo correctamente${NC}"
    echo -e "${YELLOW}Ejecuta 'pm2 logs bigartist-api' para ver errores${NC}"
fi

echo ""

################################################################################
# PASO 7: REINICIAR NGINX
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔄 PASO 7: Reiniciando Nginx...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Verificar configuración de Nginx
nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: Configuración de Nginx inválida${NC}"
    exit 1
fi

# Reiniciar Nginx
systemctl restart nginx

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: No se pudo reiniciar Nginx${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Nginx reiniciado correctamente${NC}\n"

################################################################################
# PASO 8: VERIFICACIÓN FINAL
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}✅ PASO 8: Verificación Final${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${GREEN}🎉 DEPLOY COMPLETADO EXITOSAMENTE 🎉${NC}\n"

echo -e "${YELLOW}📊 ESTADO DE LOS SERVICIOS:${NC}"
echo ""

# Estado de PM2
echo -e "${BLUE}🔹 Backend (PM2):${NC}"
pm2 list | grep bigartist-api
echo ""

# Estado de Nginx
echo -e "${BLUE}🔹 Nginx:${NC}"
systemctl status nginx --no-pager | head -5
echo ""

# URLs de acceso
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 URLs DE ACCESO:${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Frontend:${NC} https://app.bigartist.es"
echo -e "${BLUE}Backend:${NC}  https://app.bigartist.es/api"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Comandos útiles
echo -e "${YELLOW}📝 COMANDOS ÚTILES:${NC}"
echo -e "  ${BLUE}Ver logs del backend:${NC}  pm2 logs bigartist-api"
echo -e "  ${BLUE}Reiniciar backend:${NC}     pm2 restart bigartist-api"
echo -e "  ${BLUE}Ver logs de Nginx:${NC}     tail -f /var/log/nginx/error.log"
echo -e "  ${BLUE}Reiniciar Nginx:${NC}       systemctl restart nginx"
echo ""

echo -e "${GREEN}✨ Todo listo para usar en: https://app.bigartist.es ✨${NC}"
echo ""
