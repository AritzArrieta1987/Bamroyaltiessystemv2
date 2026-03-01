Last login: Sat Feb 28 22:33:25 on ttys001
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sat Feb 28 21:48:32 UTC 2026

  System load:  0.0               Processes:             114
  Usage of /:   4.0% of 76.45GB   Users logged in:       1
  Memory usage: 39%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Sat Feb 28 21:33:39 2026 from 207.188.130.38
root@ubuntu:~# # Ver el archivo api.ts completo
cat /var/www/bigartist-source/src/utils/api.ts

# Ver el archivo ProtectedRoute.tsx completo  
cat /var/www/bigartist-source/src/components/ProtectedRoute.tsx

# Ver la configuración de Nginx actual
cat /etc/nginx/sites-enabled/bigartist
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
    const response = await fetch(`${API_URL}/login`, {
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
    const response = await fetch(`${API_URL}/verify`, {
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
};import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setIsAuthenticated(false);
      navigate('/', { replace: true });
      return;
    }

    const verifyToken = async () => {
      try {
        const API_URL = window.location.hostname === 'localhost' 
          ? 'http://localhost:3000' 
          : 'https://app.bigartist.es';

        const response = await fetch(`${API_URL}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/', { replace: true });
      }
    };

    verifyToken();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#c9a574] text-xl">Verificando...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
server {
    listen 443 ssl http2;
    server_name app.bigartist.es;

    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;

    # Frontend
    root /var/www/bigartist/dist;
    index index.html;

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}
root@ubuntu:~# 
