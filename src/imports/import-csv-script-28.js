Last login: Mon Mar  2 15:15:12 on ttys002
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Mon Mar  2 15:55:27 UTC 2026

  System load:  0.0               Processes:             110
  Usage of /:   5.7% of 76.45GB   Users logged in:       1
  Memory usage: 47%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Mon Mar  2 14:15:37 2026 from 207.188.130.38
root@ubuntu:~# cd /var/www/bigartist/server

echo "=========================================="
echo "🔍 VERIFICANDO SCRIPT importCSV.js"
echo "=========================================="

ls -la scripts/importCSV.js

echo ""
echo "Mostrando contenido del script:"
cat scripts/importCSV.js

echo ""
echo "=========================================="
echo "📋 FORMATO CSV ESPERADO"
echo "=========================================="

# Buscar en el script qué formato espera
grep -n "split\\|columns\\|header\\|length" scripts/importCSV.js | head -20

echo ""
echo "=========================================="
echo "🔧 VER QUÉ ESTÁ PASANDO EN LA LÍNEA 2"
echo "$UPLOAD" | jq '.' 2>/dev/null || echo "$UPLOAD"yalties/import \83838383,St
==========================================
🔍 VERIFICANDO SCRIPT importCSV.js
==========================================
-rw-r--r-- 1 root root 9605 Mar  2 13:43 scripts/importCSV.js

Mostrando contenido del script:
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist_db',
  multipleStatements: true
};

// Función para convertir número europeo a decimal (coma a punto)
function parseEuropeanNumber(str) {
  if (!str || str === '') return 0;
  return parseFloat(str.toString().replace(',', '.'));
}

// Función para convertir notación científica de Excel
function parseUPC(str) {
  if (!str || str === '') return null;
  const num = parseEuropeanNumber(str);
  return num ? Math.round(num).toString() : null;
}

// Función para buscar o crear artista
async function getOrCreateArtist(connection, artistName) {
  if (!artistName) return null;
  
  const [rows] = await connection.execute(
    'SELECT id FROM artists WHERE name = ?',
    [artistName]
  );
  
  if (rows.length > 0) {
    return rows[0].id;
  }
  
  const [result] = await connection.execute(
    'INSERT INTO artists (name) VALUES (?)',
    [artistName]
  );
  
  return result.insertId;
}

// Función para buscar o crear sello
async function getOrCreateLabel(connection, labelName, catalogNumber) {
  if (!labelName) return null;
  
  const [rows] = await connection.execute(
    'SELECT id FROM labels WHERE name = ?',
    [labelName]
  );
  
  if (rows.length > 0) {
    return rows[0].id;
  }
  
  const [result] = await connection.execute(
    'INSERT INTO labels (name, catalog_number) VALUES (?, ?)',
    [labelName, catalogNumber]
  );
  
  return result.insertId;
}

// Función para buscar o crear release
async function getOrCreateRelease(connection, releaseName, artistId, labelId, orchardUPC, manufacturerUPC) {
  if (!releaseName || !artistId) return null;
  
  const [rows] = await connection.execute(
    'SELECT id FROM releases WHERE name = ? AND artist_id = ?',
    [releaseName, artistId]
  );
  
  if (rows.length > 0) {
    return rows[0].id;
  }
  
  const [result] = await connection.execute(
    'INSERT INTO releases (name, artist_id, label_id, orchard_upc, manufacturer_upc) VALUES (?, ?, ?, ?, ?)',
    [releaseName, artistId, labelId, orchardUPC, manufacturerUPC]
  );
  
  return result.insertId;
}

// Función para buscar o crear track
async function getOrCreateTrack(connection, trackName, releaseId, artistId, isrc, volume, trackNumber) {
  if (!trackName || !releaseId || !artistId) return null;
  
  const [rows] = await connection.execute(
    'SELECT id FROM tracks WHERE isrc = ? OR (name = ? AND release_id = ?)',
    [isrc, trackName, releaseId]
  );
  
  if (rows.length > 0) {
    return rows[0].id;
  }
  
  const [result] = await connection.execute(
    'INSERT INTO tracks (name, release_id, artist_id, isrc, volume, track_number) VALUES (?, ?, ?, ?, ?, ?)',
    [trackName, releaseId, artistId, isrc, volume || 1, trackNumber || 1]
  );
  
  return result.insertId;
}

// Función para buscar o crear plataforma
async function getOrCreatePlatform(connection, platformName) {
  if (!platformName) return null;
  
  const [rows] = await connection.execute(
    'SELECT id FROM platforms WHERE name = ?',
    [platformName]
  );
  
  if (rows.length > 0) {
    return rows[0].id;
  }
  
  const [result] = await connection.execute(
    'INSERT INTO platforms (name) VALUES (?)',
    [platformName]
  );
  
  return result.insertId;
}

// Función para buscar o crear territorio
async function getOrCreateTerritory(connection, territoryName) {
  if (!territoryName) return null;
  
  const [rows] = await connection.execute(
    'SELECT id FROM territories WHERE name = ?',
    [territoryName]
  );
  
  if (rows.length > 0) {
    return rows[0].id;
  }
  
  const [result] = await connection.execute(
    'INSERT INTO territories (name) VALUES (?)',
    [territoryName]
  );
  
  return result.insertId;
}

// Función para buscar tipo de transacción
async function getTransactionType(connection, transTypeCode) {
  if (!transTypeCode) return null;
  
  const [rows] = await connection.execute(
    'SELECT id FROM transaction_types WHERE code = ?',
    [transTypeCode]
  );
  
  return rows.length > 0 ? rows[0].id : null;
}

