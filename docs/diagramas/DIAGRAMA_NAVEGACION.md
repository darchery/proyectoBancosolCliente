```text
HOME
 ├─ [Iniciar sesión] ──► LOGIN
 │  ├─ [Entrar] ──► WELCOME_ADMIN
 │  │  ├─ [Tiendas] ─► gestion_tiendas ◄ WELCOME_ADMIN
 │  │  ├─ [Colaboradores] ─► gestion_colab ◄ WELCOME_ADMIN
 │  │  ├─ [Coordinadores] ─► gestion_coord ◄ WELCOME_ADMIN
 │  │  ├─ [Voluntarios] ─► asign_volunt ◄ WELCOME_ADMIN
 │  │  ├─ [Campaña] ─► gestion_campanya ◄ WELCOME_ADMIN
 │  │  ├─ [Bandeja] ─► gestion_bandeja ◄ WELCOME_ADMIN
 │  │  └─ [Cerrar sesión] ──► LOGIN
 │  │
 │  ├─ [Entrar] ──► WELCOME_CAPITAN
 │  │  ├─ [Tiendas] ─► gestion_tiendas ◄ WELCOME_CAPITAN
 │  │  ├─ [Colaboradores] ─► gestion_colab ◄ WELCOME_CAPITAN
 │  │  └─ [Cerrar sesión] ──► LOGIN
 │  │
 │  ├─ [Entrar] ──► WELCOME_COORDINADOR
 │  │  ├─ [Tiendas] ─► gestion_tiendas ◄ WELCOME_COORD
 │  │  ├─ [Colaboradores] ─► gestion_colab ◄ WELCOME_COORD
 │  │  ├─ [Voluntarios] ─► asign_volunt ◄ WELCOME_COORD
 │  │  └─ [Cerrar sesión] ──► LOGIN
 │  │
 │  ├─ [Entrar] ──► WELCOME_CAP+COORD
 │  │  ├─ [Tiendas] ─► gestion_tiendas ◄ WELCOME_C+C
 │  │  ├─ [Colaboradores] ─► gestion_colab ◄ WELCOME_C+C
 │  │  ├─ [Bandeja] ─► gestion_bandeja ◄ WELCOME_C+C
 │  │  └─ [Cerrar sesión] ──► LOGIN
 │  │
 │  ├─ [Entrar] ──► WELCOME_ENT_COLAB
 │  │  ├─ [Tiendas] ─► gestion_tiendas ◄ WELCOME_ENT
 │  │  ├─ [Colaboradores] ─► gestion_colab ◄ WELCOME_ENT
 │  │  └─ [Cerrar sesión] ──► LOGIN
 │  │
 │  ├─ [Entrar] ──► WELCOME_RESP_TIENDA
 │  │  ├─ [Tiendas] ─► gestion_tiendas ◄ WELCOME_RESP
 │  │  ├─ [Colaboradores] ─► gestion_colab ◄ WELCOME_RESP
 │  │  └─ [Cerrar sesión] ──► LOGIN
 │  │
 │  └─ [Volver inicio] ──► HOME
 │
 └─ [Solicitar acceso] ──► SOLICITAR_ACCESO (terminal)
```

### LEYENDA
*   `►` : Navegación hacia adelante (clic en botón/enlace).
*   `◄` : Botón [Menú Principal] que vuelve al welcome correspondiente.
*   `[Algo]` : Elemento clickeable (botón o enlace).
*   `ALGO` : Nombre de la página HTML.
*   `──►` : Redirección con `localStorage.setItem` previo (login).
*   `(terminal)` : Página sin salida programática.
