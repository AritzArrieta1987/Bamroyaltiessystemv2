Last login: Mon Mar  2 16:55:05 on ttys001
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Mon Mar  2 18:51:54 UTC 2026

  System load:  0.0               Processes:             110
  Usage of /:   6.0% of 76.45GB   Users logged in:       0
  Memory usage: 46%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Mon Mar  2 18:37:02 2026 from 207.188.130.38
root@ubuntu:~# cd /var/www/bigartist_backup_20260302_174903/server

echo "=========================================="
echo "📋 VER LOGS EN TIEMPO REAL"
echo "=========================================="
pm2 logs bigartist-api --lines 30 --nostream

echo ""
echo "=========================================="
echo "🔍 VERIFICAR ENDPOINT DE IMPORTACIÓN"
echo "=========================================="

# Ver el código del endpoint /api/royalties/import
grep -A 50 "'/import'" server.js | head -60

echo ""
echo "=========================================="
echo "🧪 PROBAR ENDPOINT MANUALMENTE"
echo "=========================================="

# Obtener token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
echo "=========================================="E"/import \-01-01r '.token')
==========================================
📋 VER LOGS EN TIEMPO REAL
==========================================
[TAILING] Tailing last 30 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-out.log last 30 lines:
0|bigartis | ✅ Importación completada exitosamente
0|bigartis | 🚀 Servidor corriendo en puerto 3001
0|bigartis | 📊 Health check: http://localhost:3001/api/health
0|bigartis | 🔐 Login attempt for email: admin@bigartist.es
0|bigartis | 📝 Password received: ***8 chars***
0|bigartis | 🔐 Verificando token...
0|bigartis | 📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0NzAyMTgsImV4cCI6MTc3MjU1NjYxOH0.gCI_s0T2pAg0j6yVPLqI_vCUZKOTYSCA52WHVz4uijE
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
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001
0|bigartis | Servidor corriendo en puerto 3001

/root/.pm2/logs/bigartist-api-error.log last 30 lines:
0|bigartis |     at Multipart.emit (node:events:524:28)
0|bigartis |     at HeaderParser.cb (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:358:14)
0|bigartis |     at HeaderParser.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:162:20)
0|bigartis |     at SBMH.ssCb [as _cb] (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:394:37)
0|bigartis |     at feed (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:219:14)
0|bigartis |     at SBMH.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:104:16)
0|bigartis |     at Multipart._write (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:567:19)
0|bigartis |     at writeOrBuffer (node:internal/streams/writable:572:12)
0|bigartis | MulterError: Unexpected field
0|bigartis |     at wrappedFileFilter (/var/www/bigartist_backup_20260302_174903/server/node_modules/multer/index.js:40:19)
0|bigartis |     at Multipart.<anonymous> (/var/www/bigartist_backup_20260302_174903/server/node_modules/multer/lib/make-middleware.js:109:7)
0|bigartis |     at Multipart.emit (node:events:524:28)
0|bigartis |     at HeaderParser.cb (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:358:14)
0|bigartis |     at HeaderParser.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:162:20)
0|bigartis |     at SBMH.ssCb [as _cb] (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:394:37)
0|bigartis |     at feed (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:219:14)
0|bigartis |     at SBMH.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:104:16)
0|bigartis |     at Multipart._write (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:567:19)
0|bigartis |     at writeOrBuffer (node:internal/streams/writable:572:12)
0|bigartis | MulterError: Unexpected field
0|bigartis |     at wrappedFileFilter (/var/www/bigartist_backup_20260302_174903/server/node_modules/multer/index.js:40:19)
0|bigartis |     at Multipart.<anonymous> (/var/www/bigartist_backup_20260302_174903/server/node_modules/multer/lib/make-middleware.js:109:7)
0|bigartis |     at Multipart.emit (node:events:524:28)
0|bigartis |     at HeaderParser.cb (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:358:14)
0|bigartis |     at HeaderParser.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:162:20)
0|bigartis |     at SBMH.ssCb [as _cb] (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:394:37)
0|bigartis |     at feed (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:219:14)
0|bigartis |     at SBMH.push (/var/www/bigartist_backup_20260302_174903/server/node_modules/streamsearch/lib/sbmh.js:104:16)
0|bigartis |     at Multipart._write (/var/www/bigartist_backup_20260302_174903/server/node_modules/busboy/lib/types/multipart.js:567:19)
0|bigartis |     at writeOrBuffer (node:internal/streams/writable:572:12)


==========================================
🔍 VERIFICAR ENDPOINT DE IMPORTACIÓN
==========================================

==========================================
🧪 PROBAR ENDPOINT MANUALMENTE
==========================================
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZ...

Subiendo CSV de prueba...
Note: Unnecessary use of -X or --request, POST is already inferred.
* Host localhost:3001 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0*   Trying [::1]:3001...
* Connected to localhost (::1) port 3001
> POST /api/royalties/import HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/8.5.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzI0Nzc1MzcsImV4cCI6MTc3MjU2MzkzN30.Wrmmrs6Npri_eHgFw6x3omA_QXz8MIoptSRoc7MQ23k
> Content-Length: 343
> Content-Type: multipart/form-data; boundary=------------------------SLB4E9FRwQ3wSmhbdYo5aj
> 
} [343 bytes data]
* We are completely uploaded and fine
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 1004
< ETag: W/"3ec-Kqq/mpzOgRg3PlVX7Y/Yb10Gcu0"
< Date: Mon, 02 Mar 2026 18:52:17 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
{ [1004 bytes data]
100  1347  100  1004  100   343  12347   4218 --:--:-- --:--:-- --:--:-- 16426
* Connection #0 to host localhost left intact
{"success":true,"message":"Archivo CSV importado exitosamente","stats":{"artists":4,"tracks":5,"platforms":3,"territories":3,"royalties":6,"totalRevenue":"1067.0500"},"output":"═══════════════════════════════════════════════════════\n📊 BIGARTIST ROYALTIES SYSTEM - CSV IMPORTER\n═══════════════════════════════════════════════════════\n\n🔌 Conectando a MySQL...\n✅ Conexión establecida\n\n📂 Leyendo archivo CSV...\n📊 Total de líneas: 3\n\n🚀 Iniciando importación...\n\n⚠️  Línea 2 omitida (columnas insuficientes: 1)\n\n\n🎉 Importación completada!\n✅ Registros importados: 0\n❌ Errores: 0\n\n📊 Estadísticas de la base de datos:\n   - Artistas: 4\n   - Canciones: 5\n   - Plataformas: 3\n   - Registros de royalties: 6\n\n🔌 Conexión cerrada\n"}
==========================================
📊 SI VES ERROR, NECESITO VER EL STACK TRACE
==========================================
root@ubuntu:/var/www/bigartist_backup_20260302_174903/server# 
