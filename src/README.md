# 🎵 BAM Royalties System - BIGARTIST

Sistema de gestión de royalties para Big Artist Management S.L.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)
![Node](https://img.shields.io/badge/Node-20+-green.svg)

## 📋 Descripción

Sistema completo de gestión de royalties musicales que permite:

- ✅ Gestión de artistas y contratos
- ✅ Catálogo de canciones y álbumes
- ✅ Cálculo automático de royalties
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Portal de artistas para consulta de ganancias
- ✅ Carga masiva de datos vía CSV
- ✅ Gestión de finanzas y ventas físicas
- ✅ Sistema de autenticación seguro con JWT

## 🚀 Tecnologías

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router** - Routing
- **Recharts** - Gráficos y estadísticas
- **Lucide React** - Iconos
- **Tailwind CSS v4** - Estilos

### Backend
- **Node.js + Express** - API REST
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **Multer** - Upload de archivos
- **PM2** - Gestión de procesos

### Infraestructura
- **Nginx** - Servidor web
- **Ubuntu 24.04** - Sistema operativo
- **Let's Encrypt** - Certificados SSL
- **GitHub** - Control de versiones

## 📂 Estructura del Proyecto

```
bamroyaltiessystemv2/
├── public/                    # Archivos estáticos
│   └── favicon.svg           # Favicon personalizado
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes UI reutilizables
│   │   ├── AdminLayout.tsx  # Layout principal con navegación
│   │   ├── LoginPanel.tsx   # Panel de login
│   │   ├── ArtistPortal.tsx # Portal de artistas
│   │   └── Toaster.tsx      # Notificaciones
│   ├── pages/               # Páginas de la aplicación
│   │   ├── HomePage.tsx     # Dashboard principal
│   │   ├── ArtistsPage.tsx  # Gestión de artistas
│   │   ├── CatalogPage.tsx  # Catálogo de música
│   │   ├── FinancesPage.tsx # Finanzas y royalties
│   │   ├── ContractsPage.tsx # Gestión de contratos
│   │   ├── UploadPage.tsx   # Carga de CSV
│   │   └── ...              # Otras páginas
│   ├── utils/               # Utilidades
│   │   ├── api.ts          # Cliente API
│   │   └── debug.ts        # Herramientas debug
│   ├── styles/             # Estilos globales
│   │   └── globals.css     # CSS global + Tailwind
│   ├── routes.ts           # Configuración de rutas
│   └── App.tsx            # Componente principal
├── server/                 # Backend Node.js
│   ├── server.js          # Servidor Express
│   ├── init-database.sql  # Script de inicialización DB
│   ├── create-admin.js    # Crear usuario admin
│   └── package.json       # Dependencias backend
├── deploy.sh              # Script de deploy completo
├── deploy-quick.sh        # Script de deploy rápido
└── DEPLOYMENT.md          # Guía de deployment

```

## 🔧 Instalación Local

### Prerequisitos

- Node.js 20+
- npm o yarn
- Git

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git
cd Bamroyaltiessystemv2

# 2. Instalar dependencias del frontend
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Compilar para producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`

## 🌐 Deployment en Servidor

### Configuración del Servidor

**Servidor:** 94.143.141.241  
**Dominio:** app.bigartist.es  
**Usuario:** root

### Deploy Automático

Usa los scripts incluidos para deploy automático:

```bash
# Deploy completo (frontend + backend + reinicio servicios)
./deploy.sh

# Deploy rápido (solo frontend)
./deploy-quick.sh
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para más detalles.

### Deploy Manual

```bash
# Conectar al servidor
ssh root@94.143.141.241

# Navegar al proyecto
cd /root/bamroyalties

# Actualizar código
git pull origin main

# Instalar dependencias y compilar
npm install
npm run build

# Copiar archivos
rm -rf /var/www/bigartist/dist/*
cp -r dist/* /var/www/bigartist/dist/
chown -R www-data:www-data /var/www/bigartist/dist/

# Reiniciar servicios
pm2 restart bigartist-api
systemctl reload nginx
```

## 🔐 Credenciales

### Base de Datos MySQL
- **Usuario:** root
- **Contraseña:** BigArtist2018!@?
- **Base de datos:** bigartist
- **Host:** localhost:3306

### Usuario Admin
- **Email:** admin@bigartist.es
- **Contraseña:** admin123

### Usuario Artista (Demo)
- **Email:** artist@bigartist.es
- **Contraseña:** artist123

## 🎨 Diseño

### Colores Principales

```css
/* Dorado */
--gold-primary: #c9a574;
--gold-light: #d4b589;

/* Verde/Azul Oscuro */
--dark-primary: #0D1F23;
--dark-secondary: #132E35;
--dark-accent: #2D4A53;

/* Grises */
--gray-text: #AFB3B7;
--gray-dark: #69818D;
```

### Características del Diseño

- ✨ **Header transparente** con logo BIGARTIST
- ✨ **Navegación horizontal** centrada
- ✨ **Fondo de textura** con overlay verde/azulado
- ✨ **Diseño elegante** verde y dorado
- ✨ **Totalmente responsive** (desktop, tablet, móvil)
- ✨ **Animaciones suaves** y transiciones

## 📱 Responsive

El sistema está optimizado para todos los dispositivos:

- **Desktop** (> 968px): Layout completo con navegación horizontal
- **Tablet** (< 968px): Layout adaptado con menú hamburguesa
- **Mobile** (< 480px): Optimizado para pantallas pequeñas

## 🗄️ Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema (admin/artistas)
- **artists** - Información de artistas
- **songs** - Catálogo de canciones
- **contracts** - Contratos con artistas
- **royalties** - Cálculos de royalties
- **physical_sales** - Ventas físicas
- **statements** - Estados de cuenta

Ver `server/init-database.sql` para el esquema completo.

## 🔄 API Endpoints

### Autenticación
```
POST /api/login          # Login
POST /api/logout         # Logout
GET  /api/verify         # Verificar token
```

### Artistas
```
GET    /api/artists           # Listar artistas
GET    /api/artists/:id       # Obtener artista
POST   /api/artists           # Crear artista
PUT    /api/artists/:id       # Actualizar artista
DELETE /api/artists/:id       # Eliminar artista
```

### Catálogo
```
GET    /api/songs             # Listar canciones
GET    /api/songs/:id         # Obtener canción
POST   /api/songs             # Crear canción
PUT    /api/songs/:id         # Actualizar canción
DELETE /api/songs/:id         # Eliminar canción
```

### Dashboard
```
GET /api/dashboard/stats      # Estadísticas generales
GET /api/dashboard/charts     # Datos para gráficos
```

Ver documentación completa en `/server/README.md`

## 🛠️ Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Preview de producción
```

### Backend
```bash
cd server
npm start            # Iniciar servidor
node create-admin.js # Crear usuario admin
```

### Deployment
```bash
./deploy.sh          # Deploy completo
./deploy-quick.sh    # Deploy rápido (solo frontend)
```

## 🐛 Troubleshooting

### El servidor no compila
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de permisos en el servidor
```bash
# Ajustar permisos
sudo chown -R www-data:www-data /var/www/bigartist/dist/
sudo chmod -R 755 /var/www/bigartist/dist/
```

### Backend no responde
```bash
# Ver logs de PM2
pm2 logs bigartist-api

# Reiniciar proceso
pm2 restart bigartist-api
```

### Error de conexión a MySQL
```bash
# Verificar estado de MySQL
sudo systemctl status mysql

# Reiniciar MySQL
sudo systemctl restart mysql
```

## 📊 Características Principales

### Dashboard
- 📈 Gráficos de royalties por mes
- 💰 Resumen de ingresos totales
- 🎵 Canciones más reproducidas
- 👥 Artistas top

### Gestión de Artistas
- ➕ Agregar/editar artistas
- 📊 Ver estadísticas por artista
- 🔗 Portal personalizado para cada artista
- 📧 Gestión de contactos

### Catálogo Musical
- 🎵 Biblioteca completa de canciones
- 🎨 Gestión de álbumes
- 🏷️ Metadatos completos (ISRC, UPC, etc.)
- ▶️ Reproductor integrado

### Finanzas
- 💵 Cálculo automático de royalties
- 📊 Reportes detallados
- 💳 Gestión de pagos
- 📈 Proyecciones financieras

### Contratos
- 📝 Gestión de contratos
- ✅ Estados (activo, pendiente, vencido)
- 📅 Fechas de renovación
- 📎 Adjuntar documentos

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas hasheadas (bcrypt)
- ✅ HTTPS con certificado SSL
- ✅ Validación de inputs
- ✅ Protección CSRF
- ✅ Rate limiting en API

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

© 2026 Big Artist Management S.L. - Todos los derechos reservados

## 👨‍💻 Autor

**Aritz Arrieta**  
GitHub: [@AritzArrieta1987](https://github.com/AritzArrieta1987)

## 🌟 Soporte

Para soporte, contacta a: admin@bigartist.es

---

**Hecho con ❤️ para BIGARTIST**
