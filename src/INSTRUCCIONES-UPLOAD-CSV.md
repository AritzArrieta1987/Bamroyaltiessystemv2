# 📤 Funcionalidad de Upload CSV - BIGARTIST

## 🎯 ¿Qué hemos creado?

Una **interfaz web completa** para subir archivos CSV de The Orchard y procesarlos automáticamente en la base de datos MySQL.

### ✨ Características:
- ✅ **Drag & Drop**: Arrastra archivos directamente
- ✅ **API RESTful**: Endpoint `/api/royalties/import`
- ✅ **Procesamiento automático**: Usa el script `importCSV.js`
- ✅ **Estadísticas en tiempo real**: Muestra resultados instantáneos
- ✅ **Notificaciones**: Toast messages elegantes
- ✅ **Límite de tamaño**: Hasta 50MB por archivo

---

## 🚀 DEPLOY RÁPIDO (3 pasos)

### **Opción 1: Ejecutar todo desde tu Mac**

```bash
# Dale permisos al script
chmod +x UPDATE-SERVER-JS.sh

# Ejecutar
./UPDATE-SERVER-JS.sh
```

### **Opción 2: Ejecutar manualmente en el servidor**

1. **Conecta por SSH:**
   ```bash
   ssh root@94.143.141.241
   ```

2. **Copia y pega todos los comandos** del archivo `COMANDOS-SSH-CSV-UPLOAD.txt`

3. **Verifica que funciona:**
   ```bash
   curl http://localhost:3001/api/health
   pm2 logs bigartist-api --lines 20
   ```

---

## 📋 ¿Qué se ha actualizado?

### **Backend (`server.js`)**
- ✅ Agregado endpoint `POST /api/royalties/import`
- ✅ Multer para manejar archivos
- ✅ Ejecución del script `importCSV.js`
- ✅ Respuesta con estadísticas después de importar

### **Frontend (`/pages/UploadPage.tsx`)**
- ✅ Interfaz drag & drop mejorada
- ✅ Conexión con API real (no localStorage)
- ✅ Muestra estadísticas reales:
  - Artistas importados
  - Canciones importadas
  - Plataformas detectadas
  - Territorios detectados
  - Total de royalties
  - Ingresos totales

### **Nuevos archivos**
- ✅ `/server/scripts/importCSV.js` - Script de importación
- ✅ `/server/database/schema.sql` - Esquema de base de datos

---

## 🧪 Cómo probarlo

### 1. **Desde la webapp**

1. Ve a: **https://app.bigartist.es/upload**
2. Arrastra el archivo `Oct2017_fullreport_big_artist_EU.csv`
3. Click en **"Procesar CSV"**
4. Espera unos segundos
5. ¡Listo! Verás las estadísticas

### 2. **Desde la terminal (cURL)**

```bash
# Login
TOKEN=$(curl -s -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"BigArtist2024"}' \
  | jq -r '.token')

# Subir CSV
curl -X POST https://app.bigartist.es/api/royalties/import \
  -H "Authorization: Bearer $TOKEN" \
  -F "csv=@Oct2017_fullreport_big_artist_EU.csv"
```

---

## 📊 Verificar datos importados

```bash
# Conecta al servidor
ssh root@94.143.141.241

# Ver estadísticas
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  (SELECT COUNT(*) FROM artists) as artistas,
  (SELECT COUNT(*) FROM tracks) as canciones,
  (SELECT COUNT(*) FROM platforms) as plataformas,
  (SELECT COUNT(*) FROM territories) as territorios,
  (SELECT COUNT(*) FROM royalty_details) as royalties,
  (SELECT ROUND(SUM(net_receipts), 2) FROM royalty_details) as ingresos_totales;
"
```

---

## 🔧 Troubleshooting

### ❌ Error: "Module 'multer' not found"

```bash
ssh root@94.143.141.241
cd /var/www/bigartist/server
npm install multer
pm2 restart bigartist-api
```

### ❌ Error: "Cannot find module importCSV.js"

```bash
# Verificar que existe
ls -la /var/www/bigartist/server/scripts/importCSV.js

# Si no existe, crearlo según el archivo /server/scripts/importCSV.js
```

### ❌ El botón "Procesar CSV" no hace nada

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Sube el CSV y mira los errores
4. Verifica que `VITE_API_URL` esté correctamente configurado

### ❌ Error 500: "Error procesando el archivo"

```bash
# Ver logs del servidor
ssh root@94.143.141.241
pm2 logs bigartist-api --lines 50
```

---

## 📁 Estructura de archivos en el servidor

```
/var/www/bigartist/
├── server/
│   ├── server.js              ← ✅ ACTUALIZADO
│   ├── .env
│   ├── package.json
│   ├── scripts/
│   │   └── importCSV.js       ← ✅ Script de importación
│   └── database/
│       └── schema.sql         ← ✅ Esquema de BD
└── frontend/
    ├── index.html
    └── assets/
        └── index-*.js         ← ✅ Incluye UploadPage actualizado
```

---

## ✅ Checklist de verificación

- [ ] Backend actualizado con endpoint `/api/royalties/import`
- [ ] Dependencia `multer` instalada (`npm list multer`)
- [ ] PM2 corriendo sin errores (`pm2 list`)
- [ ] Health check funciona (`curl http://localhost:3001/api/health`)
- [ ] Frontend compilado y desplegado
- [ ] Página `/upload` carga correctamente
- [ ] Se puede subir un CSV de prueba
- [ ] Estadísticas se muestran después de importar
- [ ] Los datos aparecen en MySQL

---

## 🎨 Capturas de pantalla esperadas

### Página de Upload (inicial):
- Área de drag & drop con icono de Upload
- Texto "Arrastra y suelta tu archivo CSV"
- Sección de información sobre el formato

### Archivo seleccionado:
- Card mostrando el nombre del archivo
- Tamaño en KB
- Botón "Procesar CSV" habilitado

### Durante el procesamiento:
- Barra de progreso animada
- Texto "⏳ Procesando..."

### Importación exitosa:
- ✅ Mensaje de éxito
- Grid con 6 estadísticas:
  - Artistas
  - Canciones
  - Plataformas
  - Territorios
  - Total Royalties
  - Ingresos Totales (€)

---

## 🔗 URLs importantes

- **App principal**: https://app.bigartist.es
- **Página de upload**: https://app.bigartist.es/upload
- **API Health Check**: https://app.bigartist.es/api/health
- **Dashboard**: https://app.bigartist.es/

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs del servidor:**
   ```bash
   pm2 logs bigartist-api
   ```

2. **Verifica la conexión a MySQL:**
   ```bash
   mysql -u root -p'BigArtist2018!@?' -e "SELECT 1;"
   ```

3. **Comprueba que el script existe:**
   ```bash
   ls -la /var/www/bigartist/server/scripts/importCSV.js
   ```

4. **Reinicia todo:**
   ```bash
   pm2 restart bigartist-api
   systemctl reload nginx
   ```

---

**Última actualización:** 2 de Marzo, 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para producción
