# 📁 Estructura Completa del Proyecto BAM Royalties System

## 🎯 Visión General

Este proyecto es un sistema completo de gestión de royalties musicales para BIGARTIST (Big Artist Management S.L.), con frontend en React/Vite, backend en Node.js/Express y base de datos MySQL.

## 📂 Estructura de Archivos

```
bamroyaltiessystemv2/
│
├── 📄 ARCHIVOS DE CONFIGURACIÓN
│   ├── package.json              # Dependencias y scripts del frontend
│   ├── tsconfig.json             # Configuración TypeScript
│   ├── vite.config.ts            # Configuración Vite
│   ├── .gitignore                # Archivos ignorados por Git
│   └── index.html                # HTML principal
│
├── 📄 ARCHIVOS DE ENTRADA
│   ├── main.tsx                  # Punto de entrada React
│   ├── App.tsx                   # Componente principal con lógica de auth
│   └── routes.ts                 # Configuración de rutas (React Router)
│
├── 🎨 ESTILOS
│   └── styles/
│       └── globals.css           # Estilos globales + Tailwind CSS v4
│
├── 🧩 COMPONENTES
│   ├── components/
│   │   ├── AdminLayout.tsx       # Layout principal con header horizontal
│   │   ├── LoginPanel.tsx        # Panel de login (alternativo)
│   │   ├── ArtistPortal.tsx      # Portal para artistas
│   │   ├── Toaster.tsx           # Sistema de notificaciones
│   │   │
│   │   ├── ui/                   # Componentes UI reutilizables
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ... (40+ componentes UI)
│   │   │
│   │   └── figma/
│   │       └── ImageWithFallback.tsx  # Componente protegido
│
├── 📄 PÁGINAS
│   ├── pages/
│   │   ├── HomePage.tsx          # Dashboard principal con stats
│   │   ├── ArtistsPage.tsx       # Gestión de artistas
│   │   ├── CatalogPage.tsx       # Catálogo de canciones
│   │   ├── AddTrackPage.tsx      # Agregar nueva canción
│   │   ├── FinancesPage.tsx      # Finanzas y royalties
│   │   ├── ContractsPage.tsx     # Gestión de contratos
│   │   ├── UploadPage.tsx        # Carga masiva CSV
│   │   ├── PhysicalSalesPage.tsx # Ventas físicas
│   │   ├── ArtistPortalPage.tsx  # Vista de portal de artista
│   │   └── NotFoundPage.tsx      # Página 404
│
├── 🛠️ UTILIDADES
│   ├── utils/
│   │   ├── api.ts                # Cliente HTTP y endpoints API
│   │   └── debug.ts              # Herramientas de debug
│
├── 📦 ARCHIVOS IMPORTADOS (Figma)
│   ├── imports/
│   │   ├── login-panel.tsx       # LoginPanel principal (con imágenes)
│   │   ├── server.js             # Servidor backend original
│   │   ├── server-1.js           # Variante del servidor
│   │   └── ... (logs y scripts de deploy)
│
├── 🗄️ BACKEND (Node.js + Express)
│   ├── server/
│   │   ├── server.js             # Servidor Express principal
│   │   ├── package.json          # Dependencias backend
│   │   ├── init-database.sql     # Script inicialización MySQL
│   │   ├── create-admin.js       # Script crear usuario admin
│   │   └── README.md             # Documentación backend
│
├── 🚀 SCRIPTS DE DEPLOYMENT
│   ├── deploy.sh                 # Deploy completo
│   ├── deploy-quick.sh           # Deploy rápido (solo frontend)
│   ├── deploy-local.sh           # Deploy local
│   └── quick-deploy.sh           # Alias de deploy rápido
│
├── 📚 DOCUMENTACIÓN
│   ├── README.md                 # Documentación principal
│   ├── DEPLOYMENT.md             # Guía de deployment
│   ├── PROJECT-STRUCTURE.md      # Este archivo
│   ├── DEPLOY-SIMPLE.md          # Guía simple de deploy
│   ├── COMO-DESPLEGAR.md         # Guía en español
│   ├── COMANDOS-DEPLOY.txt       # Comandos rápidos
│   └── Attributions.md           # Atribuciones
│
├── 📋 OTROS
│   ├── deployment/               # Herramientas de deployment
│   │   ├── DeployApp.tsx
│   │   ├── SSLSetup.tsx
│   │   ├── VerifySetup.tsx
│   │   └── README.md
│   │
│   ├── guidelines/
│   │   └── Guidelines.md         # Guías de desarrollo
│   │
│   └── public/
│       └── favicon.svg           # Favicon personalizado
│
└── 🖼️ ASSETS (Figma)
    ├── figma:asset/0a2a9faa...png  # Imagen de fondo (oficina)
    └── figma:asset/aa0296e2...png  # Logo BIGARTIST

```

