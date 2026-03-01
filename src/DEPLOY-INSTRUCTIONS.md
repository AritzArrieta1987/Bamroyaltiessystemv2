# 📦 Instrucciones de Despliegue - BAM Royalties System

## 🎯 Cambios Realizados

1. **✏️ Nombre del proyecto**: Actualizado de "Nuevo proyecto en blanco" a "BAM Royalties System"
2. **🖼️ Favicon**: Configurado para usar `/favicon.png`
3. **⚙️ Vite Config**: Configurado para generar `dist/` directamente (no `build/`)

## 📋 Archivos Actualizados

- `package.json` - Nombre del proyecto
- `index.html` - Título y favicon
- `vite.config.ts` - Configuración de build
- `deploy-bigartist.sh` - Script de despliegue mejorado

## 🚀 Pasos para Desplegar

### 1. Subir Cambios a GitHub

Desde tu máquina local, navega al repositorio y ejecuta:

```bash
cd /ruta/a/tu/repositorio/Versionfinal

# Agregar los archivos actualizados
git add package.json index.html vite.config.ts deploy-bigartist.sh

# Hacer commit
git commit -m "feat: Actualizar nombre a BAM Royalties System y configurar favicon"

# Subir a GitHub
git push origin main
```

### 2. Añadir el Favicon al Repositorio

**Importante**: Necesitas añadir manualmente el archivo `favicon.png` al repositorio.

```bash
# Crear carpeta public si no existe
mkdir -p public

# Copia tu archivo favicon.png a public/
cp /ruta/a/tu/favicon.png public/favicon.png

# Agregar y subir
git add public/favicon.png
git commit -m "feat: Añadir favicon del sistema"
git push origin main
```

### 3. Desplegar en el Servidor

Conéctate al servidor y ejecuta el script:

```bash
# Conectar al servidor
ssh root@94.143.141.241

# Ejecutar el script de despliegue actualizado
/root/deploy-bigartist.sh
```

## 🔍 Verificación

Después del despliegue:

1. Abre `https://app.bigartist.es`
2. Verifica que el título de la pestaña diga **"BAM Royalties System"**
3. Verifica que aparezca el favicon correcto
4. Presiona `Ctrl+Shift+R` para limpiar caché si es necesario

## 📝 Notas Adicionales

### Sobre el Favicon

Si no tienes el archivo `favicon.png` en el formato correcto:

```bash
# Convertir imagen a PNG de 32x32 o 64x64
# Usando ImageMagick (si lo tienes instalado):
convert tu-imagen.png -resize 32x32 public/favicon.png

# O manualmente guárdala como PNG desde tu editor de imágenes
```

### Actualizar el Script en el Servidor

Si necesitas actualizar el script de despliegue en el servidor:

```bash
# En el servidor
nano /root/deploy-bigartist.sh

# Pegar el contenido actualizado del script
# Guardar: Ctrl+O, Enter
# Salir: Ctrl+X

# Dar permisos de ejecución
chmod +x /root/deploy-bigartist.sh
```

## 🎉 ¡Listo!

El sistema ahora mostrará "BAM Royalties System" en todos los lugares donde antes aparecía "Nuevo proyecto en blanco".
