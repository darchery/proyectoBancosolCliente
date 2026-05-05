# REORGANIZACIÓN DE PROYECTO - ESTRUCTURA NUEVA

## Nueva estructura de carpetas en `src/`:

```
src/
├── assets/
│   └── css/
│       ├── footer_comun.css
│       ├── header_comun.css
│       ├── style_gestion.css
│       ├── style_home.css
│       ├── style_login.css
│       ├── style_solicitar_acceso.css
│       └── style_welcome.css
├── components/
│   ├── footer/
│   │   ├── footer_comun.css
│   │   ├── footer_comun.html
│   │   └── footer_comun.js
│   └── header/
│       ├── header_comun.css
│       ├── header_comun.html
│       └── header_comun.js
├── data/
│   ├── datos.json
│   └── usuarios.json
└── pages/
    ├── home/
    │   ├── index_home.html
    │   └── home.js
    ├── login/
    │   ├── index_login.html
    │   └── login.js
    ├── solicitar-acceso/
    │   ├── index_solicitar_acceso.html
    │   └── solicitar_acceso.js
    ├── welcome/
    │   ├── welcome.js
    │   ├── welcome_admin.html
    │   ├── welcome_admin.js
    │   ├── welcome_capitan.html
    │   ├── welcome_capitan.js
    │   ├── welcome_capitan_coordinador.html
    │   ├── welcome_capitan_coordinador.js
    │   ├── welcome_coordinador.html
    │   ├── welcome_coordinador.js
    │   ├── welcome_entidad_colaboradora.html
    │   ├── welcome_entidad_colaboradora.js
    │   ├── welcome_responsable_tienda.html
    │   └── welcome_responsable_tienda.js
    └── gestion/
        ├── asignacion-voluntarios/
        │   ├── asignacion_voluntarios.html
        │   └── asignacion_voluntarios.js
        ├── bandeja-entrada/
        │   ├── gestionar_bandeja_entrada.html
        │   └── gestionar_bandeja_entrada.js
        ├── campanyas/
        │   ├── gestionar_campanya.html
        │   └── gestionar_campanya.js
        ├── colaboradores/
        │   ├── gestionar_colaboradores.html
        │   └── gestion_colaboradores.js
        ├── coordinadores/
        │   ├── gestionar_coordinadores.html
        │   └── gestion_coordinadores.js
        └── tiendas/
            ├── gestionar_tiendas.html
            └── gestionar_tiendas.js
```

## Cambios realizados:

### 1. ✅ Creación de estructura estándar
- `src/assets/css/` - Todos los CSS centralizados
- `src/components/` - Componentes reutilizables (header, footer)
- `src/pages/` - Todas las páginas/vistas organizadas por funcionalidad

### 2. ✅ Actualización de rutas HTML
Todos los archivos HTML actualizados para apuntar a:
- CSS: `../../assets/css/style_*.css`
- Header: `../../components/header/header_comun.html` y `header_comun.js`
- Footer: `../../components/footer/footer_comun.html` y `footer_comun.js`

### 3. ✅ Actualización de rutas JS
Todos los archivos JavaScript actualizados para apuntar a:
- Rutas de login: `../login/index_login.html`
- Rutas de welcome: `../welcome/welcome_*.html`
- Rutas de gestión: `../gestion/*/` 
- Datos: `../../data/usuarios.json`

### 4. ✅ Corrección de typo
- Creado `asignacion_voluntarios.html` en `src/pages/gestion/asignacion-voluntarios/`

## Próximos pasos (LIMPIEZA):

Las siguientes carpetas pueden ser eliminadas (son el código antiguo):
```bash
rm -rf src/gestionDatos/
rm -rf src/gestionElementosComunes/
rm -rf src/gestionPaginasIniciales/
rm -rf src/gestionWelcomeUsuarios/
```

## Rutas de referencia rápida:

| Elemento | Ubicación | Acceso relativo desde src/pages/ |
|---|---|---|
| Home | `pages/home/index_home.html` | `../home/index_home.html` |
| Login | `pages/login/index_login.html` | `../login/index_login.html` |
| Welcome Admin | `pages/welcome/welcome_admin.html` | `../welcome/welcome_admin.html` |
| Gestion Colaboradores | `pages/gestion/colaboradores/` | `../gestion/colaboradores/` |
| CSS Global | `assets/css/style_gestion.css` | `../../assets/css/style_gestion.css` |
| Header | `components/header/header_comun.html` | `../../components/header/header_comun.html` |
| Footer | `components/footer/footer_comun.html` | `../../components/footer/footer_comun.html` |
