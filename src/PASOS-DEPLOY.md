# 🚀 Pasos para Desplegar - BAM Royalties System

## ✅ **OPCIÓN 1: Deployment Rápido (Recomendado)**

### Paso 1: Guardar cambios en GitHub
```bash
git add .
git commit -m "Update: Contratos con edición y PDF"
git push origin main
```

### Paso 2: Ejecutar deployment
```bash
chmod +x quick-deploy.sh
./quick-deploy.sh
```

### Paso 3: Abrir aplicación
```
https://app.bigartist.es
```

**¡Listo! Solo 3 comandos** 🎉

---

## ✅ **OPCIÓN 2: Deployment Completo con Verificaciones**

Si quieres ver todos los detalles y verificaciones:

```bash
chmod +x deploy-final.sh
./deploy-final.sh
```

Este script te mostrará:
- ✅ Backup del sistema actual
- ✅ Progreso detallado de cada paso
- ✅ Verificaciones de servicios
- ✅ Información completa al final

---

## 📋 **Resumen de lo que hace el deployment:**

1. 🧹 **Limpia** la instalación anterior
2. 📥 **Clona** el código desde GitHub
3. 📦 **Instala** dependencias
4. 🏗️ **Compila** el frontend React
5. ⚙️ **Configura** el backend Node.js
6. 🗄️ **Inicializa** MySQL (si es necesario)
7. 🚀 **Reinicia** servicios (PM2 + Nginx)
8. ✅ **Verifica** que todo funcione

---

## 🌐 **Acceso después del deployment:**

### URL
```
https://app.bigartist.es
```

### Login
- **Email:** admin@bigartist.es
- **Password:** Admin123!

---

## 🔧 **Si algo falla:**

### Ver logs del backend
```bash
ssh root@94.143.141.241 'pm2 logs bigartist-api'
```

### Ver logs de Nginx
```bash
ssh root@94.143.141.241 'tail -f /var/log/nginx/bigartist_error.log'
```

### Reiniciar todo
```bash
ssh root@94.143.141.241 'pm2 restart bigartist-api && systemctl reload nginx'
```

---

## 💡 **Tips:**

1. **Siempre haz `git push` antes de desplegar**
2. **Si no ves cambios en el navegador:** Presiona `Ctrl+Shift+R` para limpiar caché
3. **Los scripts crean backup automático** en `/var/www/backups/`
4. **Puedes ejecutar el deployment cuantas veces quieras**, es seguro

---

## 📞 **Comandos útiles:**

```bash
# Ver estado de servicios
ssh root@94.143.141.241 'pm2 status && systemctl status nginx'

# Ver último commit en el servidor
ssh root@94.143.141.241 'cd /var/www/bigartist && git log -1'

# Ver qué está corriendo en el puerto 3001
ssh root@94.143.141.241 'netstat -tlnp | grep 3001'

# Entrar al servidor
ssh root@94.143.141.241
```

---

## 🎉 **¡Eso es todo!**

Con estos pasos tu aplicación estará desplegada en producción en menos de 2 minutos.

### Workflow normal:
```bash
# 1. Haces cambios en tu código
# 2. Guardas en GitHub
git add .
git commit -m "Tu mensaje"
git push

# 3. Despliegas
./quick-deploy.sh

# 4. Verificas
# Abrir: https://app.bigartist.es
```

**¡Simple y rápido!** 🚀
