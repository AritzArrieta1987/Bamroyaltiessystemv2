import { Users, Plus, Search, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { apiRequest, API_ENDPOINTS } from '../utils/api';

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde API
  useEffect(() => {
    loadArtistsFromAPI();
  }, []);

  const loadArtistsFromAPI = async () => {
    setLoading(true);
    try {
      // 🔥 FORZAR DATOS VACÍOS - NO HAY API AÚN
      console.log('🚫 ARTISTS PAGE: Cargando con datos vacíos (no hay backend)');
      setArtists([]);
    } catch (error) {
      console.error('❌ Error loading artists:', error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

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
          Administra la información y contratos de tus artistas {artists.length > 0 && `(${artists.length} artistas)`}
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
          onClick={() => navigate('/add-artist')}
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
          {filteredArtists.map((artist, idx) => {
            console.log('Artist click:', artist.name, 'ID:', artist.id);
            
            return (
              <div
                key={artist.id || idx}
                onClick={() => {
                  if (artist.id) {
                    console.log('Navegando a:', `/artist-portal/${artist.id}`);
                    navigate(`/artist-portal/${artist.id}`);
                  } else {
                    console.error('Artist sin ID:', artist);
                  }
                }}
                style={{
                  background: 'rgba(30, 47, 47, 0.5)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(201, 165, 116, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                }}
              >
                {/* Foto grande tipo postal - header */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundImage: artist.photo 
                    ? `url(${artist.photo})`
                    : 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  {/* Overlay gradient para mejor legibilidad */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    background: 'linear-gradient(to top, rgba(13, 31, 35, 0.95), transparent)'
                  }} />
                  
                  {/* Badge de status */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: artist.status === 'active' 
                      ? 'rgba(34, 197, 94, 0.9)' 
                      : 'rgba(234, 179, 8, 0.9)',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {artist.status === 'active' ? 'Activo' : 'Pendiente'}
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#ffffff', 
                    marginBottom: '6px',
                    lineHeight: '1.2'
                  }}>
                    {artist.name}
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#8b9299', 
                    marginBottom: '20px' 
                  }}>
                    {artist.email}
                  </p>

                  {/* Stats grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      background: 'rgba(201, 165, 116, 0.08)',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(201, 165, 116, 0.15)'
                    }}>
                      <div style={{ fontSize: '11px', color: '#8b9299', marginBottom: '4px' }}>
                        Canciones
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                        {artist.totalTracks || 0}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ fontSize: '11px', color: '#8b9299', marginBottom: '4px' }}>
                        Streams
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                        {(artist.totalStreams || 0).toLocaleString('es-ES', { notation: 'compact', maximumFractionDigits: 1 })}
                      </div>
                    </div>
                  </div>

                  {/* Revenue destacado */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(201, 165, 116, 0.05) 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#8b9299', marginBottom: '4px' }}>
                      Ingresos Totales
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
                      €{(artist.totalRevenue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <Upload size={48} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            No hay artistas registrados
          </h3>
          <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
            {artists.length === 0 
              ? 'Sube un archivo CSV para ver los artistas automáticamente'
              : 'Intenta con otros términos de búsqueda'}
          </p>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
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
            onClick={() => navigate('/upload')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
            }}
          >
            <Upload size={20} />
            Ir a Subir Archivos
          </button>
        </div>
      )}
    </div>
  );
}