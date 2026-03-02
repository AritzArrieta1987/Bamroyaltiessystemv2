import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import LoginPanel from './imports/login-panel';
import { Toaster } from './components/Toaster';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Mostrar loading mientras verifica la sesión
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0D1F23',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: '#c9a574',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Cargando...
        </div>
      </div>
    );
  }

  // Mostrar LoginPanel si no está autenticado
  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLoginSuccess} />;
  }

  // Mostrar la aplicación completa con router
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
