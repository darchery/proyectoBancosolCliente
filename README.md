# Proyecto Bancosol TCAW

**Sistema de Gestión de Voluntarios y Colaboradores** para la organización Bancosol TCAW.

Aplicación web fullstack para administrar campañas de voluntariado, asignación de voluntarios, gestión de tiendas y colaboradores con control de acceso basado en roles.

---

## Descripción General

El proyecto Bancosol TCAW es una aplicación web diseñada para gestionar de manera integral las operaciones de una organización de voluntariado. Permite a diferentes tipos de usuarios (administradores, coordinadores, capitanes, responsables de tiendas, etc.) colaborar en la gestión de campañas, tiendas, colaboradores y voluntarios.

**Principales características:**
- Autenticación de usuarios con roles diferenciados
- Gestión de campañas de voluntariado
- Administración de tiendas y colaboradores
- Asignación de voluntarios
- Control de acceso basado en roles (RBAC)
- Exportación de datos a Excel
- Gestión de bandeja de entrada
- Sistema de permisos por rol

---

## Estructura del Proyecto

```
proyectoBancosolTCAW/
├── src/                          # Código del cliente (Frontend)
│   ├── assets/
│   │   ├── css/                  # Estilos globales
│   │   └── images/               # Recursos gráficos (logos)
│   ├── components/
│   │   ├── footer/               # Componente pie de página reutilizable
│   │   └── header/               # Componente cabecera reutilizable
│   ├── data/
│   │   ├── datos.json            # Datos generales
│   │   ├── db.json               # Base de datos simulada (json-server)
│   │   └── usuarios.json         # Base de datos de usuarios
│   └── pages/
│       ├── gestion/              # Páginas de administración
│       │   ├── asignacion-voluntarios/
│       │   ├── bandeja-entrada/
│       │   ├── campanyas/
│       │   ├── colaboradores/
│       │   ├── coordinadores/
│       │   └── tiendas/
│       ├── home/                 # Página de inicio
│       ├── login/                # Página de login
│       ├── solicitar-acceso/     # Solicitud de acceso
│       └── welcome/              # Páginas de bienvenida por rol
├── servidor/                     # Backend (json-server)
│   └── .env                      # Configuración del servidor
├── esqueleto_profe/              # Esqueleto del profesor
├── package.json                  # Dependencias del proyecto
├── README.md                     # Este archivo
├── ESTRUCTURA_DIRECTORIOS.md     # Documentación de estructura
├── DIAGRAMA_NAVEGACION.md        # Diagrama de navegación
└── RequisitosFuncionales.txt     # Requisitos del proyecto
```

---

## Roles de Usuario

El sistema soporta los siguientes roles de usuario:

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **Administrador** | Control total del sistema | Gestión de todo |
| **Coordinador** | Gestión de colaboradores y voluntarios | Tiendas, colaboradores, voluntarios |
| **Capitán** | Visualización y reportes | Tiendas, colaboradores |
| **Coordinador + Capitán** | Combinación de permisos | Tiendas, colaboradores, bandeja entrada |
| **Responsable Colaboradora** | Gestión de colaboradores de su entidad | Tiendas, colaboradores |
| **Responsable Tienda** | Gestión de su tienda | Tiendas, colaboradores |

---

## Instalación y Configuración

### Requisitos Previos
- **Node.js** v14 o superior
- **npm** o **yarn**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd proyectoBancosolTCAW
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar el Backend (json-server)

En una terminal, ejecuta:

```bash
npx json-server --port 3001 src/data/db.json
```

O usa el comando guardado en `LANZAR_BACKEND.txt`:

```bash
npm run start:backend
```

### 4. Iniciar el Frontend

Abre el archivo `src/pages/home/index_home.html` en tu navegador web, o usa un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

Luego accede a `http://localhost:8000` en tu navegador.

---

## Páginas y Funcionalidad

### Páginas Principales

#### Home (`src/pages/home/`)
- Página de inicio de la aplicación
- Botones de acceso rápido:
  - Iniciar sesión
  - Solicitar acceso

