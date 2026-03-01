#!/bin/bash
# One-line deployment - BAM Royalties System
# Ejecuta: bash <(curl -s https://raw.githubusercontent.com/AritzArrieta1987/Bamroyaltiessystemv2/main/one-line-deploy.sh)

ssh root@94.143.141.241 'bash -s' << 'ENDSSH'
set -e
echo "🚀 BAM Royalties - Quick Deploy"
echo ""
echo "🧹 Limpiando..."
rm -rf /var/www/bigartist
echo "📥 Clonando..."
cd /var/www && git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git bigartist
cd bigartist
echo "📦 Instalando..."
npm install --silent
echo "🏗️  Compilando..."
npm run build
cd server
npm install --production --silent
[ ! -f ".env" ] && cat > .env << EOF
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bigartist
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
EOF
[ -f "init-database.sql" ] && mysql -u root -p'BigArtist2018!@?' < init-database.sql 2>/dev/null || true
[ -f "create-admin.js" ] && node create-admin.js 2>/dev/null || true
echo "🚀 Reiniciando..."
pm2 restart bigartist-api 2>/dev/null || pm2 start server.js --name bigartist-api
pm2 save
chown -R www-data:www-data /var/www/bigartist/dist
chmod -R 755 /var/www/bigartist/dist
systemctl reload nginx
echo ""
echo "✅ Deployment completado!"
echo "🌐 https://app.bigartist.es"
echo "👤 admin@bigartist.es / Admin123!"
ENDSSH
