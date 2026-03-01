import { useState } from 'react';
import { Terminal, Copy, CheckCircle, Rocket, Upload } from 'lucide-react';

export function DeployApp() {
  const [copied, setCopied] = useState(false);

  const deployScript = `#!/bin/bash
# Script de despliegue BIGARTIST
# Ejecutar DENTRO del servidor en /root/bigartist-app
# Este script hace build y despliega la aplicación

set -e  # Detener si hay errores

echo "🚀 BIGARTIST - Despliegue de Aplicación"
echo "========================================"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json no encontrado"
    echo "   Asegúrate de estar en /root/bigartist-app"
    exit 1
fi

echo "📂 Directorio actual: $(pwd)"
echo ""

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Hacer build de producción
echo "🔨 Construyendo aplicación..."
npm run build

# 3. Verificar que existe el directorio dist
if [ ! -d "dist" ]; then
    echo "❌ Error: directorio dist no fue creado"
    echo "   El build falló"
    exit 1
fi

echo "✅ Build completado"
echo ""

# 4. Limpiar directorio de destino
echo "🧹 Limpiando directorio de publicación..."
rm -rf /var/www/bigartist/*

# 5. Copiar archivos al servidor web
echo "📤 Copiando archivos a /var/www/bigartist..."
cp -r dist/* /var/www/bigartist/

# 6. Ajustar permisos
echo "🔐 Ajustando permisos..."
chown -R www-data:www-data /var/www/bigartist
chmod -R 755 /var/www/bigartist

# 7. Recargar Nginx
echo "🔄 Recargando Nginx..."
nginx -t && systemctl reload nginx

echo ""
echo "✅ ¡Despliegue completado exitosamente!"
echo "========================================"
echo "🌐 Tu aplicación está disponible en:"
echo "   http://app.bigartist.es"
if [ -d "/etc/letsencrypt/live/app.bigartist.es" ]; then
    echo "   https://app.bigartist.es"
fi
echo ""
echo "📊 Archivos desplegados:"
ls -lah /var/www/bigartist | head -10
echo "========================================"`;

  const copyScript = () => {
    const textArea = document.createElement('textarea');
    textArea.value = deployScript;
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

  const steps = [
    {
      title: 'Subir tu código al servidor',
      description: 'Hay varias opciones:',
      options: [
        {
          name: 'Opción 1: Git (Recomendado)',
          commands: [
            'ssh root@94.143.141.241',
            'cd /root/bigartist-app',
            'git clone https://github.com/tu-usuario/bigartist-app.git .',
            '# O si ya existe el repo: git pull'
          ]
        },
        {
          name: 'Opción 2: SCP (desde tu ordenador local)',
          commands: [
            '# Desde tu ordenador local (no en el servidor):',
            'scp -r ./tu-proyecto/* root@94.143.141.241:/root/bigartist-app/'
          ]
        },
        {
          name: 'Opción 3: SFTP/FileZilla',
          commands: [
            'Host: 94.143.141.241',
            'User: root',
            'Port: 22',
            'Subir archivos a: /root/bigartist-app'
          ]
        }
      ]
    },
    {
      title: 'Crear el script de despliegue',
      commands: [
        'ssh root@94.143.141.241',
        'nano /root/bigartist-app/deploy.sh',
        '# Pega el script de abajo',
        'chmod +x /root/bigartist-app/deploy.sh'
      ]
    },
    {
      title: 'Ejecutar el despliegue',
      commands: [
        'cd /root/bigartist-app',
        './deploy.sh'
      ],
      info: 'El script instalará dependencias, hará el build y desplegará automáticamente'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Rocket className="w-10 h-10 text-purple-500" />
            <h1 className="text-4xl font-bold text-white">Desplegar Aplicación</h1>
          </div>
          <p className="text-slate-400">Sube tu código y despliega BIGARTIST en producción</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <Upload className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-slate-300">React/Vite → app.bigartist.es</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                  {step.description && (
                    <p className="text-slate-400 mb-3">{step.description}</p>
                  )}
                  
                  {step.options ? (
                    <div className="space-y-4">
                      {step.options.map((option, optIdx) => (
                        <div key={optIdx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                          <h3 className="font-bold text-green-400 mb-2">{option.name}</h3>
                          <div className="space-y-1">
                            {option.commands.map((cmd, cmdIdx) => (
                              <code key={cmdIdx} className={`block text-xs px-3 py-2 rounded ${
                                cmd.startsWith('#') 
                                  ? 'text-slate-500 bg-slate-950/50' 
                                  : 'text-green-400 bg-slate-950'
                              }`}>
                                {cmd}
                              </code>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <div className="space-y-1 mb-3">
                        {step.commands?.map((cmd, cmdIdx) => (
                          <code key={cmdIdx} className={`block text-xs px-3 py-2 rounded ${
                            cmd.startsWith('#') 
                              ? 'text-slate-500 bg-slate-950/50' 
                              : 'text-green-400 bg-slate-950'
                          }`}>
                            {cmd}
                          </code>
                        ))}
                      </div>
                      {step.info && (
                        <p className="text-sm text-blue-400 mt-2">💡 {step.info}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deploy Script */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-white">Script de Despliegue (deploy.sh)</h2>
            </div>
            <button
              onClick={copyScript}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
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
              {deployScript}
            </pre>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/50">
          <h3 className="text-xl font-bold text-white mb-3">📝 Notas importantes</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <p>El script debe ejecutarse <strong>DENTRO</strong> del servidor en el directorio <code className="bg-slate-900 px-2 py-1 rounded text-green-400">/root/bigartist-app</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <p>Asegúrate de que tu proyecto React/Vite tenga configurado <code className="bg-slate-900 px-2 py-1 rounded text-green-400">npm run build</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <p>El build se guarda en <code className="bg-slate-900 px-2 py-1 rounded text-green-400">dist/</code> y se copia automáticamente a <code className="bg-slate-900 px-2 py-1 rounded text-green-400">/var/www/bigartist</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <p>Cada vez que hagas cambios, solo necesitas ejecutar <code className="bg-slate-900 px-2 py-1 rounded text-green-400">./deploy.sh</code> de nuevo</p>
            </div>
          </div>
        </div>

        {/* Quick Deploy */}
        <div className="mt-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-700/50">
          <h3 className="text-xl font-bold text-white mb-3">⚡ Despliegue rápido (todo en uno)</h3>
          <p className="text-slate-300 text-sm mb-3">Si ya tienes tu código en el servidor, ejecuta esto:</p>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
            <code className="text-sm text-green-400 font-mono">
              ssh root@94.143.141.241 "cd /root/bigartist-app && npm install && npm run build && rm -rf /var/www/bigartist/* && cp -r dist/* /var/www/bigartist/ && chown -R www-data:www-data /var/www/bigartist && systemctl reload nginx"
            </code>
          </div>
          <p className="text-slate-400 text-xs mt-2">💡 Este comando hace todo el proceso en una sola línea desde tu ordenador local</p>
        </div>
      </div>
    </div>
  );
}