#### Login (`src/pages/login/`)
- Formulario de autenticación
- Validación de credenciales contra `db.json`
- Redirección según rol del usuario
- Almacenamiento de rol en `localStorage`

#### Welcome (Bienvenida) (`src/pages/welcome/`)
Páginas específicas por rol:
- `welcome_admin.html` - Panel de administrador
- `welcome_coordinador.html` - Panel de coordinador
- `welcome_capitan.html` - Panel de capitán
- `welcome_capitan_coordinador.html` - Panel de capitán+coordinador
- `welcome_entidad_colaboradora.html` - Panel de responsable colaboradora
- `welcome_responsable_tienda.html` - Panel de responsable tienda

#### Gestión de Tiendas (`src/pages/gestion/tiendas/`)
- Listar tiendas
- Añadir nueva tienda
- Modificar información de tienda
- Eliminar tienda
- Asignar coordinadores a tienda
- Registrar incidencias
- Búsqueda filtrada por cadena, coordinador, zona geográfica y localidad

#### Gestión de Colaboradores (`src/pages/gestion/colaboradores/`)
- Listar colaboradores
- Añadir colaborador a campaña
- Modificar datos del colaborador
- Eliminar colaborador
- Asignar a tienda
- Exportar listado a Excel
- Registrar incidencias
- Búsqueda filtrada por coordinador, usuario, localidad y zona geográfica

#### Asignación de Voluntarios (`src/pages/gestion/asignacion-voluntarios/`)
- Añadir voluntarios a campaña
- Guardar datos sin confirmar
- Cancelar cambios
- Exportar datos a Excel

#### Gestión de Campañas (`src/pages/gestion/campanyas/`)
- Crear nueva campaña
- Gestionar información de campaña
- Salir de gestión

#### Bandeja de Entrada (`src/pages/gestion/bandeja-entrada/`)
- Ver mensajes/notificaciones
- Acceso restringido a ciertos roles

#### Gestión de Coordinadores (`src/pages/gestion/coordinadores/`)
- Listar coordinadores
- CRUD de coordinadores

#### Solicitar Acceso (`src/pages/solicitar-acceso/`)
- Formulario para solicitar nuevo acceso al sistema

---

## Comunicación con el Servidor

### Backend (API)

El proyecto utiliza **json-server** como simulador de API REST. 

**Puerto:** `3001`
**Archivo de datos:** `src/data/db.json`

### Endpoints Principales

El servidor expone los siguientes endpoints REST:

```
GET     /colaboradores        - Obtener lista de colaboradores
POST    /colaboradores        - Crear nuevo colaborador
GET     /colaboradores/:id    - Obtener colaborador por ID
PUT     /colaboradores/:id    - Actualizar colaborador
DELETE  /colaboradores/:id    - Eliminar colaborador

GET     /tiendas              - Obtener lista de tiendas
POST    /tiendas              - Crear nueva tienda
PUT     /tiendas/:id          - Actualizar tienda
DELETE  /tiendas/:id          - Eliminar tienda

GET     /voluntarios          - Obtener lista de voluntarios
POST    /voluntarios          - Crear nuevo voluntario
```

### Llamadas a la API

Todas las llamadas se realizan mediante `fetch()` de JavaScript con configuración de encabezados:

```javascript
const API_URL = 'http://localhost:3001';

// GET
const response = await fetch(`${API_URL}/colaboradores`);
const data = await response.json();

// POST
const response = await fetch(`${API_URL}/colaboradores`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(nuevoColaborador)
});

// PUT
const response = await fetch(`${API_URL}/colaboradores/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(datosActualizados)
});

