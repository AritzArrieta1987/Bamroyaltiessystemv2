import { Users, Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artistas desde localStorage (del CSV procesado)
  useEffect(() => {
    loadArtistsFromCSV();
  }, []);

  const loadArtistsFromCSV = () => {
    // Cargar artistas existentes
    const existingArtists = JSON.parse(localStorage.getItem('artists') || '[]');
    
    // Cargar datos del CSV procesado
    const uploadedCSVs = JSON.parse(localStorage.getItem('uploadedCSVs') || '[]');
    
    if (uploadedCSVs.length > 0 && uploadedCSVs[0].processedData) {
      const processedData = uploadedCSVs[0].processedData;
      const csvArtists = processedData.artists || [];
      
      // Crear o actualizar artistas desde el CSV
      const artistsMap = new Map();
      
      // Agregar artistas existentes al mapa
      existingArtists.forEach((artist: any) => {
        artistsMap.set(artist.name, artist);
      });
      
      // Agregar/actualizar artistas del CSV
      csvArtists.forEach((csvArtist: any) => {
        if (!artistsMap.has(csvArtist.name)) {
          // Crear nuevo artista desde el CSV
          const newArtist = {
            id: Date.now() + Math.random(),
            name: csvArtist.name,
            email: `${csvArtist.name.toLowerCase().replace(/\s+/g, '.')}@artist.com`,
            phone: '+34 600 000 000',
            photo: '',
            bio: `Artista con ${csvArtist.tracks.length} canciones en el catálogo`,
            contractType: 'percentage',
            contractPercentage: 50,
            contractDetails: 'Contrato estándar - 50% royalties',
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active',
            totalRevenue: csvArtist.totalRevenue,
            totalStreams: csvArtist.totalStreams,
            trackCount: csvArtist.tracks.length,
            totalTracks: csvArtist.tracks.length,
            csvData: csvArtist // Guardar datos completos del CSV
          };
          artistsMap.set(csvArtist.name, newArtist);
        } else {
          // Actualizar artista existente con datos del CSV
          const existingArtist = artistsMap.get(csvArtist.name);
          existingArtist.totalRevenue = csvArtist.totalRevenue;
          existingArtist.totalStreams = csvArtist.totalStreams;
          existingArtist.trackCount = csvArtist.tracks.length;
          existingArtist.totalTracks = csvArtist.tracks.length;
          existingArtist.csvData = csvArtist;
        }
      });
      
      const updatedArtists = Array.from(artistsMap.values());
      setArtists(updatedArtists);
      
      // Guardar artistas actualizados en localStorage
      localStorage.setItem('artists', JSON.stringify(updatedArtists));
    } else if (existingArtists.length > 0) {
      setArtists(existingArtists);
    } else {
      // 🎨 Datos de prueba para preview
      const demoArtists = [
        {
          id: 1,
          name: 'ROSALÍA',
          email: 'rosalia@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1720097196031-831449d443e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBjb25jZXJ0JTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzcyMzgzNjE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 12,
          totalRevenue: 28450.80,
          totalStreams: 2340521,
          status: 'active'
        },
        {
          id: 2,
          name: 'Bad Bunny',
          email: 'badbunny@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1642791112868-60c92b7b9eef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcmFwcGVyJTIwdXJiYW4lMjBhcnRpc3QlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzIzODM2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 10,
          totalRevenue: 24320.50,
          totalStreams: 2150320,
          status: 'active'
        },
        {
          id: 3,
          name: 'C. Tangana',
          email: 'ctangana@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1566768514716-bf40f43b4fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwc2luZ2VyJTIwZ3VpdGFyJTIwY29uY2VydHxlbnwxfHx8fDE3NzIzODM2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 8,
          totalRevenue: 19870.30,
          totalStreams: 1850421,
          status: 'active'
        },
        {
          id: 4,
          name: 'Aitana',
          email: 'aitana@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1674191084250-c99a9cba09d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwb3AlMjBhcnRpc3QlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzIzODM2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 6,
          totalRevenue: 15230.20,
          totalStreams: 1420310,
          status: 'active'
        },
        {
          id: 5,
          name: 'Rauw Alejandro',
          email: 'rauw@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1764649841400-e502bb1ee65b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbiUyMGFydGlzdCUyMHN0YWdlJTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzcyMzgzNjIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 5,
          totalRevenue: 12450.60,
          totalStreams: 1120450,
          status: 'active'
        },
        {
          id: 6,
          name: 'Nathy Peluso',
          email: 'nathy@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1562943718-beb158a241ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB1cmJhbiUyMGFydGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjM4MzYyMnww&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 4,
          totalRevenue: 9820.40,
          totalStreams: 890250,
          status: 'active'
        },
        {
          id: 7,
          name: 'Becky G',
          email: 'beckyg@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1615228462597-c75dd7ca18fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBtaWNyb3Bob25lJTIwc3R1ZGlvfGVufDF8fHx8MTc3MjM4MzYyMnww&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 3,
          totalRevenue: 7650.30,
          totalStreams: 680120,
          status: 'pending'
        },
        {
          id: 8,
          name: 'Mora',
          email: 'mora@bigartist.es',
          photo: 'https://images.unsplash.com/photo-1712530708772-49749a0bad58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMG11c2ljJTIwcHJvZHVjZXIlMjBzdHVkaW98ZW58MXx8fHwxNzcyMzgzNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
          totalTracks: 2,
          totalRevenue: 5230.80,
          totalStreams: 520180,
          status: 'active'
        }
      ];
      setArtists(demoArtists);
    }
    
    setLoading(false);
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
            // Debug: Log para verificar que el ID existe
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