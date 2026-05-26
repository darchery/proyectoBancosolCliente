# GUÍA RÁPIDA DE REFERENCIA - REACT
## Para usar durante la migración

---

## PARTE 1: COMPONENTES Y JSX

### Estructura básica de componente
```jsx
import { Header } from '../../components';

export function MiComponente() {
  return (
    <div className="contenedor">
      <Header />
      <p>Contenido</p>
    </div>
  );
}
```

### Reglas JSX importantes
✅ **Nombres de componentes con mayúscula:** `<Header />` ✓  
❌ **No:** `<header />` (es HTML puro)

✅ **className en lugar de class:** `<div className="box">`  
❌ **No:** `<div class="box">`

✅ **Etiquetas autocierre:** `<img />`  
❌ **No:** `<img>` (sin cierre)

✅ **Expresiones en llaves:** `<p>{variable}</p>`  
❌ **No:** `<p>{if (x) y}</p>` (sentencias no permitidas)

### Retornar múltiples elementos
```jsx
// ✓ Opción 1: Fragment <>
export function Component() {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  );
}

// ✓ Opción 2: Div
export function Component() {
  return (
    <div>
      <h1>Título</h1>
      <p>Párrafo</p>
    </div>
  );
}
```

### Props
```jsx
// Pasar props
<Button texto="Click aquí" color="blue" onClick={handleClick} />

// Recibir props con destructuring
export function Button({ texto, color = "gray", onClick }) {
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}>
      {texto}
    </button>
  );
}
```

### Renderizar listas
```jsx
const items = [
  { id: 1, nombre: 'Item 1' },
  { id: 2, nombre: 'Item 2' }
];

export function Lista() {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.nombre}</li>  {/* ⚠️ key es obligatorio */}
      ))}
    </ul>
  );
}
```

### Renderizado condicional
```jsx
// Opción 1: if/else
export function Component({ mostrar }) {
  if (!mostrar) return null;
  return <p>Visible</p>;
}

// Opción 2: Ternario
export function Component({ mostrar }) {
  return mostrar ? <p>Visible</p> : null;
}

// Opción 3: AND lógico (&&)
export function Component({ mostrar }) {
  return mostrar && <p>Visible</p>;
}
```

---

## PARTE 2: EVENT HANDLERS Y FORMULARIOS

### Event handlers básicos
```jsx
export function Component() {
  const handleClick = () => {
    console.log('Clickeado');
  };

  const handleChange = (e) => {
    console.log('Valor:', e.target.value);
  };

  return (
    <>
      <button onClick={handleClick}>Click</button>
      <input onChange={handleChange} />
    </>
  );
}
```

