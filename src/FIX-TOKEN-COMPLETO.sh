#!/bin/bash

# =================================================
# 🔧 SCRIPT COMPLETO PARA ARREGLAR EL TOKEN
# =================================================

echo "🚀 Conectando al servidor y arreglando el token..."

ssh root@94.143.141.241 << 'ENDSSH'

cd /var/www/bigartist/server

echo "============================================"
echo "1️⃣ PROBANDO LOGIN ACTUAL"
echo "============================================"

# Probar el login y ver qué devuelve
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' \
  | jq '.'

echo ""
echo "============================================"
echo "2️⃣ VERIFICANDO ESTRUCTURA DEL SERVIDOR"
echo "============================================"

# Ver las primeras líneas del verifyToken
grep -A 20 "const verifyToken" server.js | head -25

echo ""
echo "============================================"
echo "3️⃣ VER LOGS DE PM2"
echo "============================================"

pm2 logs bigartist-api --lines 20 --nostream

echo ""
echo "============================================"
echo "✅ DIAGNÓSTICO COMPLETO"
echo "============================================"

ENDSSH
