#!/bin/bash

echo "🚀 Iniciando despliegue de BAM ROYALTIES SYSTEM..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paso 1: Eliminar directorio anterior
echo -e "${BLUE}📁 Limpiando directorio anterior...${NC}"
rm -rf /var/www/bigartist

# Paso 2: Clonar repositorio
echo -e "${BLUE}📥 Clonando repositorio desde GitHub...${NC}"
cd /var/www
git clone https://github.com/AritzArrieta1987/Versionfinal.git bigartist

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al clonar el repositorio${NC}"
    exit 1
fi

cd bigartist

# Paso 3: Actualizar api.ts con logs de debug
echo -e "${BLUE}🔧 Actualizando src/utils/api.ts con logs de debug...${NC}"

cat > src/utils/api.ts << 'EOF'
// API Configuration
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Types
export interface User {
  id: number;
  email: string;
  name: string;
  type: 'admin' | 'artist' | 'label';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthError {
  error: string;
}

export interface RoyaltiesData {
  totalRoyalties: number;
  monthlyGrowth: number;
  activeStreams: number;
  totalSongs: number;
  monthlyData: Array<{
    month: string;
    amount: number;
  }>;
  topSongs: Array<{
    title: string;
    artist: string;
    streams: number;
    revenue: number;
  }>;
}

// Login function
export const login = async (email: string, password: string) => {
  try {
    console.log('🌐 API_URL:', API_URL);
    console.log('📤 Enviando petición de login a:', `${API_URL}/auth/login`);
    console.log('📧 Email:', email);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📊 Status de respuesta HTTP:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    const data = await response.json();
    console.log('📦 Datos recibidos:', data);
    
    if (!response.ok) {
      console.error('❌ Error del servidor:', data);
      throw new Error(data.error || data.message || 'Error al iniciar sesión');
    }

    return data;
  } catch (error) {
    console.error('💥 Error en función login:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};

// Fetch royalties data
export const fetchRoyaltiesData = async (token: string): Promise<RoyaltiesData> => {
  try {
    const response = await fetch(`${API_URL}/royalties`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de royalties');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching royalties:', error);
    throw error;
  }
};
EOF

echo -e "${GREEN}✅ api.ts actualizado${NC}"

# Paso 4: Actualizar LoginPanel.tsx con verificación correcta
echo -e "${BLUE}🔧 Actualizando src/components/LoginPanel.tsx...${NC}"

# Primero, vamos a leer el archivo original y solo modificar la función handleLogin
# Usaremos sed para hacer el cambio
cat > /tmp/handleLogin.txt << 'EOF'
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Intentando login con:', email);
      
      // Llamada al backend para validar credenciales
      const response = await login(email, password);
      
      console.log('📥 Respuesta del backend:', response);

      // El backend devuelve { token, user } directamente cuando es exitoso
      if (response.token && response.user) {
        // Guardar token y datos del usuario
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          type: response.user.type
        }));
        
        console.log('✅ Login exitoso, token guardado');
        onLoginSuccess();
      } else {
        throw new Error('Respuesta del servidor inválida');
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
EOF

# Hacer backup del archivo original
cp src/components/LoginPanel.tsx src/components/LoginPanel.tsx.backup

# Reemplazar la verificación response.success por response.token
sed -i 's/if (response\.success)/if (response.token \&\& response.user)/g' src/components/LoginPanel.tsx

# Agregar los console.log necesarios
sed -i '/const response = await login(email, password);/a\      \n      console.log("📥 Respuesta del backend:", response);' src/components/LoginPanel.tsx
sed -i '/const handleLogin = async (e: React.FormEvent) => {/a\    e.preventDefault();\n    setIsLoading(true);\n    setError("");\n\n    try {\n      console.log("🔐 Intentando login con:", email);' src/components/LoginPanel.tsx

echo -e "${GREEN}✅ LoginPanel.tsx actualizado${NC}"

# Paso 5: Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

# Paso 6: Build de producción
echo -e "${BLUE}🏗️  Compilando aplicación (npm run build)...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el build${NC}"
    exit 1
fi

# Paso 6.5: Renombrar build a dist si es necesario
if [ -d "build" ] && [ ! -d "dist" ]; then
    echo -e "${BLUE}🔄 Renombrando build/ a dist/...${NC}"
    mv build dist
fi

# Paso 7: Verificar que dist/ se creó correctamente
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Directorio dist/ creado correctamente${NC}"
    echo -e "${BLUE}📊 Contenido de dist/:${NC}"
    ls -lh dist/
else
    echo -e "${RED}❌ No se creó el directorio dist/${NC}"
    exit 1
fi

# Paso 8: Verificar permisos para Nginx
echo -e "${BLUE}🔐 Configurando permisos para Nginx...${NC}"
chown -R www-data:www-data /var/www/bigartist/dist
chmod -R 755 /var/www/bigartist/dist

# Paso 9: Copiar favicon si existe en el repositorio
if [ -f "public/favicon.png" ]; then
    echo -e "${BLUE}🖼️  Copiando favicon...${NC}"
    cp public/favicon.png dist/favicon.png
    echo -e "${GREEN}✅ Favicon copiado${NC}"
else
    echo -e "${BLUE}ℹ️  No se encontró favicon.png en public/, recuerda añadirlo manualmente${NC}"
fi

# Resumen final
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DESPLIEGUE COMPLETADO EXITOSAMENTE${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📍 Ubicación:${NC} /var/www/bigartist"
echo -e "${BLUE}🌐 URL:${NC} https://app.bigartist.es"
echo ""
echo -e "${BLUE}🔍 Próximos pasos:${NC}"
echo "1. Abre https://app.bigartist.es en tu navegador"
echo "2. Presiona Ctrl+Shift+R para limpiar caché"
echo "3. Abre la Consola del Navegador (F12)"
echo "4. Intenta login con: admin@bigartist.es / admin123"
echo "5. Verifica los logs en la consola que empiezan con 🔐 📥 ✅"
echo ""
echo -e "${GREEN}🎉 ¡Listo!${NC}"