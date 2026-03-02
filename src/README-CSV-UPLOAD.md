# 📤 CSV Upload Feature - BIGARTIST Royalties System

## 🎯 Resumen Ejecutivo

**IMPLEMENTADO:** Sistema completo de importación de CSV de The Orchard directamente desde la webapp.

**TIEMPO DE IMPLEMENTACIÓN:** Completado  
**ESTADO:** ✅ Listo para deploy  
**PRÓXIMO PASO:** Ejecutar deploy en el servidor

---

## 🚀 DEPLOY EN 1 COMANDO

```bash
chmod +x QUICK-DEPLOY.sh && ./QUICK-DEPLOY.sh
```

**Esto hará:**
1. ✅ Subir `server.js` actualizado al servidor
2. ✅ Instalar dependencia `multer`
3. ✅ Reiniciar PM2

**Tiempo estimado:** 30 segundos

---

## 📋 Archivos Listos para Deploy

### **Backend (ya actualizados)**
- ✅ `/server/server.js` - Con endpoint `/api/royalties/import`
- ✅ `/server/package.json` - Con dependencia `multer`
- ✅ `/server/scripts/importCSV.js` - Script de importación

### **Frontend (ya actualizado)**
- ✅ `/pages/UploadPage.tsx` - Interfaz completa de upload

### **Documentación**
- ✅ `/INSTRUCCIONES-UPLOAD-CSV.md` - Guía completa
- ✅ `/RESUMEN-FUNCIONALIDAD-CSV.md` - Detalles técnicos
- ✅ `/COMANDOS-SSH-CSV-UPLOAD.txt` - Comandos manuales

---

## 🎬 Demo: Cómo usar después del deploy

### **1. Acceder a la página de upload**
```
https://app.bigartist.es/upload
```

### **2. Arrastrar el CSV**
- Arrastra `Oct2017_fullreport_big_artist_EU.csv`
- O haz clic para seleccionar

### **3. Procesar**
- Click en "Procesar CSV"
- Espera 10-30 segundos

### **4. Ver resultados**
```
✅ Importación Completada

Artistas: 12
Canciones: 50
Plataformas: 5
Territorios: 20
Total Royalties: 1,523
Ingresos Totales: €1,234.56
```

---

## 🔧 Opciones de Deploy

### **OPCIÓN 1: Script Automático (Recomendado)**
```bash
chmod +x QUICK-DEPLOY.sh
./QUICK-DEPLOY.sh
```

### **OPCIÓN 2: Manual (SSH)**
```bash
ssh root@94.143.141.241

cd /var/www/bigartist/server
# Copiar el contenido de /server/server.js

npm install multer
pm2 restart bigartist-api
pm2 logs bigartist-api --lines 30
```

### **OPCIÓN 3: Copy-Paste Total**
Abre `/COMANDOS-SSH-CSV-UPLOAD.txt` y copia TODO en tu terminal SSH.

---

## ✅ Verificación Post-Deploy

### **1. Health Check**
```bash
curl https://app.bigartist.es/api/health
```
Respuesta esperada:
```json
{"status":"OK","timestamp":"2026-03-02T..."}
```

### **2. PM2 Status**
```bash
ssh root@94.143.141.241
pm2 list
```
Debe mostrar `bigartist-api` en estado `online`.

### **3. Logs**
```bash
pm2 logs bigartist-api --lines 20
```
Debe mostrar:
```
✅ Servidor corriendo en puerto 3001
📊 Health check: http://localhost:3001/api/health
```

### **4. Interfaz Web**
```
https://app.bigartist.es/upload
```
Debe mostrar la página de upload con drag & drop.

---

## 🧪 Prueba Completa

### **Test 1: Login**
```bash
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"BigArtist2024"}'
```

### **Test 2: Upload CSV**
```bash
# Obtener token
TOKEN=$(curl -s -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"BigArtist2024"}' \
  | jq -r '.token')

# Subir CSV
curl -X POST https://app.bigartist.es/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "csv=@imports/Oct2017_fullreport_big_artist_EU.csv"
```

### **Test 3: Verificar Datos**
```bash
ssh root@94.143.141.241

mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  (SELECT COUNT(*) FROM artists) as artistas,
  (SELECT COUNT(*) FROM tracks) as canciones,
  (SELECT COUNT(*) FROM royalty_details) as royalties,
  (SELECT ROUND(SUM(net_receipts), 2) FROM royalty_details) as total
FROM DUAL;
"
```

---

## 📊 Estructura de Datos

### **Tablas de MySQL**

```sql
-- Catálogos
artists           -- Artistas únicos
tracks            -- Canciones (relacionadas con artistas)
platforms         -- Plataformas (Spotify, YouTube, etc.)
territories       -- Países/territorios
royalty_types     -- Tipos de transacción (AV, S, AS, SV)
periods           -- Períodos mensuales (2017M10, etc.)

-- Datos
royalty_details   -- Detalles de cada royalty
royalty_summary   -- Resumen agregado por período
```

### **Formato del CSV**

