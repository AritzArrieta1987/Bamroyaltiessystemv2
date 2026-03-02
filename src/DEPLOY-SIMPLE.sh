#!/bin/bash

# ============================================
# 🚀 SCRIPT SIMPLE PARA COPIAR Y PEGAR
# ============================================
# Ejecuta este script DENTRO del servidor
# después de conectarte con SSH
# ============================================

echo "🚀 Iniciando deployment..."

cd /var/www/bamroyalties
git pull origin main
npm install
npm run build
cd backend
npm install
pm2 restart bamroyalties
cd ..
sudo systemctl restart nginx

echo ""
echo "✅ ¡COMPLETADO!"
echo "🌐 https://app.bigartist.es"
pm2 list
