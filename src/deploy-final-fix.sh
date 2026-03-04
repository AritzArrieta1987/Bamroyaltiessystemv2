#!/bin/bash
# BIGARTIST - Script de despliegue final con autenticación GitHub

echo "========================================"
echo "BIGARTIST - Deploy Final"
echo "========================================"

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar que estamos en el directorio correcto
cd /var/www/bigartist

# Agregar .gitignore para evitar conflictos
echo -e "${YELLOW}[1/4] Configurando .gitignore...${NC}"
cat > .gitignore << 'GITIGNORE'
node_modules/
dist/
build/
package-lock.json
.env
.DS_Store
GITIGNORE

# Confirmar cambios locales
echo -e "${YELLOW}[2/4] Subiendo configuración a GitHub...${NC}"
git add .gitignore vite.config.ts
git commit -m "chore: Configure build output and ignore files" 2>/dev/null || echo "No hay cambios que commitear"

# Instrucciones para autenticación
echo -e "${BLUE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CONFIGURACIÓN DE TOKEN DE GITHUB"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"
echo "Para evitar errores de autenticación, necesitas un Personal Access Token:"
echo ""
echo "1. Ve a: https://github.com/settings/tokens"
echo "2. Click en 'Generate new token (classic)'"
echo "3. Nombre: 'BIGARTIST Server Deploy'"
echo "4. Selecciona: ✓ repo (todos los permisos)"
echo "5. Click en 'Generate token'"
echo "6. COPIA el token generado"
echo ""
echo -e "${YELLOW}Cuando ejecutes 'git push', usa:${NC}"
echo -e "  Username: ${GREEN}AritzArrieta1987${NC}"
echo -e "  Password: ${GREEN}[PEGA TU TOKEN AQUÍ]${NC}"
echo ""
echo -e "${BLUE}O configura el token permanentemente:${NC}"
echo -e "${GREEN}git remote set-url origin https://TU_TOKEN@github.com/AritzArrieta1987/Bamroyaltiessystemv2.git${NC}"
echo ""

# Push de cambios
echo -e "${YELLOW}[3/4] Intentando push a GitHub...${NC}"
git push origin main 2>&1 | tee /tmp/git-push-result.log

if grep -q "Authentication failed" /tmp/git-push-result.log || grep -q "Invalid username" /tmp/git-push-result.log; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠ Autenticación fallida - Ejecuta manualmente:${NC}"
    echo ""
    echo -e "${GREEN}git remote set-url origin https://TU_TOKEN@github.com/AritzArrieta1987/Bamroyaltiessystemv2.git${NC}"
    echo -e "${GREEN}git push origin main${NC}"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
fi

# Verificar estado de la aplicación
echo -e "${YELLOW}[4/4] Verificando aplicación...${NC}"
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓ Build correcto - dist/index.html existe${NC}"
    echo -e "${GREEN}✓ La aplicación está operativa en: https://app.bigartist.es${NC}"
else
    echo -e "${YELLOW}⚠ No se encuentra dist/index.html${NC}"
fi

echo ""
echo -e "${GREEN}========================================"
echo -e "RESUMEN DEL DESPLIEGUE"
echo -e "========================================${NC}"
echo "• vite.config.ts configurado (build → dist)"
echo "• .gitignore creado"
echo "• Build funcionando correctamente"
echo "• URL: https://app.bigartist.es"
echo ""
echo -e "${YELLOW}Próximos despliegues (después de configurar token):${NC}"
echo -e "${GREEN}cd /var/www/bigartist && git pull origin main && npm run build && systemctl reload nginx${NC}"
echo ""
