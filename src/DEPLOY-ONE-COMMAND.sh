#!/bin/bash

# ========================================
# DEPLOYMENT EN UNA SOLA LÍNEA
# Copia y pega este comando en tu terminal
# ========================================

ssh root@94.143.141.241 << 'ENDSSH'

# Navegar al directorio
cd /var/www/bamroyalties

# Pull desde GitHub
echo "📥 Descargando cambios..."
git fetch origin
git reset --hard origin/main
git pull origin main

# Build frontend
echo "🔨 Compilando frontend..."
npm install
npm run build

# Reiniciar backend
echo "🔄 Reiniciando backend..."
cd backend
npm install
pm2 restart bamroyalties || pm2 start server.js --name bamroyalties
pm2 save
cd ..

# Reiniciar Nginx
echo "🌐 Reiniciando Nginx..."
sudo systemctl restart nginx

# Verificación
echo ""
echo "✅ DEPLOYMENT COMPLETO"
echo "🌐 Visita: https://app.bigartist.es"
echo ""
pm2 list

ENDSSH

echo ""
echo "✅ Todo completado desde tu terminal local!"
echo "📱 Ahora puedes ver la app en tu móvil: https://app.bigartist.es"
