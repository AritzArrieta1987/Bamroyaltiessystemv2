import { Music, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';
import { apiRequest, API_ENDPOINTS } from '../utils/api';

export function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [audioElements, setAudioElements] = useState<{ [key: number]: HTMLAudioElement }>({});
  const navigate = useNavigate();
  
  useEffect(() => {
    loadTracksFromAPI();
  }, []);

  const loadTracksFromAPI = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(API_ENDPOINTS.TRACKS);
      console.log('✅ Tracks from API:', response);
      setTracks(response.tracks || []);
    } catch (error) {
      console.error('❌ Error loading tracks:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTracks = tracks.filter((track: any) =>
    track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.album?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlay = (trackId: number, audioUrl?: string) => {
    if (!audioUrl) {
      alert('⚠️ Esta canción no tiene archivo de audio.\n\nLos archivos de audio no se pueden almacenar por limitaciones del navegador.\n\n💡 Sugerencia: Conecta con Supabase para almacenar archivos de audio en la nube.');
      return;
    }

    // Crear o obtener el elemento de audio para esta canción
    let audioElement = audioElements[trackId];
    
    if (!audioElement) {
      audioElement = new Audio(audioUrl);
      audioElement.addEventListener('ended', () => {
        setPlayingTrackId(null);
      });
      setAudioElements(prev => ({ ...prev, [trackId]: audioElement }));
    }
    
    if (playingTrackId === trackId) {
      audioElement.pause();
      setPlayingTrackId(null);
    } else {
      // Pausar cualquier otra canción que esté sonando
      if (playingTrackId !== null && audioElements[playingTrackId]) {
        audioElements[playingTrackId].pause();
      }
      audioElement.play();
      setPlayingTrackId(trackId);
    }
  };

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
      <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{
          flex: '1',
          minWidth: '250px',
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

        <button
          onClick={() => navigate('/add-track')}
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
          Agregar Canción
        </button>

        <button
          onClick={() => navigate('/upload-tracks')}
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
          <Upload size={20} />
          Subir Archivo CSV
        </button>
      </div>

      {/* Empty state */}
      {filteredTracks.length > 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'left'
                }}>
                  Canción
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'left'
                }}>
                  Artista
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'left'
                }}>
                  Álbum
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'right'
                }}>
                  Streams
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'right'
                }}>
                  Ingresos
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'center'
                }}>
                  Duración
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'center'
                }}>
                  Reproducir
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.map((track: any) => (
                <tr key={track.id} style={{
                  transition: 'background 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#ffffff',
                    fontWeight: '600'
                  }}>
                    {track.title}
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#AFB3B7'
                  }}>
                    {track.artist}
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#AFB3B7'
                  }}>
                    {track.album}
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#AFB3B7',
                    textAlign: 'right'
                  }}>
                    {track.streams.toLocaleString('es-ES')}
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#22c55e',
                    fontWeight: '600',
                    textAlign: 'right'
                  }}>
                    €{track.revenue.toFixed(2)}
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '13px',
                    color: '#8b9299',
                    textAlign: 'center'
                  }}>
                    {track.duration}
                  </td>
                  <td style={{
                    padding: '16px 12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '13px',
                    color: '#8b9299',
                    textAlign: 'center'
                  }}>
                    <button
                      onClick={() => handlePlay(track.id, track.audioUrl)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 6px rgba(201, 165, 116, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(201, 165, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(201, 165, 116, 0.3)';
                      }}
                    >
                      {playingTrackId === track.id ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
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
            {tracks.length === 0 
              ? 'Sube un archivo CSV para ver el catálogo musical'
              : 'Intenta con otros términos de búsqueda'}
          </p>
        </div>
      )}
    </div>
  );
}