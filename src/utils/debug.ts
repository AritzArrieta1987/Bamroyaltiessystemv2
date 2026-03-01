// Debug utilities for development
if (typeof window !== 'undefined') {
  (window as any).clearAllData = () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Todos los datos locales han sido borrados');
    window.location.reload();
  };

  console.log('🔧 Debug tools disponibles:');
  console.log('  - window.clearAllData() - Borra todos los datos locales y recarga');
}

export {};
