root@ubuntu:/var/www/bigartist-source# # 1. Ver el contenido completo del archivo api.ts
cat /var/www/bigartist-source/src/utils/api.ts

# 2. Ver también si hay algún archivo de tipos o interfaces
ls -la /var/www/bigartist-source/src/utils/

# 3. Ver el vite.config para entender cómo se compila
cat /var/www/bigartist-source/vite.config.ts 2>/dev/null || cat /var/www/bigartist-source/vite.config.js 2>/dev/null || echo "No vite config"
// API Configuration
const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'https://app.bigartist.es/api';

// API Endpoints for data fetching
export const API_ENDPOINTS = {
  dashboard: '/dashboard',
  contracts: '/contracts',
  artists: '/artists',
  tracks: '/tracks',
  csvUploads: '/csv-uploads',
  payments: '/payments',
  disputes: '/disputes',
  users: '/users',
};

// Generic API request function
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }
  
  return response.json();
};

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};

// Verify token function
export const verifyToken = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Token inválido');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};

// Create user function (admin only)
export const createUser = async (token: string, userData: {
  email: string;
  password: string;
  name: string;
  type?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear usuario');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};total 20
drwxr-xr-x  2 root root 4096 Feb 28 21:51 .
drwxr-xr-x 11 root root 4096 Feb 28 21:44 ..
-rw-r--r--  1 root root 2984 Feb 28 21:51 api.ts
-rw-r--r--  1 root root 2974 Feb 28 21:51 api.ts.backup
-rw-r--r--  1 root root  417 Feb 28 21:44 debug.ts

  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'sonner@2.0.3': 'sonner',
        'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png': path.resolve(__dirname, './src/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png'),
        'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png': path.resolve(__dirname, './src/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });root@ubuntu:/var/www/bigartist-source# 