## 🔑 Archivos Clave

### Frontend Core
- **`main.tsx`** - Punto de entrada, renderiza `<App />`
- **`App.tsx`** - Maneja autenticación y muestra LoginPanel o RouterProvider
- **`routes.ts`** - Define todas las rutas de la aplicación
- **`components/AdminLayout.tsx`** - Layout con header, nav y outlet para páginas

### Autenticación
- **`imports/login-panel.tsx`** - LoginPanel principal con imágenes de Figma
- **`utils/api.ts`** - Cliente API con funciones de login/logout

### Backend
- **`server/server.js`** - API REST con Express
- **`server/init-database.sql`** - Schema completo de MySQL
- **`server/create-admin.js`** - Script para crear usuario admin

### Deployment
- **`deploy.sh`** - Script bash para deploy completo
- **`deploy-quick.sh`** - Script bash para deploy solo frontend

## 🎨 Componentes Principales

### Layout
```
AdminLayout
├── Header (transparente con blur)
│   ├── Logo BIGARTIST (izquierda)
│   ├── Navegación horizontal (centro)
│   └── Acciones (derecha: notificaciones, settings, logout)
└── Content (Outlet para páginas)
```

### Páginas
```
HomePage          → Dashboard con estadísticas y gráficos
ArtistsPage       → Lista de artistas con CRUD
CatalogPage       → Catálogo de canciones con filtros
FinancesPage      → Gestión de royalties y finanzas
ContractsPage     → Contratos con estados
UploadPage        → Carga masiva de datos CSV
```

## 🗄️ Base de Datos

### Tablas Principales
```sql
users            → Usuarios del sistema (admin/artistas)
artists          → Información de artistas
songs            → Catálogo de canciones
albums           → Álbumes
contracts        → Contratos con artistas
royalties        → Cálculos de royalties
physical_sales   → Ventas físicas
statements       → Estados de cuenta
```

## 🌐 API Endpoints

### Autenticación
```
POST   /api/login          # Autenticar usuario
POST   /api/logout         # Cerrar sesión
GET    /api/verify         # Verificar token JWT
```

### Artistas
```
GET    /api/artists        # Listar todos
GET    /api/artists/:id    # Obtener uno
POST   /api/artists        # Crear
PUT    /api/artists/:id    # Actualizar
DELETE /api/artists/:id    # Eliminar
```

### Catálogo
```
GET    /api/songs          # Listar canciones
POST   /api/songs          # Agregar canción
PUT    /api/songs/:id      # Actualizar
DELETE /api/songs/:id      # Eliminar
```

### Dashboard
```
GET    /api/dashboard/stats   # Estadísticas generales
GET    /api/dashboard/charts  # Datos para gráficos
```

## 🎯 Flujo de Datos

```
1. Usuario accede a app.bigartist.es
2. Nginx sirve archivos de /var/www/bigartist/dist/
3. React carga y verifica token en localStorage
4. Si no hay token → LoginPanel
5. Usuario hace login → POST /api/login
6. Backend valida credenciales en MySQL
7. Backend retorna JWT token
8. Frontend guarda token y user en localStorage
9. Redirect a Dashboard (HomePage)
10. Componentes llaman a API con token en headers
11. Backend valida JWT en cada request
12. Backend retorna datos de MySQL
13. Frontend renderiza datos en componentes
```

