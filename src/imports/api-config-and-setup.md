# 1. Ver la configuración de la API en el código fuente
cd /var/www/bigartist-source/
cat package.json

# 2. Buscar donde se define la URL de la API
grep -r "localhost" src/ | grep -E "(3001|api)" | head -10
grep -r "API_URL\|apiUrl\|baseURL" src/ | head -10

# 3. Ver el archivo de configuración de Vite
cat vite.config.ts

# 4. Ver los archivos principales del frontend
ls -la src/
cat src/main.tsx | head -50
¡Perfecto!: command not found

  {
      "name": "Bam Royalties System",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
          "lucide-react": "*",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router": "*",
          "recharts": "*",
          "sonner": "^2.0.3",
          "tailwindcss": "*"
      },
      "devDependencies": {
          "@types/node": "^20.10.0",
          "@vitejs/plugin-react-swc": "^3.10.2",
          "vite": "6.3.5"
      },
      "scripts": {
          "dev": "vite",
          "build": "vite build"
      }
  }src/deploy-to-server.sh:        proxy_pass http://localhost:3001;
src/deploy-complete.sh:        proxy_pass http://localhost:3001/api/;
src/server/README.md:    proxy_pass http://localhost:3001;
src/server/server.js:  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
src/components/ProtectedRoute.tsx:        const API_URL = window.location.hostname === 'localhost' 
src/components/ProtectedRoute.tsx:        const response = await fetch(`${API_URL}/api/auth/verify`, {
src/utils/api.ts:const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'https://app.bigartist.es/api';
src/utils/api.ts:  const response = await fetch(`${API_URL}${endpoint}`, config);
src/utils/api.ts:    const response = await fetch(`${API_URL}/login`, {
src/utils/api.ts:    const response = await fetch(`${API_URL}/verify`, {
src/utils/api.ts:    const response = await fetch(`${API_URL}/users`, {

  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'sonner@2.0.3': 'sonner',
        'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png': path.resolve(__dirname, './src/assets/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png'),
        'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png': path.resolve(__dirname, './src/assets/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });total 104
drwxr-xr-x 11 root root  4096 Feb 28 21:44 .
drwxr-xr-x  4 root root  4096 Feb 28 21:44 ..
-rw-r--r--  1 root root  4980 Feb 28 21:44 App.tsx
-rw-r--r--  1 root root   303 Feb 28 21:44 Attributions.md
-rw-r--r--  1 root root  6133 Feb 28 21:44 DEPLOYMENT.md
drwxr-xr-x  2 root root  4096 Feb 28 21:44 assets
drwxr-xr-x  4 root root  4096 Feb 28 21:44 components
-rw-r--r--  1 root root  7008 Feb 28 21:44 deploy-complete.sh
-rw-r--r--  1 root root  3834 Feb 28 21:44 deploy-frontend-only.sh
-rw-r--r--  1 root root  6769 Feb 28 21:44 deploy-to-server.sh
drwxr-xr-x  2 root root  4096 Feb 28 21:44 deployment
drwxr-xr-x  2 root root  4096 Feb 28 21:44 guidelines
drwxr-xr-x  2 root root  4096 Feb 28 21:44 imports
-rw-r--r--  1 root root 11415 Feb 28 21:44 index.css
-rw-r--r--  1 root root   172 Feb 28 21:44 main.tsx
drwxr-xr-x  2 root root  4096 Feb 28 21:44 pages
-rw-r--r--  1 root root  1436 Feb 28 21:44 routes.ts
drwxr-xr-x  2 root root  4096 Feb 28 21:44 server
drwxr-xr-x  2 root root  4096 Feb 28 21:44 styles
drwxr-xr-x  2 root root  4096 Feb 28 21:44 utils

  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  root@ubuntu:/var/www/bigartist-source# 
