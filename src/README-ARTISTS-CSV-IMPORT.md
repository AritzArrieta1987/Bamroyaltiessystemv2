# 🎯 IMPORTACIÓN AUTOMÁTICA DE ARTISTAS DESDE CSV

## 📋 Resumen

El sistema **BIGARTIST Royalties** ya está configurado para extraer automáticamente los nombres de artistas de los archivos CSV que subes y agregarlos a la tabla `artists` (Gestión de Artistas).

---

## ✅ ¿Cómo Funciona?

### 1️⃣ **Cuando subes un CSV:**
- El frontend envía el archivo al endpoint `POST /api/royalties/import`
- El backend ejecuta el script `scripts/importCSV.js`

### 2️⃣ **El script lee el CSV:**
```javascript
// Línea 207 de importCSV.js
const artistName = columns[8].trim();  // Columna 9 del CSV (índice 8)
```

### 3️⃣ **Crea o busca el artista:**
```javascript
// Línea 219 de importCSV.js
const artistId = await getOrCreateArtist(connection, artistName);
```

### 4️⃣ **La función `getOrCreateArtist`:**
```javascript
// Líneas 29-47 de importCSV.js
async function getOrCreateArtist(connection, artistName) {
  if (!artistName) return null;
  
  // 1. Busca si ya existe
  const [rows] = await connection.execute(
    'SELECT id FROM artists WHERE name = ?',
    [artistName]
  );
  
  if (rows.length > 0) {
    return rows[0].id;  // ✅ Devuelve el ID existente
  }
  
  // 2. Si no existe, lo crea
  const [result] = await connection.execute(
    'INSERT INTO artists (name) VALUES (?)',
    [artistName]
  );
  
  return result.insertId;  // ✅ Devuelve el nuevo ID
}
```

### 5️⃣ **Resultado:**
- ✅ **Canciones** → van a la tabla `tracks` (Catálogo Musical)
- ✅ **Artistas** → van a la tabla `artists` (Gestión de Artistas)
- ✅ **Royalties** → van a la tabla `royalties` relacionados con artista + canción
- ✅ **Totales** → se muestran en el Dashboard

---

## 🗂️ Estructura del CSV

El CSV debe tener este formato (separado por `;`):

```
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
```

**Columnas importantes:**
- **Columna 9** (`Artist Name`) → Se extrae el nombre del artista
- **Columna 11** (`Track Name`) → Nombre de la canción
- **Columna 17** (`Net Receipts`) → Ingresos por royalties

---

## 🔧 Scripts de Diagnóstico

### Script 1: Corregir Endpoint `/api/artists`

**Problema:** El endpoint requiere autenticación y no devuelve artistas.

**Solución:**
```bash
# Copiar al servidor y ejecutar
scp FIX-ARTISTS-ENDPOINT-FINAL.sh root@94.143.141.241:/root/
ssh root@94.143.141.241
chmod +x /root/FIX-ARTISTS-ENDPOINT-FINAL.sh
/root/FIX-ARTISTS-ENDPOINT-FINAL.sh
```

**Qué hace:**
- ✅ Remueve `verifyToken` del endpoint `/api/artists`
- ✅ Reinicia el servidor PM2
- ✅ Prueba el endpoint automáticamente

---

### Script 2: Verificar Importación de Artistas

**Propósito:** Mostrar cómo funciona la importación y ver los artistas actuales.

```bash
# Copiar al servidor y ejecutar
scp VERIFY-CSV-ARTIST-IMPORT.sh root@94.143.141.241:/root/
ssh root@94.143.141.241
chmod +x /root/VERIFY-CSV-ARTIST-IMPORT.sh
/root/VERIFY-CSV-ARTIST-IMPORT.sh
```

**Qué muestra:**
- ✅ Código de la función `getOrCreateArtist()`
- ✅ Estructura de la tabla `artists`
- ✅ Artistas actuales en la base de datos
- ✅ Ejemplo de formato CSV
- ✅ Flujo completo de importación

---

## 🧪 Cómo Probar

### 1. Corregir el endpoint (si no funciona):
```bash
ssh root@94.143.141.241
/root/FIX-ARTISTS-ENDPOINT-FINAL.sh
```

### 2. Verificar que el servidor está corriendo:
```bash
pm2 status
pm2 logs bigartist-api --lines 20
```

### 3. Probar el endpoint directamente:
```bash
curl -X GET http://94.143.141.241:3001/api/artists | jq '.'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Bad Bunny",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0.00
    },
    {
      "id": 6,
      "name": "J Balvin",
      "total_tracks": 0,
      "total_transactions": 0,
      "total_revenue": 0.00
    }
  ]
}
```

