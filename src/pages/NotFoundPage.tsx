import { AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div>
        <AlertCircle size={64} color="#c9a574" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
          Página no encontrada
        </h1>
        <p style={{ fontSize: '16px', color: '#AFB3B7' }}>
          La página que buscas no existe
        </p>
      </div>
    </div>
  );
}
