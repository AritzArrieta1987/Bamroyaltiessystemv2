#!/bin/bash
# BIGARTIST - Update LoginPanel Directo
# Copia y pega este comando completo en tu SSH

cd /root/Bamroyaltiessystemv2 && \
git pull origin main && \
mkdir -p imports && \
cat > imports/login-panel.tsx << 'ENDFILE'
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">BIGARTIST</h1>
          <p className="text-green-200 text-lg">Royalties System</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-green-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {error && (
              <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-green-900 font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

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
ENDFILE

echo "✓ Archivo creado" && \
git add imports/login-panel.tsx && \
git commit -m "Fix: LoginPanel corrected" && \
git push origin main && \
echo "✓ Push a GitHub OK" && \
cd /var/www/bigartist && \
git pull origin main && \
echo "✓ Pull en producción OK" && \
npm run build && \
echo "✓ Build completado" && \
systemctl reload nginx && \
echo "" && \
echo "========================================" && \
echo "✓✓✓ ACTUALIZACIÓN COMPLETADA ✓✓✓" && \
echo "========================================" && \
echo "URL: https://app.bigartist.es" && \
echo ""
