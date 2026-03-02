import { Outlet, useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  FileText, 
  Upload, 
  DollarSign,
  Package,
  LogOut,
  Bell,
  Settings,
  Menu,
  X
} from 'lucide-react';
import bgImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/artists', icon: Users, label: 'Artistas' },
    { path: '/catalog', icon: Music, label: 'Catálogo' },
    { path: '/finances', icon: DollarSign, label: 'Finanzas' },
    { path: '/contracts', icon: FileText, label: 'Contratos' },
    { path: '/upload', icon: Upload, label: 'Subir CSV' },
  ];

  return (
    <div style={{ 
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Imagen de fondo completa - ajustada para móvil */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0
      }} />
      
      {/* Overlay oscuro */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.88) 0%, rgba(19, 46, 53, 0.85) 50%, rgba(45, 74, 83, 0.82) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 1
      }} />

      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header Horizontal */}
        <div style={{
          background: 'transparent',
          borderBottom: '1px solid rgba(100, 150, 160, 0.1)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div className="header-container" style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px'
          }}>
            {/* Logo */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              minWidth: '150px'
            }}>
              <img 
                src={logoImage} 
                alt="BIGARTIST Logo" 
                className="logo-img"
                style={{ 
                  height: '40px',
                  width: 'auto'
                }} 
              />
            </div>

            {/* Menu Items Horizontal - Desktop */}
            <nav className="desktop-nav" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              flex: 1,
              justifyContent: 'center'
            }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      background: isActive 
                        ? 'rgba(212, 165, 116, 0.15)'
                        : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: isActive ? '#d4a574' : '#8b9299',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(212, 165, 116, 0.08)';
                        e.currentTarget.style.color = '#d4a574';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#8b9299';
                      }
                    }}
                  >
                    <Icon size={18} />
                    <span className="menu-label">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Side Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                className="action-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(212, 165, 116, 0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4a574',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)'}
              >
                <Bell size={18} />
              </button>
              <button
                className="action-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(212, 165, 116, 0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4a574',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)'}
              >
                <Settings size={18} />
              </button>
              <button
                onClick={handleLogout}
                className="logout-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <LogOut size={18} />
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-btn"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(212, 165, 116, 0.1)',
                  border: 'none',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4a574',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="mobile-menu" style={{
              background: 'rgba(13, 31, 35, 0.98)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(100, 150, 160, 0.1)',
              padding: '16px'
            }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      marginBottom: '8px',
                      background: isActive 
                        ? 'rgba(212, 165, 116, 0.15)'
                        : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: isActive ? '#d4a574' : '#8b9299',
                      fontSize: '15px',
                      fontWeight: isActive ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Separador */}
              <div style={{
                height: '1px',
                background: 'rgba(100, 150, 160, 0.1)',
                margin: '12px 0'
              }} />
              
              {/* Botón Logout en menu móvil */}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ 
          flex: 1,
          maxWidth: '1600px',
          width: '100%',
          margin: '0 auto',
          padding: '32px 20px'
        }}>
          <Outlet />
        </div>
      </div>

      {/* Estilos Responsive */}
      <style>{`
        /* Tablet y móvil */
        @media (max-width: 968px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: flex !important;
          }
          
          .header-container {
            padding: 0 16px !important;
            height: 60px !important;
          }
          
          .logo-img {
            height: 35px !important;
          }
          
          .action-btn {
            width: 36px !important;
            height: 36px !important;
          }
          
          .logout-btn {
            display: none !important;
          }
          
          .main-content {
            padding: 24px 16px !important;
          }
        }

        /* Móvil pequeño */
        @media (max-width: 480px) {
          .header-container {
            padding: 0 12px !important;
          }
          
          .logo-img {
            height: 30px !important;
          }
          
          .action-btn {
            width: 32px !important;
            height: 32px !important;
          }
          
          .mobile-menu-btn {
            width: 36px !important;
            height: 36px !important;
          }
          
          .main-content {
            padding: 20px 12px !important;
          }
        }

        /* Desktop grande */
        @media (min-width: 969px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}