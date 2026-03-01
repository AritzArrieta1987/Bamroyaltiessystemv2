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

