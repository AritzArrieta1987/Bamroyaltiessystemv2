# 🚀 DEPLOY: Funcionalidad de Upload CSV

## 📋 Resumen de Cambios

Hemos añadido la funcionalidad de **subir archivos CSV directamente desde la webapp** para importar datos de royalties.

### ✨ Características Nuevas:
- ✅ Endpoint `/api/royalties/import` para recibir archivos CSV
- ✅ Interfaz drag & drop en la página `/upload`
- ✅ Procesamiento automático usando el script `importCSV.js`
- ✅ Estadísticas en tiempo real después de la importación
- ✅ Notificaciones con toast
- ✅ Límite de 50MB por archivo

---

## 🔧 PASO 1: Actualizar Backend (SSH al servidor)

```bash
# Conectar al servidor
ssh root@94.143.141.241

# Ir al directorio del servidor
cd /var/www/bigartist/server

# Actualizar server.js (copiar el código actualizado)
nano server.js
```

**Cambios en `server.js`:**
1. Agregar imports:
   ```javascript
   const multer = require('multer');
   const fs = require('fs');
   const path = require('path');
   const { spawn } = require('child_process');
   ```

2. Configurar multer:
   ```javascript
   const upload = multer({ 
     dest: '/tmp/',
     limits: { fileSize: 50 * 1024 * 1024 } // 50MB máx
   });
   ```

3. Agregar endpoint de importación (antes del health check):
   ```javascript
   // **ENDPOINT: Importar CSV**
   app.post('/api/royalties/import', verifyToken, upload.single('csv'), async (req, res) => {
     // ... (ver server.js completo)
   });
   ```

**Instalar multer:**
```bash
npm install multer
```

**Reiniciar PM2:**
```bash
pm2 restart bigartist-api
pm2 logs bigartist-api --lines 50
```

**Verificar que funciona:**
```bash
curl http://localhost:3001/api/health
```

---

## 🎨 PASO 2: Actualizar Frontend

En tu **Mac local**:

```bash
# Build del frontend
npm run build

# Subir al servidor
scp -r dist/* root@94.143.141.241:/var/www/bigartist/frontend/
```

**O actualizar manualmente en el servidor:**

```bash
# En el servidor
cd /var/www/bigartist
git pull origin main  # Si tienes Git configurado

# O copiar manualmente los archivos actualizados
```

**Reiniciar Nginx:**
```bash
systemctl reload nginx
```

---

## 📤 PASO 3: Subir el CSV

1. Ve a: **https://app.bigartist.es/upload**
2. Arrastra el archivo `Oct2017_fullreport_big_artist_EU.csv`
3. Haz clic en **"Procesar CSV"**
4. Espera a que termine la importación
5. Verás las estadísticas:
   - Artistas
   - Canciones
   - Plataformas
   - Territorios
   - Total Royalties
   - Ingresos Totales

---

## 🧪 Testing

**Probar el endpoint directamente:**

```bash
# Desde el servidor
cd /var/www/bigartist/server

# Login para obtener token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"BigArtist2024"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Subir CSV de prueba
curl -X POST http://localhost:3001/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "csv=@data.csv"
```

---

## 📊 Verificar Datos Importados

```bash
# En el servidor
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  (SELECT COUNT(*) FROM artists) as artists,
  (SELECT COUNT(*) FROM tracks) as tracks,
  (SELECT COUNT(*) FROM platforms) as platforms,
  (SELECT COUNT(*) FROM territories) as territories,
  (SELECT COUNT(*) FROM royalty_details) as royalties,
  (SELECT ROUND(SUM(net_receipts), 2) FROM royalty_details) as total_revenue;
"
```

---

## 🔍 Troubleshooting

### Error: "Module 'multer' not found"
```bash
cd /var/www/bigartist/server
npm install multer
pm2 restart bigartist-api
```

### Error: "Permission denied" al subir CSV
```bash
# Verificar permisos en /tmp
ls -la /tmp
chmod 777 /tmp  # Solo si es necesario
```

### Error: "spawn ENOENT"
```bash
# Verificar que existe el script
ls -la /var/www/bigartist/server/scripts/importCSV.js

# Verificar que node está en el PATH
which node
```

### El frontend no se actualiza
```bash
# Limpiar caché del navegador
# O forzar recarga con Ctrl+Shift+R (Cmd+Shift+R en Mac)

# En el servidor, verificar archivos
ls -la /var/www/bigartist/frontend/
```

---

## 📁 Estructura de Archivos

```
/var/www/bigartist/
├── server/
│   ├── server.js              ← ✅ Actualizado
│   ├── scripts/
│   │   └── importCSV.js       ← ✅ Existe
│   ├── database/
│   │   └── schema.sql         ← ✅ Existe
│   └── package.json
└── frontend/
    ├── index.html
    ├── assets/
    │   └── index-*.js         ← ✅ Actualizado
    └── ...
```

---

## ✅ Checklist de Deploy

- [ ] Backend actualizado con endpoint `/api/royalties/import`
- [ ] Dependencia `multer` instalada
- [ ] PM2 reiniciado
- [ ] Frontend compilado y subido
- [ ] Nginx recargado
- [ ] Página `/upload` funciona correctamente
- [ ] Se puede subir un CSV de prueba
- [ ] Estadísticas se muestran después de la importación

---

## 🎯 Resultado Esperado

Después del deploy:

1. ✅ La webapp tiene una página funcional de upload en `/upload`
2. ✅ Se puede arrastrar y soltar archivos CSV
3. ✅ Los archivos se procesan automáticamente
4. ✅ Se muestran estadísticas en tiempo real
5. ✅ Los datos se guardan en MySQL
6. ✅ El dashboard se actualiza con los datos nuevos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `pm2 logs bigartist-api`
2. Verifica el health check: `curl http://localhost:3001/api/health`
3. Comprueba que MySQL está corriendo: `systemctl status mysql`

---

**Última actualización:** 2 de Marzo, 2026
