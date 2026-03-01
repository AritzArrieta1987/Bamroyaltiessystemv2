# Scripts de Despliegue BIGARTIST

## Servidor: 94.143.141.241
## Dominio: app.bigartist.es

### Acceso rápido a los scripts

Para acceder a estos scripts en cualquier momento, ejecuta:

```bash
cd /deployment
```

### Credenciales MySQL
- **Database:** bigartist
- **User:** root
- **Password:** BigArtist2018!@?
- **Host:** localhost

### Archivos disponibles

1. **VerifySetup.tsx** - Script para verificar que todo esté instalado
2. **SSLSetup.tsx** - Script para configurar certificado SSL
3. **DeployApp.tsx** - Script para desplegar la aplicación

### Estructura del servidor

```
/root/bigartist-app/     → Código fuente de la aplicación
/var/www/bigartist/      → Build de producción (accesible por Nginx)
/etc/nginx/sites-available/bigartist  → Configuración de Nginx
```

### Despliegue rápido

```bash
ssh root@94.143.141.241 "cd /root/bigartist-app && npm install && npm run build && rm -rf /var/www/bigartist/* && cp -r dist/* /var/www/bigartist/ && chown -R www-data:www-data /var/www/bigartist && systemctl reload nginx"
```
