# 🚀 DEPLOY DESDE TERMINAL - INSTRUCCIONES

## ⚡ OPCIÓN 1: COMANDO ÚNICO (MÁS RÁPIDO)

Copia y pega esto en tu terminal local:

```bash
ssh root@94.143.141.241 'cd /var/www/bamroyalties && git pull origin main && npm install && npm run build && cd backend && npm install && pm2 restart bamroyalties && cd .. && sudo systemctl restart nginx && echo "" && echo "✅ COMPLETADO" && echo "🌐 https://app.bigartist.es" && pm2 list'
```

Presiona Enter y espera 2-3 minutos.

---

## 🔧 OPCIÓN 2: PASO A PASO (MÁS CONTROL)

### 1️⃣ Conectar al servidor

```bash
ssh root@94.143.141.241
```

### 2️⃣ Una vez dentro, copia y pega:

```bash
cd /var/www/bamroyalties && \
git pull origin main && \
npm install && \
npm run build && \
cd backend && \
npm install && \
pm2 restart bamroyalties && \
cd .. && \
sudo systemctl restart nginx && \
echo "" && \
echo "✅ COMPLETADO" && \
echo "🌐 https://app.bigartist.es" && \
pm2 list
```

### 3️⃣ Salir del servidor

```bash
exit
```

---

## 📋 OPCIÓN 3: SCRIPT COMPLETO CON VERIFICACIONES

### 1️⃣ Subir el script al servidor

Primero sube el script:

```bash
scp DEPLOY-SERVER-COMPLETE.sh root@94.143.141.241:/root/
```

### 2️⃣ Conectar y ejecutar

```bash
ssh root@94.143.141.241
chmod +x /root/DEPLOY-SERVER-COMPLETE.sh
/root/DEPLOY-SERVER-COMPLETE.sh
```

---

## 📱 VERIFICAR EN TU MÓVIL

Después de ejecutar cualquiera de las opciones:

1. **Abre tu navegador móvil**
2. **Visita:** `https://app.bigartist.es`
3. **Limpia la caché:**
   - iOS Safari: Ajustes > Safari > Borrar historial
   - Android Chrome: Menú > Configuración > Privacidad > Borrar datos
4. **Recarga la página**

---

## ✅ QUÉ DEBERÍAS VER

### LoginPanel:
```
┌──────────────────┐
│  [LOGO BIGARTIST] │
│  ───────────────  │
│ ROYALTIES SYSTEM  │
│                   │
│  📧 Email         │
│  🔒 Contraseña    │
│  [Iniciar Sesión] │
└──────────────────┘
```

### AdminPanel (Móvil):
```
┌──────────────────────────┐
│ [LOGO]    [🔔] [⚙️] [☰]  │
└──────────────────────────┘

Al tocar ☰:
┌──────────────────────────┐
│ 📊 Dashboard             │
│ 👥 Artistas              │
│ 🎵 Catálogo              │
│ 💰 Finanzas              │
│ 📄 Contratos             │
│ ⬆️  Subir CSV            │
├──────────────────────────┤
│ 🚪 Cerrar Sesión (rojo)  │
└──────────────────────────┘
```

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "Permission denied"
```bash
sudo su
# Luego ejecuta los comandos
```

### ❌ Error: PM2 no reinicia
```bash
cd /var/www/bamroyalties/backend
pm2 delete bamroyalties
pm2 start server.js --name bamroyalties
pm2 save
```

### ❌ Error: Nginx no reinicia
```bash
sudo nginx -t  # Verificar configuración
sudo systemctl status nginx  # Ver estado
sudo systemctl restart nginx  # Reiniciar
```

### ❌ No veo cambios en móvil
1. Limpia caché del navegador
2. Prueba en modo incógnito
3. Verifica que el deploy terminó OK
4. Espera 1-2 minutos para propagación

### ❌ Error: "Not a git repository"
```bash
cd /var/www/bamroyalties
git init
git remote add origin https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git
git fetch origin
git checkout -b main origin/main
```

---

## 📊 COMANDOS ÚTILES

### Ver logs del backend
```bash
pm2 logs bamroyalties
```

### Ver logs de Nginx
```bash
tail -f /var/log/nginx/bamroyalties_error.log
```

### Reiniciar todo
```bash
pm2 restart bamroyalties
sudo systemctl restart nginx
sudo systemctl restart mysql
```

### Verificar estado
```bash
pm2 list
sudo systemctl status nginx
sudo systemctl status mysql
```

---

## 🎯 RESUMEN RÁPIDO

**Para deployment rápido:**
```bash
ssh root@94.143.141.241
cd /var/www/bamroyalties
git pull && npm run build && cd backend && pm2 restart bamroyalties && cd .. && sudo systemctl restart nginx
exit
```

**Ver en móvil:**
- https://app.bigartist.es
- Limpia caché
- ¡Listo!

---

## 📞 INFORMACIÓN DEL SERVIDOR

- **IP:** 94.143.141.241
- **Usuario:** root
- **Directorio app:** /var/www/bamroyalties
- **Dominio:** app.bigartist.es
- **Backend puerto:** 3001
- **GitHub:** https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git

---

## ⏱️ TIEMPO ESTIMADO

- **Opción 1 (Comando único):** 2-3 minutos
- **Opción 2 (Paso a paso):** 3-5 minutos
- **Opción 3 (Script completo):** 5-8 minutos

---

## 🎉 ¡ESO ES TODO!

Elige la opción que prefieras y en pocos minutos verás tu app actualizada en el móvil.

**¡Buena suerte! 🚀📱**
