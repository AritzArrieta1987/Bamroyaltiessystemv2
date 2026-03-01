import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import LoginPanel from './components/LoginPanel';
import AdminLayout from './components/AdminLayout';
import { HomePage } from './pages/HomePage';
import { ArtistsPage } from './pages/ArtistsPage';
import { CatalogPage } from './pages/CatalogPage';
import { ContractsPage } from './pages/ContractsPage';
import { UploadPage } from './pages/UploadPage';
import { FinancesPage } from './pages/FinancesPage';
import { PhysicalSalesPage } from './pages/PhysicalSalesPage';
import { ArtistPortalPage } from './pages/ArtistPortalPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0d1f23'
      }}>
        <div style={{ color: '#c9a574', fontSize: '18px' }}>Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLogin} />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AdminLayout onLogout={handleLogout} />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "artists", element: <ArtistsPage /> },
        { path: "catalog", element: <CatalogPage /> },
        { path: "contracts", element: <ContractsPage /> },
        { path: "upload", element: <UploadPage /> },
        { path: "finances", element: <FinancesPage /> },
        { path: "physical-sales", element: <PhysicalSalesPage /> },
        { path: "artist-portal", element: <ArtistPortalPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
