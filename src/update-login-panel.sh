#!/bin/bash

# Script automático para actualizar LoginPanel en BIGARTIST
# Fecha: 3 de marzo 2026

echo "========================================"
echo "BIGARTIST - Actualización LoginPanel"
echo "========================================"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Ir al repositorio GitHub
echo -e "${YELLOW}[1/7] Accediendo al repositorio...${NC}"
cd /root/Bamroyaltiessystemv2 || { echo -e "${RED}Error: No se encuentra el repositorio${NC}"; exit 1; }

# 2. Hacer pull primero por si hay cambios
echo -e "${YELLOW}[2/7] Sincronizando con GitHub...${NC}"
git pull origin main

# 3. Crear carpeta imports si no existe
echo -e "${YELLOW}[3/7] Verificando estructura de carpetas...${NC}"
mkdir -p imports

# 4. Crear el archivo LoginPanel actualizado
echo -e "${YELLOW}[4/7] Creando archivo login-panel.tsx...${NC}"
cat > imports/login-panel.tsx << 'EOF'
import React, { useState } from 'react';

interface LoginPanelProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export function LoginPanel({ onLoginSuccess }: LoginPanelProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || 'Error en el inicio de sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-yellow-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">BIGARTIST</h1>
          <p className="text-green-200 text-lg">Royalties System</p>
        </div>

        {/* Panel de Login */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-green-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-green-100 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-400/30 text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                placeholder="Ingrese su usuario"
                required
                disabled={isLoading}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-green-100 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-green-400/30 text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                placeholder="Ingrese su contraseña"
                required
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-green-900 font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-green-200 text-sm">
              © 2026 BIGARTIST - Royalties System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo -e "${GREEN}✓ Archivo login-panel.tsx creado correctamente${NC}"

# 5. Commit y Push a GitHub
echo -e "${YELLOW}[5/7] Haciendo commit a GitHub...${NC}"
git add imports/login-panel.tsx
git commit -m "Fix: LoginPanel component corrected - removed image import errors"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Cambios enviados a GitHub correctamente${NC}"
else
    echo -e "${RED}✗ Error al hacer push a GitHub${NC}"
    exit 1
fi

# 6. Actualizar producción
echo -e "${YELLOW}[6/7] Actualizando proyecto en producción...${NC}"
cd /var/www/bigartist || { echo -e "${RED}Error: No se encuentra el directorio de producción${NC}"; exit 1; }

git pull origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Código actualizado desde GitHub${NC}"
else
    echo -e "${RED}✗ Error al actualizar desde GitHub${NC}"
    exit 1
fi

# 7. Build del proyecto
echo -e "${YELLOW}[7/7] Compilando proyecto (esto puede tardar un momento)...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completado correctamente${NC}"
else
    echo -e "${RED}✗ Error en el build${NC}"
    exit 1
fi

# Reiniciar Nginx (opcional pero recomendado)
echo -e "${YELLOW}Reiniciando Nginx...${NC}"
systemctl reload nginx

echo ""
echo -e "${GREEN}========================================"
echo -e "✓ ACTUALIZACIÓN COMPLETADA"
echo -e "========================================"
echo -e "La aplicación está lista en: ${YELLOW}https://app.bigartist.es${NC}"
echo ""
