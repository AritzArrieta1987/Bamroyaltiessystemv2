# ⚡ Quick Start - BAM Royalties System

## 🚀 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git
cd Bamroyaltiessystemv2

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

Abre http://localhost:5173

## 🔐 Login de Prueba

**Admin:**
- Email: `admin@bigartist.es`
- Password: `admin123`

**Artist:**
- Email: `artist@bigartist.es`
- Password: `artist123`

## 🏗️ Build para Producción

```bash
npm run build
# Output en ./dist/
```

## 🌐 Deploy a Servidor

```bash
# Deploy completo (frontend + backend + servicios)
./deploy.sh

# Deploy rápido (solo frontend)
./deploy-quick.sh
```

## 📁 Archivos Principales

```
main.tsx              → Punto de entrada
App.tsx               → Lógica de auth
routes.ts             → Rutas de la app
components/           → Componentes React
pages/                → Páginas de la app
server/               → Backend Node.js
utils/api.ts          → Cliente API
```

## 🗄️ Backend Setup

```bash
cd server
npm install
node create-admin.js    # Crear usuario admin
npm start              # Puerto 3001
```

## 📊 Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Node.js + Express + MySQL
- **Auth:** JWT
- **Gráficos:** Recharts
- **Routing:** React Router
- **Icons:** Lucide React

## 🔗 Links Útiles

- **Producción:** https://app.bigartist.es
- **Servidor:** 94.143.141.241
- **GitHub:** https://github.com/AritzArrieta1987/Bamroyaltiessystemv2.git

## 📚 Documentación Completa

Ver [README.md](./README.md) y [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**¿Problemas?** Revisa [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)
