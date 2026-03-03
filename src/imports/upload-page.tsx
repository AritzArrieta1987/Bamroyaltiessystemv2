Last login: Mon Mar  2 19:48:26 on ttys000
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Mon Mar  2 19:00:54 UTC 2026

  System load:  0.0               Processes:             111
  Usage of /:   6.0% of 76.45GB   Users logged in:       0
  Memory usage: 46%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Mon Mar  2 18:51:55 2026 from 207.188.130.38
root@ubuntu:~# cat /var/www/bigartist/src/pages/UploadPage.tsx
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

// URL del API - apunta directamente al servidor de producción
const API_URL = 'https://app.bigartist.es/api';

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [stats, setStats] = useState<any>(null);
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
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setUploadSuccess(false);
      setStats(null);
    } else {
      toast.error('Por favor, sube un archivo CSV válido');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(false);
      setStats(null);
    }
  };

  const handleProcessCsv = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setStats(null);

    try {
      const formData = new FormData();
      formData.append('csv', file);

      const token = localStorage.getItem('authToken');
      
      // Debug: Verificar el token
      console.log('🔑 Token obtenido:', token);
      console.log('📤 Enviando a:', `${API_URL}/royalties/import`);
      
      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión de nuevo.');
        return;
      }
      
      const response = await fetch(`${API_URL}/royalties/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      console.log('📥 Respuesta del servidor:', data);

      if (data.success) {
        setUploadSuccess(true);
        // Convertir totalRevenue a número cuando llega del servidor
        setStats({
          ...data.stats,
          totalRevenue: Number(data.stats.totalRevenue)
        });
        toast.success('✅ Archivo CSV importado exitosamente');
        
        // Resetear el archivo después de 5 segundos
        setTimeout(() => {
          setFile(null);
          setUploadSuccess(false);
        }, 5000);
      } else {
        toast.error(data.message || 'Error al procesar el archivo');
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error al subir CSV:', error);
      toast.error('Error al subir el archivo. Verifica la conexión con el servidor.');
    } finally {
      setIsUploading(false);
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

      {isUploading && (
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
                <div style={{ width: '50%', height: '8px', background: '#c9a574', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadSuccess && stats && (
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CheckCircle size={24} color="#c9a574" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574', margin: 0 }}>
              ✅ Importación Completada
            </h3>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Artistas</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>{stats.artists}</p>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Canciones</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>{stats.tracks}</p>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Plataformas</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>{stats.platforms}</p>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Territorios</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>{stats.territories}</p>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Total Royalties</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>{stats.royalties}</p>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Ingresos Totales</p>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>€{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <button
        style={{
          marginTop: '32px',
          padding: '12px 24px',
          background: file && !isUploading 
            ? 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)' 
            : 'rgba(201, 165, 116, 0.3)',
          border: 'none',
          borderRadius: '12px',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: file && !isUploading ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          opacity: file && !isUploading ? 1 : 0.5,
        }}
        onClick={handleProcessCsv}
        disabled={!file || isUploading}
      >
        {isUploading ? '⏳ Procesando...' : 'Procesar CSV'}
      </button>
    </div>
  );
}root@ubuntu:~#formData.append('csv', csvFile);  // ← Frontend envía 'csv''
-bash: syntax error near unexpected token `'csv','
root@ubuntu:~# upload.single('file')  // ← Backend espera 'file'
-bash: syntax error near unexpected token `'file''
root@ubuntu:~# cd /var/www/bigartist_backup_20260302_174903/server

# Hacer backup
cp server.js server.js.backup_$(date +%Y%m%d_%H%M%S)

# Cambiar 'file' por 'csv'
sed -i "s/upload.single('file')/upload.single('csv')/g" server.js

# Verificar el cambio
echo "=========================================="
echo "🔍 VERIFICANDO CAMBIO"
echo "=========================================="
grep "upload.single" server.js

echo ""
echo "=========================================="
echo "🔄 REINICIANDO PM2"
echo "=========================================="
pm2 restart bigartist-api

echo ""
echo "Esperando 3 segundos..."
sleep 3

pm2 logs bigartist-api --lines 10 --nostream===="
==========================================
🔍 VERIFICANDO CAMBIO
==========================================
app.post('/api/royalties/import', authenticateToken, upload.single('csv'), async (req, res) => {

==========================================
🔄 REINICIANDO PM2
==========================================
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 1    │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

Esperando 3 segundos...

==========================================
📋 VER LOGS
==========================================
[TAILING] Tailing last 10 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 10 lines:
0|bigartis |     at wrappedFileFilter (/var/www/bigartist_backup_20260302_174903/server/node_modules/multer/index.js:40:19)
0|bigartis |     at Multipart.<anonymous> (/var/www/bigartist_backup_20260302_174903/server/node_modules/multer/lib/make-middleware.js:109:7)
0|bigartis |     at Multipart.emit (node:events:524:28)
0|bigartis |     at HeaderParser.cb (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:358:14)
0|bigartis |     at HeaderParser.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:162:20)
0|bigartis |     at SBMH.ssCb [as _cb] (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:394:37)
0|bigartis |     at feed (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:219:14)
0|bigartis |     at SBMH.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:104:16)
0|bigartis |     at Multipart._write (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:567:19)
0|bigartis |     at writeOrBuffer (node:internal/streams/writable:572:12)

/root/.pm2/logs/bigartist-api-out.log last 10 lines:
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001

root@ubuntu:/var/www/bigartist_backup_20260302_174903/server#