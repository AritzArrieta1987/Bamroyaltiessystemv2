cd /var/www/bigartist/

# 2. Ver qué hay actualmente
ls -la

# 3. Clonar el repositorio COMPLETO de GitHub
cd /var/www/
git clone https://github.com/AritzArrieta1987/Webappversionfinalv10.git bigartist-source

# 4. Ver la estructura del proyecto
ls -la bigartist-source/
tree -L 2 bigartist-source/ 2>/dev/null || find bigartist-source/ -maxdepth 2 -type f -o -type d | head -30
total 24
drwxr-xr-x 6 www-data www-data 4096 Feb 28 21:12 .
drwxr-xr-x 4 root     root     4096 Feb 28 19:30 ..
drwxr-xr-x 2 root     root     4096 Feb 28 21:04 backups
drwxr-xr-x 3 root     root     4096 Feb 28 21:16 frontend
drwxr-xr-x 6 root     root     4096 Feb 28 21:13 repo
drwxr-xr-x 3 root     root     4096 Feb 28 21:13 server
Cloning into 'bigartist-source'...
remote: Enumerating objects: 315, done.
remote: Counting objects: 100% (315/315), done.
remote: Compressing objects: 100% (297/297), done.
remote: Total 315 (delta 95), reused 2 (delta 0), pack-reused 0 (from 0)
Receiving objects: 100% (315/315), 5.02 MiB | 4.12 MiB/s, done.
Resolving deltas: 100% (95/95), done.
total 32
drwxr-xr-x  4 root root 4096 Feb 28 21:44 .
drwxr-xr-x  5 root root 4096 Feb 28 21:44 ..
drwxr-xr-x  8 root root 4096 Feb 28 21:44 .git
-rw-r--r--  1 root root  311 Feb 28 21:44 README.md
-rw-r--r--  1 root root  335 Feb 28 21:44 index.html
-rw-r--r--  1 root root  572 Feb 28 21:44 package.json
drwxr-xr-x 11 root root 4096 Feb 28 21:44 src
-rw-r--r--  1 root root  795 Feb 28 21:44 vite.config.ts
bigartist-source/
bigartist-source/README.md
bigartist-source/package.json
bigartist-source/vite.config.ts
bigartist-source/index.html
bigartist-source/.git
bigartist-source/.git/refs
bigartist-source/.git/hooks
bigartist-source/.git/config
bigartist-source/.git/HEAD
bigartist-source/.git/info
bigartist-source/.git/branches
bigartist-source/.git/logs
bigartist-source/.git/packed-refs
bigartist-source/.git/index
bigartist-source/.git/description
bigartist-source/.git/objects
bigartist-source/src
bigartist-source/src/Attributions.md
bigartist-source/src/deployment
bigartist-source/src/deploy-frontend-only.sh
bigartist-source/src/assets
bigartist-source/src/DEPLOYMENT.md
bigartist-source/src/imports
bigartist-source/src/routes.ts
bigartist-source/src/deploy-to-server.sh
bigartist-source/src/main.tsx
bigartist-source/src/App.tsx
bigartist-source/src/index.css
bigartist-source/src/guidelines
root@ubuntu:/var/www# 