// DELETE
const response = await fetch(`${API_URL}/colaboradores/${id}`, {
  method: 'DELETE'
});
```

---

## Autenticación y Seguridad

### Sistema de Autenticación

1. **Login:** El usuario ingresa credenciales (usuario/contraseña)
2. **Validación:** Se valida contra `src/data/db.json`
3. **Almacenamiento:** El rol se guarda en `localStorage`:
   - `userRole` - Rol del usuario
   - `userName` - Nombre del usuario (opcional)

### Ejemplo de db.json

```json
{
  "usuarios": [
    {
      "id": 1,
      "usuario": "admin",
      "clave": "admin123",
      "rol": "admin",
      "nombre": "Administrador"
    },
    {
      "id": 2,
      "usuario": "coord1",
      "clave": "coord123",
      "rol": "coordinador",
      "nombre": "Coordinador 1"
    }
  ]
}
```

### Verificación de Rol

En cada página de gestión se verifica el rol del usuario:

```javascript
const rolActual = localStorage.getItem('userRole') || 'admin';

if (rolActual === 'admin') {
    // Mostrar opciones de admin
}
```

---

## Estructura de Estilos

- **Global:** `src/assets/css/`
- **Por página:** Cada página tiene su propio CSS
- **Componentes:** `src/components/{footer,header}/`

### Estilos Disponibles

- `header_comun.css` - Estilos de cabecera
- `footer_comun.css` - Estilos de pie de página
- `style_home.css` - Home
- `style_login.css` - Login
- `style_welcome.css` - Páginas de bienvenida
- `style_gestion.css` - Páginas de gestión
- `style_solicitar_acceso.css` - Solicitud de acceso

---

## Datos

### Estructura de db.json

```json
{
  "usuarios": [...],
  "colaboradores": [...],
  "tiendas": [...],
  "voluntarios": [...],
  "campanyas": [...]
}
```

---

## Flujo de Navegación

Ver `DIAGRAMA_NAVEGACION.md` para el diagrama completo.

**Resumen:**
- `HOME` → `LOGIN` → `WELCOME_{ROL}` → Páginas de gestión
- Las páginas de gestión pueden volver al `WELCOME_{ROL}` correspondiente
- Los datos se persisten en `localStorage` durante la sesión

---

## Requisitos Funcionales Implementados

- **RF1:** Gestionar Cadena (Añadir, Eliminar, Modificar, Cancelar, Guardar)
- **RF2:** Gestionar Roles (Añadir, Eliminar, Modificar)
- **RF3:** Gestionar Colaboradores (CRUD completo, Exportar Excel, Búsqueda filtrada)
- **RF4:** Gestionar Campaña (Generar, Salir)
- **RF5:** Gestionar Tienda (CRUD, Asignar coordinadores, Búsqueda filtrada)
- **RF6:** Gestionar Asignación de Voluntarios (Añadir, Guardar, Cancelar, Exportar)

---

## Tecnologías Utilizadas

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Fetch API

- **Backend:**
  - Node.js
  - json-server (simulador de API REST)
  - npm

- **Persistencia:**
  - JSON (simulación de base de datos)
  - localStorage (sesiones de cliente)

---

## Archivos de Configuración

### package.json
Define las dependencias del proyecto:
- `json-server@^1.0.0-beta.15` - Servidor API simulado

### LANZAR_BACKEND.txt
Comando rápido para iniciar el servidor:
```bash
npx json-server --port 3001 src/data/db.json
```

---

## Troubleshooting

### El servidor no inicia en puerto 3001
```bash
# Cambiar puerto
npx json-server --port 3002 src/data/db.json
# Y actualizar API_URL en los archivos JS
```

### localStorage no funciona
- Asegúrate de que la aplicación se ejecuta en `http://` o `https://`, no en `file://`
- Usa un servidor local (ver sección Instalación)

### Los datos no se guardan
- Verifica que `src/data/db.json` existe y es válido JSON
- Recarga la página para ver cambios del servidor

### CORS error
- json-server incluye CORS por defecto
- Si aún hay problemas, accede desde `http://localhost:8000`

---

## Documentación Adicional

- `ESTRUCTURA_DIRECTORIOS.md` - Estructura completa de directorios
- `DIAGRAMA_NAVEGACION.md` - Diagrama de flujo de navegación
- `RequisitosFuncionales.txt` - Requisitos del proyecto
- `LANZAR_BACKEND.txt` - Comando para iniciar backend

---

