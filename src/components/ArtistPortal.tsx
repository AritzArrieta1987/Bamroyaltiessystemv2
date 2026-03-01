interface ArtistPortalProps {
  onLogout: () => void;
  artistData: any;
}

export default function ArtistPortal({ onLogout, artistData }: ArtistPortalProps) {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1f23 0%, #1a2e35 100%)',
      padding: '40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff' }}>
            Portal del Artista: {artistData.name}
          </h1>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: 'rgba(201, 165, 116, 0.1)',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '8px',
              color: '#c9a574',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
        
        <div style={{ 
          background: 'rgba(42, 63, 63, 0.4)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <h2 style={{ color: '#c9a574', marginBottom: '16px' }}>Estadísticas</h2>
          <p style={{ color: '#AFB3B7' }}>Email: {artistData.email}</p>
          <p style={{ color: '#AFB3B7' }}>Total Revenue: €{artistData.totalRevenue?.toFixed(2) || 0}</p>
          <p style={{ color: '#AFB3B7' }}>Total Streams: {artistData.totalStreams?.toLocaleString() || 0}</p>
        </div>
      </div>
    </div>
  );
}
