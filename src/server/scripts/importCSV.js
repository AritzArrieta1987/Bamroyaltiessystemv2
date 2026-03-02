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
