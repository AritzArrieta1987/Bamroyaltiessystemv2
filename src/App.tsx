import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router';
import LoginPanel from './components/LoginPanel';
import AdminLayout from './components/AdminLayout';
import { Toaster } from './components/Toaster';
import { HomePage } from './pages/HomePage';
import { ArtistsPage } from './pages/ArtistsPage';
import { CatalogPage } from './pages/CatalogPage';
import { AddTrackPage } from './pages/AddTrackPage';
import { ContractsPage } from './pages/ContractsPage';
import { UploadPage } from './pages/UploadPage';
import { FinancesPage } from './pages/FinancesPage';
import { PhysicalSalesPage } from './pages/PhysicalSalesPage';
import { ArtistPortalPage } from './pages/ArtistPortalPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🎨 DEMO MODE: Si estamos en Figma Make preview, saltar login
    const isDemoMode = window.location.hostname.includes('figma') || window.location.hostname === 'localhost';
    
    if (isDemoMode) {
      setIsLoggedIn(true);
      setIsLoading(false);
      return;
    }
    
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    // Forzar navegación al home
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1e2f3f'
      }}>
        <div style={{ color: '#c9a574', fontSize: '18px' }}>Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLogin} />;
  }

  // ✅ Crear router con todas las rutas DESPUÉS del login
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AdminLayout onLogout={handleLogout} />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "artists", element: <ArtistsPage /> },
        { path: "catalog", element: <CatalogPage /> },
        { path: "add-track", element: <AddTrackPage /> },
        { path: "contracts", element: <ContractsPage /> },
        { path: "upload", element: <UploadPage /> },
        { path: "finances", element: <FinancesPage /> },
        { path: "physical-sales", element: <PhysicalSalesPage /> },
        { path: "artist-portal/:artistId", element: <ArtistPortalPage /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;