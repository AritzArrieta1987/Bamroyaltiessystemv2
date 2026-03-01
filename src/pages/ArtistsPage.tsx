import { Users, Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar artistas desde localStorage
    const localArtists = JSON.parse(localStorage.getItem('artists') || '[]');
    setArtists(localArtists);
    setLoading(false);
  }, []);

  const filteredArtists = artists.filter(artist =>
    artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#AFB3B7' }}>
        <p>Cargando artistas...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
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
          <Users size={32} color="#c9a574" />
          Gestión de Artistas
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Administra la información y contratos de tus artistas
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
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
              placeholder="Buscar artistas..."
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
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
          }}
        >
          <Plus size={20} />
          Agregar Artista
        </button>
      </div>

      {/* Lista de artistas */}
      {filteredArtists.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {filteredArtists.map((artist, idx) => (
            <div
              key={idx}
              style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                {artist.name?.charAt(0) || 'A'}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                {artist.name}
              </h3>
              <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '16px' }}>
                {artist.email}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  {artist.totalTracks || 0} tracks
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>
                  €{(artist.totalRevenue || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <Search size={48} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            No se encontraron artistas
          </h3>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
            {artists.length === 0 
              ? 'Sube un archivo CSV para ver los artistas'
              : 'Intenta con otros términos de búsqueda'}
          </p>
        </div>
      )}
    </div>
  );
}
