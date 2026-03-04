# 🚀 EJECUTAR EN EL SERVIDOR

## ⚡ SOLUCIÓN RÁPIDA (UN SOLO COMANDO)

### Conecta al servidor y ejecuta:

```bash
ssh root@94.143.141.241
```

Luego **copia y pega TODO este bloque**:

```bash
cat > /root/fix-artists.sh << 'FIXSCRIPT'
#!/bin/bash
echo "🔧 Corrigiendo endpoint /api/artists..."

# Backup
cp /var/www/bigartist/src/server/server.js /var/www/bigartist/src/server/server.js.backup-$(date +%Y%m%d-%H%M%S)

# Remover verifyToken
cd /var/www/bigartist/src/server
sed -i "s/app\.get('\/api\/artists', verifyToken,/app.get('\/api\/artists',/" server.js

# Verificar
echo "✅ Cambio aplicado:"
grep -n "app.get('/api/artists'" server.js

# Reiniciar
lsof -ti :3001 | xargs kill -9 2>/dev/null
pm2 delete bigartist-api 2>/dev/null
pm2 start server.js --name bigartist-api
pm2 save

# Esperar
sleep 5

# Probar
echo ""
echo "🧪 Probando endpoint:"
curl -X GET http://localhost:3001/api/artists | jq '.'

echo ""
echo "✅ LISTO! Ve a: https://app.bigartist.es/artists"
FIXSCRIPT

chmod +x /root/fix-artists.sh
/root/fix-artists.sh
```

---

## 🎯 ¿Qué hace este comando?

1. ✅ Crea un backup de `server.js`
2. ✅ Remueve `verifyToken` del endpoint `/api/artists`
3. ✅ Reinicia el servidor PM2
4. ✅ Prueba el endpoint automáticamente

---

## ✅ Resultado Esperado

Deberías ver algo como:

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

---

## 🧪 Probar en el Navegador

1. **Ve a:** https://app.bigartist.es/artists
2. **Deberías ver:** La lista de artistas
3. **Sube un CSV:** https://app.bigartist.es/upload
4. **Los artistas del CSV aparecerán automáticamente en Gestión de Artistas**

---

## 🔍 Verificar que Funciona

```bash
# Ver artistas en la base de datos
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT t.id) as canciones,
  COALESCE(SUM(r.net_receipts), 0) as ingresos
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON r.track_id = t.id
GROUP BY a.id, a.name;
"
```

---

## 📊 Ver Logs del Servidor

```bash
pm2 logs bigartist-api --lines 50
```

---

## 🔄 Reiniciar Servidor (si es necesario)

```bash
pm2 restart bigartist-api
```

---

## ❌ Si Sigue sin Funcionar

### Problema: "Token no proporcionado"

**Causa:** Puede haber un endpoint duplicado.

**Solución:**

```bash
# Buscar todos los endpoints /api/artists
grep -n "app.get('/api/artists'" /var/www/bigartist/src/server/server.js

# Si aparecen 2 o más líneas, edita manualmente:
nano /var/www/bigartist/src/server/server.js

# Busca el endpoint duplicado y elimínalo
# Luego guarda (Ctrl+X, Y, Enter) y reinicia:
pm2 restart bigartist-api
```

---

### Problema: "Couldn't connect to server"

**Causa:** El servidor no está corriendo.

**Solución:**

```bash
# Ver estado
pm2 status

# Si no está online:
cd /var/www/bigartist/src/server
pm2 start server.js --name bigartist-api

# Ver logs de error
pm2 logs bigartist-api --err --lines 30
```

---

### Problema: Los artistas no aparecen después de subir CSV

**Verificar:**

```bash
# Ver última importación
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT * FROM csv_uploads ORDER BY uploaded_at DESC LIMIT 1;
"

# Ver logs de importación
pm2 logs bigartist-api | grep -i "importación\|import\|csv"

# Ver artistas recién creados
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT * FROM artists ORDER BY created_at DESC LIMIT 10;
"
```

---

## 🎯 Cómo Funciona la Importación de Artistas

Cuando subes un archivo CSV:

1. **Frontend** envía el archivo a `POST /api/royalties/import`
2. **Backend** ejecuta `/var/www/bigartist/src/server/scripts/importCSV.js`
3. **Script** lee cada línea del CSV:
   - Columna 9: `Artist Name`
   - Columna 11: `Track Name`
   - Columna 17: `Net Receipts`
4. **Para cada artista:**
   - Busca si existe en la tabla `artists`
   - Si NO existe → lo **INSERTA** automáticamente
   - Si existe → usa el ID existente
5. **Resultado:**
   - ✅ Artistas en tabla `artists`
   - ✅ Canciones en tabla `tracks`
   - ✅ Royalties en tabla `royalties`
   - ✅ Todo relacionado correctamente

---

## 📦 Archivos Importantes

```
/var/www/bigartist/
├── src/
│   ├── server/
│   │   ├── server.js                    ← Endpoint /api/artists
│   │   └── scripts/
│   │       └── importCSV.js            ← Importación de CSV
│   └── pages/
│       └── ArtistsPage.tsx             ← Frontend de artistas
```

---

## 🔑 Comandos Útiles

```bash
# Ver todos los artistas
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SELECT * FROM artists;"

# Contar artistas
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SELECT COUNT(*) FROM artists;"

# Ver último artista creado
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SELECT * FROM artists ORDER BY created_at DESC LIMIT 1;"

# Probar endpoint desde servidor
curl http://localhost:3001/api/artists | jq '.'

# Probar endpoint desde internet
curl http://94.143.141.241:3001/api/artists | jq '.'

# Ver estado de PM2
pm2 status

# Ver logs completos
pm2 logs bigartist-api

# Reiniciar todo
pm2 restart bigartist-api

# Ver procesos en puerto 3001
lsof -i :3001

# Matar proceso en puerto 3001
lsof -ti :3001 | xargs kill -9
```

---

## ✅ Lista de Verificación

Después de ejecutar el script, verifica:

- [ ] `pm2 status` muestra `online`
- [ ] `curl http://localhost:3001/api/artists` devuelve JSON con `"success":true`
- [ ] `https://app.bigartist.es/artists` muestra la lista de artistas
- [ ] Al subir un CSV, los artistas aparecen automáticamente

---

## 📞 Soporte

Si algo no funciona:

1. **Ver logs:** `pm2 logs bigartist-api --lines 100`
2. **Verificar BD:** `mysql -u root -p'BigArtist2018!@?' bigartist_db`
3. **Verificar endpoint:** `grep -A 20 "app.get('/api/artists'" /var/www/bigartist/src/server/server.js`

---

**¡Listo!** Con este comando TODO debería funcionar. 🚀
