# 🚀 ACTUALIZAR APP - SOLO SSH

## 📝 PASO 1: Conectar al servidor

```bash
ssh root@94.143.141.241
```

---

## 📝 PASO 2: Copiar y pegar esto

```bash
cd /var/www/bamroyalties && git pull origin main && npm run build && cd backend && pm2 restart bamroyalties && cd .. && sudo systemctl restart nginx && echo "" && echo "✅ ACTUALIZADO!" && echo "🌐 https://app.bigartist.es"
```

---

## 📝 PASO 3: Salir

```bash
exit
```

---

## 📱 PASO 4: Ver en tu móvil

**https://app.bigartist.es**

*(Limpia caché del navegador)*

---

## ⚡ VERSIÓN ULTRA CORTA

Si ya estás conectado al servidor por SSH:

```bash
cd /var/www/bamroyalties
git pull
npm run build
cd backend
pm2 restart bamroyalties
sudo systemctl restart nginx
```

---

¡Eso es todo! 🎉
