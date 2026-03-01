# 🚀 BAM Royalties System - Deployment Guide

Sistema completo de gestión de royalties con React, Node.js, MySQL y Nginx.

---

## ⚡ OPCIÓN 1: One-Line Deploy (LA MÁS FÁCIL)

**Sin descargar nada, directo desde tu terminal:**

```bash
bash <(curl -s https://raw.githubusercontent.com/AritzArrieta1987/Bamroyaltiessystemv2/main/one-line-deploy.sh)
```

✅ **Todo automático en un solo comando**

---

## 🚀 OPCIÓN 2: Deploy desde GitHub (Recomendado)

**Si NO tienes el código en local:**

### Paso 1: Descarga el script
```bash
wget https://raw.githubusercontent.com/AritzArrieta1987/Bamroyaltiessystemv2/main/deploy-from-github.sh
```

O usa curl:
```bash
curl -O https://raw.githubusercontent.com/AritzArrieta1987/Bamroyaltiessystemv2/main/deploy-from-github.sh
```

### Paso 2: Ejecuta
```bash
chmod +x deploy-from-github.sh
./deploy-from-github.sh
```

✅ **Clona, compila y despliega todo automáticamente**

---

## 💻 OPCIÓN 3: Deploy desde Local (Si tienes el código)

**Si ya clonaste el repositorio en tu máquina:**

```bash
chmod +x quick-deploy.sh
./quick-deploy.sh
```

✅ **Sube y despliega tu código local**

---

## 🛠️ OPCIÓN 4: Deployment Manual vía SSH

**Si prefieres hacerlo paso a paso:**

```bash
# 1. Conectar al servidor
ssh root@94.143.141.241

# 2. Clonar repositorio
cd /var/www
rm -rf bigartist
git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git bigartist
cd bigartist

# 3. Frontend
npm install
npm run build

# 4. Backend
cd server
npm install --production

# 5. Configurar .env (si no existe)
cat > .env << EOF
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BigArtist2018!@?
DB_NAME=bigartist
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=production
EOF

# 6. Base de datos
mysql -u root -p'BigArtist2018!@?' < init-database.sql
node create-admin.js

# 7. Iniciar servicios
pm2 restart bigartist-api || pm2 start server.js --name bigartist-api
pm2 save

# 8. Permisos y Nginx
chown -R www-data:www-data /var/www/bigartist/dist
chmod -R 755 /var/www/bigartist/dist
systemctl reload nginx
```

---

## 🌐 Acceso a la Aplicación

### URL
```
https://app.bigartist.es
```

### Credenciales Admin
- **Email:** `admin@bigartist.es`
- **Password:** `Admin123!`

---

## 📋 Información del Servidor

| Item | Valor |
|------|-------|
| **IP** | 94.143.141.241 |
| **Usuario** | root |
| **Dominio** | app.bigartist.es |
| **Directorio** | /var/www/bigartist |
| **Puerto API** | 3001 |
| **Base de Datos** | bigartist |
| **MySQL Password** | BigArtist2018!@? |

---

## 🔍 Verificar Deployment

### Estado de servicios
```bash
ssh root@94.143.141.241 'pm2 status && systemctl status nginx'
```

### Ver logs del API
```bash
ssh root@94.143.141.241 'pm2 logs bigartist-api'
```

### Ver logs de Nginx
```bash
ssh root@94.143.141.241 'tail -f /var/log/nginx/bigartist_error.log'
```

### Test de conexión
```bash
curl https://app.bigartist.es
```

---

## 🔧 Troubleshooting

### Problema: No puedo conectarme por SSH

**Solución:**
```bash
# Verifica tu clave SSH
ssh-add -l

# Prueba la conexión
ssh -v root@94.143.141.241
```

### Problema: Error al clonar repositorio

**Solución:**
```bash
# Asegúrate de que Git esté instalado en el servidor
ssh root@94.143.141.241 'apt-get update && apt-get install -y git'
```

### Problema: API no inicia

**Solución:**
```bash
# Ver logs completos
ssh root@94.143.141.241 'pm2 logs bigartist-api --lines 100'

# Reiniciar
ssh root@94.143.141.241 'pm2 restart bigartist-api'
```

### Problema: 502 Bad Gateway

**Solución:**
```bash
# Verificar que el API esté corriendo
ssh root@94.143.141.241 'pm2 status'

# Verificar puerto 3001
ssh root@94.143.141.241 'netstat -tlnp | grep 3001'

# Reiniciar todo
ssh root@94.143.141.241 'pm2 restart bigartist-api && systemctl reload nginx'
```

### Problema: Cambios no se reflejan

**Solución:**
1. Limpia caché del navegador: `Ctrl + Shift + R`
2. Verifica que el código esté en GitHub
3. Re-ejecuta el deployment

---

## 📦 Estructura en el Servidor

