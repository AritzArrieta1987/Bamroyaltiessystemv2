import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArtistPortal } from '../components/ArtistPortal';
import { ArrowLeft } from 'lucide-react';
import { apiRequest, API_ENDPOINTS } from '../utils/api';

export function ArtistPortalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artistData, setArtistData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtistData();
  }, [id]);

  const loadArtistData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Cargar artista desde el API
      const response = await apiRequest(`${API_ENDPOINTS.ARTISTS}/${id}`);
      console.log('✅ Artist data from API:', response);
      
      if (response.success && response.artist) {
        setArtistData(response.artist);
      } else {
        console.error('❌ Artist not found');
        setArtistData(null);
      }
    } catch (error) {
      console.error('❌ Error loading artist:', error);
      setArtistData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Volver a la página de artistas
    navigate('/artists');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#c9a574',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
          }}>
            Cargando portal del artista...
          </div>
        </div>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#c9a574',
          padding: '40px',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
          }}>
            ⚠️
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
          }}>
            Artista no encontrado
          </div>
          <p style={{
            fontSize: '14px',
            color: '#8b9299',
            marginBottom: '24px',
          }}>
            No se pudo encontrar el artista con ID: {id}
          </p>
          <button
            onClick={() => navigate('/artists')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Volver a Artistas
          </button>
        </div>
      </div>
    );
  }

  return <ArtistPortal onLogout={handleLogout} artistData={artistData} />;
}