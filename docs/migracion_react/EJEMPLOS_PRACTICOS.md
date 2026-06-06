# EJEMPLOS PRÁCTICOS DE COMPONENTES
## Código listo para copiar y pegar en cada fase

---

## FASE 1: COMPONENTES BÁSICOS

### Header.jsx
```jsx
import '../styles/header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <img src="/LOGO_BANCOSOL.png" alt="Bancosol" className="logo" />
        <h1>Sistema de Gestión Bancosol</h1>
      </div>
    </header>
  );
}
```

### Footer.jsx
```jsx
import '../styles/footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <img src="/LOGO_BANCOSOL_FOOTER.png" alt="Bancosol" className="logo-footer" />
        <p>&copy; 2024 Bancosol TCAW. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
```

### Button.jsx
```jsx
export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  type = "button",
  className = ""
}) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
    >
      {children}
    </button>
  );
}
```

### Input.jsx
```jsx
export function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  name = "",
  disabled = false
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="form-input"
      />
    </div>
  );
}
```

### Card.jsx
```jsx
export function Card({ 
  title, 
  children, 
  className = "",
  onClick = null 
}) {
  return (
    <div 
      className={`card ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}
```

### index.js (en carpeta components)
```jsx
export { Header } from './Header/Header';
export { Footer } from './Footer/Footer';
export { Button } from './ui/Button';
export { Card } from './ui/Card';
export { Input } from './ui/Input';
```

---

## FASE 2: FORMULARIOS

### Textarea.jsx
```jsx
export function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  name = "",
  required = false,
  disabled = false
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className="form-textarea"
      />
    </div>
  );
}
```

### Select.jsx
```jsx
export function Select({
  label,
  value,
  onChange,
  options = [],
  name = "",
  required = false,
  disabled = false
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="form-select"
      >
        <option value="">-- Selecciona una opción --</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Login.jsx
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Button, Input } from '../../components';

export function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usuario || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setCargando(true);

      // Simular carga de API
      const respuesta = await fetch('/data/db.json');
      const data = await respuesta.json();

      // Buscar usuario
      const usuarioValido = data.usuarios.find(u =>
        u.usuario === usuario && u.clave === password
      );

      if (!usuarioValido) {
        setError('Usuario o contraseña incorrectos');
        return;
      }

      // Guardamos rol en localStorage (por ahora)
      localStorage.setItem('userRole', usuarioValido.rol);
      
      // Redirigir a welcome
      navigate('/welcome');

    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Header />
      <main className="login-container">
        <section className="login-form">
          <h2>Iniciar sesión</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Usuario"
              type="text"
              name="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ejemplo: admin"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />

            <Button type="submit" disabled={cargando}>
              {cargando ? 'Entrando...' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="login-help">
            ¿No tienes cuenta? <a href="/solicitar-acceso">Solicitar acceso</a>
          </p>

          <details className="login-info">
            <summary>📋 Usuarios de prueba</summary>
            <ul>
              <li><strong>admin</strong> / admin</li>
              <li><strong>capitan</strong> / capitan</li>
              <li><strong>coordinador</strong> / coordinador</li>
            </ul>
          </details>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

---

## FASE 3: ESTADO Y LISTAS

### TiendasList.jsx
```jsx
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function TiendasList({ 
  tiendas, 
  onDelete, 
  onEdit,
  cargando = false,
  error = null 
}) {
  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (cargando) {
    return <div className="loading">Cargando tiendas...</div>;
  }

  if (!tiendas || tiendas.length === 0) {
    return <p className="empty-state">No hay tiendas disponibles</p>;
  }

  return (
    <div className="tiendas-grid">
      {tiendas.map((tienda) => (
        <Card 
          key={tienda.id} 
          title={tienda.nombre}
          className="tienda-card"
        >
          <p><strong>Ubicación:</strong> {tienda.ubicacion}</p>
          <p><strong>Coordinador:</strong> {tienda.coordinador}</p>
          
          <div className="card-actions">
            <Link 
              to={`/tienda/${tienda.id}`}
              className="btn btn-small btn-primary"
            >
              Ver detalle
            </Link>
            {onEdit && (
              <Button 
                onClick={() => onEdit(tienda)}
                className="btn-small btn-secondary"
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button 
                onClick={() => {
                  if (window.confirm(`¿Eliminar "${tienda.nombre}"?`)) {
                    onDelete(tienda.id);
                  }
                }}
                className="btn-small btn-danger"
              >
                Eliminar
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### Tiendas.jsx (Página CRUD)
```jsx
import { useState, useEffect } from 'react';
import { Header, Footer, Button, Card, Input } from '../../components';
import { TiendasList } from '../../components/TiendasList/TiendasList';

const TIENDAS_INICIALES = [
  { 
    id: 1, 
    nombre: 'Carrefour Centro', 
    ubicacion: 'Málaga Centro', 
    coordinador: 'Juan'
  },
  { 
    id: 2, 
    nombre: 'Carrefour Este', 
    ubicacion: 'Málaga Este', 
    coordinador: 'María'
  }
];

export function Tiendas() {
  const [tiendas, setTiendas] = useState(TIENDAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tiendaEdicion, setTiendaEdicion] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    ubicacion: '',
    coordinador: ''
  });

  // Filtrar tiendas
  const tiendasFiltradas = tiendas.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAgregar = () => {
    if (!formulario.nombre || !formulario.ubicacion) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (tiendaEdicion) {
      // Actualizar tienda existente
      setTiendas(tiendas.map(t =>
        t.id === tiendaEdicion.id
          ? { ...tiendaEdicion, ...formulario }
          : t
      ));
      setTiendaEdicion(null);
    } else {
      // Agregar nueva tienda
      setTiendas([...tiendas, {
        ...formulario,
        id: Date.now()
      }]);
    }

    setFormulario({ nombre: '', ubicacion: '', coordinador: '' });
    setModoEdicion(false);
  };

  const handleEditar = (tienda) => {
    setTiendaEdicion(tienda);
    setFormulario({
      nombre: tienda.nombre,
      ubicacion: tienda.ubicacion,
      coordinador: tienda.coordinador
    });
    setModoEdicion(true);
  };

  const handleEliminar = (tiendaId) => {
    setTiendas(tiendas.filter(t => t.id !== tiendaId));
  };

  const handleCancelar = () => {
    setFormulario({ nombre: '', ubicacion: '', coordinador: '' });
    setTiendaEdicion(null);
    setModoEdicion(false);
  };

  return (
    <>
      <Header />
      <main className="gestion-container">
        <h2>Gestión de Tiendas</h2>

        {/* Botón agregar */}
        {!modoEdicion && (
          <Button onClick={() => setModoEdicion(true)}>
            + Agregar tienda
          </Button>
        )}

        {/* Formulario */}
        {modoEdicion && (
          <Card title={tiendaEdicion ? 'Editar tienda' : 'Nueva tienda'} className="form-card">
            <Input
              label="Nombre"
              value={formulario.nombre}
              onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              placeholder="Nombre de la tienda"
              required
            />

            <Input
              label="Ubicación"
              value={formulario.ubicacion}
              onChange={(e) => setFormulario({ ...formulario, ubicacion: e.target.value })}
              placeholder="Ubicación"
              required
            />

            <Input
              label="Coordinador"
              value={formulario.coordinador}
              onChange={(e) => setFormulario({ ...formulario, coordinador: e.target.value })}
              placeholder="Nombre del coordinador"
            />

            <div className="form-buttons">
              <Button onClick={handleAgregar} className="btn-primary">
                {tiendaEdicion ? 'Actualizar' : 'Guardar'}
              </Button>
              <Button onClick={handleCancelar} className="btn-secondary">
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Búsqueda */}
        <div className="search-section">
          <Input
            type="text"
            placeholder="Buscar tienda..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Lista */}
        <TiendasList
          tiendas={tiendasFiltradas}
          onEdit={handleEditar}
          onDelete={handleEliminar}
        />
      </main>
      <Footer />
    </>
  );
}
```

---

## FASE 4: CUSTOM HOOKS

### useLocalStorage.js
```jsx
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### useFetch.js
```jsx
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setStatus('pending');
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setStatus('success');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };

    fetchData();
  }, [url]);

  return { status, data, error };
}
```

---

## FASE 5: ROUTING

### App.jsx (Estructura completa)
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Páginas
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { SolicitarAcceso } from './pages/SolicitarAcceso/SolicitarAcceso';
import { Welcome } from './pages/Welcome/Welcome';
import { Tiendas } from './pages/Gestion/Tiendas/Tiendas';
import { NotFound } from './pages/NotFound/NotFound';

// Componentes
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { GestionLayout } from './layouts/GestionLayout';

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/solicitar-acceso" element={<SolicitarAcceso />} />

      {/* Protegidas */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Anidadas con layout */}
        <Route element={<GestionLayout />}>
          <Route path="/tiendas" element={<Tiendas />} />
          {/* Agregar más rutas aquí */}
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    const userRole = localStorage.getItem('userRole');
    setIsAuthenticated(!!userRole);
    setCargando(false);
  }, []);

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </BrowserRouter>
  );
}
```

### ProtectedRoute.jsx
```jsx
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

