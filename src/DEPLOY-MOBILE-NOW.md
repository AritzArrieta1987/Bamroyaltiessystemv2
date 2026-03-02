# 🚀 DEPLOYMENT MÓVIL - PASO A PASO

**Fecha:** 1 de Marzo, 2026  
**Versión:** 2.0.0 - Optimización Móvil  
**Objetivo:** Ver los cambios en tu móvil en producción

---

## 📋 PASO 1: SUBIR A GITHUB

### Opción A: Script Automático (Recomendado) ⚡

```bash
# Dale permisos de ejecución
chmod +x GIT-COMMIT-MOBILE.sh

# Ejecuta el script
./GIT-COMMIT-MOBILE.sh
```

### Opción B: Comandos Manuales 📝

```bash
# 1. Añadir archivos
git add components/AdminLayout.tsx
git add imports/login-panel.tsx
git add index.html
git add package.json

# 2. Commit
git commit -m "feat: Optimización móvil completa y cambio a ROYALTIES SYSTEM"

# 3. Push
git push origin main
```

---

## 📋 PASO 2: CONECTAR AL SERVIDOR

```bash
# Conecta por SSH al servidor
ssh root@94.143.141.241
```

**Contraseña:** La que configuraste para el servidor

---

## 📋 PASO 3: DEPLOY EN EL SERVIDOR

Una vez dentro del servidor:

```bash
# Ir al directorio de la aplicación
cd /var/www/bamroyalties

# Opción A: Deploy Rápido (Solo pull + restart) ⚡
./deploy-quick.sh

# Opción B: Deploy Completo (Con build) 🔄
./deploy.sh
```

### Recomendación:
- **Primera vez:** Usa `./deploy.sh` (deploy completo)
- **Actualizaciones:** Usa `./deploy-quick.sh` (más rápido)

---

## 📋 PASO 4: VERIFICAR EN TU MÓVIL

### 1. Abre tu navegador móvil (Chrome, Safari, etc.)

### 2. Visita: `https://app.bigartist.es`

### 3. Limpia la caché (importante):
- **iOS Safari:** Settings > Safari > Clear History and Website Data
- **Android Chrome:** Settings > Privacy > Clear browsing data

### 4. Verifica:
- ✅ LoginPanel muestra "ROYALTIES SYSTEM"
- ✅ Imagen de fondo cubre toda la pantalla
- ✅ Al entrar, el header muestra solo el logo BIGARTIST
- ✅ Aparece el botón hamburguesa (☰) en la esquina
- ✅ Al tocar ☰, se despliega el menú
- ✅ El menú incluye: Dashboard, Artistas, Catálogo, Finanzas, Contratos, Subir CSV
- ✅ Al final del menú aparece "Cerrar Sesión" en rojo
- ✅ Todo es táctil y responsive

---

## 🔍 TROUBLESHOOTING

### Problema: No veo los cambios
**Solución:**
```bash
# En el servidor
cd /var/www/bamroyalties
./deploy.sh  # Deploy completo
sudo systemctl restart nginx
```

### Problema: Error 502 Bad Gateway
**Solución:**
```bash
# Verifica el backend
cd /var/www/bamroyalties/backend
pm2 restart bamroyalties
pm2 logs bamroyalties
```

### Problema: Cambios no se reflejan en móvil
**Solución:**
1. Limpia caché del navegador móvil
2. Recarga con "Hard Refresh"
3. Prueba en modo incógnito
4. Verifica que el deploy terminó correctamente

### Problema: Menu hamburguesa no aparece
**Solución:**
- Verifica el ancho de tu pantalla
- El menú aparece solo en pantallas < 968px
- Prueba rotando el dispositivo a vertical

---

## 📱 DISEÑOS ESPERADOS

### LoginPanel (Móvil Vertical)
```
┌─────────────────────────┐
│                         │
│   [LOGO BIGARTIST]      │
│   ─────────────         │
│  ROYALTIES SYSTEM       │
│                         │
├─────────────────────────┤
│                         │
│  📧 Email               │
│  ┌───────────────────┐  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  🔒 Contraseña          │
│  ┌───────────────────┐  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ Iniciar Sesión    │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

### AdminPanel (Móvil Vertical)
```
┌─────────────────────────┐
│ [LOGO]      [🔔] [⚙️] [☰]│
├─────────────────────────┤
│                         │
│  Dashboard Content      │
│                         │
└─────────────────────────┘

Al tocar ☰:
┌─────────────────────────┐
│ [LOGO]      [🔔] [⚙️] [✕]│
├─────────────────────────┤
│ 📊 Dashboard            │
│ 👥 Artistas             │
│ 🎵 Catálogo             │
│ 💰 Finanzas             │
│ 📄 Contratos            │
│ ⬆️  Subir CSV           │
├─────────────────────────┤
│ 🚪 Cerrar Sesión        │
└─────────────────────────┘
```

---

## ✅ CHECKLIST FINAL

Antes de cerrar, verifica:

- [ ] Código subido a GitHub (git push exitoso)
- [ ] Deploy ejecutado en servidor
- [ ] Nginx reiniciado si fue necesario
- [ ] Página carga en móvil
- [ ] LoginPanel muestra "ROYALTIES SYSTEM"
- [ ] Imagen de fondo visible en toda la pantalla
- [ ] Menu hamburguesa funcional
- [ ] Todas las opciones del menú funcionan
- [ ] "Cerrar Sesión" aparece en menú móvil
- [ ] Navegación táctil fluida
- [ ] No hay errores en consola del navegador

---

## 🎯 COMANDOS RESUMIDOS

### En tu máquina local:
```bash
chmod +x GIT-COMMIT-MOBILE.sh
./GIT-COMMIT-MOBILE.sh
```

### En el servidor (vía SSH):
```bash
ssh root@94.143.141.241
cd /var/www/bamroyalties
./deploy-quick.sh
```

### En tu móvil:
```
1. Abre Chrome/Safari
2. Visita: https://app.bigartist.es
3. Limpia caché
4. ¡Disfruta!
```

---

## 📞 URLS IMPORTANTES

- **Producción:** https://app.bigartist.es
- **Repositorio:** https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git
- **Servidor:** 94.143.141.241
- **Dominio:** app.bigartist.es

---

## 🎉 ¡TODO LISTO!

Después de seguir estos pasos, podrás ver tu aplicación completamente optimizada para móvil con:

✨ Diseño responsive profesional  
✨ Menu hamburguesa funcional  
✨ Imagen de fondo en toda la pantalla  
✨ Navegación táctil optimizada  
✨ Branding actualizado a "ROYALTIES SYSTEM"  

**¡Disfruta de tu aplicación móvil!** 📱🚀
