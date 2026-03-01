# 🚀 DEPLOY SIMPLE - COMANDO DIRECTO

## ⚡ SI YA HICISTE GIT PUSH DESDE FIGMA MAKE

Ejecuta esto **DIRECTAMENTE** en tu terminal local (Mac):

```bash
ssh root@94.143.141.241 "cd /var/www/bigartist && bash deploy.sh"
```

**Eso es TODO.** Este comando:
1. Se conecta al servidor
2. Va a la carpeta del proyecto
3. Ejecuta el deploy completo

---

## 📋 O SI PREFIERES PASO A PASO:

### 1. Desde Figma Make (ya hecho ✅):
- Descargar código
- Los archivos ya están actualizados localmente

### 2. Hacer commit y push (desde tu Mac):
```bash
cd /ruta/donde/descargaste/figma-make
git add .
git commit -m "Update"
git push origin main
```

### 3. Deploy en servidor (comando único):
```bash
ssh root@94.143.141.241 "cd /var/www/bigartist && bash deploy.sh"
```

---

## 🎯 COMANDO TODO EN UNO

Si quieres hacer commit + push + deploy en un solo comando:

```bash
git add . && git commit -m "Update" && git push origin main && ssh root@94.143.141.241 "cd /var/www/bigartist && bash deploy.sh"
```

---

## 💡 NOTA IMPORTANTE

Los scripts `deploy-local.sh` y `quick-deploy.sh` deben estar:
- ❌ NO en el servidor (root@94.143.141.241)
- ✅ SÍ en tu Mac (donde tienes el código del proyecto)

---

## 🔧 SI QUIERES CREAR EL SCRIPT EN TU MAC:

1. Abre terminal en tu Mac
2. Ve a la carpeta del proyecto:
   ```bash
   cd /ruta/donde/esta/tu/proyecto
   ```

3. Copia y pega esto:
   ```bash
   cat > deploy.sh << 'EOF'
   #!/bin/bash
   git add . && \
   git commit -m "${1:-Update}" && \
   git push origin main && \
   ssh root@94.143.141.241 "cd /var/www/bigartist && bash deploy.sh"
   EOF
   chmod +x deploy.sh
   ```

4. Úsalo así:
   ```bash
   bash deploy.sh "Tu mensaje"
   ```

---

## ⚡ SOLUCIÓN MÁS RÁPIDA (AHORA MISMO):

Desde tu Mac, ejecuta:

```bash
ssh root@94.143.141.241 "cd /var/www/bigartist && git pull && npm install && npm run build && cd server && npm install && cd .. && pm2 restart bigartist-api && systemctl restart nginx"
```

Este comando hace **TODO** en una línea.
