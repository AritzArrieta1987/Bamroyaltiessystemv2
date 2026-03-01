import { useState } from 'react';
import { Terminal, Copy, CheckCircle, Lock, Shield } from 'lucide-react';

export function SSLSetup() {
  const [copied, setCopied] = useState(false);

  const sslScript = `#!/bin/bash
# Script de configuración SSL con Let's Encrypt
# BIGARTIST - app.bigartist.es
# Ejecutar como root en el servidor 94.143.141.241

set -e  # Detener si hay errores

echo "🔒 BIGARTIST - Configuración SSL Let's Encrypt"
echo "=============================================="

# 1. Instalar Certbot
echo "📦 Instalando Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# 2. Obtener certificado SSL
echo "🔐 Obteniendo certificado SSL para app.bigartist.es..."
certbot --nginx -d app.bigartist.es --non-interactive --agree-tos --email admin@bigartist.es --redirect

# 3. Verificar renovación automática
echo "⚙️ Configurando renovación automática..."
systemctl status certbot.timer

# 4. Test de renovación
echo "🧪 Probando renovación automática..."
certbot renew --dry-run

# 5. Verificar configuración de Nginx
echo "✅ Verificando configuración de Nginx..."
nginx -t
systemctl reload nginx

echo ""
echo "✅ ¡SSL Configurado Exitosamente!"
echo "=============================================="
echo "🔒 Certificado SSL:"
echo "   - Dominio: app.bigartist.es"
echo "   - Emisor: Let's Encrypt"
echo "   - Validez: 90 días (se renueva automáticamente)"
echo ""
echo "🌐 Tu sitio ahora está disponible en:"
echo "   https://app.bigartist.es"
echo ""
echo "🔄 Renovación automática configurada"
echo "   Certbot renovará el certificado automáticamente"
echo "=============================================="

# 6. Mostrar estado del certificado
echo ""
echo "📋 Información del certificado:"
certbot certificates`;

  const copyScript = () => {
    const textArea = document.createElement('textarea');
    textArea.value = sslScript;
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

  const instructions = [
    {
      step: 1,
      title: 'Conectar al servidor',
      command: 'ssh root@94.143.141.241',
      description: 'Conéctate vía SSH al servidor',
    },
    {
      step: 2,
      title: 'Crear script SSL',
      command: 'nano /root/setup-ssl.sh',
      description: 'Crea el archivo y pega el script',
    },
    {
      step: 3,
      title: 'Dar permisos',
      command: 'chmod +x /root/setup-ssl.sh',
      description: 'Haz el script ejecutable',
    },
    {
      step: 4,
      title: 'Ejecutar',
      command: '/root/setup-ssl.sh',
      description: 'Instala SSL (toma 1-2 minutos)',
    },
  ];

  const requirements = [
    {
      title: 'DNS configurado',
      status: true,
      description: 'app.bigartist.es debe apuntar a 94.143.141.241',
    },
    {
      title: 'Puerto 80 abierto',
      status: true,
      description: 'Necesario para validación Let\'s Encrypt',
    },
    {
      title: 'Puerto 443 abierto',
      status: true,
      description: 'Para tráfico HTTPS',
    },
    {
      title: 'Nginx instalado',
      status: true,
      description: 'Debe estar corriendo',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-green-500" />
            <h1 className="text-4xl font-bold text-white">Big Artist Management S.L.</h1>
          </div>
          <p className="text-slate-400">Configuración SSL con Let's Encrypt</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <Lock className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-300">HTTPS para app.bigartist.es</span>
          </div>
        </div>

        {/* Requirements Check */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Requisitos Previos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {requirements.map((req, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    req.status ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {req.status ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{req.title}</h3>
                    <p className="text-sm text-slate-400">{req.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Instrucciones</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {instructions.map(instr => (
              <div key={instr.step} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {instr.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">{instr.title}</h3>
                    <code className="block text-xs bg-slate-950 text-green-400 px-3 py-2 rounded mb-2">
                      {instr.command}
                    </code>
                    <p className="text-sm text-slate-400">{instr.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Script */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-white">Script SSL</h2>
            </div>
            <button
              onClick={copyScript}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
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
              {sslScript}
            </pre>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-700/50">
          <h3 className="text-xl font-bold text-white mb-4">¿Qué hace este script?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Instala Certbot (Let's Encrypt)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Obtiene certificado SSL gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Configura HTTPS en Nginx</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Redirección HTTP → HTTPS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Renovación automática del certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Validez: 90 días (auto-renovable)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
