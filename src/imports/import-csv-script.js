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
root@ubuntu:/var/www/bigartist/server# 
