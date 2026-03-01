#!/bin/bash

################################################################################
# ⚡ DEPLOY RÁPIDO - Una sola línea
################################################################################

# Configuración
SERVER="root@94.143.141.241"
PROJECT="/var/www/bigartist"

# Colores
G='\033[0;32m'
B='\033[0;34m'
Y='\033[1;33m'
NC='\033[0m'

# Mensaje de commit
MSG="${1:-Update}"

echo -e "${B}🚀 Deploy rápido iniciado...${NC}\n"

# Git: add, commit, push
echo -e "${Y}📤 Subiendo a GitHub...${NC}"
git add . && git commit -m "$MSG" && git push origin main

if [ $? -ne 0 ]; then
    echo -e "${Y}⚠️  Git push falló o no hay cambios (continuando...)${NC}"
fi

# Deploy en servidor
echo -e "\n${Y}🔄 Desplegando en servidor...${NC}\n"
ssh -t $SERVER "cd $PROJECT && bash deploy.sh"

# Resultado
if [ $? -eq 0 ]; then
    echo -e "\n${G}✅ Deploy completado: https://app.bigartist.es${NC}\n"
else
    echo -e "\n❌ Hubo un error en el deploy${NC}\n"
    exit 1
fi
