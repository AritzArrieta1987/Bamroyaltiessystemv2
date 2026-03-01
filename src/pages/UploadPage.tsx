import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [tracksImported, setTracksImported] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleProcessCsv = () => {
    if (!file) return;

    setCsvUploading(true);
    setCsvProgress(0);
    setCsvSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Simular progreso de carga
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        setCsvProgress(progress);
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          
          // Procesar CSV
          setTimeout(() => {
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            const newTracks: any[] = [];

            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim() === '') continue;
              
              const values = lines[i].split(',').map(v => v.trim());
              const track: any = { id: Date.now() + i };

              headers.forEach((header, index) => {
                if (header === 'title' || header === 'canción' || header === 'song') {
                  track.title = values[index];
                } else if (header === 'artist' || header === 'artista') {
                  track.artist = values[index];
                } else if (header === 'album' || header === 'álbum') {
                  track.album = values[index];
                } else if (header === 'platform' || header === 'plataforma') {
                  track.platform = values[index];
                } else if (header === 'streams' || header === 'reproducciones') {
                  track.streams = parseInt(values[index]) || 0;
                } else if (header === 'revenue' || header === 'ingresos') {
                  track.revenue = parseFloat(values[index]) || 0;
                } else if (header === 'duration' || header === 'duración') {
                  track.duration = values[index];
                }
              });

              if (track.title && track.artist) {
                newTracks.push(track);
              }
            }

            // Guardar en localStorage
            const existingTracks = JSON.parse(localStorage.getItem('tracks') || '[]');
            const updatedTracks = [...existingTracks, ...newTracks];
            localStorage.setItem('tracks', JSON.stringify(updatedTracks));
            
            setTracksImported(newTracks.length);
            setCsvSuccess(true);
            setCsvUploading(false);

            // Resetear después de 3 segundos
            setTimeout(() => {
              setCsvProgress(0);
              setCsvSuccess(false);
              setFile(null);
            }, 3000);
          }, 500);
        }
      }, 100);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
          Subir Archivo CSV
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Carga archivos CSV de The Orchard para procesar royalties automáticamente
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#c9a574' : 'rgba(201, 165, 116, 0.3)'}`,
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          background: isDragging
            ? 'rgba(201, 165, 116, 0.1)'
            : 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          marginBottom: '24px',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div
          style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
          }}
        >
          <Upload size={32} color="#ffffff" />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
          {isDragging ? 'Suelta el archivo aquí' : 'Arrastra y suelta tu archivo CSV'}
        </h3>
        <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '16px' }}>
          o haz clic para seleccionar un archivo
        </p>
        <p style={{ fontSize: '12px', color: '#6B7280' }}>
          Formatos soportados: CSV (máx. 10 MB)
        </p>
      </div>

      {file && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '12px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(201, 165, 116, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FileText size={24} color="#c9a574" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
              {file.name}
            </p>
            <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

      <div style={{
        marginTop: '32px',
        padding: '20px',
        background: 'rgba(42, 63, 63, 0.3)',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertCircle size={20} color="#c9a574" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#c9a574', marginBottom: '8px' }}>
              Formato del archivo CSV
            </p>
            <ul style={{ fontSize: '13px', color: '#AFB3B7', paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '4px' }}>El archivo debe estar en formato CSV (separado por comas)</li>
              <li style={{ marginBottom: '4px' }}>La primera fila debe contener los nombres de las columnas</li>
              <li style={{ marginBottom: '4px' }}>Formato compatible con The Orchard</li>
              <li>Tamaño máximo recomendado: 10 MB</li>
            </ul>
          </div>
        </div>
      </div>

      {csvUploading && (
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(42, 63, 63, 0.3)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Upload size={20} color="#c9a574" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#c9a574', marginBottom: '8px' }}>
                Cargando archivo CSV
              </p>
              <div style={{ width: '100%', height: '8px', background: 'rgba(201, 165, 116, 0.2)', borderRadius: '4px' }}>
                <div style={{ width: `${csvProgress}%`, height: '8px', background: '#c9a574', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {csvSuccess && (
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(42, 63, 63, 0.3)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={20} color="#c9a574" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#c9a574', marginBottom: '8px' }}>
                Archivo CSV cargado exitosamente
              </p>
              <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                Se importaron {tracksImported} nuevas pistas
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        style={{
          marginTop: '32px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
          border: 'none',
          borderRadius: '12px',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background 0.3s ease',
        }}
        onClick={handleProcessCsv}
        disabled={!file || csvUploading}
      >
        Procesar CSV
      </button>
    </div>
  );
}