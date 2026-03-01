Last login: Sat Feb 28 22:48:16 on ttys002
/Users/aritzarrieta/.zprofile:1: no such file or directory: /opt/homebrew/bin/brew
/Users/aritzarrieta/.zprofile:2: no such file or directory: /usr/local/bin/brew
aritzarrieta@MBP-de-Aritz ~ % ssh root@94.143.141.241
root@94.143.141.241's password: 
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sat Feb 28 22:00:24 UTC 2026

  System load:  0.0               Processes:             113
  Usage of /:   4.2% of 76.45GB   Users logged in:       1
  Memory usage: 40%               IPv4 address for ens6: 94.143.141.241
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


Last login: Sat Feb 28 21:48:33 2026 from 207.188.130.38
root@ubuntu:~# # 1. Detener PM2
pm2 delete bigartist-api

# 2. Iniciar con el .env explícitamente
cd /var/www/bigartist/server
pm2 start server.js --name bigartist-api --update-env

# 3. Ver los logs
pm2 logs bigartist-api --lines 10

# 4. Probar el login
sleep 2
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"Admin123!"}'
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2] Starting /var/www/bigartist/server/server.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 17.3mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 10 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 10 lines:
0|bigartis |     at /var/www/bigartist/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at /var/www/bigartist/server/node_modules/body-parser/lib/read.js:137:5 {
0|bigartis |   code: 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR',
0|bigartis |   errno: 1698,
0|bigartis |   sql: undefined,
0|bigartis |   sqlState: '28000',
0|bigartis |   sqlMessage: "Access denied for user 'root'@'localhost'"
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 10 lines:
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001

0|bigartist-api  | 🚀 BIGARTIST API running on port 3001
^C
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NzIzMTYxMDksImV4cCI6MTc3MjQwMjUwOX0.tCjPJgxm--XKElg0qz7ySWUW0lbmB2rVT_0Li6LH6tE","user":{"id":1,"email":"admin@bigartist.es","name":"Administrator","type":"admin"}}root@ubuntu:/var/www/bigartist/server# ¡PM2 NO ESTÁ CARGANDO EL .env! El error ER_ACCESS_DENIED_NO_PASSWORD_ERROR significa que la contraseña está llegando vacía. Vamos a cargar el .env de forma explícita con el ecosistema de PM2:

# 1. Crear archivo de configuración PM2
cat > /var/www/bigartist/server/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'bigartist-api',
    script: './server.js',
    cwd: '/var/www/bigartist/server',
    env: {
      PORT: 3001,
      DB_HOST: 'localhost',
      DB_USER: 'root',
      DB_PASSWORD: 'BigArtist2018!@?',
      DB_NAME: 'bigartist',
      JWT_SECRET: 'bigartist-jwt-secret-2026',
      NODE_ENV: 'production'
    }
  }]
}
EOF

  -d '{"email":"admin@bigartist.es","password":"Admin123!"}'
