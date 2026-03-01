import { DollarSign, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiRequest, API_ENDPOINTS } from '../utils/api';

type TabType = 'resumen' | 'ingresos' | 'gastos' | 'ventas-fisico' | 'solicitudes' | 'reportes';

interface FinanceData {
  totalRoyalties: number;
  bamProfit: number;
  artistProfit: number;
  pendingRequests: number;
  transfersCompleted: number;
  pendingRoyalties: number;
  grossProfit: number;
  netProfit: number;
  yearlyData: Array<{ month: string; revenue: number }>;
}

export function FinancesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('resumen');
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);

  useEffect(() => {
    loadFinanceData();
    
    // Escuchar eventos de nuevas solicitudes de pago
    const handlePaymentRequest = (event: any) => {
      console.log('🔔 Nueva solicitud de pago en Finanzas:', event.detail);
      
      const data = event.detail;
      // Agregar la nueva solicitud a la lista
      setPaymentRequests(prev => [{
        id: data.id,
        artist_id: data.artistId,
        artist_name: data.artistName,
        amount: data.amount,
        status: 'pending',
        created_at: data.createdAt,
        first_name: data.firstName,
        last_name: data.lastName,
        account_holder: data.accountHolder,
        iban: data.iban,
        reference: data.reference
      }, ...prev]);

      // Actualizar contadores
      setFinanceData(prev => prev ? {
        ...prev,
        pendingRequests: prev.pendingRequests + 1,
        pendingRoyalties: prev.pendingRoyalties + data.amount
      } : null);
    };
    
    window.addEventListener('paymentRequested', handlePaymentRequest);
    
    return () => {
      window.removeEventListener('paymentRequested', handlePaymentRequest);
    };
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      
      // Cargar desde API - usar endpoint correcto
      try {
        const response = await apiRequest('/finances/overview');
        console.log('✅ Finances from API:', response);
        
        if (response.success && response.data) {
          setFinanceData(response.data);
          setPaymentRequests(response.paymentRequests || []);
        } else {
          throw new Error('No data from API');
        }
      } catch (apiError) {
        console.log('⚠️ API no disponible, mostrando datos vacíos');
        // Datos vacíos si el API no responde
        setFinanceData({
          totalRoyalties: 0,
          bamProfit: 0,
          artistProfit: 0,
          pendingRequests: 0,
          transfersCompleted: 0,
          pendingRoyalties: 0,
          grossProfit: 0,
          netProfit: 0,
          yearlyData: []
        });
        setPaymentRequests([]);
      }
    } catch (error) {
      console.error('❌ Error loading finances:', error);
      // Datos vacíos en caso de error
      setFinanceData({
        totalRoyalties: 0,
        bamProfit: 0,
        artistProfit: 0,
        pendingRequests: 0,
        transfersCompleted: 0,
        pendingRoyalties: 0,
        grossProfit: 0,
        netProfit: 0,
        yearlyData: []
      });
      setPaymentRequests([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(201, 165, 116, 0.2)',
          borderTop: '3px solid var(--accent-gold)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Cargando datos financieros...</p>
      </div>
    );
  }

  if (!financeData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No se pudieron cargar los datos financieros</p>
      </div>
    );
  }

  const TabButton = ({ tab, icon, label, badge }: { tab: TabType; icon: React.ReactNode; label: string; badge?: number }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: activeTab === tab ? 'rgba(201, 165, 116, 0.15)' : 'transparent',
        border: 'none',
        borderBottom: activeTab === tab ? '2px solid var(--accent-gold)' : '2px solid transparent',
        color: activeTab === tab ? 'var(--accent-gold)' : '#6B7280',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          background: 'var(--danger)',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 6px',
          borderRadius: '10px',
          minWidth: '18px',
          textAlign: 'center'
        }}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#ffffff',
          marginBottom: '8px'
        }}>
          Finanzas y Reportes
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          Gestiona y analiza los ingresos, gastos y reportes financieros
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '0px',
        flexWrap: 'wrap'
      }}>
        <TabButton 
          tab="resumen" 
          icon={<DollarSign size={16} />} 
          label="Resumen General" 
        />
        <TabButton 
          tab="ingresos" 
          icon={<TrendingUp size={16} />} 
          label="Ingresos" 
        />
        <TabButton 
          tab="gastos" 
          icon={<TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />} 
          label="Gastos" 
        />
        <TabButton 
          tab="ventas-fisico" 
          icon={<DollarSign size={16} />} 
          label="Ventas Físico" 
        />
        <TabButton 
          tab="solicitudes" 
          icon={<DollarSign size={16} />} 
          label="Solicitudes" 
          badge={financeData.pendingRequests}
        />
        <TabButton 
          tab="reportes" 
          icon={<DollarSign size={16} />} 
          label="Reportes" 
        />
      </div>

      {/* Content - Resumen General */}
      {activeTab === 'resumen' && (
        <div>
          {/* Top Row - 2 cards horizontales */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Resumen de Royalties */}
            <div style={{
              background: 'rgba(30, 47, 47, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '32px',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                Hola, aquí está el resumen<br/>de tus royalties.
              </h2>
              
              <div>
                <p style={{
                  fontSize: '11px',
                  color: '#6B7280',
                  marginBottom: '8px'
                }}>
                  Este mes tus artistas han generado
                </p>
                
                <h3 style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  color: 'var(--accent-gold)',
                  margin: 0
                }}>
                  €{financeData.totalRoyalties.toFixed(2)}
                </h3>
              </div>
            </div>

            {/* Beneficios combinados */}
            <div style={{
              background: 'rgba(30, 47, 47, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '32px',
              minHeight: '180px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Mini Bar Chart Background */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: '32px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                height: '90px',
                opacity: 0.12
              }}>
                <div style={{ width: '14px', height: '40%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '14px', height: '65%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '14px', height: '80%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '14px', height: '55%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '14px', height: '70%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '14px', height: '90%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '14px', height: '60%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '14px', height: '50%', background: 'var(--accent-gold)', borderRadius: '4px 4px 0 0' }}></div>
              </div>
              
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
                    Beneficios de Bam
                  </p>
                  <h3 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-gold)', margin: 0 }}>
                    €{financeData.bamProfit.toFixed(2)}
                  </h3>
                </div>
                
                <div>
                  <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
                    Beneficio de Artistas
                  </p>
                  <h3 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-gold)', margin: 0 }}>
                    €{financeData.artistProfit.toFixed(2)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid - 2 columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '500px 1fr',
            gap: '20px'
          }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Artistas Pendientes */}
              <div style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px',
                minHeight: '130px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                  Artistas Pendientes de Solicitud
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
                  {financeData.pendingRequests > 0 
                    ? `${financeData.pendingRequests} solicitudes pendientes`
                    : 'No hay solicitudes pendientes'
                  }
                </p>
              </div>

              {/* Chart - Ventas del Último Año */}
              <div style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '28px',
                minHeight: '360px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '24px' }}>
                  Ventas del Último Año
                </h3>
                {financeData.yearlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={financeData.yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                      <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(30, 47, 47, 0.95)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="revenue" fill="var(--accent-gold)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '90px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" opacity="0.4">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                      No hay datos disponibles para mostrar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Stats Cards with explicit grid positioning */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '130px 180px 180px',
              gap: '20px'
            }}>
              {/* Row 1, Col 1 - Solicitudes de Royalties */}
              <div style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gridColumn: '1',
                gridRow: '1'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
                  Solicitudes de Royalties
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
                  {paymentRequests.length > 0
                    ? `${paymentRequests.length} solicitudes totales`
                    : 'No hay solicitudes'
                  }
                </p>
              </div>

              {/* Row 1-2, Col 2 - GROSS PROFIT (spans 2 rows) */}
              <div style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gridColumn: '2',
                gridRow: '1 / 3'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600'
                  }}>
                    GROSS PROFIT
                  </p>
                  <TrendingUp size={18} color="var(--accent-gold)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0' }}>
                    €{financeData.grossProfit.toFixed(2)}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#6B7280', margin: 0 }}>
                    Ingresos BAM según contratos
                  </p>
                </div>
              </div>

              {/* Row 2, Col 1 - ROYALTIES PENDIENTES */}
              <div style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gridColumn: '1',
                gridRow: '2'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600'
                  }}>
                    ROYALTIES PENDIENTES
                  </p>
                  <Clock size={18} color="var(--accent-gold)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0' }}>
                    €{financeData.pendingRoyalties.toFixed(2)}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#6B7280', margin: 0 }}>
                    Solicitudes pendientes de pago
                  </p>
                </div>
              </div>

              {/* Row 3, Col 1 - TRANSFERENCIAS REALIZADAS */}
              <div style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gridColumn: '1',
                gridRow: '3'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600'
                  }}>
                    TRANSFERENCIAS REALIZADAS
                  </p>
                  <ArrowUpRight size={18} color="var(--accent-gold)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0' }}>
                    {financeData.transfersCompleted}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#6B7280', margin: 0 }}>
                    Solicitudes completadas
                  </p>
                </div>
              </div>

              {/* Row 3, Col 2 - NET PROFIT */}
              <div style={{
                background: 'rgba(30, 47, 47, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gridColumn: '2',
                gridRow: '3'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600'
                  }}>
                    NET PROFIT
                  </p>
                  <DollarSign size={18} color="var(--accent-gold)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0 0 4px 0' }}>
                    €{financeData.netProfit.toFixed(2)}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#6B7280', margin: 0 }}>
                    Después de gastos operativos (15%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Tabs - Placeholder */}
      {activeTab !== 'resumen' && (
        <div style={{
          background: 'rgba(30, 47, 47, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Sección en construcción
          </p>
        </div>
      )}
    </div>
  );
}