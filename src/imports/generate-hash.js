# Generar un hash correcto de "admin123" con Node.js
cd /var/www/bigartist-api
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10, (err, hash) => { console.log('Hash:', hash); });"
[TAILING] Tailing last 30 lines for [bigartist-api] process (change the value with --lines option)
/root/.pm2/logs/bigartist-api-error.log last 30 lines:
/root/.pm2/logs/bigartist-api-out.log last 30 lines:
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: 🛡️ auth for agents: https://vestauth.com
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
0|bigartis | API corriendo en puerto 3001
0|bigartis | [dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
0|bigartis | API corriendo en puerto 3001

^C
[PM2] Applying action stopProcessId on app [bigartist-api](ids: [ 0, 1 ])
[PM2] [bigartist-api](0) ✓
[PM2] [bigartist-api](1) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ bigartist-api      │ fork     │ 6    │ stopped   │ 0%       │ 0b       │
│ 1  │ bigartist-api      │ fork     │ 41   │ stopped   │ 0%       │ 0b       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
Hash: $2b$10$oLi3RdRY/D6Q5UAdO8l.eOfFtkoBl5aR8wxuZCfPAbwAh5yRW1UJy
root@ubuntu:/var/www/bigartist-api# 