### Input controlado (state-driven)
```jsx
import { useState } from 'react';

export function Formulario() {
  const [nombre, setNombre] = useState('');

  const handleChange = (e) => {
    setNombre(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviado:', nombre);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={handleChange} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Manejo de múltiples inputs
```jsx
const [formData, setFormData] = useState({
  nombre: '',
  email: '',
  edad: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

return (
  <form>
    <input name="nombre" value={formData.nombre} onChange={handleChange} />
    <input name="email" value={formData.email} onChange={handleChange} />
    <input name="edad" value={formData.edad} onChange={handleChange} />
  </form>
);
```

### e.preventDefault()
```jsx
const handleSubmit = (e) => {
  e.preventDefault(); // Prevenir recarga de página
  console.log('Formulario enviado');
};

return <form onSubmit={handleSubmit}>...</form>;
```

---

## PARTE 3: ESTADO CON useState Y useEffect

### useState - Crear estado
```jsx
import { useState } from 'react';

export function Contador() {
  const [count, setCount] = useState(0);  // [estado, setter]

  return (
    <>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
}
```

### useState - Actualizar objetos
```jsx
const [usuario, setUsuario] = useState({
  nombre: 'Juan',
  email: 'juan@example.com'
});

// ✓ CORRECTO: spread operator
setUsuario({
  ...usuario,
  nombre: 'Pedro'
});

// ❌ INCORRECTO: No mutes directo
usuario.nombre = 'Pedro'; // ¡MAL!
```

### useState - Actualizar arrays
```jsx
const [items, setItems] = useState([
  { id: 1, nombre: 'Item 1' }
]);

// ✓ Agregar
setItems([...items, { id: 2, nombre: 'Item 2' }]);

// ✓ Eliminar
setItems(items.filter(item => item.id !== 1));

// ✓ Actualizar
setItems(items.map(item =>
  item.id === 1 ? { ...item, nombre: 'Actualizado' } : item
));
```

### useEffect - Ejecutar código después de render
```jsx
import { useEffect, useState } from 'react';

export function Componente() {
  const [datos, setDatos] = useState(null);

  // Se ejecuta después de CADA render
  useEffect(() => {
    console.log('Componente renderizado');
  }); // Sin dependencias

  // Se ejecuta solo al MONTAR
  useEffect(() => {
    console.log('Componente montado');
    return () => console.log('Componente desmontado');
  }, []); // Dependencias vacías

  // Se ejecuta cuando 'datos' CAMBIA
  useEffect(() => {
    console.log('Datos cambió:', datos);
  }, [datos]); // Incluir en dependencias

  return <div>Contenido</div>;
}
```

### useEffect - Cargar datos
```jsx
useEffect(() => {
  const cargarDatos = async () => {
    try {
      const respuesta = await fetch('/api/datos');
      const data = await respuesta.json();
      setDatos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  cargarDatos();
}, []); // Solo al montar
```

### useEffect - Limpieza (cleanup)
```jsx
useEffect(() => {
  const intervalo = setInterval(() => {
    console.log('Cada 2 segundos');
  }, 2000);

  // Retornar función de limpieza
  return () => {
    clearInterval(intervalo); // Prevenir memory leaks
  };
}, []);
```

---

## PARTE 4: HOOKS AVANZADOS

### useRef - Acceder a DOM
```jsx
import { useRef } from 'react';

export function Componente() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus(); // Dar foco al input
    console.log(inputRef.current.value);
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Enfoque</button>
    </>
  );
}
```

### useCallback - Memorizar función
```jsx
import { useCallback } from 'react';

export function Padre() {
  const handleClick = useCallback(() => {
    console.log('Clickeado');
  }, []); // Dependencias

  // handleClick es la misma función entre renders
  return <Hijo onClick={handleClick} />;
}
```

### useMemo - Memorizar valor
```jsx
import { useMemo } from 'react';

export function Componente({ items }) {
  // Calcular solo si 'items' cambia
  const total = useMemo(() => {
    console.log('Recalculando...');
    return items.reduce((sum, item) => sum + item.valor, 0);
  }, [items]);

  return <p>Total: {total}</p>;
}
```

### Custom hook - useLocalStorage
```jsx
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setStoredValue = (value) => {
    setValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setStoredValue];
}

// Uso:
const [nombre, setNombre] = useLocalStorage('nombre', 'Juan');
```

---

## PARTE 5: REACT ROUTER

### Configuración básica
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navegación con Link
```jsx
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

### Navegación programática con useNavigate
```jsx
import { useNavigate } from 'react-router-dom';

export function Componente() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  };

  return <button onClick={handleClick}>Ir a Home</button>;
}
```

### Parámetros de ruta
```jsx
// Definir ruta con parámetro
<Route path="/producto/:id" element={<ProductoDetalle />} />

// Obtener parámetro en componente
import { useParams } from 'react-router-dom';

export function ProductoDetalle() {
  const { id } = useParams();
  return <p>Producto ID: {id}</p>;
}

// Link con parámetro
<Link to={`/producto/${producto.id}`}>Ver</Link>
```

### Rutas protegidas
```jsx
import { Outlet, Navigate } from 'react-router-dom';

export function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// En App.jsx
<Route element={<ProtectedRoute isAuthenticated={isAuth} />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/perfil" element={<Perfil />} />
</Route>
```

### Rutas anidadas
```jsx
<Route path="/admin" element={<AdminLayout />}>
  <Route path="usuarios" element={<Usuarios />} />
  <Route path="productos" element={<Productos />} />
</Route>

// AdminLayout.jsx
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet /> {/* Las subrutas se renderizan aquí */}
      </main>
    </div>
  );
}
```

---

## PARTE 6: CONTEXT API Y AUTENTICACIÓN

### Crear Context
```jsx
import { createContext } from 'react';

export const MiContext = createContext(null);
```

### Provider
```jsx
import { useState } from 'react';
import { MiContext } from './MiContext';

export function MiProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const valor = {
    usuario,
    setUsuario
  };

  return (
    <MiContext.Provider value={valor}>
      {children}
    </MiContext.Provider>
  );
}
```

### Usar Context con useContext
```jsx
import { useContext } from 'react';
import { MiContext } from './MiContext';

export function Componente() {
  const { usuario, setUsuario } = useContext(MiContext);

  return (
    <>
      <p>Usuario: {usuario?.nombre}</p>
      <button onClick={() => setUsuario({ nombre: 'Juan' })}>
        Set Usuario
      </button>
    </>
  );
}
```

### Custom hook para Context
```jsx
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// Uso:
const { usuario, login, logout } = useAuth();
```

---

## TIPS Y TRUCOS

### Debugging
```jsx
// Console.log en renders
console.log('Componente renderizado');

// Usar React DevTools
// Instala extensión de Chrome/Firefox

// Breakpoints
debugger; // En cualquier línea de código
```

### Performance - Evitar renders innecesarios
```jsx
import { memo } from 'react';

// Componente que no re-renderiza si props iguales
const MiComponente = memo(function MiComponente({ nombre }) {
  console.log('Renderizando:', nombre);
  return <p>{nombre}</p>;
});
```

### Prevención de errores - Optional chaining
```jsx
// ✓ CORRECTO
const nombre = usuario?.perfil?.nombre;
const tel = contacto?.telefonos?.[0];

// ❌ INCORRECTO - Error si usuario es null
const nombre = usuario.perfil.nombre;
```

### Conversiones de tipo útiles
```jsx
// Booleano
const estaAutenticado = !!usuario; // true si usuario existe

// String a número
const cantidad = parseInt(input); // 10
const decimal = parseFloat(input); // 10.5

// Número a string
const texto = cantidad.toString();
```

### Spread operator para actualizar estado
```jsx
// Arrays
setItems([...items, nuevoItem]);

// Objetos
setUsuario({ ...usuario, nombre: 'Nuevo' });

// Merge de objetos
const obj = { ...obj1, ...obj2 }; // obj2 sobrescribe obj1
```

---

## CHECKLIST: ¿Cuándo usar cada hook?

| Problema | Solución |
|----------|----------|
| Guardar datos que cambian | `useState` |
| Ejecutar código after render | `useEffect` |
| Acceder a DOM directo | `useRef` |
| Evitar re-renders del hijo | `useCallback` |
| Cálculos pesados | `useMemo` |
| Datos compartidos (global state) | `useContext` |
| Lógica reutilizable | Custom hook |
| Navegación entre páginas | `react-router-dom` |
| Proteger rutas | `ProtectedRoute` + Context |

---

## ERRORES COMUNES

### ❌ Error: Estado no actualiza
```jsx
// INCORRECTO
usuario.nombre = 'Nuevo'; // Mutación directa
setUsuario(usuario);

// CORRECTO
setUsuario({ ...usuario, nombre: 'Nuevo' });
```

### ❌ Error: Infinite loop en useEffect
```jsx
// INCORRECTO
useEffect(() => {
  setItems([...items, nuevoItem]);
}, [items]); // Cada cambio de items causa effect

// CORRECTO
useEffect(() => {
  cargarDatos();
}, []); // Solo al montar
```

### ❌ Error: 'this' es undefined
```jsx
// INCORRECTO (class component)
handleClick() { // falta bind
  this.setState(...);
}

// CORRECTO (functional component)
const handleClick = () => {
  setState(...);
};
```

### ❌ Error: Key warnings en listas
```jsx
// INCORRECTO
{items.map((item, index) => (
  <div key={index}>{item}</div> // Usar index es malo
))}

// CORRECTO
{items.map((item) => (
  <div key={item.id}>{item}</div> // Usar ID único
))}
```

### ❌ Error: useContext fuera de Provider
```jsx
// INCORRECTO
<useAuth /> // Error: Not inside AuthProvider

// CORRECTO
<AuthProvider>
  <App /> {/* Ahora useAuth() funciona */}
</AuthProvider>
```

---

## RECURSOS RÁPIDOS

- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Temario del proyecto: `/temario_react/`
- Plan completo: `/PLAN_MIGRACION_REACT.md`

¡Buena suerte en la migración! 🚀
