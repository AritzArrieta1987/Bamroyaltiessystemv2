#!/bin/bash

# BIGARTIST ROYALTIES SYSTEM - Database Setup Script
# Este script crea las tablas e importa el CSV

echo "═══════════════════════════════════════════════════════"
echo "📊 BIGARTIST ROYALTIES SYSTEM - CONFIGURACIÓN DE BD"
echo "═══════════════════════════════════════════════════════"
echo ""

# Variables
DB_PASSWORD="BigArtist2018!@?"
DB_NAME="bigartist_db"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"
CSV_FILE="$SERVER_DIR/../imports/Oct2017_fullreport_big_artist_EU.csv"

# Paso 1: Crear tablas
echo "📋 Paso 1: Creando tablas en MySQL..."
mysql -u root -p"$DB_PASSWORD" < "$SERVER_DIR/database/schema.sql"

if [ $? -eq 0 ]; then
    echo "✅ Tablas creadas exitosamente"
else
    echo "❌ Error creando tablas"
    exit 1
fi

echo ""

# Paso 2: Verificar que el CSV existe
echo "📂 Paso 2: Verificando archivo CSV..."
if [ ! -f "$CSV_FILE" ]; then
    echo "❌ Archivo CSV no encontrado: $CSV_FILE"
    exit 1
fi
echo "✅ Archivo CSV encontrado"
echo ""

# Paso 3: Importar CSV
echo "📊 Paso 3: Importando datos desde CSV..."
echo "⏳ Este proceso puede tardar varios minutos..."
echo ""

cd "$SERVER_DIR"
node scripts/importCSV.js "$CSV_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Importación completada exitosamente"
else
    echo ""
    echo "❌ Error durante la importación"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📊 Puedes verificar los datos con:"
echo "   mysql -u root -p'$DB_PASSWORD' -e 'USE $DB_NAME; SELECT COUNT(*) FROM royalties;'"
echo ""
echo "🚀 Reinicia el backend con:"
echo "   pm2 restart bigartist-api"
echo ""
