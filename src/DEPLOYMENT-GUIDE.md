# 🚀 Guía de Deployment - BAM Royalties System

## 📋 Requisitos Previos

### Servidor Ubuntu 24.04
- **IP:** 94.143.141.241
- **Usuario:** root
- **Dominio:** app.bigartist.es
- **MySQL Password:** BigArtist2018!@?

### En tu máquina local
- Git configurado
- Acceso SSH al servidor
- Node.js instalado (opcional, solo para desarrollo)

---

## 🔄 Proceso de Deployment

### 1️⃣ Preparar el código

```bash
# 1. Asegúrate de estar en la rama correcta
git status

# 2. Añadir todos los cambios
git add .

# 3. Hacer commit
git commit -m "Update: Página de contratos con edición completa y subida de PDF"

# 4. Subir a GitHub
git push origin main
```

### 2️⃣ Ejecutar el script de deployment

```bash
# Dar permisos de ejecución al script
chmod +x deploy-final.sh

# Ejecutar deployment
./deploy-final.sh
```

### 3️⃣ ¿Qué hace el script?

El script `deploy-final.sh` realiza las siguientes acciones:

1. ✅ **Backup del sistema actual** (si existe)
2. ✅ **Clona el código** desde GitHub
3. ✅ **Instala dependencias** y compila el frontend
4. ✅ **Configura el backend** con Node.js y PM2
5. ✅ **Inicializa MySQL** con las tablas necesarias
6. ✅ **Configura Nginx** como reverse proxy
7. ✅ **Verifica** que todo esté funcionando

---

## 🌐 Acceso a la Aplicación

### URL Principal
```
https://app.bigartist.es
```

### Credenciales Admin
- **Email:** admin@bigartist.es
- **Password:** Admin123!

---

## 🛠️ Comandos Útiles

### Ver logs del API
```bash
ssh root@94.143.141.241 'pm2 logs bigartist-api'
```

### Ver estado de servicios
```bash
ssh root@94.143.141.241 'pm2 status'
```

### Reiniciar el API
```bash
ssh root@94.143.141.241 'pm2 restart bigartist-api'
```

### Ver logs de Nginx (errores)
```bash
ssh root@94.143.141.241 'tail -f /var/log/nginx/bigartist_error.log'
```

### Ver logs de Nginx (acceso)
```bash
ssh root@94.143.141.241 'tail -f /var/log/nginx/bigartist_access.log'
```

### Reiniciar Nginx
```bash
ssh root@94.143.141.241 'systemctl restart nginx'
```

### Reiniciar MySQL
```bash
ssh root@94.143.141.241 'systemctl restart mysql'
```

---

## 🗄️ Base de Datos

### Conexión a MySQL desde el servidor
```bash
ssh root@94.143.141.241
mysql -u root -p'BigArtist2018!@?'
```

### Ver base de datos
```sql
USE bigartist;
SHOW TABLES;
```

### Ver usuarios
```sql
SELECT * FROM users;
```

### Ver contratos
```sql
SELECT * FROM contracts;
```

---

## 🔧 Troubleshooting

### Problema: La página no carga

1. **Verificar Nginx:**
```bash
ssh root@94.143.141.241 'systemctl status nginx'
```

2. **Ver logs de Nginx:**
```bash
ssh root@94.143.141.241 'tail -50 /var/log/nginx/bigartist_error.log'
```

3. **Reiniciar Nginx:**
```bash
ssh root@94.143.141.241 'systemctl restart nginx'
```

### Problema: Login no funciona

1. **Verificar que el API esté corriendo:**
```bash
ssh root@94.143.141.241 'pm2 status bigartist-api'
```

2. **Ver logs del API:**
```bash
ssh root@94.143.141.241 'pm2 logs bigartist-api --lines 50'
```

3. **Reiniciar API:**
```bash
ssh root@94.143.141.241 'pm2 restart bigartist-api'
```

4. **Verificar conexión a MySQL:**
```bash
ssh root@94.143.141.241 'mysql -u root -p"BigArtist2018!@?" -e "SELECT 1"'
```

### Problema: Error 502 Bad Gateway

Esto indica que Nginx no puede conectar con el backend:

1. **Verificar que el API esté corriendo:**
```bash
ssh root@94.143.141.241 'pm2 status'
```

2. **Verificar que el puerto 3001 esté escuchando:**
```bash
ssh root@94.143.141.241 'netstat -tlnp | grep 3001'
```

3. **Reiniciar todo:**
```bash
ssh root@94.143.141.241 'pm2 restart bigartist-api && systemctl reload nginx'
```

### Problema: Cambios no se reflejan

1. **Limpiar caché del navegador:** Ctrl+Shift+R (Chrome/Firefox)
2. **Verificar que el código se subió a GitHub:**
   ```bash
   git log -1
   ```
3. **Re-ejecutar deployment:**
   ```bash
   ./deploy-final.sh
   ```

---

## 📁 Estructura en el Servidor

```
/var/www/bigartist/
├── dist/                    # Frontend compilado (servido por Nginx)
│   ├── index.html
│   ├── assets/
│   └── ...
├── server/                  # Backend Node.js
│   ├── server.js
│   ├── create-admin.js
│   ├── init-database.sql
│   ├── package.json
│   └── .env
├── node_modules/           # Dependencias del frontend
└── ...                     # Código fuente

/var/www/backups/           # Backups automáticos
└── bigartist_backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## 🔐 Seguridad

### SSL/TLS
El certificado SSL está gestionado por Let's Encrypt:
- Ubicación: `/etc/letsencrypt/live/app.bigartist.es/`
- Renovación automática configurada

### Renovar certificado SSL manualmente
```bash
ssh root@94.143.141.241 'certbot renew'
```

### Firewall
Asegúrate de que estos puertos estén abiertos:
- **80** (HTTP - redirect a HTTPS)
- **443** (HTTPS)
- **22** (SSH)
- **3001** (Backend - solo localhost)

---

## 🎨 Funcionalidades Actuales

### ✅ Implementado
- Login con MySQL y JWT
- Dashboard con estadísticas
- Gestión de Artistas
- Catálogo de música
- **Gestión de Contratos** con:
  - Tipos: Distribución, Management, Distribución Física, Otros Servicios
  - Edición completa de contratos
  - Subida de PDF del contrato
  - Vista previa de splits de royalties
- Subida de CSV
- Finanzas
- Ventas físicas

---

## 📞 Contacto y Soporte

Si tienes problemas durante el deployment:

1. Revisa los logs (ver sección de comandos útiles)
2. Verifica que todos los servicios estén corriendo
3. Asegúrate de que el código está en GitHub
4. Prueba el script de deployment de nuevo

---

## 🎉 ¡Listo!

Una vez completado el deployment, tu aplicación estará disponible en:

**https://app.bigartist.es**

Inicia sesión y disfruta de tu sistema de gestión de royalties! 🎵