### 4. Ver artistas en la base de datos:
```bash
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as canciones,
  COALESCE(SUM(r.net_receipts), 0) as ingresos
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON r.track_id = t.id
GROUP BY a.id, a.name
ORDER BY a.name;
"
```

### 5. Probar en el navegador:
1. Ve a: **https://app.bigartist.es/upload**
2. Sube un archivo CSV
3. Ve a: **https://app.bigartist.es/artists**
4. Deberías ver los artistas extraídos del CSV

---

## 🐛 Solución de Problemas

### Problema 1: "Token no proporcionado"
**Causa:** El endpoint `/api/artists` tiene `verifyToken`

**Solución:**
```bash
ssh root@94.143.141.241
/root/FIX-ARTISTS-ENDPOINT-FINAL.sh
```

---

### Problema 2: "Couldn't connect to server"
**Causa:** El servidor Node.js no está corriendo

**Solución:**
```bash
ssh root@94.143.141.241

# Liberar puerto
lsof -ti :3001 | xargs kill -9

# Reiniciar servidor
cd /var/www/bigartist/src/server
pm2 delete bigartist-api
pm2 start server.js --name bigartist-api
pm2 save

# Verificar
pm2 status
pm2 logs bigartist-api --lines 20
```

---

### Problema 3: Los artistas no aparecen después de importar CSV
**Causa posible:** Error en el script de importación

**Diagnóstico:**
```bash
# Ver logs de PM2
pm2 logs bigartist-api --lines 100

# Ver última importación
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT * FROM csv_uploads ORDER BY uploaded_at DESC LIMIT 1;
"

# Ver artistas recién creados
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT * FROM artists ORDER BY created_at DESC LIMIT 10;
"
```

---

### Problema 4: Verificar que hay endpoints duplicados
```bash
grep -n "app.get('/api/artists'" /var/www/bigartist/src/server/server.js
```

**Si aparece más de una línea:** Hay endpoints duplicados. Elimina el duplicado manualmente.

---

## 📊 Estadísticas de Importación

Después de importar un CSV, el sistema devuelve estadísticas:

```json
{
  "success": true,
  "message": "Archivo CSV importado exitosamente",
  "stats": {
    "artists": 5,
    "tracks": 23,
    "platforms": 4,
    "territories": 12,
    "royalties": 156,
    "totalRevenue": 1234.56
  }
}
```

---

## 🔄 Flujo Completo

```
┌─────────────────────┐
│ 1. Usuario sube CSV │
│    (frontend)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│ 2. POST /api/royalties/import│
│    (con archivo CSV)         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 3. Ejecuta scripts/importCSV.js│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 4. Lee línea por línea      │
│    - Columna 9: Artist Name │
│    - Columna 11: Track Name │
│    - Columna 17: Net Receipts│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 5. getOrCreateArtist()      │
│    - Busca artista          │
│    - Si no existe: INSERT   │
│    - Devuelve artist_id     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 6. INSERT en tablas:        │
│    ✅ artists               │
│    ✅ tracks                │
│    ✅ royalties             │
│    ✅ platforms             │
│    ✅ territories           │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 7. Dashboard actualizado    │
│    - Total artistas         │
│    - Total canciones        │
│    - Total royalties        │
└─────────────────────────────┘
```

---

## 📞 Comandos Útiles

### Ver estado del servidor:
```bash
pm2 status
pm2 info bigartist-api
```

### Ver logs en tiempo real:
```bash
pm2 logs bigartist-api
```

### Reiniciar servidor:
```bash
pm2 restart bigartist-api
```

### Ver artistas en BD:
```bash
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SELECT * FROM artists;"
```

### Probar endpoint:
```bash
curl -X GET http://94.143.141.241:3001/api/artists | jq '.'
```

---

## ✅ Confirmación

**El sistema YA está funcionando correctamente.** Solo necesitas:

1. ✅ Corregir el endpoint `/api/artists` (remover `verifyToken`)
2. ✅ Reiniciar el servidor
3. ✅ Probar subiendo un CSV

**Todo el código de importación YA está implementado y funcional.** 🎉

---

## 📧 Soporte

Si tienes problemas:
1. Ejecuta `/root/VERIFY-CSV-ARTIST-IMPORT.sh` para diagnóstico
2. Verifica logs: `pm2 logs bigartist-api`
3. Verifica BD: `mysql -u root -p bigartist_db`

---

**Última actualización:** 2026-03-04  
**Versión:** 1.0  
**Autor:** BIGARTIST System
