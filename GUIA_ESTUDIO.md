# GUÍA DE ESTUDIO Y APRENDIZAJE
## Cómo aprovechar mejor el plan de migración

---

## 📖 CÓMO ESTUDIAR CADA FASE

### Paso 1: Lee el temario (30 min)
**ANTES de empezar a codificar, lee:**
- Temario correspondiente a la fase
- PLAN_MIGRACION_REACT.md para esa fase
- GUIA_RAPIDA_REACT.md section relevante

**Objetivo:** Entender el concepto, no memorizar sintaxis

### Paso 2: Estudia ejemplos (20 min)
**En EJEMPLOS_PRACTICOS.md:**
- Lee el código
- Entiende qué hace cada línea
- Hazlo preguntas: ¿por qué aquí y no allá?

### Paso 3: Código junto (1-2 horas)
**Abre dos ventanas:**
- Izquierda: VS Code con tu proyecto
- Derecha: EJEMPLOS_PRACTICOS.md o temario

**NO copies/pegas:**
- Escribe cada línea manualmente
- Entiende qué hace cada variable
- Si necesitas variable/función, ve y aprende por qué se usa

### Paso 4: Testea (30 min)
**Después de escribir:**
- `npm start`
- ¿Qué se ve? ¿Qué esperabas ver?
- Abre DevTools (F12) y revisa console
- Experimenta: cambia valores, observa qué pasa

### Paso 5: Commit Git (10 min)
```bash
git add .
git commit -m "Fase X: [descripción]"
```

**Ejemplo:**
```
git commit -m "Fase 1: Crear componentes Header, Footer, Button"
```

---

## 🎯 OBJETIVOS DE CADA FASE

### ✅ FASE 0: Preparación
**Objetivo:** Entorno funcionando sin errores

**Verificar:**
```bash
npm start  # Sin errores
```

**Éxito:** ✓ Header, Footer, contenido se ven

---

### ✅ FASE 1: Fundamentos
**Objetivo:** Entender componentes, props, JSX

**Preguntas a responder:**
1. ¿Qué es un componente?
2. ¿Por qué se llama JSX?
3. ¿Cómo paso datos entre componentes?
4. ¿Cuál es la diferencia entre export default y export named?
5. ¿Cómo renderizo una lista con .map()?

**Verificar:**
- [ ] Los 5 componentes básicos funcionan
- [ ] Puedo pasar props y se renderean
- [ ] Las listas se muestran sin warnings
- [ ] Los estilos CSS se aplican

**Éxito:** ✓ Página Home muestra Header + contenido + Footer con estilos

---

### ✅ FASE 2: Interactividad
**Objetivo:** Entender event handlers y formularios controlados

**Preguntas a responder:**
1. ¿Qué es un event handler?
2. ¿Cuál es la diferencia entre onClick y onChange?
3. ¿Qué significa "input controlado"?
4. ¿Para qué sirve e.preventDefault()?
5. ¿Cómo paso datos desde un hijo al padre?

**Verificar:**
- [ ] Login form funciona
- [ ] Inputs responden a cambios
- [ ] onSubmit valida y procesa datos
- [ ] Navegación funciona

**Éxito:** ✓ Puedo escribir en inputs y el formulario responde

---

### ✅ FASE 3: Estado
**Objetivo:** Entender useState y useEffect

**Preguntas a responder:**
1. ¿Cuál es la diferencia entre useState y una variable normal?
2. ¿Por qué no puedo mutar estado directamente?
3. ¿Cuándo se ejecuta useEffect?
4. ¿Para qué sirve el array de dependencias?
5. ¿Qué es "lifting state up"?

**Verificar:**
- [ ] useState actualiza el componente
- [ ] CRUD (agregar, eliminar) funciona
- [ ] Búsqueda filtra correctamente
- [ ] useEffect carga datos

**Éxito:** ✓ Puedo agregar/eliminar tiendas y colaboradores

---

### ✅ FASE 4: Avanzado
**Objetivo:** Optimización y reutilización

