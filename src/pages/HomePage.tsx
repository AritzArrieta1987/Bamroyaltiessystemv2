import { LayoutDashboard, TrendingUp, DollarSign, Users, Music, Calendar, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiRequest, API_ENDPOINTS } from '../utils/api';

interface DashboardData {
  totalRevenue: number;
  totalStreams: number;
  totalArtists: number;
  totalTracks: number;
  totalContracts: number;
  activeContracts: number;
  platforms: { name: string; revenue: number }[];
  territories: { name: string; revenue: number }[];
  periods: { period: string; revenue: number }[];
  topArtists: { id: number; name: string; photo: string | null; totalRevenue: number; totalStreams: number; tracks: any[] }[];
  csvUploads: any[];
}

const COLORS = ['#1DB954', '#FA2D48', '#FF0000', '#c9a574', '#3b82f6', '#a855f7', '#22c55e', '#f59e0b'];

export function HomePage() {
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📊 HomePage: Cargando datos desde API MySQL...');
      
      const [dashRes, contractsRes] = await Promise.allSettled([
        apiRequest(API_ENDPOINTS.DASHBOARD),
        apiRequest(API_ENDPOINTS.CONTRACTS),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.success) {
        setDashData(dashRes.value.data);
        console.log('✅ Dashboard cargado:', dashRes.value.data);
      } else if (dashRes.status === 'rejected') {
        throw new Error(dashRes.reason?.message || 'Error cargando dashboard');
      }

      if (contractsRes.status === 'fulfilled' && contractsRes.value?.success) {
        setContracts(contractsRes.value.data || []);
      }

      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('❌ Error cargando dashboard:', err);
      setError(err.message || 'Error conectando con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Loading state
  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard size={32} color="#c9a574" />
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Resumen general de BIGARTIST ROYALTIES</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#AFB3B7' }}>
          <RefreshCw size={32} color="#c9a574" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p>Cargando datos desde MySQL...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard size={32} color="#c9a574" />
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Resumen general de BIGARTIST ROYALTIES</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(30,47,47,0.8) 100%)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Error conectando con el servidor</h3>
          <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>{error}</p>
          <button onClick={loadDashboard} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)', border: 'none', borderRadius: '10px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!dashData || dashData.totalRevenue === 0) {
    return (
      <div>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard size={32} color="#c9a574" />
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Resumen general de BIGARTIST ROYALTIES</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(42,63,63,0.6) 0%, rgba(30,47,47,0.8) 100%)', border: '1px solid rgba(201,165,116,0.3)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(201,165,116,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <LayoutDashboard size={40} color="#c9a574" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>No hay datos en la base de datos</h2>
          <p style={{ fontSize: '16px', color: '#AFB3B7', marginBottom: '24px' }}>
            Sube tu primer archivo CSV de The Orchard para ver las estadísticas
          </p>
          <a href="/upload" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)', borderRadius: '10px', color: '#ffffff', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            Subir CSV
          </a>
        </div>
      </div>
    );
  }

  const statsCards = [
    { title: 'Total Royalties', value: `€${dashData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, subtitle: `${dashData.totalStreams.toLocaleString('es-ES')} streams` },
    { title: 'Artistas', value: dashData.totalArtists, icon: Users, subtitle: 'Artistas activos' },
    { title: 'Tracks', value: dashData.totalTracks, icon: Music, subtitle: 'Canciones totales' },
    { title: 'Contratos', value: dashData.totalContracts, icon: FileText, subtitle: `${dashData.activeContracts} activos` },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LayoutDashboard size={32} color="#c9a574" />
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
            Resumen general de BIGARTIST ROYALTIES
            {lastUpdated && (
              <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '12px' }}>
                · Actualizado {lastUpdated.toLocaleTimeString('es-ES')}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadDashboard}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(201,165,116,0.1)', border: '1px solid rgba(201,165,116,0.3)', borderRadius: '10px', color: '#c9a574', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statsCards.map((card, index) => (
          <div key={index} style={{ background: 'linear-gradient(135deg, rgba(42,63,63,0.6) 0%, rgba(30,47,47,0.8) 100%)', border: '1px solid rgba(201,165,116,0.3)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>{card.title}</p>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', margin: 0 }}>{card.value}</h3>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(201,165,116,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={24} color="#c9a574" />
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{card.subtitle}</span>
          </div>
        ))}
      </div>

      {/* CSS animations inline */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