```csv
Period;Activity Period;DMS;Territory;Orchard UPC;...;Label Share Net Receipts;...
2017M10;2017M9;YouTube;Spain;191774000000;...;0,258066;EUR
```

**Características:**
- Delimitador: `;` (punto y coma)
- Números: `,` (coma decimal europea)
- Encoding: UTF-8
- Tamaño máximo: 50MB

---

## 🔒 Seguridad

- ✅ **Autenticación JWT**: Solo usuarios con token válido
- ✅ **Validación de archivos**: Solo `.csv` permitidos
- ✅ **Límite de tamaño**: Máximo 50MB
- ✅ **Limpieza automática**: Archivos temporales eliminados
- ✅ **SQL Injection**: Protección con prepared statements

---

## 📈 Rendimiento

### **Tiempos esperados:**
- 100 líneas: ~2-3 segundos
- 1,000 líneas: ~10-15 segundos
- 10,000 líneas: ~1-2 minutos

### **Optimizaciones:**
- Caché de IDs en memoria
- Conexión persistente a MySQL
- Procesamiento línea por línea (streaming)
- Índices en columnas de búsqueda

---

## 🆘 Troubleshooting

### ❌ "Module 'multer' not found"
```bash
ssh root@94.143.141.241
cd /var/www/bigartist/server
npm install multer
pm2 restart bigartist-api
```

### ❌ "spawn ENOENT"
```bash
# Verificar que existe el script
ls -la /var/www/bigartist/server/scripts/importCSV.js

# Si no existe, crearlo
# (Copiar de /server/scripts/importCSV.js)
```

### ❌ "Cannot connect to MySQL"
```bash
ssh root@94.143.141.241
systemctl status mysql
systemctl start mysql
```

### ❌ "Permission denied /tmp"
```bash
ssh root@94.143.141.241
chmod 777 /tmp
```

### ❌ Frontend no actualiza
```bash
# Limpiar caché del navegador
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# O recompilar frontend
npm run build
scp -r dist/* root@94.143.141.241:/var/www/bigartist/frontend/
```

---

## 📞 Comandos Útiles

### **Ver logs en tiempo real**
```bash
ssh root@94.143.141.241
pm2 logs bigartist-api
```

### **Reiniciar todo**
```bash
pm2 restart bigartist-api
systemctl reload nginx
```

### **Ver datos en MySQL**
```bash
mysql -u root -p'BigArtist2018!@?' bigartist_db

SHOW TABLES;
SELECT COUNT(*) FROM royalty_details;
SELECT * FROM artists LIMIT 10;
```

### **Eliminar todos los datos** (⚠️ CUIDADO)
```bash
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
TRUNCATE royalty_details;
TRUNCATE tracks;
TRUNCATE artists;
TRUNCATE platforms;
TRUNCATE territories;
TRUNCATE royalty_types;
TRUNCATE periods;
"
```

---

## 🎯 Próximos Pasos Recomendados

Después de importar el CSV:

1. ✅ **Verificar datos en el Dashboard**
   ```
   https://app.bigartist.es/
   ```

2. ✅ **Revisar estadísticas de artistas**
   ```
   https://app.bigartist.es/artists
   ```

3. ✅ **Explorar catálogo de canciones**
   ```
   https://app.bigartist.es/catalog
   ```

4. ✅ **Ver finanzas**
   ```
   https://app.bigartist.es/finances
   ```

---

## 📚 Documentación Completa

- **`INSTRUCCIONES-UPLOAD-CSV.md`** - Guía paso a paso
- **`RESUMEN-FUNCIONALIDAD-CSV.md`** - Detalles técnicos completos
- **`COMANDOS-DEPLOY-CSV.md`** - Comandos de deploy
- **`COMANDOS-SSH-CSV-UPLOAD.txt`** - Comandos para SSH

---

## ✨ Características Implementadas

- ✅ Endpoint API `/api/royalties/import`
- ✅ Interfaz drag & drop
- ✅ Procesamiento en segundo plano
- ✅ Estadísticas en tiempo real
- ✅ Notificaciones con toast
- ✅ Manejo de errores robusto
- ✅ Validación de archivos
- ✅ Limpieza automática
- ✅ Soporte para archivos grandes (50MB)
- ✅ Formato europeo (coma decimal)
- ✅ Compatibilidad con The Orchard

---

## 🎉 Resultado Final

Una vez desplegado, tendrás:

```
🌐 Webapp: https://app.bigartist.es
   ├── 🏠 Dashboard con estadísticas reales
   ├── 👥 Lista de artistas importados
   ├── 🎵 Catálogo de canciones
   ├── 💰 Finanzas y royalties
   └── 📤 Upload de CSV funcional
```

---

**Fecha de Creación:** 2 de Marzo, 2026  
**Versión:** 1.0.0  
**Estado:** ✅ **LISTO PARA DEPLOY**

---

## 🚀 DEPLOY AHORA

```bash
chmod +x QUICK-DEPLOY.sh && ./QUICK-DEPLOY.sh
```

**¡Eso es todo! En 30 segundos estarás subiendo CSV desde la webapp.** 🎉
