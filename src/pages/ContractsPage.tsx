import { FileText, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
          <FileText size={32} color="#c9a574" />
          Gestión de Contratos
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Contratos guardados en MySQL
        </p>
      </div>

      {/* Barra de acciones */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(42, 63, 63, 0.4)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '12px',
          }}>
            <Search size={20} color="#c9a574" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por artista o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
          }}
        >
          <Plus size={20} />
          Nuevo Contrato
        </button>
      </div>

      {/* Empty state */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
      }}>
        <FileText size={48} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
          No hay contratos en la base de datos
        </h3>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Crea tu primer contrato con el botón "Nuevo Contrato"
        </p>
      </div>
    </div>
  );
}
