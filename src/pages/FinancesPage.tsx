import { DollarSign } from 'lucide-react';

export function FinancesPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#ffffff',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <DollarSign size={32} color="#c9a574" />
          Finanzas
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Gestión de pagos, gastos e ingresos
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
      }}>
        <DollarSign size={64} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
          Panel de Finanzas
        </h2>
        <p style={{ fontSize: '16px', color: '#AFB3B7' }}>
          Sube un archivo CSV para ver los datos financieros
        </p>
      </div>
    </div>
  );
}
