# 📊 BIGARTIST ROYALTIES SYSTEM - Instrucciones de Configuración

## 🚀 Paso a Paso

### 1. Crear las tablas en MySQL

```bash
cd /var/www/bigartist/server
mysql -u root -p'BigArtist2018!@?' < database/schema.sql
```

### 2. Verificar que las tablas se crearon

```bash
mysql -u root -p'BigArtist2018!@?' -e "USE bigartist_db; SHOW TABLES;"
```

Deberías ver:
- artists
- labels
- releases
- tracks
- platforms
- territories
- transaction_types
- royalties
- users

### 3. Importar los datos del CSV

```bash
cd /var/www/bigartist/server
node scripts/importCSV.js ../imports/Oct2017_fullreport_big_artist_EU.csv
```

Este proceso puede tardar varios minutos. Verás el progreso en tiempo real.

### 4. Verificar los datos importados

```bash
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  (SELECT COUNT(*) FROM artists) as artists,
  (SELECT COUNT(*) FROM tracks) as tracks,
  (SELECT COUNT(*) FROM royalties) as royalties;
"
```

### 5. Reiniciar el backend

```bash
pm2 restart bigartist-api
pm2 logs bigartist-api --lines 20
```

### 6. Probar los nuevos endpoints

```bash
# Obtener token (ya tienes el usuario admin)
TOKEN=$(curl -s -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"BigArtist2024"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Dashboard de royalties
curl -H "Authorization: Bearer $TOKEN" \
  "https://app.bigartist.es/api/royalties/dashboard" | jq

# Lista de artistas
curl -H "Authorization: Bearer $TOKEN" \
  "https://app.bigartist.es/api/artists" | jq

# Lista de royalties (primeras 10)
curl -H "Authorization: Bearer $TOKEN" \
  "https://app.bigartist.es/api/royalties?limit=10" | jq
```

---

## 📋 Estructura de la Base de Datos

### Tablas Principales:

1. **artists** - Artistas
2. **labels** - Sellos discográficos
3. **releases** - Álbumes/Releases
4. **tracks** - Canciones individuales
5. **platforms** - Plataformas (Spotify, YouTube, etc.)
6. **territories** - Países/Territorios
7. **transaction_types** - Tipos de transacción (S, AS, AV, etc.)
8. **royalties** - Transacciones de royalties (tabla principal)

### Vista:

- **v_royalties_detailed** - Vista simplificada con todos los datos relacionados

---

## 🔄 Para Importar Nuevos CSVs

```bash
# Formato del comando
node scripts/importCSV.js /ruta/al/archivo.csv

# Ejemplo
node scripts/importCSV.js ../imports/Nov2017_fullreport.csv
```

---

## 🛠️ Script Automático (Todo en uno)

```bash
cd /var/www/bigartist/server
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

---

## 📊 Endpoints API Disponibles

### Autenticación:
- `POST /api/auth/login` - Login

### Royalties:
- `GET /api/royalties/dashboard?period=2017M10` - Dashboard con estadísticas
- `GET /api/royalties?period=2017M10&artist=Junior&page=1&limit=50` - Lista de royalties
- `GET /api/artists` - Lista de artistas con totales

### Parámetros del Dashboard:
- `period` (opcional) - Filtrar por período específico (ej: 2017M10)

### Respuesta del Dashboard incluye:
- Total de ingresos y transacciones
- Top 10 artistas
- Top 10 canciones
- Ingresos por plataforma
- Ingresos por territorio (top 15)
- Lista de períodos disponibles

---

## 🐛 Troubleshooting

### Si el CSV no se importa:
```bash
# Verificar que el archivo existe y tiene permisos
ls -lah ../imports/Oct2017_fullreport_big_artist_EU.csv

# Verificar encoding
file ../imports/Oct2017_fullreport_big_artist_EU.csv
```

### Si hay errores de conexión MySQL:
```bash
# Verificar .env
cat .env

# Probar conexión manual
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SELECT 1;"
```

### Si PM2 no arranca:
```bash
# Ver logs completos
pm2 logs bigartist-api --lines 50

# Eliminar y recrear el proceso
pm2 delete bigartist-api
cd /var/www/bigartist/server
pm2 start server.js --name bigartist-api
pm2 save
```

---

## ✅ Checklist Final

- [ ] Tablas creadas en MySQL
- [ ] CSV importado exitosamente
- [ ] PM2 reiniciado y funcionando
- [ ] Endpoint `/api/royalties/dashboard` responde correctamente
- [ ] Endpoint `/api/artists` responde correctamente
- [ ] Frontend puede acceder a los datos

---

**¡Listo para seguir con el frontend!** 🎨
