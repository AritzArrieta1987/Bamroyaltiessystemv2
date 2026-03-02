# 🚀 Guía de Deployment - BIGARTIST Royalties System

## 📋 Información del Servidor

- **IP:** 94.143.141.241
- **Usuario:** root
- **Dominio:** app.bigartist.es
- **Repositorio:** https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git

## 📂 Estructura de Directorios

```
/root/bamroyalties/              # Código fuente del proyecto
/var/www/bigartist/dist/         # Frontend compilado (servido por Nginx)
/var/www/bigartist/backend/      # Backend Node.js (Express + MySQL)
```

## 🔧 Stack Tecnológico

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express
- **Base de datos:** MySQL (bigartist)
- **Servidor web:** Nginx
- **Gestor de procesos:** PM2
- **SSL:** Certbot (Let's Encrypt)

## 📦 Scripts de Deploy

### 1. Deploy Completo (`deploy.sh`)

Realiza un deploy completo con reinicio de servicios:

```bash
# Dar permisos de ejecución (solo primera vez)
chmod +x deploy.sh

# Ejecutar deploy completo
./deploy.sh
```

**Este script:**
- ✅ Conecta al servidor vía SSH
- ✅ Actualiza código desde GitHub (git pull)
- ✅ Instala dependencias npm
- ✅ Compila el frontend (npm run build)
- ✅ Copia archivos a /var/www/bigartist/dist/
- ✅ Reinicia el backend con PM2
- ✅ Recarga Nginx
- ✅ Verifica el estado de los servicios

### 2. Deploy Rápido (`deploy-quick.sh`)

Para actualizaciones rápidas solo del frontend:

```bash
# Dar permisos de ejecución (solo primera vez)
chmod +x deploy-quick.sh

# Ejecutar deploy rápido
./deploy-quick.sh
```

**Este script:**
- ✅ Actualiza código
- ✅ Compila frontend
- ✅ Copia archivos
- ❌ NO reinicia backend (más rápido)

## 🔑 Configuración SSH

Para evitar escribir la contraseña cada vez, configura SSH keys:

```bash
# Generar clave SSH (si no tienes una)
ssh-keygen -t rsa -b 4096

# Copiar clave al servidor
ssh-copy-id root@94.143.141.241
```

## 📝 Comandos Útiles

### Conectar al servidor
```bash
ssh root@94.143.141.241
```

### Ver logs del backend
```bash
ssh root@94.143.141.241 "pm2 logs bigartist-api"
```

### Ver estado de PM2
```bash
ssh root@94.143.141.241 "pm2 status"
```

### Reiniciar backend manualmente
```bash
ssh root@94.143.141.241 "pm2 restart bigartist-api"
```

### Ver logs de Nginx
```bash
ssh root@94.143.141.241 "tail -f /var/log/nginx/access.log"
ssh root@94.143.141.241 "tail -f /var/log/nginx/error.log"
```

### Reiniciar Nginx
```bash
ssh root@94.143.141.241 "systemctl reload nginx"
```

### Verificar estado de MySQL
```bash
ssh root@94.143.141.241 "systemctl status mysql"
```

## 🔄 Flujo de Trabajo Recomendado

### Para cambios en el frontend:
```bash
# 1. Hacer cambios en tu código local
# 2. Commit y push a GitHub
git add .
git commit -m "Descripción de cambios"
git push origin main

# 3. Deploy rápido
./deploy-quick.sh
```

### Para cambios en el backend o base de datos:
```bash
# 1. Hacer cambios y push a GitHub
git add .
git commit -m "Descripción de cambios"
git push origin main

# 2. Deploy completo
./deploy.sh
```

## 🐛 Solución de Problemas

### Error: "Permission denied"
```bash
chmod +x deploy.sh deploy-quick.sh
```

### Error: "Connection refused"
```bash
# Verificar que el servidor esté accesible
ping 94.143.141.241

# Verificar servicio SSH
ssh root@94.143.141.241 "systemctl status ssh"
```

### Error en la compilación
```bash
# Conectar al servidor y compilar manualmente
ssh root@94.143.141.241
cd /root/bamroyalties
npm install
npm run build
```

### Backend no responde
```bash
# Ver logs y reiniciar
ssh root@94.143.141.241 "pm2 logs bigartist-api"
ssh root@94.143.141.241 "pm2 restart bigartist-api"
```

## 🔐 Credenciales

### Base de datos MySQL
- **Usuario:** root
- **Contraseña:** BigArtist2018!@?
- **Base de datos:** bigartist

### Usuario Admin por defecto
- **Email:** admin@bigartist.es
- **Contraseña:** admin123

### Usuario Artist de prueba
- **Email:** artist@bigartist.es
- **Contraseña:** artist123

## 📱 Responsive Mobile

El LoginPanel tiene ajustes responsive completos:

- **Desktop:** Diseño de 2 columnas (55% logo / 45% formulario)
- **Tablet (< 968px):** Columna única, logo arriba (40vh), formulario abajo (60vh)
- **Mobile (< 480px):** Optimizado para móviles pequeños (35vh / 65vh)

## ✅ Checklist Post-Deploy

Después de cada deploy, verifica:

- [ ] La aplicación carga en https://app.bigartist.es
- [ ] El login funciona correctamente
- [ ] No hay errores en la consola del navegador
- [ ] El backend responde (verificar API)
- [ ] Los logs de PM2 no muestran errores
- [ ] Nginx está funcionando correctamente
- [ ] El certificado SSL es válido

## 📞 Soporte

Para cualquier problema durante el deploy, revisar:
1. Logs de PM2: `pm2 logs bigartist-api`
2. Logs de Nginx: `/var/log/nginx/error.log`
3. Estado de servicios: `systemctl status nginx mysql`

---

**Última actualización:** Marzo 2026
**Versión:** 2.0
