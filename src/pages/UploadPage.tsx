import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
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
    </div>
  );
}