**Preguntas a responder:**
1. ¿Cuándo usar useRef vs useState?
2. ¿Por qué useCallback memoriza funciones?
3. ¿Cuál es la diferencia entre useMemo y useCallback?
4. ¿Cómo creo un custom hook?
5. ¿Cuándo debo optimizar?

**Verificar:**
- [ ] useRef funciona (focus en inputs)
- [ ] Custom hooks se reutilizan
- [ ] No hay memory leaks

**Éxito:** ✓ Custom hooks funcionan en múltiples páginas

---

### ✅ FASE 5: Routing
**Objetivo:** Navegación SPA

**Preguntas a responder:**
1. ¿Cuál es la diferencia entre Link y useNavigate()?
2. ¿Cómo protejo rutas?
3. ¿Para qué sirven los parámetros dinámicos (:id)?
4. ¿Qué es Outlet?
5. ¿Cómo hago rutas anidadas?

**Verificar:**
- [ ] Link navega sin recargar página
- [ ] URL cambia sin recargar
- [ ] ProtectedRoute redirige a login
- [ ] Parámetros dinámicos funcionan

**Éxito:** ✓ Puedo navegar entre todas las páginas sin recargas

---

### ✅ FASE 6: Autenticación
**Objetivo:** Context API y autenticación

**Preguntas a responder:**
1. ¿Cuál es la diferencia entre Props Drilling y Context?
2. ¿Cómo creo un Provider?
3. ¿Para qué sirve useContext?
4. ¿Cómo implemento un custom hook useAuth?
5. ¿Cómo persisto la sesión?

**Verificar:**
- [ ] Login funciona
- [ ] Sesión persiste al F5
- [ ] Logout limpia sesión
- [ ] useAuth funciona en cualquier componente
- [ ] Permisos por rol funcionan

**Éxito:** ✓ Sistema de autenticación completo funcionando

---

### ✅ FASE 7: Integración
**Objetivo:** CRUD completo con todas las características

**Verificar:**
- [ ] CRUD completo en todas las páginas
- [ ] Búsqueda y filtrado funcionan
- [ ] Exportar a Excel funciona
- [ ] Validaciones funcionan
- [ ] Sin warnings en console

**Éxito:** ✓ Aplicación completa migrada a React

---

## 🧠 TÉCNICAS DE APRENDIZAJE

### Técnica 1: Enseña a otros
**¿Entiendes algo? Explícalo en voz alta o escribe:**
- "useState crea una variable que cuando cambia, React re-renderiza"
- "useEffect se ejecuta después del render, útil para cargar datos"
- "Context permite compartir datos sin prop drilling"

Si no puedes explicarlo, no lo entiendes aún.

### Técnica 2: Experimenta
**Después de cada componente, prueba:**
```jsx
// ¿Qué pasa si...?
const [x, setX] = useState([]); // Array
const [y, setY] = useState({}); // Objeto
const [z, setZ] = useState(() => {}); // Función lazy

// ¿Cuál es la diferencia?
const var1 = miArray; // ¿Por qué esto no funciona bien?
const var2 = [...miArray]; // ¿Y así?
```

### Técnica 3: Lee código de otros
**Cuando algo no funciona:**
1. Copia el ejemplo de EJEMPLOS_PRACTICOS.md línea por línea
2. Compara con tu código
3. Identifica qué es diferente
4. Aprende el patrón

### Técnica 4: Documentación = Mejor amigo
**Cuando no entiendas algo:**
- React Docs: https://react.dev (muy buenos)
- React Router: https://reactrouter.com
- Temario del proyecto: `/temario_react/`

**Busca en Google:**
```
"react useState example"
"react useEffect fetch data"
"react router protected route"
```

### Técnica 5: Debugging paso a paso
**Usa console.log abundantemente:**
```jsx
const handleClick = () => {
  console.log('Función llamada');
  console.log('Valor actual:', valor);
  
  // Breakpoint
  debugger;
  
  setValor(valor + 1);
  console.log('Estado actualizado');
};
```

