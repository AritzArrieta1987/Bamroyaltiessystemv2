# 🚀 Deployment BAM Royalties - INSTRUCCIONES SIMPLES

## ⚡ OPCIÓN MÁS FÁCIL (Sin tener código en local)

### 1️⃣ Descarga solo el script
```bash
curl -O https://raw.githubusercontent.com/AritzArrieta1987/Bamroyaltiessystemv2/main/deploy-from-github.sh
```

### 2️⃣ Dale permisos y ejecútalo
```bash
chmod +x deploy-from-github.sh
./deploy-from-github.sh
```

### 3️⃣ Abre tu aplicación
```
https://app.bigartist.es
```

**¡Listo! Solo 3 comandos** ✅

---

## 📝 O copia y pega esto directo en tu terminal:

```bash
curl -O https://raw.githubusercontent.com/AritzArrieta1987/Bamroyaltiessystemv2/main/deploy-from-github.sh && chmod +x deploy-from-github.sh && ./deploy-from-github.sh
```

**Todo en un solo comando** 🎯

---

## 🔄 O hazlo manualmente vía SSH:

```bash
# Conéctate al servidor
ssh root@94.143.141.241

# Clona el repositorio
cd /var/www
rm -rf bigartist
git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git bigartist
cd bigartist

# Instala y compila
npm install
npm run build

# Backend
cd server
npm install --production
pm2 restart bigartist-api || pm2 start server.js --name bigartist-api

# Permisos y Nginx
chown -R www-data:www-data /var/www/bigartist/dist
systemctl reload nginx
```

---

## 🌐 Acceso después del deployment

### URL
```
https://app.bigartist.es
```

### Login
- **Email:** admin@bigartist.es  
- **Password:** Admin123!

---

## ❓ Si algo falla

### Ver logs
```bash
ssh root@94.143.141.241 'pm2 logs bigartist-api'
```

### Reiniciar todo
```bash
ssh root@94.143.141.241 'pm2 restart bigartist-api && systemctl reload nginx'
```

---

## 💡 ¿Qué hace el script?

1. ✅ Hace backup automático
2. ✅ Clona el código desde GitHub
3. ✅ Instala dependencias
4. ✅ Compila React
5. ✅ Configura backend
6. ✅ Inicializa MySQL
7. ✅ Configura Nginx
8. ✅ Inicia servicios

**Todo automático, sin interacción** 🤖

---

## 🎉 ¡Eso es todo!

Tu aplicación estará corriendo en menos de 3 minutos.

### Workflow para actualizaciones futuras:

```bash
# Haces cambios en GitHub
# Luego ejecutas:
./deploy-from-github.sh
```

Simple y rápido! 🚀
