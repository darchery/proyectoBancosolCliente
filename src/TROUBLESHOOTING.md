# GUÍA DE TROUBLESHOOTING - Reorganización de Bancosol

## Si algo no funciona después de la reorganización:

### 1. Los estilos CSS no se cargan

**Síntoma:** La página se ve sin estilos/bordes/colores

**Verificar:**
- En DevTools (F12), ir a Network tab
- Buscar las peticiones de CSS que muestren status 404
- Verificar que las rutas coincidan con:
  ```
  /src/assets/css/style_*.css
  /src/components/header/header_comun.css
  /src/components/footer/footer_comun.css
  ```

**Solución:**
- Contar cuántos `../` se necesitan desde tu archivo HTML actual
- Desde profundidad 2 (ejemplo: `pages/gestion/colaboradores/`): necesitas `../../assets/css/`
- Desde profundidad 1 (ejemplo: `pages/login/`): necesitas `../assets/css/`

### 2. Los botones de navegación no funcionan

**Síntoma:** Los botones redirigen a 404 o a la página equivocada

**Verificar:**
- En DevTools Console (F12), ver si hay errores
- Buscar logs que digan "Cannot find" o rutas inválidas

**Solución:**
- Comprobar que en los archivos JS de welcome están estas rutas:
  ```javascript
  'tiendas': '../gestion/tiendas/gestionar_tiendas.html'
  'colaboradores': '../gestion/colaboradores/gestionar_colaboradores.html'
  'login': '../login/index_login.html'
  ```

### 3. El login no funciona (usuarios.json no se encuentra)

**Síntoma:** Error "Cannot fetch usuarios.json" en la consola

**Verificar:**
- En `src/pages/login/login.js` línea 39
- Debe ser: `const respuesta = await fetch('../../data/usuarios.json');`

**Solución:**
- Si está `fetch('usuarios.json')` o `fetch('/src/data/usuarios.json')`, actualizar a ruta relativa
- Contar desde la profundidad: `pages/login/login.js` → sube 2 niveles → `../../data/usuarios.json`

### 4. Header o Footer no aparecen

**Síntoma:** La página carga pero header/footer están vacíos

**Verificar:**
- En DevTools Network, verificar que `header_comun.html` y `footer_comun.js` se cargan
- Buscar errores en la consola sobre las rutas

**Solución:**
- Las rutas en HTML deben apuntar a:
  ```html
  <script src="../../components/header/header_comun.js"></script>
  <script src="../../components/footer/footer_comun.js"></script>
  ```
- Las rutas en JS del componente deben apuntar a:
  ```javascript
  importarHTML('/src/components/header/header_comun.html', ...)
  importarHTML('/src/components/footer/footer_comun.html', ...)
  ```

### 5. Las imágenes (logo) no se ven

**Síntoma:** Falta el logo de Bancosol

**Verificar:**
- Los paths a imágenes desde cualquier profundidad deben usar `/images/`
- Esto es una ruta absoluta desde la raíz del proyecto

**Verificar que existe:**
- `src/assets/images/LOGO_BANCOSOL_FOOTER.png`
- `src/assets/images/LOGO_BANCOSOL.png` 

### 6. Errores de rutas en archivos de gestión

**Síntoma:** Botones o redirecciones en módulos de gestión no funcionan

**Verificar rutas esperadas:**
```javascript
// En src/pages/gestion/*/gestion_*.js
// Las rutas deben apuntar a welcome pages como:
'../../welcome/welcome_admin.html'

// Y a páginas de login como:
'../../login/index_login.html'
```

---

## Rutas rápidas de referencia

### Profundidad 1 (ejemplo: src/pages/login/)
```
./ = src/pages/login/
../ = src/pages/
../../ = src/
../../../ = proyectoBancosolCliente/
```

### Profundidad 2 (ejemplo: src/pages/gestion/colaboradores/)
```
./ = src/pages/gestion/colaboradores/
../ = src/pages/gestion/
../../ = src/pages/
../../../ = src/
../../../../ = proyectoBancosolCliente/
```

### Profundidad 3 (ejemplo: src/pages/gestion/asignacion-voluntarios/)
```
./ = src/pages/gestion/asignacion-voluntarios/
../ = src/pages/gestion/
../../ = src/pages/
../../../ = src/
../../../../ = proyectoBancosolCliente/
```

---

## Validar que todo funciona

1. **Abrir DevTools** (F12)
2. **Ir a Network tab**
3. **Recargar página** (Ctrl+R o Cmd+R)
4. **No debe haber 404s** rojo para CSS, JS, imágenes
5. **Console tab** no debe mostrar errores rojo

Si todo es verde/gris: ¡funciona perfectamente! 🎉

---

## Estructura final esperada

```
src/
├── assets/css/             ← 7 CSS files
├── components/
│   ├── header/             ← 3 archivos
│   └── footer/             ← 3 archivos
├── data/                   ← usuarios.json, datos.json
└── pages/
    ├── home/               ← 2 archivos
    ├── login/              ← 2 archivos
    ├── solicitar-acceso/   ← 2 archivos
    ├── welcome/            ← 13 archivos (welcome.js + 6 roles)
    └── gestion/
        ├── asignacion-voluntarios/
        ├── bandeja-entrada/
        ├── campanyas/
        ├── colaboradores/
        ├── coordinadores/
        └── tiendas/
```

Total: 17 carpetas, 40+ archivos

---

## Comandos útiles para debugging

### Ver estructura de carpetas
```bash
tree src/ -L 3
```

### Buscar rutas antiguas (no debería encontrar nada)
```bash
grep -r "GestionDatos\|GestionWelcome\|GestionPaginasIniciales" src/pages/
```

### Buscar fetch calls
```bash
grep -r "fetch" src/pages/ --include="*.js"
```

### Buscar referencias a archivos CSS
```bash
grep -r "\.css" src/pages/ --include="*.html"
```

---

## Contacto

Si algo sigue sin funcionar, verificar:
1. Que NO hay espacios en blanco en rutas
2. Que mayúsculas/minúsculas son correctas (Linux/Mac son case-sensitive)
3. Que los archivos existen en sus ubicaciones esperadas
4. Que las comillas HTML son correctas (no `` sino `"`)
