#!/bin/bash

# Script para subir cambios de optimización móvil a GitHub
# BAM Royalties System - Mobile Optimization Update

echo "🚀 Subiendo cambios de optimización móvil..."

# Añadir archivos modificados
git add components/AdminLayout.tsx
git add imports/login-panel.tsx
git add index.html
git add package.json
git add GIT-COMMIT-MOBILE.sh
git add MOBILE-CHANGES.md

# Commit con mensaje descriptivo
git commit -m "feat: Optimización móvil completa y cambio a ROYALTIES SYSTEM

✨ Cambios principales:
- AdminLayout responsive con menu hamburguesa para móvil
- Imagen de fondo ocupa toda la pantalla en dispositivos móviles
- Breakpoints: Desktop (>968px), Tablet (<968px), Mobile (<480px)
- LoginPanel actualizado a 'ROYALTIES SYSTEM'
- Título actualizado en index.html: 'ROYALTIES SYSTEM - BIGARTIST'
- package.json actualizado (name: royalties-system, version: 2.0.0)

📱 Features móvil:
- Menu hamburguesa desplegable con todas las opciones
- Botón 'Cerrar Sesión' dentro del menú móvil (en rojo)
- Logo BIGARTIST optimizado para todos los tamaños de pantalla
- Botones de acción adaptados (Bell, Settings)
- Padding y espaciado responsive
- Navegación táctil mejorada
- Separador visual antes del logout
- Cierre automático del menú al navegar

🎨 Diseño responsive:
- Desktop (>968px): Menu horizontal + logout visible en header
- Tablet (<968px): Menu hamburguesa + logout en menú desplegable
- Mobile (<480px): Ultra compacto + menú desplegable completo

🔧 Cambios técnicos:
- useState para controlar apertura/cierre del menú móvil
- Media queries optimizadas para 3 breakpoints
- Position fixed para imagen de fondo en toda la pantalla
- Backdrop blur en menú desplegable para mejor legibilidad"

# Push al repositorio
git push origin main

echo ""
echo "✅ Cambios subidos correctamente a GitHub"
echo "📦 Repositorio: https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git"
echo ""
echo "🌐 Siguiente paso: Deploy en servidor"
echo "   ssh root@94.143.141.241"
echo "   cd /var/www/bamroyalties"
echo "   ./deploy-quick.sh"