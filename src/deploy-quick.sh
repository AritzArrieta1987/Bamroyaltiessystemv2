#!/bin/bash

# Script de deploy rápido (solo frontend)
# Para actualizaciones rápidas sin reiniciar backend

echo "⚡ Deploy rápido de BIGARTIST - Solo Frontend"
echo "=============================================="

SERVER_IP="94.143.141.241"
SERVER_USER="root"
PROJECT_DIR="/root/bamroyalties"
WEB_DIR="/var/www/bigartist/dist"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📥 Actualizando código...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && git pull origin main"

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && npm install"

echo -e "${YELLOW}🔨 Compilando...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && npm run build"

echo -e "${YELLOW}📂 Copiando archivos...${NC}"
ssh $SERVER_USER@$SERVER_IP "rm -rf $WEB_DIR/* && cp -r $PROJECT_DIR/dist/* $WEB_DIR/ && chown -R www-data:www-data $WEB_DIR"

echo -e "${GREEN}✅ Deploy completado - https://app.bigartist.es${NC}"