## 🔐 Seguridad

### Frontend
- Validación de inputs
- Sanitización de datos
- Manejo de errores
- Token JWT en localStorage
- Verificación de sesión al cargar

### Backend
- JWT para autenticación
- Bcrypt para passwords
- Validación de requests
- Rate limiting
- CORS configurado
- SQL injection prevention

### Servidor
- HTTPS con Let's Encrypt
- Nginx como reverse proxy
- PM2 para gestión de procesos
- MySQL con usuario limitado
- Firewall configurado

## 🚀 Proceso de Deploy

```bash
# 1. Desarrollador hace cambios localmente
# 2. Commit y push a GitHub
git add .
git commit -m "Descripción"
git push origin main

# 3. Ejecutar script de deploy
./deploy.sh

# 4. Script automáticamente:
#    - SSH al servidor (94.143.141.241)
#    - Git pull en /root/bamroyalties
#    - npm install
#    - npm run build
#    - Copiar dist/ a /var/www/bigartist/dist/
#    - Reiniciar PM2
#    - Reload Nginx
```

## 📊 Stack Tecnológico Completo

### Frontend
- React 18.3.1
- TypeScript 5.3.3
- Vite 6.3.5
- React Router (Data mode)
- Recharts (gráficos)
- Lucide React (iconos)
- Tailwind CSS v4
- Sonner (toasts)

### Backend
- Node.js 20+
- Express 4.x
- MySQL 8.x
- JWT (jsonwebtoken)
- Bcrypt (passwords)
- Multer (uploads)
- CORS

### DevOps
- Ubuntu 24.04
- Nginx 1.24+
- PM2 (process manager)
- Let's Encrypt (SSL)
- Git/GitHub
- SSH

## 🎨 Diseño Visual

### Colores
```css
Gold Primary:    #c9a574
Gold Light:      #d4b589
Dark Primary:    #0D1F23
Dark Secondary:  #132E35
Dark Accent:     #2D4A53
Gray Text:       #AFB3B7
Gray Dark:       #69818D
```

### Características
- ✨ Fondo con textura de oficina/estudio
- ✨ Overlay verde/azulado con blur
- ✨ Header completamente transparente
- ✨ Navegación horizontal centrada
- ✨ Diseño elegante verde y dorado
- ✨ Responsive para todos los dispositivos

## 📱 Responsive Breakpoints

```css
Desktop:  > 968px  → Layout completo
Tablet:   < 968px  → Menu adaptado
Mobile:   < 480px  → Optimizado móvil
```

## ✅ Checklist de Features Implementadas

- [x] Sistema de autenticación JWT
- [x] Dashboard con estadísticas
- [x] Gestión de artistas (CRUD)
- [x] Catálogo de canciones (CRUD)
- [x] Cálculo de royalties
- [x] Gestión de contratos
- [x] Portal de artistas
- [x] Carga masiva CSV
- [x] Ventas físicas
- [x] Gráficos y reportes
- [x] Sistema de notificaciones
- [x] Responsive design
- [x] Scripts de deployment
- [x] Documentación completa

## 🎓 Notas Importantes

### Imágenes de Figma
Los archivos importados de Figma usan el esquema especial:
```typescript
import imagen from 'figma:asset/[hash].png'
```

### Archivos Protegidos
NO modificar:
- `/components/figma/ImageWithFallback.tsx`

### Credenciales por Defecto
```
Admin: admin@bigartist.es / admin123
Artist: artist@bigartist.es / artist123
MySQL: root / BigArtist2018!@?
```

## 📞 Información de Contacto

**Servidor:** 94.143.141.241  
**Dominio:** app.bigartist.es  
**Repositorio:** https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git  
**Email:** admin@bigartist.es

---

**Última actualización:** Marzo 2026  
**Versión:** 2.0.0
