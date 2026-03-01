import { Outlet, useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  FileText, 
  Upload, 
  DollarSign,
  Package,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => void;
}

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/artists', icon: Users, label: 'Artistas' },
    { path: '/catalog', icon: Music, label: 'Catálogo' },
    { path: '/contracts', icon: FileText, label: 'Contratos' },
    { path: '/upload', icon: Upload, label: 'Subir CSV' },
    { path: '/finances', icon: DollarSign, label: 'Finanzas' },
    { path: '/physical-sales', icon: Package, label: 'Ventas Físicas' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1f23 0%, #1a2e35 100%)'
    }}>
      {/* Header Horizontal */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(30, 47, 47, 0.95) 0%, rgba(20, 35, 35, 0.98) 100%)',
        borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}>
          {/* Logo */}
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#c9a574',
            letterSpacing: '2px',
            textShadow: '0 0 20px rgba(201, 165, 116, 0.3)'
          }}>
            BIGARTIST
          </div>

          {/* Menu Items Horizontal */}
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
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
                    padding: '10px 20px',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(201, 165, 116, 0.25) 0%, rgba(201, 165, 116, 0.15) 100%)'
                      : 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '3px solid #c9a574' : '3px solid transparent',
                    color: isActive ? '#c9a574' : '#AFB3B7',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderRadius: '8px 8px 0 0',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                      e.currentTarget.style.color = '#c9a574';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#AFB3B7';
                    }
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '32px'
      }}>
        <Outlet />
      </div>
    </div>
  );
}