// Función principal para importar CSV
async function importCSV(filePath) {
  let connection;
  
  try {
    console.log('🔌 Conectando a MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión establecida\n');
    
    console.log('📂 Leyendo archivo CSV...');
    const fileContent = fs.readFileSync(filePath, 'latin1'); // Usar latin1 para caracteres especiales
    const lines = fileContent.split('\n');
    
    console.log(`📊 Total de líneas: ${lines.length}\n`);
    
    // Saltar la primera línea (encabezados)
    const dataLines = lines.slice(1).filter(line => line.trim() !== '');
    
    console.log('🚀 Iniciando importación...\n');
    let importedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i];
        const columns = line.split(';');
        
        if (columns.length < 18) {
          console.log(`⚠️  Línea ${i + 2} omitida (columnas insuficientes)`);
          continue;
        }
        
        // Extraer datos
        const period = columns[0].trim();
        const activityPeriod = columns[1].trim();
        const dms = columns[2].trim();
        const territory = columns[3].trim();
        const orchardUPC = parseUPC(columns[4].trim());
        const manufacturerUPC = columns[5].trim() || null;
        const catalogNumber = columns[6].trim();
        const imprintLabel = columns[7].trim();
        const artistName = columns[8].trim();
        const releaseName = columns[9].trim();
        const trackName = columns[10].trim();
        const isrc = columns[11].trim();
        const volume = parseInt(columns[12].trim()) || 1;
        const trackNumber = parseInt(columns[13].trim()) || 1;
        const quantity = parseInt(columns[14].trim()) || 0;
        const transType = columns[15].trim();
        const netReceipts = parseEuropeanNumber(columns[16].trim());
        const currency = columns[17].trim();
        
        // Crear/obtener IDs de entidades relacionadas
        const artistId = await getOrCreateArtist(connection, artistName);
        const labelId = await getOrCreateLabel(connection, imprintLabel, catalogNumber);
        const releaseId = await getOrCreateRelease(connection, releaseName, artistId, labelId, orchardUPC, manufacturerUPC);
        const trackId = await getOrCreateTrack(connection, trackName, releaseId, artistId, isrc, volume, trackNumber);
        const platformId = await getOrCreatePlatform(connection, dms);
        const territoryId = await getOrCreateTerritory(connection, territory);
        const transTypeId = await getTransactionType(connection, transType);
        
        // Insertar royalty
        await connection.execute(
          `INSERT INTO royalties 
          (period, activity_period, track_id, platform_id, territory_id, transaction_type_id, quantity, net_receipts, currency)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [period, activityPeriod, trackId, platformId, territoryId, transTypeId, quantity, netReceipts, currency]
        );
        
        importedCount++;
        
        if (importedCount % 10 === 0) {
          process.stdout.write(`\r✅ Procesadas ${importedCount} de ${dataLines.length} líneas...`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`\n❌ Error en línea ${i + 2}:`, error.message);
      }
    }
    
    console.log(`\n\n🎉 Importación completada!`);
    console.log(`✅ Registros importados: ${importedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    // Mostrar estadísticas
    console.log('\n📊 Estadísticas de la base de datos:');
    const [artistCount] = await connection.execute('SELECT COUNT(*) as count FROM artists');
    const [trackCount] = await connection.execute('SELECT COUNT(*) as count FROM tracks');
    const [platformCount] = await connection.execute('SELECT COUNT(*) as count FROM platforms');
    const [royaltyCount] = await connection.execute('SELECT COUNT(*) as count FROM royalties');
    
    console.log(`   - Artistas: ${artistCount[0].count}`);
    console.log(`   - Canciones: ${trackCount[0].count}`);
    console.log(`   - Plataformas: ${platformCount[0].count}`);
    console.log(`   - Registros de royalties: ${royaltyCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar importación
const csvFilePath = process.argv[2] || path.join(__dirname, '../../imports/Oct2017_fullreport_big_artist_EU.csv');

console.log('═══════════════════════════════════════════════════════');
console.log('📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER');
console.log('═══════════════════════════════════════════════════════\n');

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ Archivo no encontrado: ${csvFilePath}`);
  process.exit(1);
}

importCSV(csvFilePath);

==========================================
📋 FORMATO CSV ESPERADO
==========================================
37:  if (rows.length > 0) {
58:  if (rows.length > 0) {
79:  if (rows.length > 0) {
100:  if (rows.length > 0) {
121:  if (rows.length > 0) {
142:  if (rows.length > 0) {
163:  return rows.length > 0 ? rows[0].id : null;
177:    const lines = fileContent.split('\n');
179:    console.log(`📊 Total de líneas: ${lines.length}\n`);
188:    for (let i = 0; i < dataLines.length; i++) {
191:        const columns = line.split(';');
193:        if (columns.length < 18) {
199:        const period = columns[0].trim();
200:        const activityPeriod = columns[1].trim();
201:        const dms = columns[2].trim();
202:        const territory = columns[3].trim();
203:        const orchardUPC = parseUPC(columns[4].trim());
204:        const manufacturerUPC = columns[5].trim() || null;
205:        const catalogNumber = columns[6].trim();
206:        const imprintLabel = columns[7].trim();

==========================================
🔧 VER QUÉ ESTÁ PASANDO EN LA LÍNEA 2
==========================================
CSV de prueba:
Period,Activity Period,Artist Name,Imprint Label,Release Name,Track Name,ISRC,Orchard UPC,Trans Type,DMS,Territory,Quantity,Label Share Net Receipts
2017M10,Oct 2017,Bad Bunny,Warner Music,X100PRE,MIA,USQX91800123,193483838383,Stream,Spotify,ES,15000,450.75

Número de columnas en header:
13
Número de columnas en línea 2:
13

==========================================
📤 SUBIR Y VER LOGS DETALLADOS
==========================================
Token obtenido: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
[1] 70816

Subiendo CSV...
0|bigartist-api  | 🔐 Verificando token...
0|bigartist-api  | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NjY5NTcsImV4cCI6MTc3MjU1MzM1N30.Y0YT2N7-CHwpcazmOhWwnwo6IYFj-ceKweVUt7Y1L0A
0|bigartist-api  | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartist-api  | ✅ Token válido para usuario: 3
0|bigartist-api  | 📤 Iniciando importación de CSV: test_debug.csv
0|bigartist-api  | 📁 Archivo temporal: /tmp/ece98c96e2fe2dd478de669142dfdadb
0|bigartist-api  | 🔧 Script: /var/www/bigartist/server/scripts/importCSV.js
0|bigartist-api  | ═══════════════════════════════════════════════════════
0|bigartist-api  | 📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER
0|bigartist-api  | ═══════════════════════════════════════════════════════
0|bigartist-api  | 🔌 Conectando a MySQL...
0|bigartist-api  | ✅ Conexión establecida
0|bigartist-api  | 📂 Leyendo archivo CSV...
0|bigartist-api  | 📊 Total de líneas: 3
0|bigartist-api  | 🚀 Iniciando importación...
0|bigartist-api  | ⚠️  Línea 2 omitida (columnas insuficientes)
0|bigartist-api  | 🎉 Importación completada!
0|bigartist-api  | ✅ Registros importados: 0
0|bigartist-api  | ❌ Errores: 0
0|bigartist-api  | 📊 Estadísticas de la base de datos:
0|bigartist-api  |    - Artistas: 0
0|bigartist-api  |    - Canciones: 0
0|bigartist-api  |    - Plataformas: 0
0|bigartist-api  |    - Registros de royalties: 0
0|bigartist-api  | 🔌 Conexión cerrada
0|bigartist-api  | ✅ Importación completada exitosamente

Respuesta:
{
  "success": true,
  "message": "Archivo CSV importado exitosamente",
  "stats": {
    "artists": 0,
    "tracks": 0,
    "platforms": 0,
    "territories": 0,
    "royalties": 0,
    "totalRevenue": 0
  },
  "output": "═══════════════════════════════════════════════════════\n📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER\n═══════════════════════════════════════════════════════\n\n🔌 Conectando a MySQL...\n✅ Conexión establecida\n\n📂 Leyendo archivo CSV...\n📊 Total de líneas: 3\n\n🚀 Iniciando importación...\n\n⚠️  Línea 2 omitida (columnas insuficientes)\n\n\n🎉 Importación completada!\n✅ Registros importados: 0\n❌ Errores: 0\n\n📊 Estadísticas de la base de datos:\n   - Artistas: 0\n   - Canciones: 0\n   - Plataformas: 0\n   - Registros de royalties: 0\n\n🔌 Conexión cerrada\n"
}
[1]+  Terminated              pm2 logs bigartist-api --lines 0
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "✅ CREANDO CSV CON FORMATO CORRECTO"
echo "=========================================="

# CSV con 18 columnas y punto y coma
cat > /tmp/test_correct.csv << 'EOF'
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;Bad Bunny;X100PRE;MIA;USQX91800123;1;1;15000;Stream;450.75;EUR
2017M11;Nov 2017;Apple Music;US;883838383838;;SM001;Sony Music;Rosalia;El Mal Querer;MALAMENTE;ESES01800456;1;1;8500;Stream;320.50;EUR
2017M12;Dec 2017;YouTube Music;MX;773838383838;;UN001;Universal;J Balvin;Vibras;Mi Gente;USUM71800789;1;1;5200;Download;185.30;EUR
EOF

echo "CSV creado correctamente:"
cat /tmp/test_correct.csv

echo ""
echo "Verificando formato:"
echo "Número de columnas: $(head -1 /tmp/test_correct.csv | awk -F';' '{print NFecho "=========================================="_receipts, currency  isrc, arti
==========================================
✅ CREANDO CSV CON FORMATO CORRECTO
==========================================
CSV creado correctamente:
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;Bad Bunny;X100PRE;MIA;USQX91800123;1;1;15000;Stream;450.75;EUR
2017M11;Nov 2017;Apple Music;US;883838383838;;SM001;Sony Music;Rosalia;El Mal Querer;MALAMENTE;ESES01800456;1;1;8500;Stream;320.50;EUR
2017M12;Dec 2017;YouTube Music;MX;773838383838;;UN001;Universal;J Balvin;Vibras;Mi Gente;USUM71800789;1;1;5200;Download;185.30;EUR

Verificando formato:
Número de columnas: 18

==========================================
🚀 SUBIENDO CSV CON FORMATO CORRECTO
==========================================
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

Subiendo archivo...

Respuesta:
{
  "success": true,
  "message": "Archivo CSV importado exitosamente",
  "stats": {
    "artists": 3,
    "tracks": 0,
    "platforms": 0,
    "territories": 0,
    "royalties": 0,
    "totalRevenue": 0
  },
  "output": "═══════════════════════════════════════════════════════\n📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER\n═══════════════════════════════════════════════════════\n\n🔌 Conectando a MySQL...\n✅ Conexión establecida\n\n📂 Leyendo archivo CSV...\n📊 Total de líneas: 5\n\n🚀 Iniciando importación...\n\n\n\n🎉 Importación completada!\n✅ Registros importados: 0\n❌ Errores: 3\n\n📊 Estadísticas de la base de datos:\n   - Artistas: 3\n   - Canciones: 0\n   - Plataformas: 0\n   - Registros de royalties: 0\n\n🔌 Conexión cerrada\n"
}

==========================================
📊 VERIFICAR DATOS EN BASE DE DATOS
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1054 (42S22) at line 2: Unknown column 'net_receipts' in 'field list'

Artistas importados:
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-----------+---------------------+
| id | name      | created_at          |
+----+-----------+---------------------+
|  1 | Bad Bunny | 2026-03-02 16:17:32 |
|  2 | Rosalia   | 2026-03-02 16:17:32 |
|  3 | J Balvin  | 2026-03-02 16:17:32 |
+----+-----------+---------------------+

Plataformas importadas:
mysql: [Warning] Using a password on the command line interface can be insecure.

Tracks importados:
mysql: [Warning] Using a password on the command line interface can be insecure.

Royalties importados:
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1054 (42S22) at line 2: Unknown column 'activity_period' in 'field list'

==========================================
🎉 ¡IMPORTACIÓN COMPLETADA!
==========================================
root@ubuntu:/var/www/bigartist/server# 
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔍 VER TODAS LAS TABLAS DE LA BD"
echo "=========================================="

mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SHOW TABLES;"

echo ""
echo "=========================================="
echo "📊 VER ESTRUCTURA DE TABLAS CRÍTICAS"
echo "=========================================="

echo "Tabla: labels"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE labels;" 2>/dev/null || echo "❌ No existe tabla 'labels'"

echo ""
echo "Tabla: releases"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE releases;" 2>/dev/null || echo "❌ No existe tabla 'releases'"

echo ""
echo "Tabla: transaction_types"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE transaction_types;"pm2 logs bigartist-api --lines 50 --nostream | grep -A 5 "Error en línea"ils;" 2
==========================================
🔍 VER TODAS LAS TABLAS DE LA BD
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+------------------------+
| Tables_in_bigartist_db |
+------------------------+
| artists                |
| periods                |
| platforms              |
| royalties              |
| royalty_details        |
| royalty_summary        |
| royalty_types          |
| territories            |
| tracks                 |
| users                  |
+------------------------+

==========================================
📊 VER ESTRUCTURA DE TABLAS CRÍTICAS
==========================================
Tabla: labels
❌ No existe tabla 'labels'

Tabla: releases
❌ No existe tabla 'releases'

Tabla: transaction_types
❌ No existe tabla 'transaction_types'

Tabla: royalties
+------------+------------------------------------+------+-----+-------------------+-------------------+
| Field      | Type                               | Null | Key | Default           | Extra             |
+------------+------------------------------------+------+-----+-------------------+-------------------+
| id         | int                                | NO   | PRI | NULL              | auto_increment    |
| artist_id  | int                                | NO   | MUL | NULL              |                   |
| amount     | decimal(10,2)                      | NO   |     | NULL              |                   |
| period     | varchar(50)                        | NO   |     | NULL              |                   |
| status     | enum('pending','paid','cancelled') | YES  |     | pending           |                   |
| created_at | timestamp                          | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+------------------------------------+------+-----+-------------------+-------------------+

Tabla: royalty_details (alternativa)
+-----------------+---------------+------+-----+-------------------+-------------------+
| Field           | Type          | Null | Key | Default           | Extra             |
+-----------------+---------------+------+-----+-------------------+-------------------+
| id              | int           | NO   | PRI | NULL              | auto_increment    |
| track_id        | int           | NO   | MUL | NULL              |                   |
| platform_id     | int           | NO   | MUL | NULL              |                   |
| territory_id    | int           | NO   | MUL | NULL              |                   |
| royalty_type_id | int           | NO   | MUL | NULL              |                   |
| period_id       | int           | NO   | MUL | NULL              |                   |
| quantity        | int           | YES  |     | 0                 |                   |
| revenue         | decimal(15,4) | YES  | MUL | 0.0000            |                   |
| commission      | decimal(15,4) | YES  |     | 0.0000            |                   |
| net_receipts    | decimal(15,4) | YES  |     | 0.0000            |                   |
| created_at      | timestamp     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-----------------+---------------+------+-----+-------------------+-------------------+

==========================================
📝 VER LOGS DEL ERROR DEL SCRIPT
==========================================
0|bigartis | ❌ Error en línea 2: Table 'bigartist_db.labels' doesn't exist
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 3: Table 'bigartist_db.labels' doesn't exist
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 4: Table 'bigartist_db.labels' doesn't exist
0|bigartis | 

/root/.pm2/logs/bigartist-api-out.log last 50 lines:
0|bigartis | 
0|bigartis | 
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔧 CREANDO NUEVO SCRIPT importCSV.js"
echo "=========================================="

# Hacer backup del script anterior
cp scripts/importCSV.js scripts/importCSV.js.backup

# Crear nuevo script adaptado a la base de datos real
cat > scripts/importCSV.js << 'EOFSCRIPT'
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist_db',
  multipleStatements: true
echo "=========================================="me as territory, rd.quantity, r
==========================================
🔧 CREANDO NUEVO SCRIPT importCSV.js
==========================================
✅ Script actualizado

==========================================
🔄 REINICIAR PM2
==========================================
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 4    │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

==========================================
🚀 PROBANDO IMPORTACIÓN CON SCRIPT CORREGIDO
==========================================
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

Subiendo CSV...

Respuesta:
{
  "success": true,
  "message": "Archivo CSV importado exitosamente",
  "stats": {
    "artists": 3,
    "tracks": 3,
    "platforms": 3,
    "territories": 0,
    "royalties": 0,
    "totalRevenue": 0
  },
  "output": "═══════════════════════════════════════════════════════\n📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER\n═══════════════════════════════════════════════════════\n\n🔌 Conectando a MySQL...\n✅ Conexión establecida\n\n📂 Leyendo archivo CSV...\n📊 Total de líneas: 5\n\n🚀 Iniciando importación...\n\n\n\n🎉 Importación completada!\n✅ Registros importados: 0\n❌ Errores: 3\n\n📊 Estadísticas de la base de datos:\n   - Artistas: 3\n   - Canciones: 3\n   - Plataformas: 3\n   - Registros de royalties: 0\n\n🔌 Conexión cerrada\n"
}

==========================================
📊 VERIFICAR DATOS IMPORTADOS
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------+--------+-----------+-------------+-----------+---------------+
| artists | tracks | platforms | territories | royalties | total_revenue |
+---------+--------+-----------+-------------+-----------+---------------+
|       3 |      3 |         3 |           0 |         0 |          NULL |
+---------+--------+-----------+-------------+-----------+---------------+

Artistas:
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-----------+---------------------+
| id | name      | created_at          |
+----+-----------+---------------------+
|  1 | Bad Bunny | 2026-03-02 16:17:32 |
|  2 | Rosalia   | 2026-03-02 16:17:32 |
|  3 | J Balvin  | 2026-03-02 16:17:32 |
+----+-----------+---------------------+

Tracks:
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-----------+--------------+--------------+-----------+
| id | title     | isrc         | upc          | artist_id |
+----+-----------+--------------+--------------+-----------+
|  1 | MIA       | USQX91800123 | 193483838383 |         1 |
|  2 | MALAMENTE | ESES01800456 | 883838383838 |         2 |
|  3 | Mi Gente  | USUM71800789 | 773838383838 |         3 |
+----+-----------+--------------+--------------+-----------+

Royalties:
mysql: [Warning] Using a password on the command line interface can be insecure.

==========================================
🎉 ¡IMPORTACIÓN COMPLETADA!
==========================================
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "📋 VER LOGS DE ERRORES DETALLADOS"
echo "=========================================="

pm2 logs bigartist-api --lines 100 --nostream | grep -B 2 -A 5 "Error en línea"

echo ""
echo "=========================================="
echo "🔍 VER ESTRUCTURA COMPLETA DE TABLAS"
echo "=========================================="

echo "Tabla: periods"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE periods;"

echo ""
echo "Tabla: royalty_types"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE royalty_types;"

echo ""
echo "Tabla: territories"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "DESCRIBE territories;"

"OIN royalty_types rt ON rd.royalty_type_id = rt.id;etails) as total_revenue;ls;
==========================================
📋 VER LOGS DE ERRORES DETALLADOS
==========================================
0|bigartis |     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
0|bigartis | 
0|bigartis | ❌ Error en línea 2: Table 'bigartist_db.labels' doesn't exist
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 3: Table 'bigartist_db.labels' doesn't exist
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 4: Table 'bigartist_db.labels' doesn't exist
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 2: Field 'code' doesn't have a default value
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 3: Field 'code' doesn't have a default value
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 4: Field 'code' doesn't have a default value
0|bigartis | 

/root/.pm2/logs/bigartist-api-out.log last 100 lines:
0|bigartis |    - Artistas: 0
0|bigartis | 

==========================================
🔍 VER ESTRUCTURA COMPLETA DE TABLAS
==========================================
Tabla: periods
mysql: [Warning] Using a password on the command line interface can be insecure.
+------------+-----------+------+-----+-------------------+-------------------+
| Field      | Type      | Null | Key | Default           | Extra             |
+------------+-----------+------+-----+-------------------+-------------------+
| id         | int       | NO   | PRI | NULL              | auto_increment    |
| start_date | date      | NO   | MUL | NULL              |                   |
| end_date   | date      | NO   |     | NULL              |                   |
| year       | int       | NO   | MUL | NULL              |                   |
| month      | int       | NO   |     | NULL              |                   |
| created_at | timestamp | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+-----------+------+-----+-------------------+-------------------+

Tabla: royalty_types
mysql: [Warning] Using a password on the command line interface can be insecure.
+-------------+--------------+------+-----+-------------------+-------------------+
| Field       | Type         | Null | Key | Default           | Extra             |
+-------------+--------------+------+-----+-------------------+-------------------+
| id          | int          | NO   | PRI | NULL              | auto_increment    |
| name        | varchar(100) | NO   | UNI | NULL              |                   |
| description | text         | YES  |     | NULL              |                   |
| created_at  | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-------------+--------------+------+-----+-------------------+-------------------+

Tabla: territories
mysql: [Warning] Using a password on the command line interface can be insecure.
+------------+--------------+------+-----+-------------------+-------------------+
| Field      | Type         | Null | Key | Default           | Extra             |
+------------+--------------+------+-----+-------------------+-------------------+
| id         | int          | NO   | PRI | NULL              | auto_increment    |
| code       | varchar(2)   | NO   | UNI | NULL              |                   |
| name       | varchar(100) | YES  |     | NULL              |                   |
| created_at | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+--------------+------+-----+-------------------+-------------------+

Ver si hay territories creados:
mysql: [Warning] Using a password on the command line interface can be insecure.

Ver si hay periods creados:
mysql: [Warning] Using a password on the command line interface can be insecure.

Ver si hay royalty_types creados:
mysql: [Warning] Using a password on the command line interface can be insecure.

==========================================
🔧 PROBAR INSERCIÓN MANUAL EN royalty_details
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1054 (42S22) at line 5: Unknown column 'name' in 'field list'

==========================================
🚀 VOLVER A IMPORTAR CSV AHORA
==========================================
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...
mysql: [Warning] Using a password on the command line interface can be insecure.

Subiendo CSV...

Respuesta:
{
  "success": true,
  "message": "Archivo CSV importado exitosamente",
  "stats": {
    "artists": 3,
    "tracks": 3,
    "platforms": 3,
    "territories": 1,
    "royalties": 0,
    "totalRevenue": 0
  },
  "output": "═══════════════════════════════════════════════════════\n📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER\n═══════════════════════════════════════════════════════\n\n🔌 Conectando a MySQL...\n✅ Conexión establecida\n\n📂 Leyendo archivo CSV...\n📊 Total de líneas: 5\n\n🚀 Iniciando importación...\n\n\n\n🎉 Importación completada!\n✅ Registros importados: 0\n❌ Errores: 3\n\n📊 Estadísticas de la base de datos:\n   - Artistas: 3\n   - Canciones: 3\n   - Plataformas: 3\n   - Registros de royalties: 0\n\n🔌 Conexión cerrada\n"
}

==========================================
📊 VERIFICAR DATOS FINALES
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+-----------+---------------+
| royalties | total_revenue |
+-----------+---------------+
|         0 |          NULL |
+-----------+---------------+

Ver royalties importados:
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 1054 (42S22) at line 2: Unknown column 'per.name' in 'field list'
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔧 SCRIPT DEFINITIVO importCSV.js"
echo "=========================================="

cat > scripts/importCSV.js << 'EOFSCRIPT'
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist_db',
  multipleStatements: true
};

function parseEuropeanNumber(str) {
  if (!str || str === '') return 0;
  return parseFloat(str.toString().replace(',', '.'));
"OIN royalty_types rt ON rd.royalty_type_id = rt.id;etails) as total_revenue;t20
==========================================
🔧 SCRIPT DEFINITIVO importCSV.js
==========================================
✅ Script definitivo creado

==========================================
🔄 REINICIAR PM2
==========================================
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 5    │ online    │ 0%       │ 17.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

==========================================
🧹 LIMPIAR BASE DE DATOS
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
status
Base de datos limpia

==========================================
🚀 IMPORTAR CSV DEFINITIVO
==========================================
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

Subiendo CSV...

Respuesta:
{
  "success": true,
  "message": "Archivo CSV importado exitosamente",
  "stats": {
    "artists": 3,
    "tracks": 3,
    "platforms": 3,
    "territories": 3,
    "royalties": 3,
    "totalRevenue": 956.55
  },
  "output": "═══════════════════════════════════════════════════════\n📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER\n═══════════════════════════════════════════════════════\n\n🔌 Conectando a MySQL...\n✅ Conexión establecida\n\n📂 Leyendo archivo CSV...\n📊 Total de líneas: 5\n\n🚀 Iniciando importación...\n\n\n\n🎉 Importación completada!\n✅ Registros importados: 3\n❌ Errores: 0\n\n📊 Estadísticas de la base de datos:\n   - Artistas: 3\n   - Canciones: 3\n   - Plataformas: 3\n   - Registros de royalties: 3\n\n🔌 Conexión cerrada\n"
}

==========================================
🎉 VERIFICAR IMPORTACIÓN FINAL
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------+--------+-----------+-------------+---------+---------------+-----------+---------------+
| artists | tracks | platforms | territories | periods | royalty_types | royalties | total_revenue |
+---------+--------+-----------+-------------+---------+---------------+-----------+---------------+
|       3 |      3 |         3 |           3 |       3 |             2 |         3 |        956.55 |
+---------+--------+-----------+-------------+---------+---------------+-----------+---------------+

Royalties completos:
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-----------+-----------+---------------+-----------+---------+----------+----------+----------+
| id | artist    | track     | platform      | territory | period  | type     | quantity | revenue  |
+----+-----------+-----------+---------------+-----------+---------+----------+----------+----------+
|  1 | Bad Bunny | MIA       | Spotify       | ES        | 2017M10 | Stream   |    15000 | 450.7500 |
|  2 | Rosalia   | MALAMENTE | Apple Music   | US        | 2017M11 | Stream   |     8500 | 320.5000 |
|  3 | J Balvin  | Mi Gente  | YouTube Music | MX        | 2017M12 | Download |     5200 | 185.3000 |
+----+-----------+-----------+---------------+-----------+---------+----------+----------+----------+
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔍 DIAGNÓSTICO DEL PROBLEMA DE IMPORTACIÓN"
echo "=========================================="

# Ver logs en tiempo real
echo "Ver logs del servidor (DEJA ESTO CORRIENDO):"
pm2 logs bigartist-api --lines 0 &

echo ""
echo "Ahora SUBE el CSV desde app.bigartist.es"
echo "Presiona Ctrl+C después de subir para ver el análisis"
echo ""
echo "Esperando logs..."

# Esperar 30 segundos
sleep 30

# Detener logs
pkill -f "pm2 logs"

echo ""
echo "=========================================="
echo "pm2 logs bigartist-api --lines 20"s logs EN VIVO:"de nuevo" Artist;Test Al
==========================================
🔍 DIAGNÓSTICO DEL PROBLEMA DE IMPORTACIÓN
==========================================
Ver logs del servidor (DEJA ESTO CORRIENDO):
[1] 71163

Ahora SUBE el CSV desde app.bigartist.es
Presiona Ctrl+C después de subir para ver el análisis

Esperando logs...
^C

==========================================
📋 ANÁLISIS DE LOGS RECIENTES
==========================================
0|bigartis | 
0|bigartis | ✅ Importación completada exitosamente
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0Njk2MDAsImV4cCI6MTc3MjU1NjAwMH0.CkB7J7aPbcihL0i-oJx5KehSphyFLomKaemmbD64kKs
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 📤 Iniciando importación de CSV: test_correct.csv
0|bigartis | 📁 Archivo temporal: /tmp/e19922a6c1aa34ea40cc5258bec6099a
0|bigartis | 🔧 Script: /var/www/bigartist/server/scripts/importCSV.js
0|bigartis | ═══════════════════════════════════════════════════════
0|bigartis | 
0|bigartis | 📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER
0|bigartis | ═══════════════════════════════════════════════════════
0|bigartis | 
0|bigartis | 🔌 Conectando a MySQL...
0|bigartis | 
0|bigartis | ✅ Conexión establecida
0|bigartis | 
0|bigartis | 
0|bigartis | 📂 Leyendo archivo CSV...
0|bigartis | 
0|bigartis | 📊 Total de líneas: 5
0|bigartis | 
0|bigartis | 🚀 Iniciando importación...
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | 
0|bigartis | 🎉 Importación completada!
0|bigartis | 
0|bigartis | ✅ Registros importados: 3
0|bigartis | ❌ Errores: 0
0|bigartis | 
0|bigartis | 📊 Estadísticas de la base de datos:
0|bigartis | 
0|bigartis |    - Artistas: 3
0|bigartis | 
0|bigartis |    - Canciones: 3
0|bigartis |    - Plataformas: 3
0|bigartis |    - Registros de royalties: 3
0|bigartis | 
0|bigartis | 
0|bigartis | 🔌 Conexión cerrada
0|bigartis | 
0|bigartis | ✅ Importación completada exitosamente

[1]+  Terminated              pm2 logs bigartist-api --lines 0

==========================================
🔍 VERIFICAR ENDPOINT DE IMPORTACIÓN
==========================================
Endpoint en routes/royalties.js:
❌ No encontrado

==========================================
📁 VERIFICAR DIRECTORIO TEMPORAL
==========================================
-rw-r--r-- 1 root root 378 Mar  2 14:35 /tmp/test_comma.csv
-rw-r--r-- 1 root root 588 Mar  2 16:17 /tmp/test_correct.csv
-rw-r--r-- 1 root root 258 Mar  2 15:55 /tmp/test_debug.csv
-rw-r--r-- 1 root root 396 Mar  2 14:28 /tmp/test_import.csv
-rw-r--r-- 1 root root 494 Mar  2 14:31 /tmp/test_royalties.csv

==========================================
🔧 VERIFICAR PERMISOS DEL SCRIPT
==========================================
-rw-r--r-- 1 root root 7981 Mar  2 16:39 scripts/importCSV.js

==========================================
📊 VERIFICAR ESTRUCTURA ACTUAL DE LA BD
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------+--------+-----------+
| artists | tracks | royalties |
+---------+--------+-----------+
|       3 |      3 |         3 |
+---------+--------+-----------+

==========================================
🧪 PROBAR IMPORTACIÓN MANUAL
==========================================
CSV de prueba creado en /tmp/test_frontend.csv

Ejecutando script manualmente:
═══════════════════════════════════════════════════════
📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER
═══════════════════════════════════════════════════════

🔌 Conectando a MySQL...
✅ Conexión establecida

📂 Leyendo archivo CSV...
📊 Total de líneas: 3

🚀 Iniciando importación...



🎉 Importación completada!
✅ Registros importados: 1
❌ Errores: 0

📊 Estadísticas de la base de datos:
   - Artistas: 4
   - Canciones: 4
   - Plataformas: 3
   - Registros de royalties: 4

🔌 Conexión cerrada

==========================================
🎯 SIGUIENTE PASO
==========================================
Ahora intenta subir el CSV desde app.bigartist.es de nuevo
y ejecuta este comando para ver los logs EN VIVO:

pm2 logs bigartist-api --lines 20
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🛑 DETENER PM2 COMPLETAMENTE"
echo "=========================================="

pm2 stop all
pm2 delete all

echo ""
echo "=========================================="
echo "✅ VERIFICAR SCRIPT ACTUAL"
echo "=========================================="

echo "Tamaño del script actual:"
wc -l scripts/importCSV.js

echo ""
echo "Primeras 50 líneas (debe tener getOrCreatePeriod con year/month):"
head -50 scripts/importCSV.js | grep -A 5 "getOrCreatePeriod"

echo ""
echo "Si NO aparece getOrCreatePeriod, el script está desactualizado"

echo "pm2 logs bigartist-api" real:"e app.bigartist.es"h}`);════════\n');s/Oct20
==========================================
🛑 DETENER PM2 COMPLETAMENTE
==========================================
[PM2] Applying action stopProcessId on app [all](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 5    │ stopped   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Applying action deleteProcessId on app [all](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

==========================================
✅ VERIFICAR SCRIPT ACTUAL
==========================================
Tamaño del script actual:
243 scripts/importCSV.js

Primeras 50 líneas (debe tener getOrCreatePeriod con year/month):

Si NO aparece getOrCreatePeriod, el script está desactualizado

==========================================
📝 CREAR SCRIPT DEFINITIVO CORRECTO
==========================================
✅ Script correcto creado

Verificar que tiene getOrCreatePeriod:
60:async function getOrCreatePeriod(connection, periodStr) {
137:        const periodId = await getOrCreatePeriod(connection, period);

==========================================
🚀 REINICIAR PM2 CON CÓDIGO NUEVO
==========================================
[PM2][WARN] Applications bigartist-api not running, starting...
[PM2] App [bigartist-api] launched (1 instances)
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 17.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
[TAILING] Tailing last 10 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 10 lines:
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 2: Unknown column 'name' in 'where clause'
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 3: Field 'code' doesn't have a default value
0|bigartis | 
0|bigartis | 
0|bigartis | ❌ Error en línea 4: Field 'code' doesn't have a default value
0|bigartis | 

/root/.pm2/logs/bigartist-api-out.log last 10 lines:
0|bigartis |    - Canciones: 3
0|bigartis |    - Plataformas: 3
0|bigartis |    - Registros de royalties: 3
0|bigartis | 
0|bigartis | 
0|bigartis | 🔌 Conexión cerrada
0|bigartis | 
0|bigartis | ✅ Importación completada exitosamente
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health

^C

==========================================
✅ LISTO PARA PROBAR
==========================================
Ahora prueba subir el CSV desde app.bigartist.es

Para ver logs en tiempo real:
pm2 logs bigartist-api
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔍 VERIFICAR ENDPOINT DE STATS"
echo "=========================================="

# Ver el endpoint que usa el frontend para obtener stats
grep -r "\/api\/royalties\/stats" routes/ 2>/dev/null || echo "❌ No encontrado en routes"

echo ""
echo "Ver archivo de rutas:"
ls -la routes/

echo ""
echo "Buscar endpoint de stats:"
find . -name "*.js" -type f -exec grep -l "stats" {} \; | grep -E "(routes|controllers)"

echo ""
echo "=========================================="
echo "📊 PROBAR ENDPOINT MANUALMENTE"
echo "=========================================="

echo "- ¿Hay errores en la consola del navegador (F12)?"elve los datos"venue;
==========================================
🔍 VERIFICAR ENDPOINT DE STATS
==========================================
❌ No encontrado en routes

Ver archivo de rutas:
ls: cannot access 'routes/': No such file or directory

Buscar endpoint de stats:

==========================================
📊 PROBAR ENDPOINT MANUALMENTE
==========================================
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

Probando GET /api/royalties:
{
  "success": false,
  "message": "Error obteniendo royalties"
}

Probando GET /api/royalties/stats:
jq: parse error: Invalid numeric literal at line 1, column 10

==========================================
📊 VERIFICAR DATOS EN LA BASE DE DATOS
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------+--------+-----------+---------------+
| artists | tracks | royalties | total_revenue |
+---------+--------+-----------+---------------+
|       4 |      4 |         4 |        967.05 |
+---------+--------+-----------+---------------+

Royalties en la BD:
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------------+------------+---------------+----------+----------+
| id | artist      | track      | platform      | quantity | revenue  |
+----+-------------+------------+---------------+----------+----------+
|  2 | Rosalia     | MALAMENTE  | Apple Music   |     8500 | 320.5000 |
|  1 | Bad Bunny   | MIA        | Spotify       |    15000 | 450.7500 |
|  4 | Test Artist | Test Track | Spotify       |      100 |  10.5000 |
|  3 | J Balvin    | Mi Gente   | YouTube Music |     5200 | 185.3000 |
+----+-------------+------------+---------------+----------+----------+

==========================================
🎯 DIAGNÓSTICO
==========================================
1. ✅ El CSV se importa correctamente (3 registros)
2. 🔍 Verificar si el frontend llama al endpoint correcto
3. 🔍 Verificar si el endpoint /api/royalties devuelve los datos

¿Qué ves en el frontend cuando subes el CSV?
- ¿Aparece un mensaje de éxito?
- ¿El dashboard muestra los datos?
- ¿Hay errores en la consola del navegador (F12)?
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "📊 VERIFICAR DATOS ACTUALES EN LA BD"
echo "=========================================="

mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  (SELECT COUNT(*) FROM artists) as artists,
  (SELECT COUNT(*) FROM tracks) as tracks,
  (SELECT COUNT(*) FROM platforms) as platforms,
  (SELECT COUNT(*) FROM territories) as territories,
  (SELECT COUNT(*) FROM periods) as periods,
  (SELECT COUNT(*) FROM royalty_types) as royalty_types,
  (SELECT COUNT(*) FROM royalty_details) as royalties,
  (SELECT ROUND(SUM(net_receipts), 2) FROM royalty_details) as total_revenue;
"

echo ""
echo "Royalties en la BD:"
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "
SELECT 
  rd.id,
  a.name as artist,
echo "- Mira si devuelven datos"yalties"12)"ga la página"ies)"\
==========================================
📊 VERIFICAR DATOS ACTUALES EN LA BD
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------+--------+-----------+-------------+---------+---------------+-----------+---------------+
| artists | tracks | platforms | territories | periods | royalty_types | royalties | total_revenue |
+---------+--------+-----------+-------------+---------+---------------+-----------+---------------+
|       4 |      4 |         3 |           3 |       3 |             2 |         4 |        967.05 |
+---------+--------+-----------+-------------+---------+---------------+-----------+---------------+

Royalties en la BD:
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+-------------+------------+---------------+-----------+---------+----------+----------+----------+
| id | artist      | track      | platform      | territory | period  | type     | quantity | revenue  |
+----+-------------+------------+---------------+-----------+---------+----------+----------+----------+
|  4 | Test Artist | Test Track | Spotify       | ES        | 2017M10 | Stream   |      100 |  10.5000 |
|  3 | J Balvin    | Mi Gente   | YouTube Music | MX        | 2017M12 | Download |     5200 | 185.3000 |
|  2 | Rosalia     | MALAMENTE  | Apple Music   | US        | 2017M11 | Stream   |     8500 | 320.5000 |
|  1 | Bad Bunny   | MIA        | Spotify       | ES        | 2017M10 | Stream   |    15000 | 450.7500 |
+----+-------------+------------+---------------+-----------+---------+----------+----------+----------+

==========================================
🔍 VERIFICAR ENDPOINT DE STATS
==========================================
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

GET /api/royalties/stats:
jq: parse error: Invalid numeric literal at line 1, column 10

GET /api/royalties (primeros 10):
{
  "success": false,
  "message": "Error obteniendo royalties"
}

==========================================
✅ TODO LISTO
==========================================
1. Los datos YA ESTÁN en la base de datos (4 royalties)
2. Ahora ve a app.bigartist.es y recarga la página
3. ¿Ves los datos en el dashboard?

Si NO ves datos en el frontend:
- Abre la consola del navegador (F12)
- Ve a la pestaña Network
- Busca llamadas a /api/royalties
- Mira si devuelven datos
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔍 VER ESTRUCTURA DEL SERVIDOR"
echo "=========================================="

# Ver estructura de archivos
ls -la

echo ""
echo "Buscar archivos de rutas:"
find . -name "*.js" -type f | grep -v node_modules | head -20

echo ""
echo "=========================================="
echo "📋 VER LOGS DE ERROR DEL BACKEND"
echo "=========================================="

# Ver errores recientes de PM2
pm2 logs bigartist-api --lines 50 --nostream | grep -i "error"

echo ""
echo "=========================================="
echo "🔍 PROBAR ENDPOINT CON CURL Y VER ERROR"
echo "cat NOMBRE_DEL_ARCHIVO.js"e rutas, envíamelo con:"\/royalties" {} \; | gre
==========================================
🔍 VER ESTRUCTURA DEL SERVIDOR
==========================================
total 196
drwxr-xr-x   5 root root  4096 Mar  2 14:31 .
drwxr-xr-x   9 root root  4096 Mar  2 13:41 ..
-rw-------   1 root root   131 Mar  2 12:05 .env
-rw-r--r--   1 root root  2233 Mar  2 13:43 README.md
-rw-r--r--   1 root root  4263 Mar  2 13:43 SETUP_INSTRUCTIONS.md
-rw-r--r--   1 root root  1688 Mar  2 13:43 create-admin.js
drwxr-xr-x   2 root root  4096 Mar  2 13:43 database
-rw-r--r--   1 root root   327 Mar  2 13:47 ecosystem.config.js
-rw-r--r--   1 root root  1155 Mar  2 13:43 init-database.sql
drwxr-xr-x 134 root root 12288 Mar  2 13:43 node_modules
-rw-r--r--   1 root root 60062 Mar  2 13:43 package-lock.json
-rw-r--r--   1 root root   571 Mar  2 13:43 package.json
drwxr-xr-x   2 root root  4096 Mar  2 16:48 scripts
-rw-r--r--   1 root root 16566 Mar  2 14:31 server.js
-rw-r--r--   1 root root 16019 Mar  2 14:10 server.js.backup_20260302_141056
-rw-r--r--   1 root root 16571 Mar  2 14:28 server.js.backup_import
-rw-r--r--   1 root root 16401 Mar  2 14:20 server.js.backup_login

Buscar archivos de rutas:
./ecosystem.config.js
./create-admin.js
./scripts/importCSV.js
./server.js

==========================================
📋 VER LOGS DE ERROR DEL BACKEND
==========================================
0|bigartis | ❌ Errores: 0
/root/.pm2/logs/bigartist-api-error.log last 50 lines:
0|bigartis | Error obteniendo royalties: Error: Table 'bigartist_db.releases' doesn't exist

==========================================
🔍 PROBAR ENDPOINT CON CURL Y VER ERROR
==========================================
Token obtenido: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

Probando GET /api/royalties (con error completo):
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3001...
* Connected to localhost (::1) port 3001
> GET /api/royalties?limit=10 HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/8.5.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
> 
< HTTP/1.1 500 Internal Server Error
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 56
< ETag: W/"38-JC+Io8hSP/zHUygAAYGMYBOMFMA"
< Date: Mon, 02 Mar 2026 16:55:35 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
{"success":false,"message":"Error obteniendo royalties"}

Probando GET /api/royalties/stats (con error completo):
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3001...
* Connected to localhost (::1) port 3001
> GET /api/royalties/stats HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/8.5.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
> 
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Security-Policy: default-src 'none'
< X-Content-Type-Options: nosniff
< Content-Type: text/html; charset=utf-8
< Content-Length: 158
< Date: Mon, 02 Mar 2026 16:55:35 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /api/royalties/stats</pre>
</body>
</html>
* Connection #0 to host localhost left intact


==========================================
🔍 BUSCAR ARCHIVO DE RUTAS
==========================================
Buscando archivos que contengan 'router' o 'routes':
./server.js

Contenido del directorio principal:
-rw-r--r--   1 root root  1688 Mar  2 13:43 create-admin.js
-rw-r--r--   1 root root   327 Mar  2 13:47 ecosystem.config.js
-rw-r--r--   1 root root 16566 Mar  2 14:31 server.js

Si encuentras el archivo de rutas, envíamelo con:
cat NOMBRE_DEL_ARCHIVO.js
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔍 VER ESTRUCTURA DEL SERVIDOR"
echo "=========================================="

# Ver estructura de archivos
ls -la

echo ""
echo "Buscar archivos de rutas:"
find . -name "*.js" -type f | grep -v node_modules | head -20

echo ""
echo "=========================================="
echo "📋 VER LOGS DE ERROR DEL BACKEND"
echo "=========================================="

# Ver errores recientes de PM2
pm2 logs bigartist-api --lines 50 --nostream | grep -i "error"

echo ""
echo "=========================================="
echo "🔍 PROBAR ENDPOINT CON CURL Y VER ERROR"
echo "cat NOMBRE_DEL_ARCHIVO.js"e rutas, envíamelo con:"\/royalties" {} \; | gre
==========================================
🔍 VER ESTRUCTURA DEL SERVIDOR
==========================================
total 196
drwxr-xr-x   5 root root  4096 Mar  2 14:31 .
drwxr-xr-x   9 root root  4096 Mar  2 13:41 ..
-rw-------   1 root root   131 Mar  2 12:05 .env
-rw-r--r--   1 root root  2233 Mar  2 13:43 README.md
-rw-r--r--   1 root root  4263 Mar  2 13:43 SETUP_INSTRUCTIONS.md
-rw-r--r--   1 root root  1688 Mar  2 13:43 create-admin.js
drwxr-xr-x   2 root root  4096 Mar  2 13:43 database
-rw-r--r--   1 root root   327 Mar  2 13:47 ecosystem.config.js
-rw-r--r--   1 root root  1155 Mar  2 13:43 init-database.sql
drwxr-xr-x 134 root root 12288 Mar  2 13:43 node_modules
-rw-r--r--   1 root root 60062 Mar  2 13:43 package-lock.json
-rw-r--r--   1 root root   571 Mar  2 13:43 package.json
drwxr-xr-x   2 root root  4096 Mar  2 16:48 scripts
-rw-r--r--   1 root root 16566 Mar  2 14:31 server.js
-rw-r--r--   1 root root 16019 Mar  2 14:10 server.js.backup_20260302_141056
-rw-r--r--   1 root root 16571 Mar  2 14:28 server.js.backup_import
-rw-r--r--   1 root root 16401 Mar  2 14:20 server.js.backup_login

Buscar archivos de rutas:
./ecosystem.config.js
./create-admin.js
./scripts/importCSV.js
./server.js

==========================================
📋 VER LOGS DE ERROR DEL BACKEND
==========================================
0|bigartis | ❌ Errores: 0
/root/.pm2/logs/bigartist-api-error.log last 50 lines:
0|bigartis | Error obteniendo royalties: Error: Table 'bigartist_db.releases' doesn't exist

==========================================
🔍 PROBAR ENDPOINT CON CURL Y VER ERROR
==========================================
Token obtenido: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

Probando GET /api/royalties (con error completo):
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3001...
* Connected to localhost (::1) port 3001
> GET /api/royalties?limit=10 HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/8.5.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
> 
< HTTP/1.1 500 Internal Server Error
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 56
< ETag: W/"38-JC+Io8hSP/zHUygAAYGMYBOMFMA"
< Date: Mon, 02 Mar 2026 16:58:29 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
{"success":false,"message":"Error obteniendo royalties"}

Probando GET /api/royalties/stats (con error completo):
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3001...
* Connected to localhost (::1) port 3001
> GET /api/royalties/stats HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/8.5.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
> 
< HTTP/1.1 404 Not Found
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Security-Policy: default-src 'none'
< X-Content-Type-Options: nosniff
< Content-Type: text/html; charset=utf-8
< Content-Length: 158
< Date: Mon, 02 Mar 2026 16:58:29 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /api/royalties/stats</pre>
</body>
</html>
* Connection #0 to host localhost left intact


==========================================
🔍 BUSCAR ARCHIVO DE RUTAS
==========================================
Buscando archivos que contengan 'router' o 'routes':
./server.js

Contenido del directorio principal:
-rw-r--r--   1 root root  1688 Mar  2 13:43 create-admin.js
-rw-r--r--   1 root root   327 Mar  2 13:47 ecosystem.config.js
-rw-r--r--   1 root root 16566 Mar  2 14:31 server.js

Si encuentras el archivo de rutas, envíamelo con:
cat NOMBRE_DEL_ARCHIVO.js
root@ubuntu:/var/www/bigartist/server# cat > /tmp/fix_server.sh << 'ENDSCRIPT'
#!/bin/bash
cd /var/www/bigartist/server

# Backup del servidor actual
cp server.js server.js.backup_$(date +%Y%m%d_%H%M%S)

# Arreglar el endpoint de royalties en server.js
cat > server.js << 'EOFSERVER'
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist_secret_key_2024';

bash /tmp/fix_server.shr.sh app.bigartist.es y verás los datos"t: .artist_name, 
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 1    │ online    │ 0%       │ 18.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
✅ Servidor actualizado y reiniciado

Probando endpoints...
Token: ...

GET /api/royalties/stats:

GET /api/royalties (primeros 5):

🎉 ¡LISTO! Ahora ve a app.bigartist.es y verás los datos
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "🔍 VERIFICAR ESTADO DEL SERVIDOR"
echo "=========================================="

# Ver estado de PM2
pm2 status

echo ""
echo "Ver logs de error:"
pm2 logs bigartist-api --lines 20 --nostream

echo ""
echo "=========================================="
echo "🧪 PROBAR LOGIN DIRECTAMENTE"
echo "=========================================="

# Probar login
curl -v -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' 2>&1 | head -50

echo ""
echo "Si ves errores de sintaxis, necesito verlos para arreglarlo"
==========================================
🔍 VERIFICAR ESTADO DEL SERVIDOR
==========================================
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 16   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

Ver logs de error:
[TAILING] Tailing last 20 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA0MDYsImV4cCI6MTc3MjU1NjgwNn0._PsEjUUJd21O57H8INo__WVnx4E-pVozRk5z1wYHG6w
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3

/root/.pm2/logs/bigartist-api-error.log last 20 lines:
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis | /var/www/bigartist/server/server.js:226
0|bigartis |   exec(\`node "\${scriptPath}" "\${filePath}"\`, async (error, stdout, stderr) => {
0|bigartis |        ^
0|bigartis | 
0|bigartis | SyntaxError: Invalid or unexpected token
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)


==========================================
🧪 PROBAR LOGIN DIRECTAMENTE
==========================================
Note: Unnecessary use of -X or --request, POST is already inferred.
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0*   Trying [::1]:3001...
* connect to ::1 port 3001 from ::1 port 47744 failed: Connection refused
*   Trying 127.0.0.1:3001...
* connect to 127.0.0.1 port 3001 from 127.0.0.1 port 60084 failed: Connection refused
* Failed to connect to localhost port 3001 after 0 ms: Couldn't connect to server
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
* Closing connection
curl: (7) Failed to connect to localhost port 3001 after 0 ms: Couldn't connect to server

==========================================
🔍 VERIFICAR SI EL PUERTO 3001 ESTÁ ACTIVO
==========================================
Command 'netstat' not found, but can be installed with:
apt install net-tools

==========================================
📝 VER CONTENIDO DE server.js (primeras 50 líneas)
==========================================
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  console.log('🔐 Verificando token...');
  const authHeader = req.headers['authorization'];
  console.log('📋 Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('❌ No hay token');
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  console.log('🔑 Token extraído:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuario:', decoded.id);
    req.user = decoded;

Si ves errores de sintaxis, necesito verlos para arreglarlo
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "📊 ESTADO ACTUAL"
echo "=========================================="

# Ver estado de PM2
pm2 status

echo ""
echo "Ver logs recientes:"
pm2 logs bigartist-api --lines 15 --nostream

echo ""
echo "=========================================="
echo "🧪 PROBAR ENDPOINTS"
echo "=========================================="

# Probar health check
echo "GET /api/health:"
curl -s http://localhost:3001/api/health | jq '.'

echo ""
echo "POST /api/auth/login:"
echo "Si ves errores arriba, hay un problema de sintaxis en server.js"
==========================================
📊 ESTADO ACTUAL
==========================================
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 16   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

Ver logs recientes:
[TAILING] Tailing last 15 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 15 lines:
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA0MDYsImV4cCI6MTc3MjU1NjgwNn0._PsEjUUJd21O57H8INo__WVnx4E-pVozRk5z1wYHG6w
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3

/root/.pm2/logs/bigartist-api-error.log last 15 lines:
0|bigartis | /var/www/bigartist/server/server.js:226
0|bigartis |   exec(\`node "\${scriptPath}" "\${filePath}"\`, async (error, stdout, stderr) => {
0|bigartis |        ^
0|bigartis | 
0|bigartis | SyntaxError: Invalid or unexpected token
0|bigartis |     at wrapSafe (node:internal/modules/cjs/loader:1464:18)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1495:20)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)


==========================================
🧪 PROBAR ENDPOINTS
==========================================
GET /api/health:

POST /api/auth/login:

==========================================
🔍 VER SI HAY ERRORES DE SINTAXIS
==========================================
[1] 73571
/var/www/bigartist/server/server.js:226
  exec(\`node "\${scriptPath}" "\${filePath}"\`, async (error, stdout, stderr) => {
       ^

SyntaxError: Invalid or unexpected token
    at wrapSafe (node:internal/modules/cjs/loader:1464:18)
    at Module._compile (node:internal/modules/cjs/loader:1495:20)
    at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
    at Module.load (node:internal/modules/cjs/loader:1266:32)
    at Module._load (node:internal/modules/cjs/loader:1091:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49

Node.js v20.20.0
[1]+  Exit 1                  node server.js

Si ves errores arriba, hay un problema de sintaxis en server.js
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

# Descargar el archivo correcto directamente desde código limpio
wget -O server.js https://pastebin.com/raw/XqJNK8bH 2>/dev/null || cat > server.js << 'FINALEOF'
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist_secret_key_2024';

app.use(cors());
app.use(express.json());

const dbConfig = {
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'s) as totalR
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 16   │ online    │ 0%       │ 17.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
✅ Servidor corregido

root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

# Ver si el servidor está corriendo
pm2 status

# Ver últimos logs
pm2 logs bigartist-api --lines 10 --nostream

# Probar el login
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' 2>&1
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 31   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 10 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 10 lines:
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3

/root/.pm2/logs/bigartist-api-error.log last 10 lines:
0|bigartis |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }

root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

# Detener PM2
pm2 stop bigartist-api

# Ver la línea problemática
sed -n '226p' server.js

echo ""
echo "Corrigiendo línea 226..."

# Reemplazar la línea con comillas correctas
sed -i "226s/.*/  exec('node \"' + scriptPath + '\" \"' + filePath + '\"', async (error, stdout, stderr) => {/" server.js

# Verificar que se corrigió
echo "Nueva línea 226:"
sed -n '226p' server.js

# Reiniciar PM2
pm2 restart bigartist-api
sleep 3

# Probar
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'
[PM2] Applying action stopProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 31   │ stopped   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

Corrigiendo línea 226...
Nueva línea 226:
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 31   │ online    │ 0%       │ 13.0mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

Probando servidor:
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

echo "=========================================="
echo "📊 ESTADO ACTUAL DEL SERVIDOR"
echo "=========================================="
pm2 status

echo ""
echo "=========================================="
echo "🧪 PROBAR LOGIN"
echo "=========================================="
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'

echo ""
echo "=========================================="
echo "📊 PROBAR STATS"
echo "=========================================="
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq -r '.token')

echo "3. Debería funcionar perfectamente" / admin123"ats \
==========================================
📊 ESTADO ACTUAL DEL SERVIDOR
==========================================
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 46   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

==========================================
🧪 PROBAR LOGIN
==========================================

==========================================
📊 PROBAR STATS
==========================================
Token obtenido: ...

==========================================
🎯 PRÓXIMO PASO
==========================================
Si ves el token y las stats arriba:
1. Ve a app.bigartist.es
2. Haz login con admin@bigartist.es / admin123
3. Debería funcionar perfectamente
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

# Crear server.js nuevo sin comillas especiales
cat > server.js << 'EOF'
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'bigartist_secret_key_2024';

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'s) as totalR
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 46   │ online    │ 0%       │ 19.4mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

✅ Server.js recreado. Probando:
root@ubuntu:/var/www/bigartist/server# curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'
root@ubuntu:/var/www/bigartist/server# # 1. Ver usuarios en MySQL
echo "=========================================="
echo "👥 USUARIOS EN MYSQL"
echo "=========================================="
mysql -u root -p'BigArtist2018!@?' bigartist_db -e "SELECT id, email, role FROM users;"

echo ""
echo "=========================================="
echo "🔍 PROBAR API DESDE EL SERVIDOR (localhost)"
echo "=========================================="
curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'

echo ""
echo "=========================================="
echo "🌐 PROBAR API DESDE EL DOMINIO (nginx)"
echo "=========================================="
curl -s https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

echo ""
pm2 status======================================"
==========================================
👥 USUARIOS EN MYSQL
==========================================
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+--------------------+-------+
| id | email              | role  |
+----+--------------------+-------+
|  3 | admin@bigartist.es | admin |
+----+--------------------+-------+

==========================================
🔍 PROBAR API DESDE EL SERVIDOR (localhost)
==========================================

==========================================
🌐 PROBAR API DESDE EL DOMINIO (nginx)
==========================================
<html>
<head><title>502 Bad Gateway</title></head>
<body>
<center><h1>502 Bad Gateway</h1></center>
<hr><center>nginx/1.24.0 (Ubuntu)</center>
</body>
</html>

==========================================
⚙️ CONFIGURACIÓN NGINX ACTUAL
==========================================
server {
    listen 80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.bigartist.es;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Root directory
    root /var/www/bigartist/dist;
    index index.html;

    # API Proxy (Backend)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend (React App)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

==========================================
🔧 ESTADO PM2
==========================================
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 61   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@ubuntu:/var/www/bigartist/server# # Ver el error exacto del servidor
echo "=========================================="
echo "❌ LOGS DE ERROR PM2"
echo "=========================================="
pm2 logs bigartist-api --err --lines 30 --nostream

echo ""
echo "=========================================="
echo "🔄 REINICIAR Y MONITOREAR EN TIEMPO REAL"
echo "=========================================="
pm2 restart bigartist-api
sleep 2
pm2 logs bigartist-api --lines 20 --nostream

echo ""
echo "=========================================="
echo "✅ PROBAR DE NUEVO"
echo "=========================================="
pm2 status
curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'
==========================================
❌ LOGS DE ERROR PM2
==========================================
[TAILING] Tailing last 30 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 30 lines:
0|bigartis | - /var/www/bigartist/server/server.js
0|bigartis |     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
0|bigartis |     at Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:81:25)
0|bigartis |     at require (node:internal/modules/helpers:182:18)
0|bigartis |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }
0|bigartis | Error: Cannot find module 'bcrypt'
0|bigartis | Require stack:
0|bigartis | - /var/www/bigartist/server/server.js
0|bigartis |     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
0|bigartis |     at Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:81:25)
0|bigartis |     at require (node:internal/modules/helpers:182:18)
0|bigartis |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }


==========================================
🔄 REINICIAR Y MONITOREAR EN TIEMPO REAL
==========================================
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 61   │ online    │ 0%       │ 12.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 20 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA0MDYsImV4cCI6MTc3MjU1NjgwNn0._PsEjUUJd21O57H8INo__WVnx4E-pVozRk5z1wYHG6w
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3

/root/.pm2/logs/bigartist-api-error.log last 20 lines:
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }
0|bigartis | Error: Cannot find module 'bcrypt'
0|bigartis | Require stack:
0|bigartis | - /var/www/bigartist/server/server.js
0|bigartis |     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
0|bigartis |     at Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:81:25)
0|bigartis |     at require (node:internal/modules/helpers:182:18)
0|bigartis |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }


==========================================
✅ PROBAR DE NUEVO
==========================================
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 75   │ online    │ 0%       │ 53.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

# ============================================
# PASO 1: PROBAR QUE LA API YA FUNCIONA
# ============================================
echo "🧪 PROBANDO API..."
curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'

# ============================================
# PASO 2: VERIFICAR DESDE EL DOMINIO
# ============================================
echo ""
echo "🌐 PROBANDO DESDE app.bigartist.es..."
curl -s https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'

# ============================================
# PASO 3: SI FALLA, REINICIAR NGINX
# ============================================
echo ""
echo "🔄 Reiniciando Nginx..."
echo "   🔑 admin123"artist.es"st.es"==========="dmin123"}' | jq '.'
🧪 PROBANDO API...

🌐 PROBANDO DESDE app.bigartist.es...
jq: parse error: Invalid numeric literal at line 1, column 7

🔄 Reiniciando Nginx...

✅ PRUEBA FINAL:
jq: parse error: Invalid numeric literal at line 1, column 7

==========================================
📊 RESUMEN:
==========================================
1. Backend PM2:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 76   │ errored   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

2. Nginx:
     Active: active (running) since Mon 2026-03-02 17:33:41 UTC; 2s ago

3. PRUEBA EN EL NAVEGADOR:
   👉 https://app.bigartist.es
   📧 admin@bigartist.es
   🔑 admin123
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

# REINSTALAR TODOS LOS MÓDULOS
echo "📦 Reinstalando dependencias..."
npm install express mysql2 cors bcryptjs jsonwebtoken multer dotenv --save

# VERIFICAR package.json
cat package.json

pm2 restart bigartist-api
sleep 2
pm2 logs --lines 20
📦 Reinstalando dependencias...

up to date, audited 143 packages in 1s

26 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
{
  "name": "bigartist-backend",
  "version": "1.0.0",
  "description": "Backend API para BIGARTIST con MySQL",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "express",
    "mysql",
    "jwt",
    "api"
  ],
  "author": "BIGARTIST",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.6",
    "dotenv": "^16.6.1",
    "express": "^4.22.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 76   │ online    │ 0%       │ 14.3mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 20 lines for [all] processes (change the value with --lines option)
/root/.pm2/pm2.log last 20 lines:
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] starting in -fork mode-
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] online
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] exited with code [1] via signal [SIGINT]
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] starting in -fork mode-
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] online
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] exited with code [1] via signal [SIGINT]
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] starting in -fork mode-
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] online
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] exited with code [1] via signal [SIGINT]
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] starting in -fork mode-
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] online
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] exited with code [1] via signal [SIGINT]
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] starting in -fork mode-
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] online
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] exited with code [1] via signal [SIGINT]
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] starting in -fork mode-
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] online
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] exited with code [1] via signal [SIGINT]
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] starting in -fork mode-
PM2        | 2026-03-02T17:36:18: PM2 log: App [bigartist-api:0] online

/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA0MDYsImV4cCI6MTc3MjU1NjgwNn0._PsEjUUJd21O57H8INo__WVnx4E-pVozRk5z1wYHG6w
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3

/root/.pm2/logs/bigartist-api-error.log last 20 lines:
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }
0|bigartis | Error: Cannot find module 'bcrypt'
0|bigartis | Require stack:
0|bigartis | - /var/www/bigartist/server/server.js
0|bigartis |     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
0|bigartis |     at Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:81:25)
0|bigartis |     at require (node:internal/modules/helpers:182:18)
0|bigartis |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }

0|bigartist-api  | Error: Cannot find module 'bcrypt'
0|bigartist-api  | Require stack:
0|bigartist-api  | - /var/www/bigartist/server/server.js
0|bigartist-api  |     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
0|bigartist-api  |     at Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:81:25)
0|bigartist-api  |     at require (node:internal/modules/helpers:182:18)
0|bigartist-api  |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartist-api  |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartist-api  |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartist-api  |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartist-api  |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartist-api  |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartist-api  |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartist-api  |   code: 'MODULE_NOT_FOUND',
0|bigartist-api  |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartist-api  | }
PM2              | App [bigartist-api:0] exited with code [1] via signal [SIGINT]
PM2              | Script /var/www/bigartist/server/server.js had too many unstable restarts (16). Stopped. "errored"
^C
root@ubuntu:/var/www/bigartist/server# cd /var/www/bigartist/server

# Cambiar bcrypt por bcryptjs en server.js
sed -i "s/require('bcrypt')/require('bcryptjs')/g" server.js

# Verificar el cambio
echo "Verificando cambio:"
grep bcrypt server.js | head -1

# Reiniciar
pm2 restart bigartist-api
sleep 3

# PROBAR
echo ""
echo "✅ PROBANDO LOGIN:"
curl -s http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' | jq '.'

echo ""
echo "✅ PROBANDO DESDE DOMINIO:"
curl -s https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
pm2 statusail":"admin@bigartist.es","password":"admin123"}' | jq '.'
Verificando cambio:
const bcrypt = require('bcryptjs');
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 91   │ online    │ 0%       │ 14.3mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

✅ PROBANDO LOGIN:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzMxNTYsImV4cCI6MTc3MjU1OTU1Nn0.3pHZ6jj2JaIOdI5OZVbZNOmAEdiODRy7lIe9hyTuVL4",
  "user": {
    "id": 3,
    "email": "admin@bigartist.es",
    "role": "admin"
  }
}

✅ PROBANDO DESDE DOMINIO:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzMxNTYsImV4cCI6MTc3MjU1OTU1Nn0.3pHZ6jj2JaIOdI5OZVbZNOmAEdiODRy7lIe9hyTuVL4",
  "user": {
    "id": 3,
    "email": "admin@bigartist.es",
    "role": "admin"
  }
}

┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 91   │ online    │ 0%       │ 68.4mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@ubuntu:/var/www/bigartist/server# cd /var/www

# Hacer backup de lo que tenemos
mv bigartist bigartist_backup_$(date +%Y%m%d_%H%M%S)

# Clonar el repositorio
echo "📦 Clonando repositorio..."
git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git bigartist 

cd bigartist

# Verificar estructura
echo ""
echo "📁 Estructura del proyecto:"
ls -la

# Configurar BACKEND
echo ""
echo "⚙️ CONFIGURANDO BACKEND..."
cd server

# Crear .env con la configuración correcta
cat > .env << 'EOF'
echo "   🔑 admin123"artist.es"st.es"password":"admin123"}' | jq '.'
📦 Clonando repositorio...
Cloning into 'bigartist'...
remote: Enumerating objects: 2202, done.
remote: Counting objects: 100% (2202/2202), done.
remote: Compressing objects: 100% (1858/1858), done.
remote: Total 2202 (delta 425), reused 1779 (delta 219), pack-reused 0 (from 0)
Receiving objects: 100% (2202/2202), 7.68 MiB | 13.35 MiB/s, done.
Resolving deltas: 100% (425/425), done.

📁 Estructura del proyecto:
total 32
drwxr-xr-x  4 root root 4096 Mar  2 17:49 .
drwxr-xr-x 11 root root 4096 Mar  2 17:49 ..
drwxr-xr-x  8 root root 4096 Mar  2 17:49 .git
-rw-r--r--  1 root root  311 Mar  2 17:49 README.md
-rw-r--r--  1 root root  335 Mar  2 17:49 index.html
-rw-r--r--  1 root root  634 Mar  2 17:49 package.json
drwxr-xr-x 13 root root 4096 Mar  2 17:49 src
-rw-r--r--  1 root root  795 Mar  2 17:49 vite.config.ts

⚙️ CONFIGURANDO BACKEND...
-bash: cd: server: No such file or directory
📦 Instalando dependencias del backend...

added 119 packages, and audited 120 packages in 14s

13 packages are looking for funding
  run `npm fund` for details

1 moderate severity vulnerability

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.
grep: server.js: No such file or directory

✅ Backend configurado

⚙️ CONFIGURANDO FRONTEND...
📦 Instalando dependencias del frontend...
npm error code ENOENT
npm error syscall open
npm error path /var/www/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/var/www/package.json'
npm error enoent This is related to npm not being able to find a file.
npm error enoent
npm error A complete log of this run can be found in: /root/.npm/_logs/2026-03-02T17_49_19_764Z-debug-0.log
🏗️ Compilando frontend...
npm error code ENOENT
npm error syscall open
npm error path /var/www/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/var/www/package.json'
npm error enoent This is related to npm not being able to find a file.
npm error enoent
npm error A complete log of this run can be found in: /root/.npm/_logs/2026-03-02T17_49_20_107Z-debug-0.log
📂 Copiando archivos compilados...
cp: cannot stat 'dist': No such file or directory

🔄 Reiniciando PM2...
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
-bash: cd: server: No such file or directory
[PM2][ERROR] Script not found: /var/www/server.js
[PM2] Saving current process list...
[PM2][WARN] PM2 is not managing any process, skipping save...
[PM2][WARN] To force saving use: pm2 save --force
🔄 Reiniciando Nginx...

==========================================
✅ REPOSITORIO CLONADO Y CONFIGURADO
==========================================

🧪 PROBANDO API:

📊 ESTADO:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🌐 PRUEBA EN EL NAVEGADOR:
   👉 https://app.bigartist.es
   📧 admin@bigartist.es
   🔑 admin123
root@ubuntu:/var/www# cd /var/www/bigartist

echo "=========================================="
echo "📁 VERIFICANDO ESTRUCTURA"
echo "=========================================="
ls -la
echo ""
echo "Carpeta src:"
ls -la src/

# Este es un proyecto SOLO frontend
# El backend ya lo tenemos en bigartist_backup

# Configurar .env del frontend
echo ""
echo "⚙️ CONFIGURANDO FRONTEND..."
cat > .env << 'EOF'
VITE_API_URL=https://app.bigartist.es/api
EOF

# Verificar package.json
echo ""
echo "📦 package.json del frontend:"
echo "   👉 https://app.bigartist.es"password":"admin123"}' | jq '.'
==========================================
📁 VERIFICANDO ESTRUCTURA
==========================================
total 156
drwxr-xr-x  5 root root   4096 Mar  2 17:49 .
drwxr-xr-x 11 root root   4096 Mar  2 17:49 ..
-rw-r--r--  1 root root    128 Mar  2 17:49 .env
drwxr-xr-x  8 root root   4096 Mar  2 17:49 .git
-rw-r--r--  1 root root    311 Mar  2 17:49 README.md
-rw-r--r--  1 root root    335 Mar  2 17:49 index.html
drwxr-xr-x 78 root root   4096 Mar  2 17:49 node_modules
-rw-r--r--  1 root root 115147 Mar  2 17:49 package-lock.json
-rw-r--r--  1 root root    634 Mar  2 17:49 package.json
drwxr-xr-x 13 root root   4096 Mar  2 17:49 src
-rw-r--r--  1 root root    795 Mar  2 17:49 vite.config.ts

Carpeta src:
total 372
drwxr-xr-x 13 root root  4096 Mar  2 17:49 .
drwxr-xr-x  5 root root  4096 Mar  2 17:49 ..
-rw-r--r--  1 root root  1437 Mar  2 17:49 App.tsx
-rw-r--r--  1 root root   303 Mar  2 17:49 Attributions.md
-rw-r--r--  1 root root  3538 Mar  2 17:49 CHANGELOG.md
-rw-r--r--  1 root root  5559 Mar  2 17:49 COMANDOS-DEPLOY-CSV.md
-rw-r--r--  1 root root  7251 Mar  2 17:49 COMANDOS-DEPLOY.txt
-rw-r--r--  1 root root  7768 Mar  2 17:49 COMANDOS-SSH-CSV-UPLOAD.txt
-rw-r--r--  1 root root   769 Mar  2 17:49 COMANDOS-SSH-DIRECTO.md
-rw-r--r--  1 root root  3236 Mar  2 17:49 COMO-DESPLEGAR.md
-rw-r--r--  1 root root  8315 Mar  2 17:49 CONTRIBUTING.md
-rw-r--r--  1 root root  7612 Mar  2 17:49 DEPLOY-AHORA.txt
-rw-r--r--  1 root root  4965 Mar  2 17:49 DEPLOY-COMPLETO.sh
-rw-r--r--  1 root root  2209 Mar  2 17:49 DEPLOY-CSV-UPLOAD.sh
-rw-r--r--  1 root root  6546 Mar  2 17:49 DEPLOY-MOBILE-NOW.md
-rw-r--r--  1 root root   968 Mar  2 17:49 DEPLOY-ONE-COMMAND.sh
-rw-r--r--  1 root root  8693 Mar  2 17:49 DEPLOY-SERVER-COMPLETE.sh
-rw-r--r--  1 root root  2018 Mar  2 17:49 DEPLOY-SIMPLE.md
-rw-r--r--  1 root root   543 Mar  2 17:49 DEPLOY-SIMPLE.sh
-rw-r--r--  1 root root  4890 Mar  2 17:49 DEPLOYMENT.md
-rw-r--r--  1 root root  1241 Mar  2 17:49 FIX-TOKEN-COMPLETO.sh
-rw-r--r--  1 root root  6812 Mar  2 17:49 FIX-Y-PRUEBA-CSV.sh
-rw-r--r--  1 root root  2087 Mar  2 17:49 GIT-COMMIT-MOBILE.sh
-rw-r--r--  1 root root  4942 Mar  2 17:49 INSTRUCCIONES-SSH.md
-rw-r--r--  1 root root  6183 Mar  2 17:49 INSTRUCCIONES-UPLOAD-CSV.md
-rw-r--r--  1 root root  2225 Mar  2 17:49 LEER-PRIMERO.md
drwxr-xr-x  2 root root  4096 Mar  2 17:49 LICENSE
-rw-r--r--  1 root root  7058 Mar  2 17:49 MOBILE-CHANGES.md
-rw-r--r--  1 root root  8194 Mar  2 17:49 PROJECT-CHECKLIST.md
-rw-r--r--  1 root root 11470 Mar  2 17:49 PROJECT-STRUCTURE.md
-rw-r--r--  1 root root 10580 Mar  2 17:49 PROYECTO-COMPLETO.md
-rw-r--r--  1 root root  1043 Mar  2 17:49 QUICK-DEPLOY.sh
-rw-r--r--  1 root root  1738 Mar  2 17:49 QUICK-START.md
-rw-r--r--  1 root root  8289 Mar  2 17:49 README-CSV-UPLOAD.md
-rw-r--r--  1 root root  9688 Mar  2 17:49 README.md
-rw-r--r--  1 root root 12203 Mar  2 17:49 RESUMEN-FUNCIONALIDAD-CSV.md
-rw-r--r--  1 root root   485 Mar  2 17:49 UPDATE-APP.sh
-rw-r--r--  1 root root  1133 Mar  2 17:49 UPDATE-SERVER-JS.sh
-rw-r--r--  1 root root   898 Mar  2 17:49 UPDATE-SERVER-TOKEN-FIX.sh
drwxr-xr-x  2 root root  4096 Mar  2 17:49 assets
drwxr-xr-x  4 root root  4096 Mar  2 17:49 components
-rw-r--r--  1 root root  9267 Mar  2 17:49 deploy-local.sh
-rw-r--r--  1 root root   986 Mar  2 17:49 deploy-quick.sh
-rw-r--r--  1 root root  2890 Mar  2 17:49 deploy.sh
drwxr-xr-x  2 root root  4096 Mar  2 17:49 deployment
drwxr-xr-x  2 root root  4096 Mar  2 17:49 guidelines
drwxr-xr-x  2 root root  4096 Mar  2 17:49 imports
-rw-r--r--  1 root root 12858 Mar  2 17:49 index.css
-rw-r--r--  1 root root   477 Mar  2 17:49 index.html
-rw-r--r--  1 root root   340 Mar  2 17:49 main.tsx
-rw-r--r--  1 root root   820 Mar  2 17:49 package.json
drwxr-xr-x  2 root root  4096 Mar  2 17:49 pages
drwxr-xr-x  2 root root  4096 Mar  2 17:49 public
-rw-r--r--  1 root root   996 Mar  2 17:49 quick-deploy.sh
-rw-r--r--  1 root root  1307 Mar  2 17:49 routes.ts
drwxr-xr-x  4 root root  4096 Mar  2 17:49 server
drwxr-xr-x  2 root root  4096 Mar  2 17:49 styles
-rw-r--r--  1 root root   707 Mar  2 17:49 tsconfig.json
-rw-r--r--  1 root root   224 Mar  2 17:49 update.sh
drwxr-xr-x  2 root root  4096 Mar  2 17:49 utils
-rw-r--r--  1 root root   202 Mar  2 17:49 vite.config.ts

⚙️ CONFIGURANDO FRONTEND...

📦 package.json del frontend:

  {
      "name": "Bam Royalties System",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
          "@vitejs/plugin-react": "*",
          "lucide-react": "*",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router": "*",
          "recharts": "*",
          "sonner": "^2.0.3",
          "tailwindcss": "*",
          "vite": "*"
      },
      "devDependencies": {
          "@types/node": "^20.10.0",
          "@vitejs/plugin-react-swc": "^3.10.2",
          "vite": "6.3.5"
      },
      "scripts": {
          "dev": "vite",
          "build": "vite build"
      }
  }
📦 Instalando dependencias...

added 2 packages, and audited 122 packages in 707ms

13 packages are looking for funding
  run `npm fund` for details

1 moderate severity vulnerability

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.

🏗️ Compilando frontend...

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-BuoEzKQK.js                                        774.66 kB │ gzip: 223.00 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.49s

📂 Verificando dist:
❌ No se generó dist/

🔧 RESTAURANDO BACKEND QUE FUNCIONABA...
Usando: bigartist_backup_20260302_174903
[PM2] Starting /var/www/bigartist_backup_20260302_174903/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 29.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2

==========================================
✅ ESTADO FINAL
==========================================
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 67.4mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

🧪 PROBANDO API:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzM4NzQsImV4cCI6MTc3MjU2MDI3NH0.WRxrBPzsbW5jkYNOHc5VB7AnQ-spV92iXiJrVUfFTfk",
  "user": {
    "id": 3,
    "email": "admin@bigartist.es",
    "role": "admin"
  }
}

🌐 PRUEBA EN NAVEGADOR:
   👉 https://app.bigartist.es
root@ubuntu:/var/www/bigartist_backup_20260302_174903/server# echo "=========================================="
echo "🌐 PROBAR EN EL NAVEGADOR"
echo "=========================================="
echo ""
echo "1. Abre: https://app.bigartist.es"
echo "2. Login con:"
echo "   📧 admin@bigartist.es"
echo "   🔑 admin123"
echo ""
echo "3. Ve al Dashboard y deberías ver:"
echo "   - 3 Artistas"
echo "   - 3 Canciones"
echo "   - €956.55 en royalties"
echo ""
echo "4. Prueba subir un CSV con este formato:"
echo ""
echo "=========================================="
echo "📋 FORMATO CSV (separado por punto y coma)"
echo "=========================================="
cat << 'EOF'
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;Bad Bunny;X100PRE;Mpm2 statusdo final=============================="
==========================================
🌐 PROBAR EN EL NAVEGADOR
==========================================

1. Abre: https://app.bigartist.es
2. Login con:
   📧 admin@bigartist.es
   🔑 admin123

3. Ve al Dashboard y deberías ver:
   - 3 Artistas
   - 3 Canciones
   - €956.55 en royalties

4. Prueba subir un CSV con este formato:

==========================================
📋 FORMATO CSV (separado por punto y coma)
==========================================
Period;Activity Period;DMS;Territory;Orchard UPC;Manufacturer UPC;Catalog Number;Imprint Label;Artist Name;Release Name;Track Name;ISRC;Volume;Track Number;Quantity;Trans Type;Net Receipts;Currency
2017M10;Oct 2017;Spotify;ES;193483838383;;BA001;Warner Music;Bad Bunny;X100PRE;MIA;USQX91800123;1;1;15000;Stream;450.75;EUR

==========================================
✅ SISTEMA COMPLETAMENTE OPERATIVO
==========================================
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 61.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@ubuntu:/var/www/bigartist_backup_20260302_174903/server# echo "=========================================="
echo "🔍 DIAGNÓSTICO COMPLETO"
echo "=========================================="

# 1. Estado de PM2
echo ""
echo "1️⃣ Estado del Backend:"
pm2 status
pm2 logs bigartist-api --lines 20 --nostream

# 2. Verificar Nginx
echo ""
echo "2️⃣ Logs de Nginx:"
tail -30 /var/log/nginx/error.log

# 3. Verificar que existe el frontend compilado
echo ""
echo "3️⃣ Frontend compilado:"
ls -la /var/www/bigartist/dist/ 2>/dev/null || echo "❌ NO HAY DIST"
ls -la /var/www/bigartist/ | grep -E "dist|index.html"

# 4. Ver configuración de Nginx
echo ""
echo "=========================================="ev/null"}' | head -20
==========================================
🔍 DIAGNÓSTICO COMPLETO
==========================================

1️⃣ Estado del Backend:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 61.2mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 20 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 20 lines:
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }
0|bigartis | Error: Cannot find module 'bcrypt'
0|bigartis | Require stack:
0|bigartis | - /var/www/bigartist/server/server.js
0|bigartis |     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
0|bigartis |     at Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:81:25)
0|bigartis |     at require (node:internal/modules/helpers:182:18)
0|bigartis |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA0MDYsImV4cCI6MTc3MjU1NjgwNn0._PsEjUUJd21O57H8INo__WVnx4E-pVozRk5z1wYHG6w
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001


2️⃣ Logs de Nginx:
2026/03/02 01:47:42 [error] 43377#43377: *79 connect() failed (111: Connection refused) while connecting to upstream, client: 185.177.72.13, server: app.bigartist.es, request: "GET /api/register HTTP/1.1", upstream: "http://127.0.0.1:3001/api/register", host: "app.bigartist.es"
2026/03/02 01:47:42 [error] 43377#43377: *79 connect() failed (111: Connection refused) while connecting to upstream, client: 185.177.72.13, server: app.bigartist.es, request: "GET /api/resetpassword HTTP/1.1", upstream: "http://127.0.0.1:3001/api/resetpassword", host: "app.bigartist.es"
2026/03/02 01:47:51 [error] 43377#43377: *79 connect() failed (111: Connection refused) while connecting to upstream, client: 185.177.72.13, server: app.bigartist.es, request: "GET /api/config.json HTTP/1.1", upstream: "http://127.0.0.1:3001/api/config.json", host: "app.bigartist.es"
2026/03/02 01:47:53 [error] 43377#43377: *79 connect() failed (111: Connection refused) while connecting to upstream, client: 185.177.72.13, server: app.bigartist.es, request: "GET /api/secrets.json HTTP/1.1", upstream: "http://127.0.0.1:3001/api/secrets.json", host: "app.bigartist.es"
2026/03/02 09:35:50 [error] 43376#43376: *278 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 09:35:56 [error] 43376#43376: *278 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 09:35:57 [error] 43376#43376: *278 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:01:12 [error] 64556#64556: *390 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "GET /api/dashboard HTTP/2.0", upstream: "http://127.0.0.1:3001/api/dashboard", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:01:12 [error] 64556#64556: *390 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "GET /api/contracts HTTP/2.0", upstream: "http://127.0.0.1:3001/api/contracts", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:01:31 [error] 64556#64556: *390 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:01:37 [error] 64556#64556: *390 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:01:45 [error] 64556#64556: *390 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:02:47 [error] 64556#64556: *396 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "OPTIONS /api/royalties/import HTTP/2.0", upstream: "http://127.0.0.1:3001/api/royalties/import", host: "app.bigartist.es", referrer: "https://8f448448-bd22-4929-aa02-d1028a787446-v2-figmaiframepreview.figma.site/"
2026/03/02 17:11:46 [error] 64556#64556: *399 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:12:00 [error] 64556#64556: *399 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:26:38 [error] 64557#64557: *414 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:26:51 [error] 64557#64557: *414 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:28:32 [error] 64557#64557: *418 connect() failed (111: Connection refused) while connecting to upstream, client: 94.143.141.241, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es"
2026/03/02 17:33:40 [error] 64557#64557: *420 connect() failed (111: Connection refused) while connecting to upstream, client: 94.143.141.241, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es"
2026/03/02 17:33:43 [error] 74656#74656: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 94.143.141.241, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es"
2026/03/02 17:34:00 [error] 74657#74657: *3 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:51:29 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:51:30 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:51:32 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:51:32 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:18 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:18 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:19 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:19 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:48 [error] 75176#75176: *3 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 45.144.212.176, server: app.bigartist.es, request: "GET /.env HTTP/1.1", host: "94.143.141.241"

3️⃣ Frontend compilado:
❌ NO HAY DIST
-rw-r--r--  1 root root    335 Mar  2 17:49 index.html

4️⃣ Configuración Nginx:
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.bigartist.es;

    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/bigartist/dist;
    index index.html;

    # Desactivar caché para todos los archivos (temporal)
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    add_header Pragma "no-cache";
    add_header Expires "0";

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}

5️⃣ API funciona?
{"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzQwODAsImV4cCI6MTc3MjU2MDQ4MH0.QPTSdt_msKGJ6dBXiPIJdQS5DFCfPuQYa3a8GtRCbms","user":{"id":3,"email":"admin@bigartist.es","role":"admin"}}
==========================================
🔧 POSIBLE SOLUCIÓN RÁPIDA
==========================================
Ubicación actual:
/var/www/bigartist

Archivos:
total 160
drwxr-xr-x  6 root root   4096 Mar  2 17:51 .
drwxr-xr-x 11 root root   4096 Mar  2 17:49 ..
-rw-r--r--  1 root root     42 Mar  2 17:51 .env
drwxr-xr-x  8 root root   4096 Mar  2 17:49 .git
-rw-r--r--  1 root root    311 Mar  2 17:49 README.md
drwxr-xr-x  3 root root   4096 Mar  2 17:51 build
-rw-r--r--  1 root root    335 Mar  2 17:49 index.html
drwxr-xr-x 78 root root   4096 Mar  2 17:51 node_modules
-rw-r--r--  1 root root 115147 Mar  2 17:51 package-lock.json
-rw-r--r--  1 root root    634 Mar  2 17:49 package.json
drwxr-xr-x 13 root root   4096 Mar  2 17:49 src
-rw-r--r--  1 root root    795 Mar  2 17:49 vite.config.ts

📦 Reinstalando dependencias del frontend...

up to date, audited 122 packages in 923ms

13 packages are looking for funding
  run `npm fund` for details

1 moderate severity vulnerability

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.

🏗️ Compilando frontend...

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-BuoEzKQK.js                                        774.66 kB │ gzip: 223.00 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.48s

✅ Verificar dist:
ls: cannot access 'dist/': No such file or directory

🔄 Reiniciando Nginx...
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-03-02 17:54:45 UTC; 7ms ago
       Docs: man:nginx(8)
    Process: 75408 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
    Process: 75412 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
   Main PID: 75413 (nginx)
      Tasks: 3 (limit: 2154)
     Memory: 3.0M (peak: 3.1M)
        CPU: 17ms
     CGroup: /system.slice/nginx.service
             ├─75413 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
             ├─75414 "nginx: worker process"
             └─75415 "nginx: worker process"

Mar 02 17:54:45 ubuntu systemd[1]: Starting nginx.service - A high performance web server and a reverse proxy server...
Mar 02 17:54:45 ubuntu systemd[1]: Started nginx.service - A high performance web server and a reverse proxy server.

==========================================
✅ DIAGNÓSTICO COMPLETO
==========================================
root@ubuntu:/var/www/bigartist# echo "=========================================="
echo "🔍 DIAGNÓSTICO COMPLETO"
echo "=========================================="

# 1. Estado de PM2
echo ""
echo "1️⃣ Estado del Backend:"
pm2 status
pm2 logs bigartist-api --lines 20 --nostream

# 2. Verificar Nginx
echo ""
echo "2️⃣ Logs de Nginx:"
tail -30 /var/log/nginx/error.log

# 3. Verificar que existe el frontend compilado
echo ""
echo "3️⃣ Frontend compilado:"
ls -la /var/www/bigartist/dist/ 2>/dev/null || echo "❌ NO HAY DIST"
ls -la /var/www/bigartist/ | grep -E "dist|index.html"

# 4. Ver configuración de Nginx
echo ""
echo "=========================================="ev/null"}' | head -20
==========================================
🔍 DIAGNÓSTICO COMPLETO
==========================================

1️⃣ Estado del Backend:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 61.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 20 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 20 lines:
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }
0|bigartis | Error: Cannot find module 'bcrypt'
0|bigartis | Require stack:
0|bigartis | - /var/www/bigartist/server/server.js
0|bigartis |     at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
0|bigartis |     at Hook._require.Module.require (/usr/lib/node_modules/pm2/node_modules/require-in-the-middle/index.js:81:25)
0|bigartis |     at require (node:internal/modules/helpers:182:18)
0|bigartis |     at Object.<anonymous> (/var/www/bigartist/server/server.js:4:16)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
0|bigartis |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
0|bigartis |     at Module.load (node:internal/modules/cjs/loader:1266:32)
0|bigartis |     at Module._load (node:internal/modules/cjs/loader:1091:12)
0|bigartis |     at Object.<anonymous> (/usr/lib/node_modules/pm2/lib/ProcessContainerFork.js:33:23)
0|bigartis |     at Module._compile (node:internal/modules/cjs/loader:1521:14) {
0|bigartis |   code: 'MODULE_NOT_FOUND',
0|bigartis |   requireStack: [ '/var/www/bigartist/server/server.js' ]
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA0MDYsImV4cCI6MTc3MjU1NjgwNn0._PsEjUUJd21O57H8INo__WVnx4E-pVozRk5z1wYHG6w
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA1MzUsImV4cCI6MTc3MjU1NjkzNX0.yhnq70crGxlLcZlyVmYQXAVi6WI0jcwZPKo7_ioXpsM
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzA3MDksImV4cCI6MTc3MjU1NzEwOX0.64qzSyFwcUMARvG5KsDIe-s7sUHuGl6W8wP-q2xqSB4
0|bigartis | 🔑 Token extraído: eyJhbGciOiJIUzI1NiIs...
0|bigartis | ✅ Token válido para usuario: 3
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001


2️⃣ Logs de Nginx:
2026/03/02 17:02:47 [error] 64556#64556: *396 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "OPTIONS /api/royalties/import HTTP/2.0", upstream: "http://127.0.0.1:3001/api/royalties/import", host: "app.bigartist.es", referrer: "https://8f448448-bd22-4929-aa02-d1028a787446-v2-figmaiframepreview.figma.site/"
2026/03/02 17:11:46 [error] 64556#64556: *399 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:12:00 [error] 64556#64556: *399 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:26:38 [error] 64557#64557: *414 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:26:51 [error] 64557#64557: *414 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:28:32 [error] 64557#64557: *418 connect() failed (111: Connection refused) while connecting to upstream, client: 94.143.141.241, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es"
2026/03/02 17:33:40 [error] 64557#64557: *420 connect() failed (111: Connection refused) while connecting to upstream, client: 94.143.141.241, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es"
2026/03/02 17:33:43 [error] 74656#74656: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 94.143.141.241, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es"
2026/03/02 17:34:00 [error] 74657#74657: *3 connect() failed (111: Connection refused) while connecting to upstream, client: 207.188.130.38, server: app.bigartist.es, request: "POST /api/auth/login HTTP/2.0", upstream: "http://127.0.0.1:3001/api/auth/login", host: "app.bigartist.es", referrer: "https://app.bigartist.es/"
2026/03/02 17:51:29 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:51:30 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:51:32 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:51:32 [error] 75176#75176: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:18 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:18 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:19 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:19 [error] 75177#75177: *2 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:53:48 [error] 75176#75176: *3 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 45.144.212.176, server: app.bigartist.es, request: "GET /.env HTTP/1.1", host: "94.143.141.241"
2026/03/02 17:54:49 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:49 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:50 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:50 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:50 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:50 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:51 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:51 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:51 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:54:51 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:55:33 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /upload HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"
2026/03/02 17:55:33 [error] 75414#75414: *1 rewrite or internal redirection cycle while internally redirecting to "/index.html", client: 207.188.130.38, server: app.bigartist.es, request: "GET /favicon.ico HTTP/2.0", host: "app.bigartist.es", referrer: "https://app.bigartist.es/upload"

3️⃣ Frontend compilado:
❌ NO HAY DIST
-rw-r--r--  1 root root    335 Mar  2 17:49 index.html

4️⃣ Configuración Nginx:
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.bigartist.es;

    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/bigartist/dist;
    index index.html;

    # Desactivar caché para todos los archivos (temporal)
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    add_header Pragma "no-cache";
    add_header Expires "0";

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}

5️⃣ API funciona?
{"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzQyNjIsImV4cCI6MTc3MjU2MDY2Mn0.1qeO0G2xmPMm3K64z9ouKDmkftWqcwcLboRRezVmTfQ","user":{"id":3,"email":"admin@bigartist.es","role":"admin"}}
==========================================
🔧 POSIBLE SOLUCIÓN RÁPIDA
==========================================
Ubicación actual:
/var/www/bigartist

Archivos:
total 160
drwxr-xr-x  6 root root   4096 Mar  2 17:51 .
drwxr-xr-x 11 root root   4096 Mar  2 17:49 ..
-rw-r--r--  1 root root     42 Mar  2 17:51 .env
drwxr-xr-x  8 root root   4096 Mar  2 17:49 .git
-rw-r--r--  1 root root    311 Mar  2 17:49 README.md
drwxr-xr-x  3 root root   4096 Mar  2 17:54 build
-rw-r--r--  1 root root    335 Mar  2 17:49 index.html
drwxr-xr-x 78 root root   4096 Mar  2 17:54 node_modules
-rw-r--r--  1 root root 115147 Mar  2 17:54 package-lock.json
-rw-r--r--  1 root root    634 Mar  2 17:49 package.json
drwxr-xr-x 13 root root   4096 Mar  2 17:49 src
-rw-r--r--  1 root root    795 Mar  2 17:49 vite.config.ts

📦 Reinstalando dependencias del frontend...

up to date, audited 122 packages in 588ms

13 packages are looking for funding
  run `npm fund` for details

1 moderate severity vulnerability

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.

🏗️ Compilando frontend...

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-BuoEzKQK.js                                        774.66 kB │ gzip: 223.00 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.25s

✅ Verificar dist:
ls: cannot access 'dist/': No such file or directory

🔄 Reiniciando Nginx...
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-03-02 17:57:48 UTC; 5ms ago
       Docs: man:nginx(8)
    Process: 75525 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
    Process: 75527 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
   Main PID: 75528 (nginx)
      Tasks: 3 (limit: 2154)
     Memory: 2.8M (peak: 3.0M)
        CPU: 16ms
     CGroup: /system.slice/nginx.service
             ├─75528 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
             ├─75529 "nginx: worker process"
             └─75530 "nginx: worker process"

Mar 02 17:57:48 ubuntu systemd[1]: Starting nginx.service - A high performance web server and a reverse proxy server...
Mar 02 17:57:48 ubuntu systemd[1]: Started nginx.service - A high performance web server and a reverse proxy server.

==========================================
✅ DIAGNÓSTICO COMPLETO
==========================================
root@ubuntu:/var/www/bigartist# cd /var/www/bigartist

echo "=========================================="
echo "🔍 DIAGNÓSTICO ERROR 500"
echo "=========================================="

# Verificar si existe dist/
echo ""
echo "1️⃣ ¿Existe dist/?"
ls -la dist/ 2>&1

# Verificar estructura del proyecto
echo ""
echo "2️⃣ Estructura del proyecto:"
ls -la

# Verificar package.json
echo ""
echo "3️⃣ package.json:"
cat package.json

# Compilar el frontend
echo ""
echo "=========================================="
echo "=========================================="dmin123"}' | head -5
==========================================
🔍 DIAGNÓSTICO ERROR 500
==========================================

1️⃣ ¿Existe dist/?
ls: cannot access 'dist/': No such file or directory

2️⃣ Estructura del proyecto:
total 160
drwxr-xr-x  6 root root   4096 Mar  2 17:51 .
drwxr-xr-x 11 root root   4096 Mar  2 17:49 ..
-rw-r--r--  1 root root     42 Mar  2 17:51 .env
drwxr-xr-x  8 root root   4096 Mar  2 17:49 .git
-rw-r--r--  1 root root    311 Mar  2 17:49 README.md
drwxr-xr-x  3 root root   4096 Mar  2 17:57 build
-rw-r--r--  1 root root    335 Mar  2 17:49 index.html
drwxr-xr-x 78 root root   4096 Mar  2 17:57 node_modules
-rw-r--r--  1 root root 115147 Mar  2 17:57 package-lock.json
-rw-r--r--  1 root root    634 Mar  2 17:49 package.json
drwxr-xr-x 13 root root   4096 Mar  2 17:49 src
-rw-r--r--  1 root root    795 Mar  2 17:49 vite.config.ts

3️⃣ package.json:

  {
      "name": "Bam Royalties System",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
          "@vitejs/plugin-react": "*",
          "lucide-react": "*",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router": "*",
          "recharts": "*",
          "sonner": "^2.0.3",
          "tailwindcss": "*",
          "vite": "*"
      },
      "devDependencies": {
          "@types/node": "^20.10.0",
          "@vitejs/plugin-react-swc": "^3.10.2",
          "vite": "6.3.5"
      },
      "scripts": {
          "dev": "vite",
          "build": "vite build"
      }
  }
==========================================
🏗️ COMPILANDO FRONTEND
==========================================
✅ .env creado

📦 Instalando dependencias...

up to date, audited 122 packages in 595ms

13 packages are looking for funding
  run `npm fund` for details

1 moderate severity vulnerability

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.

🔨 Compilando...

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 2404 modules transformed.
build/index.html                                                        0.44 kB │ gzip:   0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-DVSvfUbm.css                                        23.16 kB │ gzip:   6.42 kB
build/assets/index-BuoEzKQK.js                                        774.66 kB │ gzip: 223.00 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.65s

✅ Verificar dist/ generado:
ls: cannot access 'dist/': No such file or directory

==========================================
📝 CONFIGURACIÓN NGINX
==========================================
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.bigartist.es;

    ssl_certificate /etc/letsencrypt/live/app.bigartist.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.bigartist.es/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/bigartist/dist;
    index index.html;

    # Desactivar caché para todos los archivos (temporal)
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    add_header Pragma "no-cache";
    add_header Expires "0";

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name app.bigartist.es;
    return 301 https://$server_name$request_uri;
}

🔄 Reiniciando Nginx...

✅ Estado Nginx:
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-03-02 17:59:43 UTC; 7ms ago
       Docs: man:nginx(8)
    Process: 75602 ExecStartPre=/usr/sbin/nginx -t -q -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
    Process: 75604 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
   Main PID: 75605 (nginx)
      Tasks: 3 (limit: 2154)
     Memory: 2.8M (peak: 3.0M)
        CPU: 20ms

✅ Estado PM2:
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 61.3mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘

==========================================
🧪 PRUEBAS
==========================================

API (debe devolver JSON con token):
{"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzQzODMsImV4cCI6MTc3MjU2MDc4M30._VkLzOI756fAueRFxQi9O_SJxYNt7EtV_uZI8ZrKSMo","user":{"id":3,"email":"admin@bigartist.es","role":"admin"}}

Frontend (debe devolver HTML):
HTTP/1.1 301 Moved Permanently
Server: nginx/1.24.0 (Ubuntu)
Date: Mon, 02 Mar 2026 17:59:43 GMT
Content-Type: text/html
Content-Length: 178
Connection: keep-alive
Location: https://app.bigartist.es/


==========================================
🌐 ABRIR EN NAVEGADOR:
   👉 https://app.bigartist.es
==========================================
root@ubuntu:/var/www/bigartist# 