### GestionLayout.jsx
```jsx
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { SidebarGestion } from '../components/SidebarGestion/SidebarGestion';

export function GestionLayout() {
  return (
    <>
      <Header />
      <div className="gestion-layout">
        <SidebarGestion />
        <main className="gestion-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
```

---

## FASE 6: AUTENTICACIÓN

### AuthContext.jsx
```jsx
import { createContext } from 'react';

export const AuthContext = createContext(null);
```

### AuthProvider.jsx
```jsx
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem('user');
    const tokenGuardado = sessionStorage.getItem('token');

    if (usuarioGuardado && tokenGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
        setEstaAutenticado(true);
      } catch (err) {
        console.error('Error al restaurar sesión:', err);
        sessionStorage.clear();
      }
    }

    setCargando(false);
  }, []);

  const login = (userData, authToken) => {
    console.log('Login:', userData.usuario);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', authToken);
    setUsuario(userData);
    setToken(authToken);
    setEstaAutenticado(true);
  };

  const logout = () => {
    console.log('Logout');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUsuario(null);
    setToken(null);
    setEstaAutenticado(false);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      estaAutenticado,
      token,
      cargando,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### useAuth.js
```jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
```

---

**Estos ejemplos son el código base para cada fase. Cópialos y ajústalos según tus necesidades.** 🚀