```
/var/www/bigartist/
├── dist/                      # Frontend compilado (servido por Nginx)
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   ├── index-[hash].css
│   │   └── ...
│   └── ...
├── server/                    # Backend API
│   ├── server.js             # API principal
│   ├── create-admin.js       # Script crear admin
│   ├── init-database.sql     # Schema MySQL
│   ├── package.json
│   └── .env                  # Configuración (creado automáticamente)
├── src/                      # Código fuente React
├── pages/                    # Páginas de la app
├── components/               # Componentes React
├── package.json
└── ...
```

---

## 🎯 Funcionalidades Desplegadas

### ✅ Autenticación
- Login con MySQL y JWT
- Validación de credenciales
- Sesión persistente

### ✅ Dashboard
- Estadísticas en tiempo real
- Gráficos de royalties
- KPIs principales

### ✅ Gestión de Artistas
- CRUD completo
- Visualización en grid/tabla
- Búsqueda y filtros

### ✅ Gestión de Contratos ⭐ (NUEVO)
- Crear/Editar contratos
- **Tipos:** Distribución, Management, Distribución Física, Otros Servicios
- **Subida de PDF** del contrato
- Vista previa de splits (Artista/BAM)
- Estados: Activo, Pendiente, Por expirar

### ✅ Catálogo
- Listado de canciones
- Estadísticas por track
- Streams y revenue

### ✅ Finanzas
- Reportes de ingresos
- Exportación de datos
- Análisis por período

### ✅ Otras funcionalidades
- Subida de CSV
- Ventas físicas
- Responsive design

---

## 🔄 Workflow para Actualizaciones

### Si haces cambios en GitHub:

```bash
# Opción rápida (sin tener código en local)
bash <(curl -s https://raw.githubusercontent.com/AritzArrieta1987/Bamroyaltiessystemv2/main/one-line-deploy.sh)
```

### Si trabajas en local:

```bash
# 1. Haces cambios
# 2. Subes a GitHub
git add .
git commit -m "Update: descripción"
git push origin main

# 3. Despliegas
./deploy-from-github.sh
```

---

## 📊 Comandos Útiles

### Gestión del API (PM2)
```bash
# Ver estado
ssh root@94.143.141.241 'pm2 status'

# Ver logs en tiempo real
ssh root@94.143.141.241 'pm2 logs bigartist-api'

# Reiniciar
ssh root@94.143.141.241 'pm2 restart bigartist-api'

# Detener
ssh root@94.143.141.241 'pm2 stop bigartist-api'

# Información detallada
ssh root@94.143.141.241 'pm2 info bigartist-api'
```

### Gestión de Nginx
```bash
# Test de configuración
ssh root@94.143.141.241 'nginx -t'

# Reload (sin downtime)
ssh root@94.143.141.241 'systemctl reload nginx'

# Restart (con downtime)
ssh root@94.143.141.241 'systemctl restart nginx'

# Ver logs de error
ssh root@94.143.141.241 'tail -f /var/log/nginx/bigartist_error.log'

# Ver logs de acceso
ssh root@94.143.141.241 'tail -f /var/log/nginx/bigartist_access.log'
```

### Gestión de MySQL
```bash
# Conectar a MySQL
ssh root@94.143.141.241
mysql -u root -p'BigArtist2018!@?'

# Backup de base de datos
ssh root@94.143.141.241 'mysqldump -u root -p"BigArtist2018!@?" bigartist > /var/www/backups/db_$(date +%Y%m%d).sql'

# Restaurar backup
ssh root@94.143.141.241 'mysql -u root -p"BigArtist2018!@?" bigartist < /var/www/backups/db_YYYYMMDD.sql'
```

### Backups
```bash
# Listar backups
ssh root@94.143.141.241 'ls -lh /var/www/backups/'

# Crear backup manual
ssh root@94.143.141.241 'tar -czf /var/www/backups/manual_$(date +%Y%m%d_%H%M%S).tar.gz -C /var/www bigartist'
```

---

## 🔒 Seguridad

### SSL/TLS
- Certificado Let's Encrypt configurado
- HTTPS forzado (redirect automático)
- TLS 1.2 y 1.3 habilitados

### Base de Datos
- Acceso solo desde localhost
- Contraseña segura: `BigArtist2018!@?`
- JWT para autenticación API

### Firewall
Puertos abiertos:
- 80 (HTTP → redirect HTTPS)
- 443 (HTTPS)
- 22 (SSH)

Puerto interno:
- 3001 (API - solo localhost)

---

## 🎉 ¡Listo!

Tu sistema está completamente desplegado y funcionando.

**Accede a:** https://app.bigartist.es

**Login:** admin@bigartist.es / Admin123!

---

## 📞 Soporte

Si encuentras algún problema:

1. ✅ Revisa los logs (ver sección de comandos útiles)
2. ✅ Verifica que todos los servicios estén corriendo
3. ✅ Prueba reiniciar los servicios
4. ✅ Consulta la sección de Troubleshooting

---

**Hecho con ❤️ para BAM Records**
