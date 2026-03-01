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
root@ubuntu:/var/www/bigartist-source# # Actualizar la contraseña en la base de datos a "admin123" (minúsculas)s)
mysql -u bigartist_user -p'BigArtist2018!@?' bigartist_db -e "
UPDATE users 
SET password_hash = '\$2b\$10\$YC5Yp6lQqB0vX8j4uZ3sKOa8DvH.jR3wN6tL5kM9pQ2xS4vW8aB7e' 
WHERE email = 'admin@bigartist.es';
SELECT id, email, 'Password updated' as status FROM users WHERE email = 'admin@bigartist.es';
"
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1045 (28000): Access denied for user 'bigartist_user'@'localhost' (using password: YES)
root@ubuntu:/var/www/bigartist-source# 