#!/bin/bash

################################################################################
# 🚀 DEPLOY AUTOMÁTICO COMPLETO - BAM ROYALTIES SYSTEM
################################################################################
# 
# EJECUTAR DESDE TU MÁQUINA LOCAL (no en el servidor)
# 
# USO:
#   bash deploy-local.sh "mensaje del commit"
#
# EJEMPLO:
#   bash deploy-local.sh "Añadido nuevo favicon y botón limpiar datos"
#
################################################################################

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuración del servidor
SERVER_USER="root"
SERVER_IP="94.143.141.241"
PROJECT_DIR="/var/www/bigartist"

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🚀 DEPLOY AUTOMÁTICO - BAM ROYALTIES SYSTEM (BIGARTIST)    ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

################################################################################
# VALIDACIÓN: Mensaje de commit
################################################################################
if [ -z "$1" ]; then
    echo -e "${RED}❌ ERROR: Debes proporcionar un mensaje de commit${NC}\n"
    echo -e "${YELLOW}Uso:${NC}"
    echo -e "  bash deploy-local.sh \"Tu mensaje aquí\"\n"
    echo -e "${YELLOW}Ejemplo:${NC}"
    echo -e "  bash deploy-local.sh \"Añadido favicon y botón limpiar datos\"\n"
    exit 1
fi

COMMIT_MESSAGE="$1"

################################################################################
# PASO 1: GIT STATUS (verificar cambios)
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 PASO 1/5: Verificando cambios en Git...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: No estás en un repositorio Git${NC}"
    exit 1
fi

# Mostrar cambios
echo -e "${YELLOW}Archivos modificados:${NC}"
git status --short
echo ""

# Confirmar
echo -e "${YELLOW}¿Deseas continuar con el deploy? (s/n):${NC} "
read -r CONFIRM

if [[ ! $CONFIRM =~ ^[SsYy]$ ]]; then
    echo -e "${RED}❌ Deploy cancelado por el usuario${NC}"
    exit 0
fi

echo -e "${GREEN}✅ Verificación completada${NC}\n"

################################################################################
# PASO 2: GIT ADD, COMMIT y PUSH
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📤 PASO 2/5: Haciendo commit y push a GitHub...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Add
echo -e "${YELLOW}⏳ Agregando archivos...${NC}"
git add .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: git add falló${NC}"
    exit 1
fi

# Commit
echo -e "${YELLOW}⏳ Haciendo commit...${NC}"
git commit -m "$COMMIT_MESSAGE"

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  No hay cambios para commitear (o commit falló)${NC}"
    echo -e "${YELLOW}Continuando con push de commits anteriores...${NC}"
fi

# Push
echo -e "${YELLOW}⏳ Subiendo a GitHub...${NC}"
git push origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERROR: git push falló${NC}"
    echo -e "${YELLOW}Verifica tus credenciales de GitHub${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Código subido a GitHub${NC}\n"

################################################################################
# PASO 3: CONECTAR AL SERVIDOR
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔌 PASO 3/5: Conectando al servidor...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Servidor: ${SERVER_USER}@${SERVER_IP}${NC}"
echo -e "${YELLOW}Proyecto: ${PROJECT_DIR}${NC}\n"

################################################################################
# PASO 4: EJECUTAR DEPLOY EN EL SERVIDOR
################################################################################
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 PASO 4/5: Ejecutando deploy en el servidor...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Ejecutar deploy.sh en el servidor vía SSH
ssh -t ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'

# Colores en el servidor
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /var/www/bigartist

if [ ! -f "deploy.sh" ]; then
    echo -e "${RED}❌ ERROR: No se encuentra deploy.sh en el servidor${NC}"
    exit 1
fi

# Ejecutar el script de deploy
bash deploy.sh

ENDSSH

if [ $? -ne 0 ]; then
    echo -e "\n${RED}❌ ERROR: Deploy en el servidor falló${NC}"
    exit 1
fi

################################################################################
# PASO 5: VERIFICACIÓN FINAL
################################################################################
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}✅ PASO 5/5: Deploy completado exitosamente${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                               ║${NC}"
echo -e "${GREEN}║               🎉 ¡DEPLOY COMPLETADO CON ÉXITO! 🎉            ║${NC}"
echo -e "${GREEN}║                                                               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🌐 URLs DE ACCESO${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Frontend:${NC} https://app.bigartist.es"
echo -e "${GREEN}Backend:${NC}  https://app.bigartist.es/api"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${MAGENTA}📝 RESUMEN DEL DEPLOY:${NC}"
echo -e "  ${GREEN}✓${NC} Commit: ${COMMIT_MESSAGE}"
echo -e "  ${GREEN}✓${NC} Push a GitHub: main"
echo -e "  ${GREEN}✓${NC} Deploy en servidor: ${SERVER_IP}"
echo -e "  ${GREEN}✓${NC} Frontend compilado y desplegado"
echo -e "  ${GREEN}✓${NC} Backend reiniciado (PM2)"
echo -e "  ${GREEN}✓${NC} Nginx reiniciado"
echo ""

echo -e "${YELLOW}💡 TIP: Si no ves los cambios, presiona Ctrl+Shift+R en el navegador${NC}\n"

echo -e "${GREEN}✨ ¡Todo listo! Abre https://app.bigartist.es en tu navegador ✨${NC}\n"
