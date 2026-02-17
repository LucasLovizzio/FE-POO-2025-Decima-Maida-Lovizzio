# FE-POO-2025 - Proyecto Frontend

Proyecto frontend desarrollado con React + TypeScript + Vite + Tailwind CSS.

## 🚀 Tecnologías

- **React 19** - Biblioteca para construir interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Herramienta de construcción y desarrollo rápido
- **Tailwind CSS** - Framework de CSS utility-first
- **React Router** - Enrutamiento para aplicaciones React
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formateador de código

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos (imágenes, iconos, etc.)
├── components/      # Componentes reutilizables
├── context/         # Contextos de React
├── hooks/           # Hooks personalizados
├── pages/           # Páginas/vistas de la aplicación
├── services/        # Servicios para llamadas a API
├── types/           # Definiciones de tipos TypeScript
├── App.tsx          # Componente principal
├── main.tsx         # Punto de entrada
└── index.css        # Estilos globales
```

## 🛠️ Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) o npm

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd FE-POO-2025-Decima-Maida-Lovizzio
```

2. Instalar dependencias:
```bash
pnpm install
# o con npm
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar el archivo `.env` con las configuraciones necesarias.

## 🚀 Comandos Disponibles

### Desarrollo
```bash
pnpm dev
# o
npm run dev
```
Inicia el servidor de desarrollo en `http://localhost:5173`

### Build
```bash
pnpm build
# o
npm run build
```
Genera la versión optimizada para producción en la carpeta `dist/`

### Preview
```bash
pnpm preview
# o
npm run preview
```
Previsualiza la versión de producción localmente

### Linting
```bash
pnpm lint
# o
npm run lint
```
Ejecuta ESLint para verificar el código

### Formateo
```bash
pnpm format
# o
npm run format
```
Formatea el código con Prettier

```bash
pnpm format:check
# o
npm run format:check
```
Verifica el formato sin modificar archivos

## 🌐 Variables de Entorno

Las variables de entorno deben definirse en un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📝 Notas de Desarrollo

- Todos los archivos TypeScript deben estar tipados correctamente
- Usar Tailwind CSS para los estilos
- Seguir las convenciones de nombres establecidas
- Ejecutar linting y formateo antes de hacer commits

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
