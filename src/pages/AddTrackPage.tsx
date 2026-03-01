import { Music, Upload, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function AddTrackPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    platform: 'Spotify',
    duration: '',
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [showWarning, setShowWarning] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea MP3 o WAV
      if (!file.type.match(/audio\/(mp3|mpeg|wav)/)) {
        alert('Por favor selecciona un archivo MP3 o WAV');
        return;
      }

      setAudioFile(file);

      // Crear Object URL para preview (más eficiente que base64)
      const objectUrl = URL.createObjectURL(file);
      setAudioPreview(objectUrl);

      // Crear un elemento de audio temporal para obtener la duración
      const tempAudio = new Audio(objectUrl);
      tempAudio.addEventListener('loadedmetadata', () => {
        const duration = tempAudio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Actualizar el campo de duración automáticamente
        setFormData(prev => ({
          ...prev,
          duration: formattedDuration
        }));
      });
      
      // Mostrar advertencia solo la primera vez
      if (!showWarning) {
        setShowWarning(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      alert('Por favor sube un archivo de audio');
      return;
    }

    // Solo guardar metadata (SIN el archivo de audio para evitar QuotaExceededError)
    const newTrack = {
      id: Date.now(),
      title: formData.title,
      artist: formData.artist,
      album: formData.album,
      platform: formData.platform,
      duration: formData.duration,
      streams: 0,
      revenue: 0,
      // NO guardamos audioUrl para evitar superar la cuota de localStorage
      fileName: audioFile.name,
      fileType: audioFile.type,
      hasAudio: false // Marcar que no tiene audio persistido
    };

    try {
      // Guardar en localStorage solo metadata
      const existingTracks = JSON.parse(localStorage.getItem('tracks') || '[]');
      const updatedTracks = [...existingTracks, newTrack];
      localStorage.setItem('tracks', JSON.stringify(updatedTracks));

      // Mostrar mensaje de éxito
      alert('✅ Canción guardada correctamente\n\nNota: El archivo de audio no se persiste entre sesiones por limitaciones del navegador.');
      
      // Redirigir al catálogo
      navigate('/catalog');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('⚠️ Error al guardar la canción. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/catalog')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '8px',
            color: '#c9a574',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <ArrowLeft size={16} />
          Volver al Catálogo
        </button>

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
          Agregar Canción
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Sube una nueva canción al catálogo musical
        </p>
      </div>

      {/* Formulario */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
        border: '1px solid rgba(201, 165, 116, 0.3)',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '800px'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Upload de audio */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#c9a574',
              marginBottom: '8px'
            }}>
              Archivo de Audio (MP3 o WAV)
            </label>
            
            <div style={{
              border: '2px dashed rgba(201, 165, 116, 0.3)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              background: 'rgba(201, 165, 116, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)';
            }}
            onClick={() => document.getElementById('audioFileInput')?.click()}
            >
              <Upload size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px', fontWeight: '600' }}>
                {audioFile ? audioFile.name : 'Click para subir archivo'}
              </p>
              <p style={{ fontSize: '13px', color: '#8b9299' }}>
                Formatos soportados: MP3, WAV
              </p>
              <input
                id="audioFileInput"
                type="file"
                accept="audio/mp3,audio/mpeg,audio/wav"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Preview del audio */}
            {audioPreview && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(201, 165, 116, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(201, 165, 116, 0.2)'
              }}>
                <p style={{ fontSize: '13px', color: '#c9a574', marginBottom: '12px', fontWeight: '600' }}>
                  Vista previa:
                </p>
                <audio
                  controls
                  src={audioPreview}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Información de la canción */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#c9a574',
                marginBottom: '8px'
              }}>
                Título de la Canción *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: DESPECHÁ"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.3s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#c9a574',
                marginBottom: '8px'
              }}>
                Artista *
              </label>
              <input
                type="text"
                required
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="Ej: ROSALÍA"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.3s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#c9a574',
                marginBottom: '8px'
              }}>
                Álbum
              </label>
              <input
                type="text"
                value={formData.album}
                onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                placeholder="Ej: MOTOMAMI"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.3s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#c9a574',
                marginBottom: '8px'
              }}>
                Duración (automática)
              </label>
              <input
                type="text"
                value={formData.duration}
                readOnly
                placeholder="Se calculará automáticamente"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.25)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '10px',
                  color: '#c9a574',
                  fontSize: '14px',
                  outline: 'none',
                  fontWeight: '600',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#c9a574',
                marginBottom: '8px'
              }}>
                Plataforma
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Spotify">Spotify</option>
                <option value="Apple Music">Apple Music</option>
                <option value="YouTube Music">YouTube Music</option>
                <option value="Deezer">Deezer</option>
                <option value="Amazon Music">Amazon Music</option>
                <option value="Tidal">Tidal</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              style={{
                padding: '14px 24px',
                background: 'transparent',
                border: '1px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '12px',
                color: '#c9a574',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)'
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
              Guardar Canción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}