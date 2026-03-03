import { useState } from 'react';
import { login } from '../utils/api';

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || response.user.email,
          type: response.user.role || 'admin'
        }));
        
        onLoginSuccess();
      } else {
        throw new Error('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#0D1F23'
    }} className="login-container">
      {/* OVERLAY VERDE */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.95) 0%, rgba(19, 46, 53, 0.9) 50%, rgba(45, 74, 83, 0.85) 100%)',
        zIndex: 1
      }} />

      {/* LADO IZQUIERDO - Logo y branding */}
      <div className="left-panel" style={{
        position: 'relative',
        width: '55%',
        overflow: 'hidden',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          width: '80%'
        }}>
          <div style={{
            color: '#c9a574',
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            letterSpacing: '4px'
          }}>
            BIGARTIST
          </div>
          
          <div style={{
            width: '100px',
            height: '1.5px',
            background: 'linear-gradient(to right, transparent, #c9a574, transparent)',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 10px rgba(201, 165, 116, 0.5)'
          }} />

          <div style={{
            color: '#c9a574',
            fontSize: '22px',
            fontWeight: '300',
            letterSpacing: '5px',
            textTransform: 'uppercase'
          }}>
            ROYALTIES SYSTEM
          </div>
        </div>
      </div>

      {/* LADO DERECHO - Formulario de login */}
      <div className="right-panel" style={{
        position: 'relative',
        width: '45%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        overflow: 'hidden',
        zIndex: 2
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Admin Panel
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#AFB3B7',
              fontWeight: '400'
            }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '14px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#AFB3B7',
                marginBottom: '10px',
                letterSpacing: '0.3px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bigartist.es"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
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

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#AFB3B7',
                marginBottom: '10px',
                letterSpacing: '0.3px'
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 16px',
                    fontSize: '15px',
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
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
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#69818D',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#c9a574'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#69818D'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#0D1F23',
                background: isLoading ? 'rgba(201, 165, 116, 0.5)' : 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                marginBottom: '16px',
                opacity: isLoading ? 0.6 : 1
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

          <div style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(175, 179, 183, 0.2)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#69818D',
              fontWeight: '400'
            }}>
              © 2026 Big Artist Management S.L.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .login-container {
            flex-direction: column !important;
          }

          .left-panel {
            width: 100% !important;
            min-height: 35vh !important;
          }

          .right-panel {
            width: 100% !important;
            min-height: 65vh !important;
            padding: 40px 30px !important;
          }
        }

        @media (max-width: 480px) {
          .right-panel {
            padding: 30px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
