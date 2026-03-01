import { useState } from 'react';
import { Terminal, Copy, CheckCircle, Activity } from 'lucide-react';

export function VerifySetup() {
  const [copied, setCopied] = useState(false);

  const verifyScript = `#!/bin/bash
# Script de verificación BIGARTIST
# Comprueba que todo esté instalado correctamente
# Ejecutar como root en el servidor 94.143.141.241

echo "🔍 BIGARTIST - Verificación de Instalación"
echo "==========================================="
echo ""

# Función para checkear
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1 - ERROR"
    fi
}

# 1. Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js instalado: $NODE_VERSION"
else
    echo "❌ Node.js NO instalado"
fi

# 2. Verificar NPM
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ NPM instalado: $NPM_VERSION"
else
    echo "❌ NPM NO instalado"
fi

echo ""

# 3. Verificar Nginx
echo "🌐 Verificando Nginx..."
if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d '/' -f 2)
    echo "✅ Nginx instalado: $NGINX_VERSION"
    
    # Estado del servicio
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx está CORRIENDO"
    else
        echo "❌ Nginx está DETENIDO"
    fi
    
    # Verificar configuración
    if nginx -t &> /dev/null; then
        echo "✅ Configuración de Nginx es VÁLIDA"
    else
        echo "⚠️  Configuración de Nginx tiene ERRORES"
    fi
else
    echo "❌ Nginx NO instalado"
fi

echo ""

# 4. Verificar MySQL
echo "🗄️  Verificando MySQL..."
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version | awk '{print $3}')
    echo "✅ MySQL instalado: $MYSQL_VERSION"
    
    # Estado del servicio
    if systemctl is-active --quiet mysql; then
        echo "✅ MySQL está CORRIENDO"
    else
        echo "❌ MySQL está DETENIDO"
    fi
    
    # Verificar base de datos
    if mysql -uroot -p'BigArtist2018!@?' -e "USE bigartist;" 2>/dev/null; then
        echo "✅ Base de datos 'bigartist' EXISTE"
    else
        echo "❌ Base de datos 'bigartist' NO existe"
    fi
else
    echo "❌ MySQL NO instalado"
fi

echo ""

# 5. Verificar Git
echo "📚 Verificando herramientas..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo "✅ Git instalado: $GIT_VERSION"
else
    echo "❌ Git NO instalado"
fi

# Verificar curl, wget, unzip
command -v curl &> /dev/null && echo "✅ curl instalado" || echo "❌ curl NO instalado"
command -v wget &> /dev/null && echo "✅ wget instalado" || echo "❌ wget NO instalado"
command -v unzip &> /dev/null && echo "✅ unzip instalado" || echo "❌ unzip NO instalado"

echo ""

# 6. Verificar directorios
echo "📂 Verificando directorios..."
if [ -d "/root/bigartist-app" ]; then
    echo "✅ Directorio /root/bigartist-app existe"
else
    echo "❌ Directorio /root/bigartist-app NO existe"
fi

if [ -d "/var/www/bigartist" ]; then
    echo "✅ Directorio /var/www/bigartist existe"
    OWNER=$(stat -c '%U:%G' /var/www/bigartist)
    echo "   Propietario: $OWNER"
else
    echo "❌ Directorio /var/www/bigartist NO existe"
fi

echo ""

# 7. Verificar configuración Nginx del sitio
echo "⚙️  Verificando configuración del sitio..."
if [ -f "/etc/nginx/sites-available/bigartist" ]; then
    echo "✅ Archivo de configuración existe"
else
    echo "❌ Archivo de configuración NO existe"
fi

if [ -L "/etc/nginx/sites-enabled/bigartist" ]; then
    echo "✅ Sitio está HABILITADO"
else
    echo "❌ Sitio NO está habilitado"
fi

echo ""

# 8. Verificar puertos
echo "🔌 Verificando puertos..."
if ss -tuln | grep -q ':80 '; then
    echo "✅ Puerto 80 (HTTP) está ABIERTO"
else
    echo "❌ Puerto 80 (HTTP) está CERRADO"
fi

if ss -tuln | grep -q ':443 '; then
    echo "✅ Puerto 443 (HTTPS) está ABIERTO"
else
    echo "⚠️  Puerto 443 (HTTPS) está CERRADO (normal si no hay SSL aún)"
fi

if ss -tuln | grep -q ':3306 '; then
    echo "✅ Puerto 3306 (MySQL) está ABIERTO"
else
    echo "❌ Puerto 3306 (MySQL) está CERRADO"
fi

echo ""

# 9. Verificar SSL (si existe)
echo "🔒 Verificando SSL..."
if [ -d "/etc/letsencrypt/live/app.bigartist.es" ]; then
    echo "✅ Certificado SSL instalado para app.bigartist.es"
    CERT_EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/app.bigartist.es/cert.pem | cut -d= -f2)
    echo "   Expira: $CERT_EXPIRY"
else
    echo "⚠️  No hay certificado SSL (ejecuta setup-ssl.sh)"
fi

echo ""

# 10. Verificar conectividad DNS
echo "🌍 Verificando DNS..."
DOMAIN_IP=$(dig +short app.bigartist.es | tail -n1)
SERVER_IP="94.143.141.241"

if [ "$DOMAIN_IP" == "$SERVER_IP" ]; then
    echo "✅ DNS configurado correctamente"
    echo "   app.bigartist.es → $DOMAIN_IP"
else
    echo "⚠️  DNS puede no estar propagado"
    echo "   app.bigartist.es → $DOMAIN_IP (esperado: $SERVER_IP)"
fi

echo ""

# 11. Verificar archivo de credenciales
echo "🔐 Verificando credenciales..."
if [ -f "/root/.bigartist-credentials" ]; then
    echo "✅ Archivo de credenciales existe"
else
    echo "❌ Archivo de credenciales NO existe"
fi

echo ""
echo "==========================================="
echo "📊 RESUMEN"
echo "==========================================="

# Contador de checks exitosos
TOTAL=0
SUCCESS=0

# Node.js
TOTAL=$((TOTAL+1))
command -v node &> /dev/null && SUCCESS=$((SUCCESS+1))

# NPM
TOTAL=$((TOTAL+1))
command -v npm &> /dev/null && SUCCESS=$((SUCCESS+1))

# Nginx
TOTAL=$((TOTAL+1))
systemctl is-active --quiet nginx && SUCCESS=$((SUCCESS+1))

# MySQL
TOTAL=$((TOTAL+1))
systemctl is-active --quiet mysql && SUCCESS=$((SUCCESS+1))

# Directorios
TOTAL=$((TOTAL+2))
[ -d "/root/bigartist-app" ] && SUCCESS=$((SUCCESS+1))
[ -d "/var/www/bigartist" ] && SUCCESS=$((SUCCESS+1))

# Configuración Nginx
TOTAL=$((TOTAL+1))
[ -f "/etc/nginx/sites-available/bigartist" ] && SUCCESS=$((SUCCESS+1))

PERCENTAGE=$((SUCCESS * 100 / TOTAL))

echo ""
echo "✅ Componentes verificados: $SUCCESS de $TOTAL ($PERCENTAGE%)"
echo ""

if [ $PERCENTAGE -eq 100 ]; then
    echo "🎉 ¡Todo está instalado correctamente!"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "   1. Si no tienes SSL, ejecuta: /root/setup-ssl.sh"
    echo "   2. Sube tu código a: /root/bigartist-app"
    echo "   3. Ejecuta: cd /root/bigartist-app && npm install && npm run build"
    echo "   4. Copia el build: cp -r dist/* /var/www/bigartist/"
elif [ $PERCENTAGE -ge 70 ]; then
    echo "⚠️  Instalación casi completa, revisa los errores arriba"
else
    echo "❌ Faltan componentes importantes, ejecuta el script de instalación"
fi

echo "==========================================="`;

  const copyScript = () => {
    const textArea = document.createElement('textarea');
    textArea.value = verifyScript;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
      textArea.remove();
    }
  };

  const checks = [
    { name: 'Node.js & NPM', icon: '📦' },
    { name: 'Nginx (servidor web)', icon: '🌐' },
    { name: 'MySQL (base de datos)', icon: '🗄️' },
    { name: 'Git & herramientas', icon: '📚' },
    { name: 'Directorios', icon: '📂' },
    { name: 'Configuración Nginx', icon: '⚙️' },
    { name: 'Puertos abiertos', icon: '🔌' },
    { name: 'Certificado SSL', icon: '🔒' },
    { name: 'DNS del dominio', icon: '🌍' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Verificación del Servidor</h1>
          </div>
          <p className="text-slate-400">Comprueba que todo esté instalado correctamente</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">94.143.141.241 - app.bigartist.es</span>
          </div>
        </div>

        {/* What it checks */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">¿Qué verifica este script?</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {checks.map((check, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{check.icon}</span>
                  <span className="text-sm text-white">{check.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Cómo usar</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">Copiar script</h3>
                  <p className="text-sm text-slate-400">Haz clic en el botón "Copiar Script"</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">Conectar y crear</h3>
                  <code className="block text-xs bg-slate-950 text-green-400 px-2 py-1 rounded mt-1">
                    ssh root@94.143.141.241
                  </code>
                  <code className="block text-xs bg-slate-950 text-green-400 px-2 py-1 rounded mt-1">
                    nano /root/verify.sh
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">Ejecutar</h3>
                  <code className="block text-xs bg-slate-950 text-green-400 px-2 py-1 rounded mt-1">
                    chmod +x /root/verify.sh
                  </code>
                  <code className="block text-xs bg-slate-950 text-green-400 px-2 py-1 rounded mt-1">
                    /root/verify.sh
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Script */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-white">Script de Verificación</h2>
            </div>
            <button
              onClick={copyScript}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Script
                </>
              )}
            </button>
          </div>
          
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-700 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre className="text-sm text-green-400 font-mono">
              {verifyScript}
            </pre>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700/50">
          <h3 className="text-xl font-bold text-white mb-2">💡 Resultado esperado</h3>
          <p className="text-slate-300 text-sm mb-3">
            El script mostrará un resumen detallado de cada componente con ✅ (instalado) o ❌ (falta).
            Al final verás un porcentaje de completitud.
          </p>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <p className="text-sm text-green-400 font-mono">
              ✅ Componentes verificados: 7 de 7 (100%)
              <br />
              🎉 ¡Todo está instalado correctamente!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
