# 📝 Changelog - BAM Royalties System

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [2.0.0] - 2026-03-01

### 🎉 Lanzamiento Mayor - Versión 2.0

#### ✨ Añadido
- Sistema completo de autenticación con JWT
- Dashboard principal con estadísticas en tiempo real
- Gestión completa de artistas (CRUD)
- Catálogo de canciones con metadatos completos
- Sistema de cálculo de royalties
- Gestión de contratos con estados
- Portal de artistas para consulta de ganancias
- Carga masiva de datos vía CSV
- Gestión de finanzas y ventas físicas
- Sistema de notificaciones (Toaster)
- Diseño responsive para móvil, tablet y desktop
- Scripts automatizados de deployment
- Documentación completa del proyecto
- Backend Node.js + Express + MySQL
- API REST completa
- Configuración de servidor con Nginx + PM2
- Certificado SSL con Let's Encrypt
- Sistema de gráficos con Recharts
- Componentes UI reutilizables (40+)
- React Router con Data mode
- TypeScript para type safety

#### 🎨 Diseño
- Header transparente con efecto blur
- Navegación horizontal centrada
- Esquema de colores verde/dorado elegante
- Fondo con textura de oficina/estudio
- Logo BIGARTIST integrado
- Animaciones suaves y transiciones
- Diseño moderno y profesional

#### 🔒 Seguridad
- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- HTTPS obligatorio
- Validación de inputs
- Protección CSRF
- Rate limiting en API
- SQL injection prevention

#### 📱 Responsive
- Breakpoint desktop (> 968px)
- Breakpoint tablet (< 968px)
- Breakpoint mobile (< 480px)
- Menu hamburguesa en móvil
- Layouts adaptados por dispositivo

#### 🚀 Deployment
- Script de deploy completo (deploy.sh)
- Script de deploy rápido (deploy-quick.sh)
- Configuración de servidor Ubuntu 24.04
- Nginx como reverse proxy
- PM2 para gestión de procesos
- Backup automático de base de datos

#### 📚 Documentación
- README.md completo
- DEPLOYMENT.md con guía paso a paso
- PROJECT-STRUCTURE.md con estructura detallada
- QUICK-START.md para inicio rápido
- Comentarios en código
- JSDoc en funciones críticas

#### 🔧 Herramientas
- Vite 6.3.5 como build tool
- TypeScript 5.3.3
- Tailwind CSS v4
- ESLint para linting
- Prettier para formateo (opcional)

## [1.0.0] - 2025-12-15

### 🎉 Lanzamiento Inicial

#### ✨ Añadido
- Estructura básica del proyecto
- Sistema de login simple
- Dashboard preliminar
- Gestión básica de artistas
- Catálogo inicial de canciones
- Base de datos MySQL
- Backend Node.js básico

#### 🐛 Problemas Conocidos
- No responsive
- Sin autenticación real
- Datos hardcodeados
- Sin deploy automatizado

---

## Tipos de Cambios

- `✨ Añadido` - para nuevas características
- `🔄 Cambiado` - para cambios en funcionalidad existente
- `🗑️ Obsoleto` - para características que se eliminarán pronto
- `🐛 Eliminado` - para características eliminadas
- `🔧 Arreglado` - para corrección de bugs
- `🔒 Seguridad` - para vulnerabilidades corregidas

---

## Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/):
- **MAJOR** version cuando hay cambios incompatibles en la API
- **MINOR** version cuando se añade funcionalidad compatible
- **PATCH** version para correcciones de bugs compatibles

---

**Última actualización:** 2026-03-01  
**Versión actual:** 2.0.0
