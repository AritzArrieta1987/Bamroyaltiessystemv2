import { Music, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar tracks desde localStorage o backend
    setLoading(false);
  }, []);

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
          <Music size={32} color="#c9a574" />
          Catálogo Musical
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Gestiona todas las canciones y álbumes de tus artistas
        </p>
      </div>

      {/* Búsqueda */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          position: 'relative',
          background: 'rgba(42, 63, 63, 0.4)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <Search
            size={20}
            color="#c9a574"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Buscar canciones, artistas, álbumes..."
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

      {/* Empty state */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
      }}>
        <Music size={64} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
          No se encontraron canciones
        </h2>
        <p style={{ fontSize: '16px', color: '#AFB3B7' }}>
          Sube un archivo CSV para ver el catálogo musical
        </p>
      </div>
    </div>
  );
}