**Abre DevTools (F12):**
- Pestaña "Console" para logs
- Pestaña "Sources" para breakpoints
- Pestaña "React" con extensión React DevTools

---

## 📊 RITMO DE TRABAJO RECOMENDADO

### Plan de 8 semanas (40 horas)
```
Semana 1-2: FASE 0 + FASE 1
├─ 5h setup + fundamentos
├─ 3h componentes básicos
└─ 2h experimentation

Semana 2-3: FASE 2 + FASE 3
├─ 5h formularios e interactividad
├─ 5h useState y useEffect
└─ 2h CRUD básico

Semana 4: FASE 4
├─ 3h useRef, useCallback, useMemo
├─ 2h custom hooks
└─ 2h refactoring

Semana 5: FASE 5 + FASE 6
├─ 3h routing
├─ 4h autenticación Context
└─ 2h testing

Semana 6-8: FASE 7
├─ 5h integración completa
├─ 3h validaciones y errores
├─ 2h Excel export
└─ 2h testing final
```

### Plan intensivo de 4 semanas (50 horas)
```
Semana 1: FASE 0-2 (acelerado)
├─ Setup + fundamentos + formularios
└─ 15 horas

Semana 2: FASE 3-4 (acelerado)
├─ Estado + hooks avanzados
└─ 15 horas

Semana 3: FASE 5-6 (acelerado)
├─ Routing + autenticación
└─ 12 horas

Semana 4: FASE 7 (integración)
├─ CRUD completo + testing
└─ 8 horas
```

---

## ✋ CUÁNDO PEDIR AYUDA

**Antes de pedir ayuda, intenta:**
1. Leer el error (console en F12)
2. Buscar el error en Google
3. Revisa GUIA_RAPIDA_REACT.md
4. Experimenta: cambia algo y ve qué pasa
5. Compara con EJEMPLOS_PRACTICOS.md
6. Lee el temario de nuevo

**Si aún no funciona:**
- Describe qué intentas hacer
- ¿Qué esperabas que pasara?
- ¿Qué pasó en cambio?
- ¿Qué error ves en console?
- Muestra el código problemático

---

## 🎁 RECURSOS ADICIONALES

### Videos YouTube (busca estos términos)
- "React Tutorial for Beginners"
- "React Hooks explained"
- "React Router tutorial"
- "React Context API tutorial"

### Práctica adicional
- https://react.dev/learn - Ejemplos interactivos
- https://reactrouter.com/en/main/docs - React Router oficial
- Haz más CRUD: usuarios, posts, comentarios, etc.

### Libros (lecturas recomendadas)
- "Learning React" por Alex Banks & Eve Porcello
- Temario del proyecto (ya incluido)

---

## 🚀 CONSEJOS FINALES

1. **No te apures.** Entender es más importante que velocidad.
2. **Commit frecuentemente.** Así puedes volver si algo se rompe.
3. **Experimenta.** Los mejores aprendizajes vienen de errores.
4. **Escribe limpio.** Código legible es code fácil de entender.
5. **Documenta.** Agrega comentarios explicando por qué, no qué.
6. **Enseña.** Explica a otros lo que aprendiste.
7. **Revisa cambios.** Antes de commit, revisa `git diff`.
8. **Celebra logros.** Cada fase completada es un éxito.

---

## 📋 CHECKLIST SEMANAL

Cada semana, verifica:

- [ ] Entiendo los conceptos de esta semana
- [ ] Puedo explicar cada concepto
- [ ] El código funciona sin errores
- [ ] Los commits están descriptivos
- [ ] No tengo warning en la consola
- [ ] Pasé todos los puntos de verificación
- [ ] Experimenté y probé variaciones
- [ ] Leí la documentación oficial

**Si respondiste "no" a algo, toma tiempo extra para aprenderlo.**

---

¡Éxito en tu aprendizaje React! 🎓

Recuerda: **La programación es como aprender un idioma.**
No esperes comprenderlo todo inmediatamente. 
Práctica consistente > velocidad rápida.

Adelante 💪
