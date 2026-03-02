# 🤝 Guía de Contribución - BAM Royalties System

¡Gracias por tu interés en contribuir al BAM Royalties System! Esta guía te ayudará a participar en el desarrollo del proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)

## 📜 Código de Conducta

Este proyecto y todos los participantes están sujetos a un código de conducta profesional. Al participar, se espera que mantengas este estándar.

### Nuestros Valores
- 🤝 Respeto y profesionalismo
- 💡 Colaboración abierta
- 🎯 Calidad sobre cantidad
- 📚 Documentación clara
- 🔒 Seguridad primero

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio

```bash
# Fork en GitHub, luego clona tu fork
git clone https://github.com/TU-USUARIO/Bamroyaltiessystemv2.git
cd Bamroyaltiessystemv2
```

### 2. Crear una Rama

```bash
# Actualiza main
git checkout main
git pull origin main

# Crea tu rama de feature
git checkout -b feature/nombre-descriptivo
# O para bugs
git checkout -b fix/nombre-del-bug
```

### 3. Hacer Cambios

- Escribe código limpio y documentado
- Sigue los estándares de código
- Añade tests si es aplicable
- Actualiza documentación si es necesario

### 4. Commit

```bash
git add .
git commit -m "tipo: descripción breve"
```

Ver [Commits](#commits) para más detalles.

### 5. Push y Pull Request

```bash
git push origin feature/nombre-descriptivo
```

Luego crea un Pull Request en GitHub.

## 🔄 Proceso de Desarrollo

### Setup Local

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build para verificar
npm run build
```

### Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Verificar linting
npm run lint
```

### Antes de Hacer Commit

- ✅ Código compila sin errores
- ✅ No hay warnings críticos
- ✅ Funciona en desarrollo
- ✅ Build exitoso
- ✅ Documentación actualizada

## 📝 Estándares de Código

### TypeScript

```typescript
// ✅ Correcto
interface User {
  id: number;
  email: string;
  name: string;
}

function getUser(id: number): User | null {
  // ...
}

// ❌ Incorrecto
function getUser(id) {
  // ...
}
```

### React Components

```typescript
// ✅ Correcto - Componente funcional con tipos
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Incorrecto - Sin tipos
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Naming Conventions

```typescript
// Componentes - PascalCase
HomePage.tsx
LoginPanel.tsx

// Funciones - camelCase
getUserById()
calculateRoyalties()

// Constantes - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.bigartist.es';
const MAX_RETRY_ATTEMPTS = 3;

// Interfaces/Types - PascalCase
interface Artist { }
type RoyaltyData = { };

// CSS Classes - kebab-case
.login-container
.artist-card
```

### Estructura de Archivos

```typescript
// Orden de imports
import { useState, useEffect } from 'react';           // React
import { useNavigate } from 'react-router';            // Third-party
import { Button } from './components/ui/button';       // Components
import { apiRequest } from './utils/api';              // Utils
import type { Artist } from './types';                 // Types
import './styles/component.css';                       // Styles

// Orden de código
// 1. Types/Interfaces
// 2. Constantes
// 3. Componente principal
// 4. Funciones auxiliares
// 5. Exports
```

### Comentarios

```typescript
// ✅ Correcto - Comentarios útiles
/**
 * Calcula los royalties totales para un artista en un período
 * @param artistId - ID del artista
 * @param startDate - Fecha inicio del período
 * @param endDate - Fecha fin del período
 * @returns Total de royalties en euros
 */
function calculateRoyalties(
  artistId: number, 
  startDate: Date, 
  endDate: Date
): number {
  // ...
}

// ❌ Incorrecto - Comentarios obvios
// Esta función suma dos números
function add(a: number, b: number) {
  return a + b; // Retorna la suma
}
```

## 📋 Commits

### Formato

```
tipo(scope): descripción breve

Descripción detallada opcional

Fixes #123
```

### Tipos de Commit

- `feat` - Nueva característica
- `fix` - Corrección de bug
- `docs` - Solo documentación
- `style` - Cambios de formato (no afectan código)
- `refactor` - Refactorización de código
- `perf` - Mejora de performance
- `test` - Añadir tests
- `chore` - Tareas de mantenimiento
- `build` - Cambios en build
- `ci` - Cambios en CI/CD

### Ejemplos

```bash
feat(artists): añadir filtro por género
fix(login): corregir validación de email
docs(readme): actualizar guía de instalación
refactor(api): simplificar cliente HTTP
perf(dashboard): optimizar carga de gráficos
```

## 🔀 Pull Requests

### Antes de Crear un PR

- ✅ Código probado localmente
- ✅ Build exitoso
- ✅ Sin conflictos con main
- ✅ Documentación actualizada
- ✅ Commits bien formateados

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] El código compila sin errores
- [ ] Añadí documentación
- [ ] Probé los cambios localmente
- [ ] Actualicé el CHANGELOG

## Screenshots
(Si aplica)

## Notas Adicionales
Cualquier información relevante
```

### Revisión de Código

- El PR será revisado por al menos un maintainer
- Puede requerir cambios antes de merge
- Se verificará calidad de código y tests
- Se comprobará compatibilidad

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifica que no sea un bug ya reportado
2. Asegúrate de que no sea un error de configuración
3. Intenta reproducirlo en ambiente limpio

### Template de Bug Report

```markdown
## Descripción del Bug
Descripción clara del problema

## Para Reproducir
1. Ir a '...'
2. Click en '...'
3. Ver error

## Comportamiento Esperado
Qué debería pasar

## Screenshots
Si aplica

## Entorno
- OS: [e.g. Ubuntu 24.04]
- Navegador: [e.g. Chrome 120]
- Versión: [e.g. 2.0.0]

## Información Adicional
Cualquier contexto adicional
```

## 💡 Sugerir Features

### Template de Feature Request

```markdown
## Problema que Resuelve
Descripción del problema actual

## Solución Propuesta
Cómo lo resolverías

## Alternativas Consideradas
Otras opciones que evaluaste

## Contexto Adicional
Información relevante, mockups, etc.
```

## 🎨 Estándares de Diseño

### Colores

Usa las variables CSS definidas:

```css
--accent-gold: #c9a574;
--bg-dark: #0D1F23;
--text-light: #f8f9fa;
```

### Componentes UI

Usa los componentes de `/components/ui/` cuando sea posible.

### Responsive

Asegúrate de que funcione en:
- Desktop (> 968px)
- Tablet (< 968px)
- Mobile (< 480px)

## 📚 Documentación

### Actualizar Docs

Si tu cambio afecta:
- Funcionalidad → Actualiza README.md
- API → Actualiza server/README.md
- Deploy → Actualiza DEPLOYMENT.md
- Estructura → Actualiza PROJECT-STRUCTURE.md

### JSDoc

Documenta funciones públicas:

```typescript
/**
 * Descripción de la función
 * @param param1 - Descripción del parámetro
 * @returns Descripción del retorno
 * @throws Descripción de errores posibles
 * @example
 * ```typescript
 * const result = myFunction('example');
 * ```
 */
```

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la documentación
2. Busca en issues cerrados
3. Abre un nuevo issue con la etiqueta `question`
4. Contacta a admin@bigartist.es

## 🏆 Reconocimientos

Los contribuidores serán añadidos a:
- Lista de contribuidores en README.md
- Archivo CONTRIBUTORS.md
- Créditos en la aplicación

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones estarán bajo la misma licencia que el proyecto.

---

**¡Gracias por contribuir a BAM Royalties System!** 🎵✨

Big Artist Management S.L. © 2026
