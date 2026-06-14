# Bancosol - Aplicación React

Aplicación web para la gestión de tiendas, colaboradores y campañas de Bancosol.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Ejecución

El proyecto necesita dos terminales:

### Terminal 1: Servidor de datos (json-server)

```bash
npx json-server --watch src/data/db.json
```

Arranca en `http://localhost:3001`. Proporciona los endpoints:
- `GET/POST/PUT/DELETE /usuarios`
- `GET/POST/PUT/DELETE /tiendas`
- `GET/POST/PUT/DELETE /colaboradores`
- `GET/POST/PUT/DELETE /coordinadores`
- `GET/POST/PUT/DELETE /campanyas`
- `GET/POST/PUT/DELETE /cadenas`
- `GET/POST/PUT/DELETE /campanyas_generadas`
- `GET/POST/PUT/DELETE /solicitudes`

### Terminal 2: Aplicación React

```bash
npm run dev
```

Arranca en `http://localhost:5173`.

## Usuarios de prueba (db.json)

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin | admin |
| coordinador1 | coordinador1 | coordinador |

## Estructura del proyecto

```
src/
├── components/layout/     → Header y Footer comunes
├── hooks/                 → Autenticación, rutas protegidas, roles
├── pages/
│   ├── home/              → Página de inicio
│   ├── login/             → Inicio de sesión
│   ├── solicitar-acceso/  → Solicitud de acceso
│   ├── welcome/           → Menú principal por rol
│   ├── notFound/          → Página 404
│   └── gestion/
│       ├── tiendas/       → CRUD de tiendas
│       ├── colaboradores/ → CRUD de colaboradores
│       └── campanyas/     → Gestión de campañas y cadenas
├── assets/                → CSS e imágenes
└── data/db.json           → Datos de prueba (json-server)
```

## Tecnologías

- React 19 + Vite
- React Router DOM (enrutamiento)
- json-server (API REST simulada)
- xlsx (exportación a Excel)
