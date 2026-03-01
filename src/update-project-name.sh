#!/bin/bash

echo "🎨 Actualizando nombre del proyecto a 'BAM Royalties System'..."

# Navegar al directorio del proyecto
cd /var/www/bigartist || { echo "❌ Error: No se encuentra /var/www/bigartist"; exit 1; }

# 1. Actualizar package.json
echo "📦 Actualizando package.json..."
cat > package.json << 'EOF'
{
  "name": "bam-royalties-system",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@vitejs/plugin-react": "*",
    "lucide-react": "*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "*",
    "recharts": "*",
    "sonner": "^2.0.3",
    "tailwindcss": "*",
    "vite": "*"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@vitejs/plugin-react-swc": "^3.10.2",
    "vite": "6.3.5"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
EOF

# 2. Actualizar index.html
echo "📄 Actualizando index.html..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BAM Royalties System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
EOF

# 3. Actualizar vite.config.ts
echo "⚙️  Actualizando vite.config.ts..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
EOF

# 4. Crear carpeta public si no existe
echo "📁 Creando carpeta public..."
mkdir -p public

# 5. Crear un favicon simple (puedes reemplazarlo luego)
echo "🎯 Creando favicon placeholder..."
cat > public/favicon.png << 'EOF'
# Este es un placeholder - sube tu propio favicon.png a /var/www/bigartist/public/
EOF

echo ""
echo "✅ Archivos actualizados correctamente!"
echo ""
echo "📊 Resumen de cambios:"
echo "   - package.json → name: 'bam-royalties-system'"
echo "   - index.html → title: 'BAM Royalties System'"
echo "   - vite.config.ts → actualizado"
echo "   - public/favicon.png → placeholder creado"
echo ""
echo "🔄 ¿Quieres hacer commit y push a GitHub? (necesitas credenciales)"
read -p "Presiona 'y' para continuar o cualquier tecla para saltar: " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "📤 Haciendo commit y push..."
    git config user.email "deploy@bigartist.es"
    git config user.name "BAM Deploy Bot"
    git add package.json index.html vite.config.ts public/
    git commit -m "Actualizar nombre del proyecto a BAM Royalties System"
    git push origin main
    echo "✅ Cambios subidos a GitHub!"
else
    echo "⏭️  Saltando commit/push a GitHub"
fi

echo ""
echo "🚀 ¿Quieres reconstruir y desplegar ahora?"
read -p "Presiona 'y' para continuar o cualquier tecla para saltar: " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🔨 Reconstruyendo aplicación..."
    npm install
    npm run build
    
    echo "📋 Copiando archivos a Nginx..."
    rm -rf /var/www/html/bigartist/*
    cp -r dist/* /var/www/html/bigartist/
    
    echo "🔄 Reiniciando Nginx..."
    systemctl reload nginx
    
    echo ""
    echo "🎉 ¡DESPLIEGUE COMPLETADO!"
    echo "🌐 Visita: https://app.bigartist.es"
else
    echo "⏭️  Reconstrucción omitida. Ejecuta /root/deploy-bigartist.sh cuando estés listo"
fi

echo ""
echo "✨ ¡Proceso completado!"
