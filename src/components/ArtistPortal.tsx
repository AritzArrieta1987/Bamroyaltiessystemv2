import { User, Music, DollarSign, TrendingUp, Calendar, Upload, Camera, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ArtistPortalProps {
  onLogout: () => void;
  artistData: any;
}

export function ArtistPortal({ onLogout, artistData }: ArtistPortalProps) {
  const navigate = useNavigate();
  const [artistPhoto, setArtistPhoto] = useState<string | null>(artistData.photo || null);
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setArtistPhoto(photoUrl);
        
        // Guardar en localStorage
        const artists = JSON.parse(localStorage.getItem('artists') || '[]');
        const updatedArtists = artists.map((a: any) => 
          a.id === artistData.id ? { ...a, photo: photoUrl } : a
        );
        localStorage.setItem('artists', JSON.stringify(updatedArtists));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    navigate('/artists');
  };

  // Preparar datos para el gráfico de plataformas
  const platformData = Object.entries(artistData.platformBreakdown || {}).map(([name, revenue]) => ({
    name,
    value: revenue as number
  })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#22c55e', '#c9a574', '#8b5cf6', '#3b82f6', '#ef4444'];

  // Top 5 tracks
  const topTracks = (artistData.tracks || [])
    .sort((a: any, b: any) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5);

  return (
    <div>
      {/* Botón de volver */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(212, 165, 116, 0.1)',
            border: '1px solid rgba(212, 165, 116, 0.3)',
            borderRadius: '10px',
            color: '#d4a574',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)';
          }}
        >
          <ArrowLeft size={16} />
          Volver a Artistas
        </button>
      </div>

      {/* Contenido del portal del artista */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '40px'
      }}>
        {/* Sección de perfil */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '32px',
            alignItems: 'start'
          }}>
            {/* Sección de carga de foto */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '180px',
                  height: '180px',
                  borderRadius: '16px',
                  background: artistPhoto 
                    ? `url(${artistPhoto}) center/cover` 
                    : 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '3px solid rgba(201, 165, 116, 0.3)',
                  overflow: 'hidden'
                }}
                onMouseEnter={() => setIsHoveringPhoto(true)}
                onMouseLeave={() => setIsHoveringPhoto(false)}
                onClick={() => document.getElementById('photoInput')?.click()}
              >
                {!artistPhoto && (
                  <User size={80} color="#ffffff" style={{ opacity: 0.5 }} />
                )}
                
                {/* Overlay on hover */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isHoveringPhoto ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}>
                  <Camera size={32} color="#c9a574" />
                  <span style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>
                    {artistPhoto ? 'Cambiar foto' : 'Subir foto'}
                  </span>
                </div>
              </div>

              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />

              <button
                onClick={() => document.getElementById('photoInput')?.click()}
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: 'rgba(201, 165, 116, 0.15)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  color: '#c9a574',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.15)';
                }}
              >
                <Upload size={16} />
                Subir Foto
              </button>
            </div>

            {/* Información del artista */}
            <div>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#ffffff', 
                marginBottom: '12px' 
              }}>
                {artistData.name}
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: '#8b9299', 
                marginBottom: '8px' 
              }}>
                {artistData.email}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(34, 197, 94, 0.15)',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#22c55e' }}>
                  {artistData.contractType || 'Distribución + Edición'}
                </span>
              </div>

              {/* Información del contrato */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginTop: '24px'
              }}>
                <div style={{
                  padding: '16px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                  <div style={{ fontSize: '12px', color: '#8b9299', marginBottom: '4px' }}>
                    Royalty %
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#c9a574' }}>
                    {artistData.royaltyPercentage}%
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                  <div style={{ fontSize: '12px', color: '#8b9299', marginBottom: '4px' }}>
                    Total Tracks
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                    {artistData.tracks?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>
                  Ingresos Totales
                </p>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e', margin: 0 }}>
                  €{(artistData.totalRevenue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} color="#22c55e" />
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>
                  Total Streams
                </p>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#c9a574', margin: 0 }}>
                  {(artistData.totalStreams || 0).toLocaleString('es-ES')}
                </h3>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(201, 165, 116, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={24} color="#c9a574" />
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>
                  Canciones
                </p>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6', margin: 0 }}>
                  {artistData.tracks?.length || 0}
                </h3>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Music size={24} color="#8b5cf6" />
              </div>
            </div>
          </div>
        </div>

        {/* Cuadrícula de gráficos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Gráfico de rendimiento mensual */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Calendar size={24} color="#c9a574" />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                Rendimiento Mensual
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={artistData.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                <XAxis dataKey="month" stroke="#AFB3B7" />
                <YAxis stroke="#AFB3B7" />
                <Tooltip
                  contentStyle={{
                    background: '#2a3f3f',
                    border: '1px solid #c9a574',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="revenue" fill="#22c55e" name="Ingresos (€)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución por plataforma */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
              Distribución por Plataforma
            </h3>
            {platformData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#2a3f3f',
                      border: '1px solid #c9a574',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', color: '#8b9299', padding: '60px 20px' }}>
                No hay datos de plataformas disponibles
              </div>
            )}
          </div>
        </div>

        {/* Top 5 canciones */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
            Top 5 Canciones
          </h3>
          {topTracks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topTracks.map((track: any, index: number) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(42, 63, 63, 0.5)',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.5)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: index === 0 ? 'rgba(201, 165, 116, 0.3)' : 'rgba(201, 165, 116, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#c9a574'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                        {track.title || track.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8b9299' }}>
                        {(track.streams || 0).toLocaleString('es-ES')} streams
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>
                      €{(track.revenue || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#8b9299', padding: '40px 20px' }}>
              No hay canciones disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}