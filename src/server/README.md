# BIGARTIST Backend API

Backend Node.js/Express con MySQL para autenticación de usuarios.

## 🚀 Instalación en el servidor

### 1. Instalar Node.js (si no está instalado)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Configurar el proyecto
```bash
cd /var/www/bigartist/server
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
nano .env
```

Edita los valores según tu configuración:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bigartist
JWT_SECRET=GENERA_UN_STRING_ALEATORIO_AQUI
```

### 4. Inicializar la base de datos
```bash
mysql -u root -p < init-database.sql
```

### 5. Crear usuario admin
```bash
node create-admin.js
```

### 6. Iniciar el servidor

**Desarrollo:**
```bash
npm run dev
```

**Producción (con PM2):**
```bash
sudo npm install -g pm2
pm2 start server.js --name bigartist-api
pm2 save
pm2 startup
```

## 📡 Endpoints

### POST /api/login
Autenticación de usuarios
```json
{
  "email": "admin@bigartist.es",
  "password": "Admin123!"
}
```

### GET /api/verify
Verificar token (requiere Authorization header)

### POST /api/users
Crear nuevo usuario (requiere autenticación)

### GET /api/health
Health check del servidor

## 🔧 Configuración Nginx

Añade esto a tu configuración de Nginx para proxy al backend:

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Reinicia Nginx:
```bash
sudo systemctl restart nginx
```

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt (10 rounds)
- JWT con expiración de 24h
- CORS configurado
- Validación de inputs
- Conexiones MySQL con pool

## 📝 Notas

- El usuario admin por defecto es: `admin@bigartist.es` / `Admin123!`
- Cambia el JWT_SECRET en producción
- Cambia la contraseña del admin después del primer login
