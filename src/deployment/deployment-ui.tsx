// Para acceder a esta interfaz de despliegue en el futuro:
// 1. Importa este archivo en tu App.tsx
// 2. O crea una ruta /deployment en tu aplicación

import { useState } from 'react';
import { SSLSetup } from './SSLSetup';
import { VerifySetup } from './VerifySetup';
import { DeployApp } from './DeployApp';
import { Shield, Activity, Rocket } from 'lucide-react';

export function DeploymentUI() {
  const [activeView, setActiveView] = useState<'verify' | 'ssl' | 'deploy'>('deploy');

  return (
    <div>
      {/* Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveView('verify')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === 'verify'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              Verificar Instalación
            </button>
            <button
              onClick={() => setActiveView('ssl')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === 'ssl'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              Configurar SSL
            </button>
            <button
              onClick={() => setActiveView('deploy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeView === 'deploy'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Rocket className="w-4 h-4" />
              Desplegar App
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeView === 'verify' && <VerifySetup />}
      {activeView === 'ssl' && <SSLSetup />}
      {activeView === 'deploy' && <DeployApp />}
    </div>
  );
}
