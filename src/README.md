# 🎵 BAM Royalties System - BIGARTIST

Sistema profesional de gestión de royalties para artistas musicales.

## 🌐 URLs

- **Aplicación**: https://app.bigartist.es
- **Repositorio**: https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git

## 🚀 Desplegar Cambios

Después de hacer cambios en Figma Make:

```bash
# 1. Commit y push desde tu máquina
git add .
git commit -m "Descripción de cambios"
git push origin main

# 2. En el servidor
ssh root@94.143.141.241
cd /var/www/bigartist
bash deploy.sh
```

👉 **[Ver instrucciones completas](./COMO-DESPLEGAR.md)**

## 🏗️ Arquitectura

### Frontend
- **React** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** v4
- **Recharts** (gráficos)
- **React Router** (navegación)

### Backend
- **Node.js** + **Express**
- **MySQL** (base de datos)
- **PM2** (process manager)

### Servidor
- **Nginx** (proxy reverso + SSL)
- **Ubuntu 24.04**
- **Certbot** (SSL gratuito)

## 📁 Estructura

```
/
├── public/              # Archivos estáticos (favicon, etc)
├── components/          # Componentes React reutilizables
├── pages/              # Páginas de la aplicación
├── server/             # Backend (Node.js + Express)
├── styles/             # Estilos globales
├── utils/              # Utilidades (API, debug)
├── deploy.sh           # 🚀 Script de deploy
└── COMO-DESPLEGAR.md   # 📖 Instrucciones de deploy
```

## 🎨 Características

- ✅ Login elegante verde/dorado
- ✅ Dashboard con estadísticas de royalties
- ✅ Gestión de artistas
- ✅ Catálogo de canciones
- ✅ Contratos y pagos
- ✅ Importación CSV (The Orchard)
- ✅ Gráficos interactivos (Recharts)
- ✅ Portal de artistas
- ✅ Diseño responsive

## 🔧 Comandos Útiles

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

### En Producción (Servidor)

```bash
# Ver logs del backend
pm2 logs bigartist-api

# Reiniciar backend
pm2 restart bigartist-api

# Ver logs de Nginx
tail -f /var/log/nginx/error.log

# Reiniciar Nginx
systemctl restart nginx
```

## 📊 Base de Datos MySQL

- **Host**: localhost
- **Puerto**: 3306
- **Usuario**: bigartist_user
- **Contraseña**: BigArtist2018!@?
- **Base de datos**: bigartist_royalties

## 🔐 SSL/HTTPS

Certificado SSL gratuito de Let's Encrypt configurado automáticamente.

Renovación automática con Certbot.

## 👨‍💻 Desarrollo

Creado con **Figma Make** por el equipo de BIGARTIST.

## 📞 Soporte

Para problemas o dudas, consulta: **COMO-DESPLEGAR.md**

---

**© 2024 BIGARTIST - BAM Royalties System**
