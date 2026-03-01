# 🚀 CÓMO DESPLEGAR LA APLICACIÓN

## ⚡ MÉTODO 1: DEPLOY AUTOMÁTICO (RECOMENDADO)

### Desde tu terminal local (Mac/Linux/Windows Git Bash):

```bash
bash deploy-local.sh "Descripción de tus cambios"
```

**Ejemplo:**
```bash
bash deploy-local.sh "Añadido favicon y botón limpiar datos"
```

Esto hace **TODO automáticamente**:
1. ✅ `git add .`
2. ✅ `git commit -m "..."`
3. ✅ `git push origin main`
4. ✅ Se conecta al servidor vía SSH
5. ✅ Ejecuta `deploy.sh` en el servidor
6. ✅ Compila frontend + reinicia backend + reinicia Nginx

### ⚡ Versión súper rápida:

```bash
bash quick-deploy.sh "Update"
```

---

## 📋 MÉTODO 2: DEPLOY MANUAL (Paso a Paso)

### 1️⃣ **Desde tu máquina (después de cambios en Figma Make)**

```bash
git add .
git commit -m "Descripción de tus cambios"
git push origin main
```

### 2️⃣ **Conectarse al servidor**

```bash
ssh root@94.143.141.241
```

### 3️⃣ **Ir a la carpeta del proyecto**

```bash
cd /var/www/bigartist
```

### 4️⃣ **Ejecutar el script de deploy**

```bash
bash deploy.sh
```

### 5️⃣ **¡LISTO!** ✅

Abre en tu navegador: **https://app.bigartist.es**

---

## 🔧 QUÉ HACE EL SCRIPT `deploy.sh`

El script automáticamente:

1. ✅ Descarga los últimos cambios desde GitHub (`git pull`)
2. ✅ Instala dependencias del frontend (`npm install`)
3. ✅ Compila el frontend React/Vite (`npm run build`)
4. ✅ Configura permisos de la carpeta `dist/`
5. ✅ Instala dependencias del backend (`cd server && npm install`)
6. ✅ Reinicia el backend con PM2 (`pm2 restart bigartist-api`)
7. ✅ Reinicia Nginx (`systemctl restart nginx`)
8. ✅ Muestra el estado final de todos los servicios

---

## 🆘 COMANDOS ÚTILES

### Ver logs del backend
```bash
pm2 logs bigartist-api
```

### Reiniciar solo el backend
```bash
pm2 restart bigartist-api
```

### Ver logs de Nginx
```bash
tail -f /var/log/nginx/error.log
```

### Reiniciar Nginx
```bash
systemctl restart nginx
```

### Ver estado de PM2
```bash
pm2 status
```

### Ver estado de Nginx
```bash
systemctl status nginx
```

---

## 📌 INFORMACIÓN DEL SERVIDOR

- **IP**: 94.143.141.241
- **Dominio**: https://app.bigartist.es
- **Usuario SSH**: root
- **Carpeta del proyecto**: /var/www/bigartist
- **Backend**: Puerto 3001 (PM2)
- **Frontend**: Nginx sirve desde /var/www/bigartist/dist

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### El deploy falla en git pull
```bash
# Resetear cambios locales
git reset --hard origin/main
git pull origin main
bash deploy.sh
```

### El backend no arranca
```bash
# Ver los logs
pm2 logs bigartist-api --lines 50

# Reiniciar completamente
pm2 delete bigartist-api
cd /var/www/bigartist/server
pm2 start server.js --name bigartist-api
pm2 save
```

### Nginx da error
```bash
# Verificar configuración
nginx -t

# Reiniciar
systemctl restart nginx

# Ver logs
tail -f /var/log/nginx/error.log
```

### El frontend no se actualiza en el navegador
Abre el navegador y presiona: **Ctrl + Shift + R** (hard reload)

---

## 🎯 RESUMEN ULTRA RÁPIDO

```bash
# En tu máquina
git add . && git commit -m "Update" && git push

# En el servidor
ssh root@94.143.141.241
cd /var/www/bigartist
bash deploy.sh
```

**¡Eso es todo!** 🎉