import { useState } from 'react';
import { login } from '../utils/api';
import bgImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';

// Iconos SVG inline
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

interface LoginPanelProps {
  onLoginSuccess: () => void;
}

export default function LoginPanel({ onLoginSuccess }: LoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('');

    try {
      setDebugInfo('🔄 Conectando al servidor...');
      console.log('🔐 Intentando login con:', email);
      
      // Llamada al backend para validar credenciales
      const response = await login(email, password);
      
      console.log('📥 Respuesta del backend:', response);
      setDebugInfo('✅ Respuesta recibida del servidor');

      // El backend devuelve { token, user } directamente cuando es exitoso
      if (response.token && response.user) {
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          type: response.user.type
        }));
        
        setDebugInfo('✅ Credenciales válidas, redirigiendo...');
        console.log('✅ Login exitoso, token guardado');
        onLoginSuccess();
      } else {
        throw new Error('Respuesta del servidor inválida');
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      setError(errorMessage);
      setDebugInfo('❌ Error: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Imagen de fondo completa */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.88) 0%, rgba(19, 46, 53, 0.85) 50%, rgba(45, 74, 83, 0.82) 100%)'
        }}
      />

      {/* Contenedor principal */}
      <div className="relative h-full min-h-screen flex flex-col lg:flex-row">
        {/* LADO IZQUIERDO - Logo y branding (oculto en móvil) */}
        <div className="hidden lg:flex lg:w-[55%] items-center justify-center">
          <div className="text-center w-4/5">
            {/* Logo de BIGARTIST */}
            <img 
              src={logoImage} 
              alt="BIGARTIST Logo" 
              className="w-full max-w-[600px] h-auto mb-3 mx-auto"
              style={{ filter: 'drop-shadow(0 0 30px rgba(201, 165, 116, 0.4))' }}
            />
            
            <div 
              className="w-[200px] h-0.5 mx-auto mb-3"
              style={{
                background: 'linear-gradient(to right, transparent, #c9a574, transparent)',
                boxShadow: '0 0 10px rgba(201, 165, 116, 0.5)'
              }}
            />

            <div 
              className="text-2xl font-light tracking-[4px] uppercase"
              style={{
                color: '#c9a574',
                textShadow: '0 0 20px rgba(201, 165, 116, 0.3)'
              }}
            >
              Royalties System
            </div>
          </div>
        </div>

        {/* LADO DERECHO - Formulario de login */}
        <div className="flex-1 lg:w-[45%] flex items-center justify-center px-6 py-8 sm:px-12 sm:py-12 lg:px-[60px]">
          <div className="w-full max-w-[440px]">
            {/* Logo móvil (visible solo en móvil) */}
            <div className="lg:hidden text-center mb-10">
              <img 
                src={logoImage} 
                alt="BIGARTIST Logo" 
                className="w-full max-w-[240px] sm:max-w-[280px] h-auto mx-auto mb-4"
                style={{ filter: 'drop-shadow(0 0 20px rgba(201, 165, 116, 0.4))' }}
              />
              <div 
                className="text-base sm:text-lg font-light tracking-[3px] uppercase"
                style={{
                  color: '#c9a574',
                  textShadow: '0 0 15px rgba(201, 165, 116, 0.3)'
                }}
              >
                Royalties System
              </div>
            </div>

            {/* Header del formulario */}
            <div className="mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                Admin Panel
              </h2>
              <p className="text-sm sm:text-base text-[#AFB3B7] font-normal">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin}>
              {error && (
                <div 
                  className="flex items-center gap-2.5 p-3.5 rounded-lg text-sm mb-6"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    color: '#fca5a5'
                  }}
                >
                  <span className="text-lg">⚠️</span>
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#AFB3B7] mb-2.5 tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  required
                  className="w-full px-4 py-3.5 text-sm sm:text-base text-white font-medium rounded-lg outline-none transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(201, 165, 116, 0.3)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c9a574';
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                  }}
                />
              </div>

              {/* Contraseña */}
              <div className="mb-7">
                <label className="block text-sm font-semibold text-[#AFB3B7] mb-2.5 tracking-wide">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    required
                    className="w-full pl-4 pr-12 py-3.5 text-sm sm:text-base text-white font-medium rounded-lg outline-none transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      border: '2px solid rgba(201, 165, 116, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#c9a574';
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#69818D] cursor-pointer p-1 flex items-center transition-colors duration-200 hover:text-[#c9a574]"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {/* Botón de login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-4 text-sm sm:text-base font-semibold text-[#0D1F23] border-none rounded-lg cursor-pointer tracking-wider uppercase transition-all duration-300"
                style={{
                  background: isLoading ? 'rgba(201, 165, 116, 0.5)' : 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
                  boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
                  }
                }}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 lg:mt-10 pt-6 border-t border-[#AFB3B7]/20 text-center">
              <p className="text-xs sm:text-sm text-[#69818D] font-normal">
                © 2026 Big Artist Management S.L.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}