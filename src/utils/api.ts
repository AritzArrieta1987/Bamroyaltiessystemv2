// API Configuration
// Detecta automáticamente si estamos en producción o desarrollo
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // En el navegador, usar el dominio actual + /api
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    // En producción, usar la IP del servidor directamente
    return 'http://94.143.141.241:3001/api';
  }
  // Fallback para SSR
  return 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

// API Endpoints for data fetching
export const API_ENDPOINTS = {
  DASHBOARD: '/dashboard',
  CONTRACTS: '/contracts',
  ARTISTS: '/artists',
  TRACKS: '/tracks',
  FINANCES: '/finances',
  CSV_UPLOADS: '/csv-uploads',
  PAYMENTS: '/payments',
  DISPUTES: '/disputes',
  USERS: '/users',
};

// Generic API request function
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('authToken'); // Cambiado de 'auth_token' a 'authToken'
  
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

// Verify token function
export const verifyToken = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Token inválido');
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
};