¡PM2: command not found
[PM2] Applying action deleteProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[PM2][WARN] Applications bigartist-api not running, starting...
[PM2] App [bigartist-api] launched (1 instances)
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 18.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 10 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 10 lines:
0|bigartis |     at /var/www/bigartist/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at /var/www/bigartist/server/node_modules/body-parser/lib/read.js:137:5 {
0|bigartis |   code: 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR',
0|bigartis |   errno: 1698,
0|bigartis |   sql: undefined,
0|bigartis |   sqlState: '28000',
0|bigartis |   sqlMessage: "Access denied for user 'root'@'localhost'"
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 10 lines:
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001

0|bigartist-api  | 🚀 BIGARTIST API running on port 3001
^C
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NzIzMTYxNzIsImV4cCI6MTc3MjQwMjU3Mn0.CdhZQ_VjOaYd3MVPq6h-Zayw0WNH8jfL6NzVBbixBIA","user":{"id":1,"email":"admin@bigartist.es","name":"Administrator","type":"admin"}}root@ubuntu:/var/www/bigartisroot@ubuntu:/var/www/bigartist/server# ¡VAYA! En la línea 79 veo que ¡EL LOGIN FUNCIONÓ! 🎉
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","user":{"id":1,"email":"admin{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","user":{"id":1,"email":"admin@bigartist.es","name":"Administrator","type":"admin"}}car el estado actual despuPero los logs antiguos están mezclados. Vamos a verificar el estado actual después del ecosystem.config.js:
# 1. Ver el estado de PM2
# 1. Ver el estado de PM2
pm2 status
# 2. Ver los logs MÁS RECIENTES (importantes)
# 2. Ver los logs MÁS RECIENTES (importantes)
pm2 logs bigartist-api --lines 5 --nostream
# 3. Probar el login de nuevo
# 3. Probar el login de nuevortist.es/api/auth/login \
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \ssword":"Admin123!"}'
  -d '{"email":"admin@bigartist.es","password":"Admin123!"}'
# 4. Verificar que el frontend funciona
# 4. Verificar que el frontend funciona
curl -I https://app.bigartist.es/
# 5. Guardar configuración PM2
# 5. Guardar configuración PM2
pm2 savetup
pm2 startup
¡VAYA!: command not found
token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...: command not found
Pero: command not found
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 60.3mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 5 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 5 lines:
0|bigartis |   errno: 1698,
0|bigartis |   sql: undefined,
0|bigartis |   sqlState: '28000',
0|bigartis |   sqlMessage: "Access denied for user 'root'@'localhost'"
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 5 lines:
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NzIzMTYxNzUsImV4cCI6MTc3MjQwMjU3NX0.LpD8MGxDwkmnQ9TpoDHeCp-EGehwbIzH29AwywMw3Sg","user":{"id":1,"email":"admin@bigartist.es","name":"Administrator","type":"admin"}}HTTP/2 200 
server: nginx/1.24.0 (Ubuntu)
date: Sat, 28 Feb 2026 22:02:55 GMT
content-type: text/html
content-length: 435
last-modified: Sat, 28 Feb 2026 21:53:39 GMT
etag: "69a363e3-1b3"
accept-ranges: bytes

[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
[PM2] Init System found: systemd
Platform systemd
Template
[Unit]
Description=PM2 process manager
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=forking
User=root
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
Environment=PM2_HOME=/root/.pm2
PIDFile=/root/.pm2/pm2.pid
Restart=on-failure

ExecStart=/usr/lib/node_modules/pm2/bin/pm2 resurrect
ExecReload=/usr/lib/node_modules/pm2/bin/pm2 reload all
ExecStop=/usr/lib/node_modules/pm2/bin/pm2 kill

[Install]
WantedBy=multi-user.target

Target path
/etc/systemd/system/pm2-root.service
Command list
[ 'systemctl enable pm2-root' ]
[PM2] Writing init configuration in /etc/systemd/system/pm2-root.service
[PM2] Making script booting at startup...
[PM2] [-] Executing: systemctl enable pm2-root...
Created symlink /etc/systemd/system/multi-user.target.wants/pm2-root.service → /etc/systemd/system/pm2-root.service.
[PM2] [v] Command successfully executed.
+---------------------------------------+
[PM2] Freeze a process list on reboot via:
$ pm2 save

[PM2] Remove init script via:
$ pm2 unstartup systemd
root@ubuntu:/var/www/bigartist/server# /var/www/bigartist/server/ecosystem.config.js  # PM2 con variables de entorno
/etc/nginx/sites-enabled/bigartist             # Nginx proxy /api/ → 3001
/var/www/bigartist/dist/                        # Frontend compilado
-bash: /var/www/bigartist/server/ecosystem.config.js: Permission denied
-bash: /etc/nginx/sites-enabled/bigartist: Permission denied
-bash: /var/www/bigartist/dist/: Is a directory
root@ubuntu:/var/www/bigartist/server# # Ver estado del backend
pm2 status
pm2 logs bigartist-api

# Actualizar código desde GitHub
cd /var/www/bigartist-source
git pull
npm run build
cp -r dist/* /var/www/bigartist/dist/

# Reiniciar servicios
pm2 restart bigartist-api
systemctl restart nginx

# Ver logs de Nginx
tail -f /var/log/nginx/bigartist_error.log
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 0    │ online    │ 0%       │ 61.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 15 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 15 lines:
0|bigartis |     at /var/www/bigartist/server/server.js:39:32
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at next (/var/www/bigartist/server/node_modules/express/lib/router/route.js:149:13)
0|bigartis |     at Route.dispatch (/var/www/bigartist/server/node_modules/express/lib/router/route.js:119:3)
0|bigartis |     at Layer.handle [as handle_request] (/var/www/bigartist/server/node_modules/express/lib/router/layer.js:95:5)
0|bigartis |     at /var/www/bigartist/server/node_modules/express/lib/router/index.js:284:15
0|bigartis |     at Function.process_params (/var/www/bigartist/server/node_modules/express/lib/router/index.js:346:12)
0|bigartis |     at next (/var/www/bigartist/server/node_modules/express/lib/router/index.js:280:10)
0|bigartis |     at /var/www/bigartist/server/node_modules/body-parser/lib/read.js:137:5 {
0|bigartis |   code: 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR',
0|bigartis |   errno: 1698,
0|bigartis |   sql: undefined,
0|bigartis |   sqlState: '28000',
0|bigartis |   sqlMessage: "Access denied for user 'root'@'localhost'"
0|bigartis | }

/root/.pm2/logs/bigartist-api-out.log last 15 lines:
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001
0|bigartis | 🚀 BIGARTIST API running on port 3001

^C  
Already up to date.

> Bam Royalties System@0.1.0 build
> vite build

vite v6.3.5 building for production...
✓ 1753 modules transformed.
build/index.html                                                        0.44 kB │ gzip:  0.28 kB
build/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9-HygGYkAN.png     49.35 kB
build/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493-C-zGM-oV.png  4,888.06 kB
build/assets/index-ClWTg1v2.css                                         9.18 kB │ gzip:  2.61 kB
build/assets/index-CTOrjcN2.js                                        306.75 kB │ gzip: 94.55 kB
✓ built in 2.41s
cp: cannot stat 'dist/*': No such file or directory
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 1    │ online    │ 0%       │ 18.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
tail: cannot open '/var/log/nginx/bigartist_error.log' for reading: No such file or directory
tail: no files remaining
root@ubuntu:/var/www/bigartist-source# Veo que ejecutaste pm2 logs sin el flag -root@ubuntu:/var/www/bigartist-source# Veo que ejecutaste pm2 logs sin el flag --nostream y se quedó pegado (líneas 261-289 muestran logs viejos). El sistema SÍ está funcionando (vimos los tokens JWT exitosos en líneas 182 y 139).
Vamos a hacer una prueba final limpia para confirmar que todo funciona:
Vamos a hacer una prueba final limpia para confirmar que todo funciona:
# 1. Limpiar logs antiguos de PM2
# 1. Limpiar logs antiguos de PM2
pm2 flush
# 2. Reiniciar la API con ecosystem.config.js
# 2. Reiniciar la API con ecosystem.config.js
pm2 restart bigartist-api
# 3. Esperar 2 segundos
# 3. Esperar 2 segundos
sleep 2
# 4. Ver SOLO logs nuevos (últimas 3 líneas, sin streaming)
# 4. Ver SOLO logs nuevos (últimas 3 líneas, sin streaming)
pm2 logs bigartist-api --lines 3 --nostream
# 5. Probar login desde curl
# 5. Probar login desde curlartist.es/api/auth/login \
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \ssword":"Admin123!"}'
  -d '{"email":"admin@bigartist.es","password":"Admin123!"}'
# 6. Verificar API está escuchando en 3001
# 6. Verificar API está escuchando en 3001
netstat -tlnp | grep 3001
-bash: syntax error near unexpected token `('
Vamos: command not found
[PM2] Flushing /root/.pm2/pm2.log
[PM2] Flushing:
[PM2] /root/.pm2/logs/bigartist-api-out.log
[PM2] /root/.pm2/logs/bigartist-api-error.log
[PM2] Logs flushed
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [bigartist-api](ids: [ 0 ])
[PM2] [bigartist-api](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 2    │ online    │ 0%       │ 18.8mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
[TAILING] Tailing last 3 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 3 lines:
/root/.pm2/logs/bigartist-api-out.log last 3 lines:
0|bigartis | 🚀 BIGARTIST API running on port 3001

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NzIzMTc0MjcsImV4cCI6MTc3MjQwMzgyN30.SI16Rxl4zE2zKsSmNcjDEBxxcCWqYLhgyxlSje60c3I","user":{"id":1,"email":"admin@bigartist.es","name":"Administrator","type":"admin"}}Command 'netstat' not found, but can be installed with:
apt install net-tools
root@ubuntu:/var/www/bigartist-source# # 1. Copiar el build correcto al directorio de Nginx
cp -r /var/www/bigartist-source/build/* /var/www/bigartist/dist/

# 2. Verificar que se copió
ls -lh /var/www/bigartist/dist/

# 3. Reiniciar Nginx para asegurar
systemctl reload nginx

# 4. Probar el frontend
curl -I https://app.bigartist.es/

# 5. Guardar configuración de PM2
pm2 save

# 6. Ver estado final
pm2 status
total 8.0K
drwxr-xr-x 2 www-data www-data 4.0K Feb 28 21:53 assets
-rwxr-xr-x 1 www-data www-data  435 Feb 28 22:25 index.html
HTTP/2 200 
server: nginx/1.24.0 (Ubuntu)
date: Sat, 28 Feb 2026 22:25:18 GMT
content-type: text/html
content-length: 435
last-modified: Sat, 28 Feb 2026 22:25:18 GMT
etag: "69a36b4e-1b3"
accept-ranges: bytes

[PM2] Saving current process list...
[PM2] Successfully saved in /root/.pm2/dump.pm2
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 2    │ online    │ 0%       │ 59.1mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
root@ubuntu:/var/www/bigartist-source# # 1. Ver los logs del backend para ver el error exacto
pm2 logs bigartist-api --lines 20 --nostream

# 2. Probar el login con curl de nuevo para confirmar que funciona
curl -X POST https://app.bigartist.es/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"Admin123!"}'

# 3. Ver qué usuarios existen en la base de datos
mysql -u root -p'BigArtist2018!@?' bigartist -e "SELECT id, email, name, type FROM users;"

# 4. Ver la estructura de la tabla users
mysql -u root -p'BigArtist2018!@?' bigartist -e "DESCRIBE users;"
[TAILING] Tailing last 20 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 20 lines:
/root/.pm2/logs/bigartist-api-out.log last 20 lines:
0|bigartis | 🚀 BIGARTIST API running on port 3001

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBiaWdhcnRpc3QuZXMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3NzIzMTc2MzgsImV4cCI6MTc3MjQwNDAzOH0.0A7S_4NcXsT5dLH2Q6BaLsXEnGdxbTv5Jumbqiw1f0o","user":{"id":1,"email":"admin@bigartist.es","name":"Administrator","type":"admin"}}mysql: [Warning] Using a password on the command line interface can be insecure.
+----+--------------------+---------------+-------+
| id | email              | name          | type  |
+----+--------------------+---------------+-------+
|  1 | admin@bigartist.es | Administrator | admin |
+----+--------------------+---------------+-------+
mysql: [Warning] Using a password on the command line interface can be insecure.
+---------------+-----------------------------------------+------+-----+-------------------+-----------------------------------------------+
| Field         | Type                                    | Null | Key | Default           | Extra                                         |
+---------------+-----------------------------------------+------+-----+-------------------+-----------------------------------------------+
| id            | int                                     | NO   | PRI | NULL              | auto_increment                                |
| email         | varchar(255)                            | NO   | UNI | NULL              |                                               |
| password_hash | varchar(255)                            | NO   |     | NULL              |                                               |
| name          | varchar(255)                            | NO   |     | NULL              |                                               |
| type          | enum('admin','user','artist','manager') | YES  |     | user              |                                               |
| created_at    | timestamp                               | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED                             |
| updated_at    | timestamp                               | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED on update CURRENT_TIMESTAMP |
| last_login    | timestamp                               | YES  |     | NULL              |                                               |
| active        | tinyint(1)                              | YES  |     | 1                 |                                               |
+---------------+-----------------------------------------+------+-----+-------------------+-----------------------------------------------+
root@ubuntu:/var/www/bigartist-source# # Ver el código de login en server.js
grep -A 30 "'/auth/login'" /var/www/bigartist/server/server.js

# O ver la línea específica donde hace la query
sed -n '30,50p' /var/www/bigartist/server/server.js
    req.user = user;
    next();
  });
};

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND active = TRUE', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Credenciales inválidas' });
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, type: user.type } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
root@ubuntu:/var/www/bigartist-source# # 1. Ver el hash actual de la contraseña en la BD
mysql -u root -p'BigArtist2018!@?' bigartist -e "SELECT id, email, password_hash FROM users WHERE email='admin@bigartist.es';"

# 2. Generar el hash correcto de "Admin123!" con Node.js
cd /var/www/bigartist/server
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin123!', 10).then(hash => console.log(hash));"

# 3. Actualizar la contraseña en la BD (copia el hash del paso 2 y pégalo aquí)
# Espera el resultado primero antes de ejecutar este comando
mysql: [Warning] Using a password on the command line interface can be insecure.
+----+--------------------+--------------------------------------------------------------+
| id | email              | password_hash                                                |
+----+--------------------+--------------------------------------------------------------+
|  1 | admin@bigartist.es | $2a$10$jpBQqj4SaZHoh3jx/clrouoBdQV/1NN4csQV8i3a5ddJ09KibYAVm |
+----+--------------------+--------------------------------------------------------------+
-bash: !',: event not found
root@ubuntu:/var/www/bigartist/server# # Generar el hash correcto de "Admin123!" usando comillas simples
node -e 'const bcrypt = require("bcrypt"); bcrypt.hash("Admin123!", 10).then(hash => console.log(hash));'
node:internal/modules/cjs/loader:1210
  throw err;
  ^

Error: Cannot find module 'bcrypt'
Require stack:
- /var/www/bigartist/server/[eval]
    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)
    at Module._load (node:internal/modules/cjs/loader:1038:27)
    at Module.require (node:internal/modules/cjs/loader:1289:19)
    at require (node:internal/modules/helpers:182:18)
    at [eval]:1:16
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:133:3) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/var/www/bigartist/server/[eval]' ]
}

Node.js v20.20.0
root@ubuntu:/var/www/bigartist/server# # 1. Ir al directorio del servidor
cd /var/www/bigartist/server

# 2. Instalar bcrypt
npm install bcrypt

# 3. Generar el hash correcto
node -e 'const bcrypt = require("bcrypt"); bcrypt.hash("Admin123!", 10).then(hash => console.log(hash));'

added 3 packages, and audited 102 packages in 573ms

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
$2b$10$zYyNk1nsZdJT0O0v2RcRIe8amu8RteCmE/PNhOb92Fhpv.rn8VgOi
root@ubuntu:/var/www/bigartist/server# 
