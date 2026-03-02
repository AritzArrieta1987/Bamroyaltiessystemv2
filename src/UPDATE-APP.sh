#!/bin/bash

# ========================================
# 🔄 ACTUALIZAR APP EN SERVIDOR
# ========================================

echo "🔄 Actualizando app..."

ssh root@94.143.141.241 << 'ENDSSH'

cd /var/www/bamroyalties
git pull origin main
npm run build
cd backend
pm2 restart bamroyalties
cd ..
sudo systemctl restart nginx

echo ""
echo "✅ ¡ACTUALIZADO!"
echo "🌐 https://app.bigartist.es"
echo ""

ENDSSH

echo "✅ Listo! Abre https://app.bigartist.es en tu móvil"
