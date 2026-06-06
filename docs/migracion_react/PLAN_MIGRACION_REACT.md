# 📚 PLAN COMPLETO DE MIGRACIÓN A REACT
## Proyecto Bancosol TCAW

**Objetivo:** Migrar la aplicación de Vanilla JavaScript a React, aprendiendo React de forma progresiva usando el temario disponible.

**Duración estimada:** 8-10 semanas (40-50 horas)  
**Metodología:** Aprendizaje por construcción (learning by doing) - Cada sección del temario se aplica directamente al proyecto

---

## 📋 TABLA DE CONTENIDOS

1. [FASE 0: PREPARACIÓN](#fase-0-preparación)
2. [FASE 1: FUNDAMENTOS (Parte 1 del Temario)](#fase-1-fundamentos)
3. [FASE 2: INTERACTIVIDAD (Parte 2 del Temario)](#fase-2-interactividad)
4. [FASE 3: ESTADO (Parte 3 del Temario)](#fase-3-estado)
5. [FASE 4: PATRONES AVANZADOS (Parte 4 del Temario)](#fase-4-patrones-avanzados)
6. [FASE 5: ENRUTAMIENTO (Enrutamiento + React Router)](#fase-5-enrutamiento)
7. [FASE 6: AUTENTICACIÓN (Gestión Autenticación)](#fase-6-autenticación)
8. [FASE 7: INTEGRACIÓN COMPLETA](#fase-7-integración-completa)
9. [VERIFICACIÓN Y TESTING](#verificación-y-testing)

---

# FASE 0: PREPARACIÓN
**Duración:** 2-3 horas | **Dificultad:** ⭐ Baja

## 0.1 Setup inicial del entorno React

### Crear proyecto React desde cero
```bash
# Clonar/crear rama de desarrollo para React
cd /home/lucasdr/Documentos/UNIVERSIDAD/tercero/segundo_semestre/TCAW/proyectoBancosolTCAW

# Crear rama git para la migración
git branch migration/react
git checkout migration/react

# Crear estructura React limpia
npx create-react-app bancosol-react
cd bancosol-react
```

### Dependencias iniciales
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "axios": "^1.x.x"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

**Tareas:**
- [ ] Instalar create-react-app
- [ ] Instalar react-router-dom
- [ ] Instalar axios (para API calls)
- [ ] Copiar archivos CSS desde `src/assets/css/` al proyecto React
- [ ] Copiar imágenes desde `src/assets/images/` al proyecto React
- [ ] Crear estructura de carpetas React:
  ```
  src/
  ├── components/          # Componentes reutilizables
  │   ├── Header/
  │   ├── Footer/
  │   └── ...
  ├── pages/               # Páginas/vistas
  │   ├── Home/
  │   ├── Login/
  │   ├── Welcome/
  │   ├── Gestion/
  │   └── ...
  ├── hooks/               # Custom hooks
  │   ├── useAuth.js
  │   └── ...
  ├── context/             # Context API
  │   ├── AuthContext.js
  │   └── ...
  ├── services/            # Servicios (API, utils)
  │   ├── api.js
  │   ├── authService.js
  │   └── ...
  ├── styles/              # Estilos compartidos
  │   └── ...
  ├── data/                # Datos mock (db.json)
  └── App.jsx
  ```

## 0.2 Copiar datos
**Tareas:**
- [ ] Copiar `src/data/db.json` al nuevo proyecto React
- [ ] Crear servicio `src/services/mockApi.js` para simular json-server
- [ ] Crear `src/services/api.js` con configuración base de fetch

## 0.3 Estudiar el temario (Lectura previa)
**Tareas:**
- [ ] Leer `temario_react/parte1_descripcion_interfaz_usuario.txt` (conceptos: componentes, JSX, props)
- [ ] Hacer notas sobre diferencias HTML vs JSX
- [ ] Identificar qué componentes del proyecto actual pueden ser reutilizables

**Concepto clave de la fase:** Entender que React es declarativo (describes what you want) vs imperativo (describe what to do).

---

# FASE 1: FUNDAMENTOS
## Parte 1 del Temario: "Descripción de interfaz de usuario"
**Duración:** 1 semana | **Dificultad:** ⭐⭐ Baja-Media

### Objetivos de aprendizaje
✅ Definir componentes React  
✅ Usar JSX correctamente  
✅ Pasar props a componentes  
✅ Renderizar listas  
✅ Renderizado condicional  
✅ Exportar/importar componentes

### 1.1 Crear componentes PUROS (sin estado)

**Concepto del temario:** "Los componentes son construcción de bloques de IU reutilizables"

#### 1.1.1 Componente Header
**Archivo:** `src/components/Header/Header.jsx`

```jsx
// ANTES (Vanilla JS en header_comun.js):
// Manipulaba manualmente el DOM

// DESPUÉS (React):
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

**Aprendizajes aplicados:**
- Función que retorna JSX (componente funcional)
- className en lugar de class
- Importar imágenes estáticas

**Tareas:**
- [ ] Crear componente Header
- [ ] Aplicar estilos de `header_comun.css`
- [ ] Verificar que se renderiza correctamente

#### 1.1.2 Componente Footer
**Archivo:** `src/components/Footer/Footer.jsx`

```jsx
export function Footer() {
  return (
    <footer className="footer">
      <img src="/LOGO_BANCOSOL_FOOTER.png" alt="Bancosol" className="logo-footer" />
      <p>&copy; 2024 Bancosol TCAW. Todos los derechos reservados.</p>
    </footer>
  );
}
```

**Tareas:**
- [ ] Crear componente Footer
- [ ] Aplicar estilos de `footer_comun.css`
- [ ] Exportar correctamente

#### 1.1.3 Componente Button reutilizable
**Archivo:** `src/components/ui/Button.jsx`

```jsx
// Demuestra uso de PROPS
export function Button({ children, onClick, disabled = false, type = "button" }) {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn"
    >
      {children}
    </button>
  );
}
```

**Aprendizajes aplicados (del temario):**
- Props como parámetros del componente
- Desestructuración de props `{ children, onClick, ... }`
- Props por defecto
- children como prop especial

**Tareas:**
- [ ] Crear componente Button
- [ ] Usar en múltiples lugares del proyecto
- [ ] Entender por qué esto es mejor que repetir `<button>` muchas veces

#### 1.1.4 Componente Card (para tiendas, colaboradores, etc.)
**Archivo:** `src/components/ui/Card.jsx`

```jsx
export function Card({ title, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}
```

**Tareas:**
- [ ] Crear componente Card
- [ ] Será base para renderizar listados

### 1.2 Renderización condicional

**Concepto del temario:** "A veces también queremos mostrar componentes diferentes según una condición"

#### 1.2.1 Componente RoleBasedButton
**Archivo:** `src/components/RoleBasedButton.jsx`

```jsx
export function RoleBasedButton({ userRole, roleRequired, children, onClick }) {
  // Solo mostrar si el rol del usuario tiene permiso
  if (!roleRequired.includes(userRole)) {
    return null;  // No renderizar nada
  }
  
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
}
```

**Aprendizajes aplicados:**
- Condicionales en componentes (if/else, return null)
- Validación de permisos basada en props

**Tareas:**
- [ ] Crear componente RoleBasedButton
- [ ] Entender control de acceso por rol

#### 1.2.2 Componente condicional: LogoutButton solo si autenticado
**Archivo:** `src/components/LogoutButton.jsx`

```jsx
export function LogoutButton({ isAuthenticated, onLogout }) {
  // Ternario para renderizar condicionalmente
  return isAuthenticated ? (
    <button onClick={onLogout} className="btn btn-logout">
      Cerrar sesión
    </button>
  ) : null;
}
```

**Aprendizajes aplicados:**
- Condicional ternario en JSX
- Props booleanas

**Tareas:**
- [ ] Crear componente LogoutButton
- [ ] Lo usaremos en Header cuando haya autenticación

### 1.3 Renderización de LISTAS

**Concepto del temario:** "Para renderizar listas usamos el método .map()"

#### 1.3.1 Componente TiendasList
**Archivo:** `src/components/TiendasList/TiendasList.jsx`

```jsx
import { Card } from '../ui/Card';

export function TiendasList({ tiendas }) {
  if (!tiendas || tiendas.length === 0) {
    return <p>No hay tiendas disponibles</p>;
  }

  return (
    <div className="tiendas-grid">
      {tiendas.map((tienda) => (
        <Card key={tienda.id} title={tienda.nombre}>
          <p><strong>Ubicación:</strong> {tienda.ubicacion}</p>
          <p><strong>Coordinador:</strong> {tienda.coordinador}</p>
        </Card>
      ))}
    </div>
  );
}
```

**Aprendizajes aplicados (críticos del temario):**
- `.map()` para transformar arrays en elementos JSX
- **Prop `key`** - muy importante para React (optimización de renderizado)
- Renderizado condicional (if tiendas vacío)
- Acceso a propiedades del objeto

**Tareas:**
- [ ] Crear componente TiendasList
- [ ] Entender por qué `key` es importante (leer temario sobre "keys")
- [ ] Testear con datos mock

#### 1.3.2 Componente ColaboradoresList
**Archivo:** `src/components/ColaboradoresList/ColaboradoresList.jsx`

```jsx
import { Card } from '../ui/Card';

export function ColaboradoresList({ colaboradores }) {
  return (
    <div className="colaboradores-list">
      {colaboradores.map((colab) => (
        <Card key={colab.id} title={colab.nombre}>
          <p><strong>Zona:</strong> {colab.zona}</p>
          <p><strong>Localidad:</strong> {colab.localidad}</p>
          <p><strong>Coordinador:</strong> {colab.coord}</p>
          <p><strong>Contacto:</strong> {colab.contacto1?.nombre}</p>
        </Card>
      ))}
    </div>
  );
}
```

**Tareas:**
- [ ] Crear componente ColaboradoresList
- [ ] Usar optional chaining `?.` para contactos

#### 1.3.3 Componente RolesList (para gestión de roles)
**Archivo:** `src/components/RolesList/RolesList.jsx`

```jsx
export function RolesList({ roles, onSelectRole }) {
  return (
    <ul className="roles-list">
      {roles.map((role) => (
        <li key={role.id} onClick={() => onSelectRole(role)}>
          {role.nombre}
        </li>
      ))}
    </ul>
  );
}
```

**Tareas:**
- [ ] Crear componente RolesList
- [ ] Entender paso de callbacks en props (onClick)

### 1.4 Composición de componentes

**Concepto del temario:** "Los componentes pueden contener otros componentes"

#### 1.4.1 Página Home
**Archivo:** `src/pages/Home/Home.jsx`

```jsx
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      
      <main className="home-container">
        <section className="home-content">
          <h2>Bienvenido a Bancosol</h2>
          <p>Sistema de Gestión de Voluntarios y Colaboradores</p>
          
          <div className="home-buttons">
            <Button onClick={() => navigate('/login')}>
              Iniciar sesión
            </Button>
            <Button onClick={() => navigate('/solicitar-acceso')}>
              Solicitar acceso
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- Composición: Header + contenido + Footer
- Fragment `<>` para múltiples elementos (del temario)
- Importar otros componentes
- useNavigate para navegación (introducción a routing)

**Tareas:**
- [ ] Crear página Home
- [ ] Verificar que combina Header + Footer + contenido
- [ ] Aplicar estilos CSS

### 1.5 Exportar/Importar correctamente

**Concepto del temario:** "Los componentes se deben exportar e importar para reutilizarlos"

#### 1.5.1 Crear index.jsx en cada carpeta de componentes
**Archivo:** `src/components/index.js`

```jsx
// Exportaciones con nombre
export { Header } from './Header/Header';
export { Footer } from './Footer/Footer';
export { Button } from './ui/Button';
export { Card } from './ui/Card';
export { TiendasList } from './TiendasList/TiendasList';
export { ColaboradoresList } from './ColaboradoresList/ColaboradoresList';
```

**Beneficio:** Importar es más limpio
```jsx
// Antes
import { Header } from '../../components/Header/Header';

// Después
import { Header } from '../../components';
```

**Tareas:**
- [ ] Crear index.js en cada carpeta de componentes
- [ ] Refactorizar imports para usar index.js

### 1.6 RESUMEN: Fase 1 ✅
**Concepto aprendido:** React es declarativo - describes UI structure with components and props

**Componentes creados:**
- Header, Footer, Button, Card
- TiendasList, ColaboradoresList, RolesList
- RoleBasedButton, LogoutButton
- Home page

**Verificación:**
- [ ] npm start funciona sin errores
- [ ] Home page renderiza correctamente
- [ ] Componentes se muestran con estilos CSS
- [ ] Listas renderean múltiples elementos con `map()`

---

# FASE 2: INTERACTIVIDAD
## Parte 2 del Temario: "Interactividad"
**Duración:** 1.5 semanas | **Dificultad:** ⭐⭐ Media

### Objetivos de aprendizaje
✅ Event handlers (onClick, onChange, onSubmit)  
✅ Formularios controlados  
✅ Propagación de eventos  
✅ Pasar funciones entre componentes  

### 2.1 Event Handlers básicos

**Concepto del temario:** "Las funciones se pasan como props y se ejecutan cuando ocurre un evento"

#### 2.1.1 Botón de acción simple
**Archivo:** `src/components/ui/Button.jsx` (actualizar)

```jsx
export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  type = "button",
  className = ""
}) {
  const handleClick = (e) => {
    console.log('Button clicked:', e);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`btn ${className}`}
    >
      {children}
    </button>
  );
}
```

**Tareas:**
- [ ] Actualizar Button component con manejo de eventos
- [ ] Añadir logging para entender flujo

#### 2.1.2 Página de Inicio con botones interactivos
**Archivo:** `src/pages/Home/Home.jsx` (actualizar)

```jsx
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components';
import { Footer } from '../../components';
import { Button } from '../../components';

export function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Usuario click en Iniciar sesión');
    navigate('/login');
  };

  const handleSignUp = () => {
    console.log('Usuario click en Solicitar acceso');
    navigate('/solicitar-acceso');
  };

  return (
    <>
      <Header />
      <main className="home-container">
        <section className="home-content">
          <h2>Bienvenido a Bancosol</h2>
          <p>Sistema de Gestión de Voluntarios y Colaboradores</p>
          
          <div className="home-buttons">
            <Button onClick={handleLogin}>
              Iniciar sesión
            </Button>
            <Button onClick={handleSignUp}>
              Solicitar acceso
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- Event handler como función declarada
- Pasar funciones como props
- preventDefault si es necesario

**Tareas:**
- [ ] Crear handlers en Home
- [ ] Verificar que funciona la navegación

### 2.2 Formularios - Inputs controlados

**Concepto del temario:** "Los inputs son 'controlados' si su valor viene de una variable de estado"

#### 2.2.1 Campo de Input reutilizable
**Archivo:** `src/components/ui/Input.jsx`

```jsx
export function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  name = ""
}) {
  const handleChange = (e) => {
    console.log(`Input ${name} cambió a:`, e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="form-input"
      />
    </div>
  );
}
```

**Aprendizajes aplicados (crítico del temario):**
- onChange event handler
- value binding (input controlado)
- htmlFor en lugar de for

**Tareas:**
- [ ] Crear componente Input
- [ ] Entender diferencia entre input controlado vs no controlado

#### 2.2.2 Componente Textarea
**Archivo:** `src/components/ui/Textarea.jsx`

```jsx
export function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  name = ""
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="form-textarea"
      />
    </div>
  );
}
```

**Tareas:**
- [ ] Crear componente Textarea

#### 2.2.3 Formulario de Login
**Archivo:** `src/pages/Login/Login.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer, Button, Input } from '../../components';

export function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar campos
    if (!usuario || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      // Aquí irá la lógica de autenticación (Fase 6)
      console.log('Login attempt:', { usuario, password });
      
      // Por ahora, hardcodear para testing
      if (usuario === 'admin' && password === 'admin') {
        // Guardar rol en localStorage (lo mejoraremos en Fase 6)
        localStorage.setItem('userRole', 'admin');
        navigate('/welcome');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error en la autenticación: ' + err.message);
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
              placeholder="Ingresa tu usuario"
            />
            
            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
            />
            
            <Button type="submit">Iniciar sesión</Button>
          </form>
          
          <p>¿No tienes cuenta? <a href="/solicitar-acceso">Solicitar acceso</a></p>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados (sección crítica del temario Parte 2):**
- Event handler onSubmit en forma
- Estado con useState (introducción, más en Fase 3)
- Inputs controlados
- Validación de formulario
- e.preventDefault()

**Tareas:**
- [ ] Crear página Login
- [ ] Testear que formulario funciona
- [ ] Verificar validación

#### 2.2.4 Formulario de Solicitar Acceso
**Archivo:** `src/pages/SolicitarAcceso/SolicitarAcceso.jsx`

```jsx
import { useState } from 'react';
import { Header, Footer, Button, Input, Textarea } from '../../components';

export function SolicitarAcceso() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    entidad: '',
    motivo: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud enviada:', formData);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <>
        <Header />
        <main className="solicitar-acceso-container">
          <div className="alert alert-success">
            <h2>¡Solicitud enviada!</h2>
            <p>Tu solicitud ha sido recibida. Nos pondremos en contacto pronto.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="solicitar-acceso-container">
        <section className="form-section">
          <h2>Solicitar Acceso</h2>
          
          <form onSubmit={handleSubmit}>
            <Input
              label="Nombre completo"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Teléfono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
            
            <Input
              label="Entidad"
              type="text"
              name="entidad"
              value={formData.entidad}
              onChange={handleChange}
              required
            />
            
            <Textarea
              label="Motivo de la solicitud"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
            />
            
            <Button type="submit">Enviar solicitud</Button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- Manejo de múltiples inputs con un estado objeto
- Renderizado condicional basado en estado
- Destructuring de eventos `const { name, value } = e.target`

**Tareas:**
- [ ] Crear página SolicitarAcceso
- [ ] Testear envío de formulario

### 2.3 Propagación de eventos y delegación

**Concepto del temario:** "Los eventos burbujean hacia arriba en el árbol del DOM"

#### 2.3.1 Lista de items con eliminación
**Archivo:** `src/components/TiendasList/TiendasList.jsx` (actualizar)

```jsx
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function TiendasList({ tiendas, onDeleteTienda, onSelectTienda }) {
  const handleDelete = (e, tiendaId) => {
    // Prevenir que el click se propague a elementos padres
    e.stopPropagation();
    
    console.log('Eliminando tienda:', tiendaId);
    if (onDeleteTienda) {
      onDeleteTienda(tiendaId);
    }
  };

  const handleSelect = (tienda) => {
    console.log('Seleccionada tienda:', tienda);
    if (onSelectTienda) {
      onSelectTienda(tienda);
    }
  };

  return (
    <div className="tiendas-grid">
      {tiendas.map((tienda) => (
        <Card 
          key={tienda.id} 
          title={tienda.nombre}
          onClick={() => handleSelect(tienda)}
          className="tienda-card clickable"
        >
          <p><strong>Ubicación:</strong> {tienda.ubicacion}</p>
          <p><strong>Coordinador:</strong> {tienda.coordinador}</p>
          
          <Button 
            onClick={(e) => handleDelete(e, tienda.id)}
            className="btn-delete btn-small"
          >
            Eliminar
          </Button>
        </Card>
      ))}
    </div>
  );
}
```

**Aprendizajes aplicados (del temario sobre propagación):**
- e.stopPropagation() para evitar que event bubbling
- Pasar parámetros a handlers: `onClick={(e) => handleDelete(e, tiendaId)}`
- Múltiples handlers en el mismo componente

**Tareas:**
- [ ] Actualizar TiendasList con handlers
- [ ] Crear versión similar para ColaboradoresList

### 2.4 RESUMEN: Fase 2 ✅
**Concepto aprendido:** React es interactivo - event handlers permiten responder a acciones del usuario

**Componentes creados/actualizados:**
- Input, Textarea componentes
- Páginas de Login y SolicitarAcceso
- Listas con event handlers

**Verificación:**
- [ ] Formularios responden a cambios de input
- [ ] onSubmit valida y procesa datos
- [ ] Event handlers se ejecutan correctamente
- [ ] e.stopPropagation() funciona

---

# FASE 3: ESTADO
## Parte 3 del Temario: "Gestión del estado en React"
**Duración:** 2 semanas | **Dificultad:** ⭐⭐⭐ Media-Alta

### Objetivos de aprendizaje
✅ Hook useState  
✅ Lifting state up  
✅ Hook useEffect  
✅ Ciclo de vida de componentes  
✅ Effects con dependencias  
✅ Limpieza de effects

### 3.1 Hook useState - Fundamentos

**Concepto del temario:** "useState permite que componentes funcionales tengan estado local"

#### 3.1.1 Contador simple (ejemplo temario aplicado)
**Archivo:** `src/pages/Contador/Contador.jsx` (para aprender)

```jsx
import { useState } from 'react';
import { Header, Footer, Button } from '../../components';

export function Contador() {
  // Estado simple
  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(contador + 1);
  };

  const decrementar = () => {
    setContador(contador - 1);
  };

  const reset = () => {
    setContador(0);
  };

  return (
    <>
      <Header />
      <main className="contador-container">
        <h2>Contador</h2>
        <p className="contador-display">{contador}</p>
        
        <div className="contador-buttons">
          <Button onClick={decrementar}>-</Button>
          <Button onClick={reset}>Reset</Button>
          <Button onClick={incrementar}>+</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- `const [estado, setEstado] = useState(valorInicial)`
- Setter es la forma correcta de actualizar estado
- React re-renderiza cuando estado cambia

**Tareas:**
- [ ] Crear página Contador para entender useState
- [ ] Experimentar: ¿qué pasa si actualizas estado directamente sin setState?

#### 3.1.2 Panel de Admin - Estado de modo edición

**Archivo:** `src/pages/Gestion/Tiendas/Tiendas.jsx`

```jsx
import { useState } from 'react';
import { Header, Footer, Button, Card, Input } from '../../components';
import { TiendasList } from '../../components/TiendasList/TiendasList';

export function Tiendas() {
  // Estado para lista de tiendas
  const [tiendas, setTiendas] = useState([
    { id: 1, nombre: 'Carrefour Centro', ubicacion: 'Málaga Centro', coordinador: 'Juan' },
    { id: 2, nombre: 'Carrefour Este', ubicacion: 'Málaga Este', coordinador: 'María' }
  ]);

  // Estado para formulario de nueva tienda
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevaTienda, setNuevaTienda] = useState({
    nombre: '',
    ubicacion: '',
    coordinador: ''
  });

  const handleAgregar = () => {
    if (!nuevaTienda.nombre || !nuevaTienda.ubicacion) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const tiendaConId = {
      ...nuevaTienda,
      id: Date.now() // ID simple
    };

    setTiendas([...tiendas, tiendaConId]);
    setNuevaTienda({ nombre: '', ubicacion: '', coordinador: '' });
    setModoEdicion(false);
  };

  const handleEliminar = (tiendaId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tienda?')) {
      setTiendas(tiendas.filter(t => t.id !== tiendaId));
    }
  };

  const handleCancelar = () => {
    setNuevaTienda({ nombre: '', ubicacion: '', coordinador: '' });
    setModoEdicion(false);
  };

  return (
    <>
      <Header />
      <main className="gestion-container">
        <h2>Gestión de Tiendas</h2>

        {/* Botón para agregar */}
        {!modoEdicion && (
          <Button onClick={() => setModoEdicion(true)}>
            + Agregar tienda
          </Button>
        )}

        {/* Formulario de edición */}
        {modoEdicion && (
          <Card title="Nueva Tienda" className="form-card">
            <Input
              label="Nombre"
              value={nuevaTienda.nombre}
              onChange={(e) => setNuevaTienda({
                ...nuevaTienda,
                nombre: e.target.value
              })}
            />
            
            <Input
              label="Ubicación"
              value={nuevaTienda.ubicacion}
              onChange={(e) => setNuevaTienda({
                ...nuevaTienda,
                ubicacion: e.target.value
              })}
            />
            
            <Input
              label="Coordinador"
              value={nuevaTienda.coordinador}
              onChange={(e) => setNuevaTienda({
                ...nuevaTienda,
                coordinador: e.target.value
              })}
            />
            
            <div className="form-buttons">
              <Button onClick={handleAgregar}>Guardar</Button>
              <Button onClick={handleCancelar} className="btn-secondary">Cancelar</Button>
            </div>
          </Card>
        )}

        {/* Lista de tiendas */}
        <TiendasList
          tiendas={tiendas}
          onDeleteTienda={handleEliminar}
        />
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados (del temario Parte 3):**
- Estado múltiple (tiendas, modoEdicion, nuevaTienda)
- Actualizar arrays con spread operator `[...tiendas, nuevaItem]`
- Actualizar objetos con spread: `{ ...nuevaTienda, nombre: valor }`
- Estado condicional para mostrar/ocultar formulario
- Ciclo CRUD: Create, Read, Delete

**Tareas:**
- [ ] Crear página Tiendas.jsx
- [ ] Implementar agregar tienda
- [ ] Implementar eliminar tienda
- [ ] Testear CRUD completo

#### 3.1.3 Página Colaboradores con CRUD
**Archivo:** `src/pages/Gestion/Colaboradores/Colaboradores.jsx`

```jsx
import { useState } from 'react';
import { Header, Footer, Button, Card, Input, Textarea } from '../../components';
import { ColaboradoresList } from '../../components/ColaboradoresList/ColaboradoresList';

export function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([
    {
      id: 1,
      nombre: 'AYUNTAMIENTO DE ALMACHAR',
      zona: 'Axarquía',
      localidad: 'ALMACHAR',
      coord: 'JM Cobos',
      contacto1: { nombre: 'Mario Torre', tel: '555 555 555' }
    }
  ]);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoColab, setNuevoColab] = useState({
    nombre: '',
    zona: '',
    localidad: '',
    coord: '',
    contacto1: { nombre: '', tel: '' }
  });

  const handleAgregar = () => {
    if (!nuevoColab.nombre || !nuevoColab.zona) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    setColaboradores([...colaboradores, {
      ...nuevoColab,
      id: Date.now()
    }]);
    
    setNuevoColab({
      nombre: '',
      zona: '',
      localidad: '',
      coord: '',
      contacto1: { nombre: '', tel: '' }
    });
    setModoEdicion(false);
  };

  const handleEliminar = (colabId) => {
    if (window.confirm('¿Eliminar colaborador?')) {
      setColaboradores(colaboradores.filter(c => c.id !== colabId));
    }
  };

  const handleCancelar = () => {
    setNuevoColab({
      nombre: '',
      zona: '',
      localidad: '',
      coord: '',
      contacto1: { nombre: '', tel: '' }
    });
    setModoEdicion(false);
  };

  return (
    <>
      <Header />
      <main className="gestion-container">
        <h2>Gestión de Colaboradores</h2>

        {!modoEdicion && (
          <Button onClick={() => setModoEdicion(true)}>
            + Agregar colaborador
          </Button>
        )}

        {modoEdicion && (
          <Card title="Nuevo Colaborador" className="form-card">
            <Input
              label="Nombre de la entidad"
              value={nuevoColab.nombre}
              onChange={(e) => setNuevoColab({
                ...nuevoColab,
                nombre: e.target.value
              })}
            />
            
            <Input
              label="Zona"
              value={nuevoColab.zona}
              onChange={(e) => setNuevoColab({
                ...nuevoColab,
                zona: e.target.value
              })}
            />
            
            {/* ... más inputs ... */}
            
            <div className="form-buttons">
              <Button onClick={handleAgregar}>Guardar</Button>
              <Button onClick={handleCancelar} className="btn-secondary">Cancelar</Button>
            </div>
          </Card>
        )}

        <ColaboradoresList
          colaboradores={colaboradores}
          onDeleteColab={handleEliminar}
        />
      </main>
      <Footer />
    </>
  );
}
```

**Tareas:**
- [ ] Crear página Colaboradores.jsx
- [ ] Implementar CRUD completo
- [ ] Añadir búsqueda/filtro

### 3.2 Lifting State Up

**Concepto del temario:** "Cuando múltiples componentes necesitan compartir estado, elevamos el estado al padre común"

#### 3.2.1 Barra de búsqueda compartida
**Archivo:** `src/components/SearchBar/SearchBar.jsx`

```jsx
import { Input } from '../ui/Input';

export function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="search-bar">
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
```

#### 3.2.2 Página que usa búsqueda global
**Archivo:** `src/pages/Gestion/Tiendas/Tiendas.jsx` (actualizar)

```jsx
import { useState } from 'react';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { TiendasList } from '../../components/TiendasList/TiendasList';

export function Tiendas() {
  const [tiendas, setTiendas] = useState([...]);
  
  // Estado compartido para búsqueda
  const [busqueda, setBusqueda] = useState('');

  // Filtrar tiendas basado en búsqueda
  const tiendasFiltradas = tiendas.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    t.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="gestion-container">
        <h2>Gestión de Tiendas</h2>

        <SearchBar
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar tienda..."
        />

        <TiendasList
          tiendas={tiendasFiltradas}  // Usar lista filtrada
          onDeleteTienda={handleEliminar}
        />
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- Estado elevado (lifting state up)
- Computar estado derivado (tiendasFiltradas)
- Pasar callbacks al hijo para actualizar estado padre

**Tareas:**
- [ ] Implementar SearchBar en Tiendas
- [ ] Implementar similar en Colaboradores
- [ ] Entender que el estado "sube" al padre común

### 3.3 Hook useEffect - Ciclo de vida

**Concepto del temario:** "useEffect permite ejecutar código cuando el componente se monta, actualiza o desmonta"

#### 3.3.1 Cargar datos en el montaje
**Archivo:** `src/pages/Gestion/Coordinadores/Coordinadores.jsx`

```jsx
import { useState, useEffect } from 'react';
import { Header, Footer } from '../../components';

export function Coordinadores() {
  const [coordinadores, setCoordinadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Se ejecuta cuando el componente se monta
  useEffect(() => {
    const cargarCoordinadores = async () => {
      try {
        setCargando(true);
        
        // Simulamos carga de API
        const respuesta = await fetch('/data/db.json');
        const data = await respuesta.json();
        
        setCoordinadores(data.coordinadores || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar coordinadores: ' + err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarCoordinadores();
  }, []); // Dependencias vacías = ejecutar solo al montar

  if (cargando) {
    return (
      <>
        <Header />
        <main className="gestion-container">
          <p>Cargando coordinadores...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="gestion-container">
          <div className="alert alert-error">{error}</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="gestion-container">
        <h2>Coordinadores</h2>
        {/* Renderizar coordinadores */}
      </main>
    </>
  );
}
```

**Aprendizajes aplicados (crítico del temario Parte 3):**
- `useEffect(callback, [dependencias])`
- Array de dependencias vacío = ejecutar solo al montar
- Estados: cargando, error, datos
- Render condicional por estado

**Tareas:**
- [ ] Crear página Coordinadores.jsx
- [ ] Cargar datos al montar
- [ ] Mostrar estados de cargando/error

#### 3.3.2 useEffect con dependencias
**Archivo:** `src/pages/Gestion/Tiendas/Tiendas.jsx` (actualizar)

```jsx
import { useState, useEffect } from 'react';
import { SearchBar } from '../../components/SearchBar/SearchBar';

export function Tiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tiendasFiltradas, setTiendasFiltradas] = useState([]);

  // Cargar tiendas al montar
  useEffect(() => {
    const cargarTiendas = async () => {
      const respuesta = await fetch('/data/db.json');
      const data = await respuesta.json();
      setTiendas(data.tiendas || []);
    };
    cargarTiendas();
  }, []);

  // Filtrar tiendas cuando busqueda cambia
  useEffect(() => {
    console.log('Ejecutando filtrado con busqueda:', busqueda);
    
    const filtradas = tiendas.filter(t =>
      t.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    setTiendasFiltradas(filtradas);
  }, [busqueda, tiendas]); // Ejecutar cuando alguna dependencia cambie

  return (
    // ...
  );
}
```

**Aprendizajes aplicados:**
- Múltiples useEffect para diferentes propósitos
- Array de dependencias específicas: `[busqueda, tiendas]`
- Entender cuándo se ejecuta cada efecto

**Tareas:**
- [ ] Implementar múltiples useEffect
- [ ] Verificar que se ejecutan en el momento correcto
- [ ] Usar console.log para entender el flujo

#### 3.3.3 Limpieza de efectos (cleanup)
**Archivo:** `src/pages/Gestion/Campanyas/Campanyas.jsx`

```jsx
import { useState, useEffect } from 'react';

export function Campanyas() {
  const [campanyas, setCampanyas] = useState([]);

  useEffect(() => {
    // Simulamos un polling de datos cada 5 segundos
    const intervalo = setInterval(async () => {
      console.log('Actualizando campanyas...');
      const respuesta = await fetch('/data/db.json');
      const data = await respuesta.json();
      setCampanyas(data.campanyas || []);
    }, 5000);

    // CLEANUP: Limpiar el intervalo cuando el componente se desmonte
    return () => {
      console.log('Limpiando intervalo');
      clearInterval(intervalo);
    };
  }, []); // Solo al montar/desmontar

  return (
    // ...
  );
}
```

**Aprendizajes aplicados (muy importante del temario):**
- Return function para cleanup
- Evitar memory leaks
- Limpiar timers, listeners, conexiones

**Tareas:**
- [ ] Crear página con cleanup
- [ ] Entender por qué es necesario

### 3.4 Estado derivado vs estado en el estado

**Concepto del temario:** "No todas las variables deben ser estado"

```jsx
// ❌ MAL - Estado redundante
const [tiendas, setTiendas] = useState([]);
const [tiendasFiltradas, setTiendasFiltradas] = useState([]);
const [filtroActivo, setFiltroActivo] = useState('');

// ✅ BIEN - Estado derivado
const [tiendas, setTiendas] = useState([]);
const [filtroActivo, setFiltroActivo] = useState('');

const tiendasFiltradas = tiendas.filter(t => 
  t.nombre.includes(filtroActivo)
);
```

**Tareas:**
- [ ] Revisar código y eliminar estado redundante
- [ ] Calcular valores derivados en lugar de guardarlos en estado

### 3.5 RESUMEN: Fase 3 ✅
**Concepto aprendido:** React es stateful - useState y useEffect controlan datos y ciclo de vida

**Componentes/Páginas creados:**
- Contador (para aprender useState)
- Tiendas CRUD
- Colaboradores CRUD
- Coordinadores (con useEffect)
- SearchBar

**Verificación:**
- [ ] CRUD funciona (agregar, eliminar)
- [ ] useEffect carga datos
- [ ] Búsqueda filtra correctamente
- [ ] No hay memory leaks (cleanup)

---

# FASE 4: PATRONES AVANZADOS
## Parte 4 del Temario: "Trampillas de Escape"
**Duración:** 1.5 semanas | **Dificultad:** ⭐⭐⭐ Media-Alta

### Objetivos de aprendizaje
✅ Hook useRef  
✅ useCallback  
✅ useMemo  
✅ Custom hooks  
✅ Performance optimization

### 4.1 Hook useRef

**Concepto del temario:** "useRef permite guardar un valor mutable que persiste entre renders sin causar re-renders"

#### 4.1.1 Foco en input (Focus management)
**Archivo:** `src/components/ui/SearchInput.jsx`

```jsx
import { useRef } from 'react';
import { Button } from './Button';
import { Input } from './Input';

export function SearchInput({ onSearch }) {
  const inputRef = useRef(null);

  const handleSearch = () => {
    if (inputRef.current) {
      const valor = inputRef.current.value;
      console.log('Buscando:', valor);
      onSearch(valor);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus(); // Foco automático
    }
  };

  return (
    <div className="search-input">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar..."
        className="form-input"
      />
      <Button onClick={handleSearch}>Buscar</Button>
      <Button onClick={handleClear} className="btn-secondary">Limpiar</Button>
    </div>
  );
}
```

**Aprendizajes aplicados:**
- `useRef(null)` crea una referencia
- `ref.current` accede al DOM
- No causa re-renders
- Útil para focus management

**Tareas:**
- [ ] Crear SearchInput
- [ ] Entender diferencia entre ref y state

#### 4.1.2 Timer con ref
**Archivo:** `src/components/Timer/Timer.jsx`

```jsx
import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';

export function Timer() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (activo) {
      intervaloRef.current = setInterval(() => {
        setSegundos(s => s + 1);
      }, 1000);
    } else {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    }

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [activo]);

  const handleReset = () => {
    setSegundos(0);
    setActivo(false);
  };

  return (
    <div className="timer">
      <p className="timer-display">{segundos}s</p>
      <div className="timer-buttons">
        <Button onClick={() => setActivo(!activo)}>
          {activo ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button onClick={handleReset} className="btn-secondary">
          Reset
        </Button>
      </div>
    </div>
  );
}
```

**Tareas:**
- [ ] Crear componente Timer
- [ ] Entender refs con side effects

### 4.2 Hook useCallback

**Concepto del temario:** "useCallback memoriza una función para optimizar renders de componentes hijos"

#### 4.2.1 Lista con botones optimizados
**Archivo:** `src/components/OptimizedList/OptimizedList.jsx`

```jsx
import { useCallback, memo } from 'react';

// Componente hijo memorizado
const ListItem = memo(function ListItem({ item, onDelete, onEdit }) {
  console.log('Renderizando ListItem:', item.id);
  
  return (
    <div className="list-item">
      <p>{item.nombre}</p>
      <div className="list-item-actions">
        <button onClick={() => onEdit(item.id)}>Editar</button>
        <button onClick={() => onDelete(item.id)}>Eliminar</button>
      </div>
    </div>
  );
});

export function OptimizedList({ items, onDeleteItem, onEditItem }) {
  // Sin useCallback, se crearía una nueva función en cada render
  // Esto causaría que ListItem siempre se re-renderice (memo no funcionaría)
  
  const handleDelete = useCallback((itemId) => {
    console.log('Eliminando:', itemId);
    onDeleteItem(itemId);
  }, [onDeleteItem]);

  const handleEdit = useCallback((itemId) => {
    console.log('Editando:', itemId);
    onEditItem(itemId);
  }, [onEditItem]);

  return (
    <div className="optimized-list">
      {items.map(item => (
        <ListItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}
```

**Aprendizajes aplicados:**
- `useCallback(fn, [dependencias])` memoriza función
- `memo()` evita re-renders innecesarios
- Importante cuando pasas callbacks como props

**Tareas:**
- [ ] Crear OptimizedList
- [ ] Entender cuándo useCallback es necesario

### 4.3 useMemo

**Concepto del temario:** "useMemo memoriza un valor computado para optimizar cálculos pesados"

#### 4.3.1 Lista filtrada con cálculos pesados
**Archivo:** `src/pages/Gestion/Estadisticas/Estadisticas.jsx`

```jsx
import { useState, useMemo, useEffect } from 'react';

export function Estadisticas() {
  const [colaboradores, setColaboradores] = useState([]);
  const [filtroZona, setFiltroZona] = useState('');

  useEffect(() => {
    // Cargar colaboradores
    const cargar = async () => {
      const resp = await fetch('/data/db.json');
      const data = await resp.json();
      setColaboradores(data.colaboradores || []);
    };
    cargar();
  }, []);

  // Cálculo pesado: estadísticas por zona
  const estadisticasPorZona = useMemo(() => {
    console.log('Recalculando estadísticas...');
    
    const stats = {};
    colaboradores.forEach(colab => {
      if (!stats[colab.zona]) {
        stats[colab.zona] = { count: 0, zonas: new Set() };
      }
      stats[colab.zona].count++;
      stats[colab.zona].zonas.add(colab.zona);
    });
    
    return Object.entries(stats).map(([zona, data]) => ({
      zona,
      total: data.count
    }));
  }, [colaboradores]); // Solo recalcular cuando colaboradores cambia

  // Filtrado que usa las estadísticas memorizadas
  const estadisticasFiltradas = useMemo(() => {
    if (!filtroZona) return estadisticasPorZona;
    
    return estadisticasPorZona.filter(stat =>
      stat.zona.toLowerCase().includes(filtroZona.toLowerCase())
    );
  }, [estadisticasPorZona, filtroZona]);

  return (
    <div className="estadisticas">
      <h2>Estadísticas</h2>
      
      <input
        type="text"
        placeholder="Filtrar zona..."
        value={filtroZona}
        onChange={(e) => setFiltroZona(e.target.value)}
      />

      <ul>
        {estadisticasFiltradas.map(stat => (
          <li key={stat.zona}>
            {stat.zona}: {stat.total} colaboradores
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Aprendizajes aplicados:**
- `useMemo(fn, [dependencias])` memoriza valor
- Útil para cálculos pesados
- Array de dependencias importante

**Tareas:**
- [ ] Crear página Estadísticas
- [ ] Entender diferencia useMemo vs useCallback

### 4.4 Custom Hooks

**Concepto del temario:** "Los custom hooks encapsulan lógica reutilizable"

#### 4.4.1 useLocalStorage Hook
**Archivo:** `src/hooks/useLocalStorage.js`

```jsx
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Estado
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Setter que actualiza localStorage también
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

**Uso:**
```jsx
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function MiComponente() {
  const [usuario, setUsuario] = useLocalStorage('usuario', null);
  const [preferencias, setPreferencias] = useLocalStorage('preferencias', {});

  return (
    <div>
      <p>Usuario: {usuario}</p>
      <button onClick={() => setUsuario('Juan')}>Set Usuario</button>
    </div>
  );
}
```

**Aprendizajes aplicados:**
- Custom hooks reutilizan lógica
- Siguen mismo patrón que hooks built-in
- Nombre comienza con "use"

**Tareas:**
- [ ] Crear useLocalStorage
- [ ] Usarlo en Login para guardar sesión

#### 4.4.2 useAsync Hook (para API calls)
**Archivo:** `src/hooks/useAsync.js`

```jsx
import { useState, useEffect } from 'react';

export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { execute, status, value, error };
}
```

**Uso:**
```jsx
import { useAsync } from '../../hooks/useAsync';

export function Tiendas() {
  const fetchTiendas = async () => {
    const resp = await fetch('/data/db.json');
    const data = await resp.json();
    return data.tiendas;
  };

  const { status, value: tiendas, error } = useAsync(fetchTiendas);

  if (status === 'pending') return <p>Cargando...</p>;
  if (status === 'error') return <p>Error: {error.message}</p>;

  return <TiendasList tiendas={tiendas} />;
}
```

**Tareas:**
- [ ] Crear useAsync
- [ ] Simplificar páginas que cargan datos
- [ ] Usar en múltiples páginas

#### 4.4.3 useFetch Hook (simplificación de useAsync)
**Archivo:** `src/hooks/useFetch.js`

```jsx
import { useAsync } from './useAsync';

export function useFetch(url) {
  const fetchData = async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  };

  return useAsync(fetchData);
}
```

**Tareas:**
- [ ] Crear useFetch simplificado
- [ ] Refactorizar páginas para usar useFetch

### 4.5 Performance - Cuándo optimizar

**Importante del temario:**
> "No optimices prematuramente. Primero haz que funcione, luego optimiza si es necesario."

```jsx
// Usa console.time() para medir performance
useEffect(() => {
  console.time('cargarDatos');
  
  const cargar = async () => {
    // ...
    console.timeEnd('cargarDatos'); // Muestra cuánto tiempo tardó
  };
  
  cargar();
}, []);
```

**Tareas:**
- [ ] Medir performance actual
- [ ] Optimizar solo si es necesario
- [ ] Usar React DevTools Profiler

### 4.6 RESUMEN: Fase 4 ✅
**Concepto aprendido:** React avanzado - Refs, callbacks, memos, custom hooks para optimización y reutilización

**Componentes/Hooks creados:**
- SearchInput con ref
- Timer component
- OptimizedList con memo
- useLocalStorage hook
- useAsync hook
- useFetch hook
- Estadísticas page

**Verificación:**
- [ ] Refs funcionan correctamente
- [ ] useCallback memoriza funciones
- [ ] useMemo memoriza valores
- [ ] Custom hooks reutilizan lógica

---

# FASE 5: ENRUTAMIENTO
## Temario: "Enrutamiento" + "React Router"
**Duración:** 1.5 semanas | **Dificultad:** ⭐⭐⭐ Media-Alta

### Objetivos de aprendizaje
✅ Conceptos de routing  
✅ React Router v6  
✅ Rutas anidadas  
✅ Parámetros dinámicos  
✅ Redirección  

### 5.1 Conceptos de Routing

**Concepto del temario:**
- Client-side routing (SPA - Single Page App)
- URL se manipula sin recargar página
- History API

#### 5.1.1 Estructura básica de Router
**Archivo:** `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importar páginas
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { SolicitarAcceso } from './pages/SolicitarAcceso/SolicitarAcceso';
import { NotFound } from './pages/NotFound/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/solicitar-acceso" element={<SolicitarAcceso />} />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Aprendizajes aplicados:**
- BrowserRouter envuelve toda la app
- Routes contenedor de Route
- Route define path → element

**Tareas:**
- [ ] Crear App.jsx con rutas básicas
- [ ] Crear página NotFound (404)

#### 5.1.2 Página NotFound
**Archivo:** `src/pages/NotFound/NotFound.jsx`

```jsx
import { Header, Footer, Button } from '../../components';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="notfound-container">
        <h1>404</h1>
        <p>Página no encontrada</p>
        <Button onClick={() => navigate('/')}>Volver a inicio</Button>
      </main>
      <Footer />
    </>
  );
}
```

**Tareas:**
- [ ] Crear NotFound page

### 5.2 Rutas protegidas

**Concepto del temario (Autenticación):** "Las rutas protegidas comprueban autenticación antes de renderizar"

#### 5.2.1 Componente ProtectedRoute
**Archivo:** `src/components/ProtectedRoute/ProtectedRoute.jsx`

```jsx
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute({ isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

**Tareas:**
- [ ] Crear ProtectedRoute
- [ ] Entiender Outlet

#### 5.2.2 Rutas protegidas en App
**Archivo:** `src/App.jsx` (actualizar)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Páginas
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Welcome } from './pages/Welcome/Welcome';
import { Tiendas } from './pages/Gestion/Tiendas/Tiendas';
import { Colaboradores } from './pages/Gestion/Colaboradores/Colaboradores';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const userRole = localStorage.getItem('userRole');
    setIsAuthenticated(!!userRole);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/tiendas" element={<Tiendas />} />
          <Route path="/colaboradores" element={<Colaboradores />} />
          {/* ... más rutas protegidas ... */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Tareas:**
- [ ] Integrar ProtectedRoute en App
- [ ] Testear que login redirige a welcome

### 5.3 Parámetros dinámicos en rutas

**Concepto del temario:** "Las rutas pueden tener parámetros variables como /tienda/:id"

#### 5.3.1 Página detalle de tienda
**Archivo:** `src/pages/Gestion/Tiendas/TiendaDetalle.jsx`

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header, Footer, Button } from '../../../components';

export function TiendaDetalle() {
  const { id } = useParams(); // Obtener parámetro de ruta
  const navigate = useNavigate();
  const [tienda, setTienda] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTienda = async () => {
      try {
        const resp = await fetch('/data/db.json');
        const data = await resp.json();
        const tiendaEncontrada = data.tiendas?.find(t => t.id === parseInt(id));
        
        if (!tiendaEncontrada) {
          navigate('/tiendas');
          return;
        }
        
        setTienda(tiendaEncontrada);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarTienda();
  }, [id, navigate]);

  if (cargando) return <p>Cargando...</p>;
  if (!tienda) return <p>Tienda no encontrada</p>;

  return (
    <>
      <Header />
      <main className="tienda-detalle-container">
        <h2>{tienda.nombre}</h2>
        <p><strong>Ubicación:</strong> {tienda.ubicacion}</p>
        <p><strong>Coordinador:</strong> {tienda.coordinador}</p>
        
        <Button onClick={() => navigate('/tiendas')}>Volver</Button>
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- `useParams()` obtiene parámetros de ruta
- Parámetros en Route: `/tienda/:id`

**Tareas:**
- [ ] Crear TiendaDetalle
- [ ] Actualizar ruta: `/tienda/:id`

#### 5.3.2 Link a detalle desde lista
**Archivo:** `src/components/TiendasList/TiendasList.jsx` (actualizar)

```jsx
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';

export function TiendasList({ tiendas }) {
  return (
    <div className="tiendas-grid">
      {tiendas.map((tienda) => (
        <Link key={tienda.id} to={`/tienda/${tienda.id}`} style={{ textDecoration: 'none' }}>
          <Card title={tienda.nombre} className="tienda-card clickable">
            <p><strong>Ubicación:</strong> {tienda.ubicacion}</p>
            <p><strong>Coordinador:</strong> {tienda.coordinador}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
```

**Aprendizajes aplicados:**
- `<Link>` para navegación sin recargar
- Template strings para parámetros

**Tareas:**
- [ ] Actualizar TiendasList con Links

### 5.4 Rutas anidadas

**Concepto del temario:** "Las rutas pueden anidarse para crear subrutas"

#### 5.4.1 Layout de gestión compartido
**Archivo:** `src/layouts/GestionLayout.jsx`

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
          <Outlet /> {/* Las subrutas se renderizan aquí */}
        </main>
      </div>
      <Footer />
    </>
  );
}
```

#### 5.4.2 Actualizar rutas con anidamiento
**Archivo:** `src/App.jsx` (actualizar)

```jsx
import { GestionLayout } from './layouts/GestionLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... rutas públicas ... */}

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/welcome" element={<Welcome />} />

          {/* Rutas de gestión anidadas */}
          <Route element={<GestionLayout />}>
            <Route path="/tiendas" element={<Tiendas />} />
            <Route path="/tienda/:id" element={<TiendaDetalle />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/colaborador/:id" element={<ColaboradorDetalle />} />
            <Route path="/coordinadores" element={<Coordinadores />} />
            {/* ... más subrutas ... */}
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Aprendizajes aplicados:**
- Rutas anidadas reutilizan layout
- `<Outlet />` renderiza subrutas

**Tareas:**
- [ ] Crear GestionLayout
- [ ] Crear SidebarGestion
- [ ] Integrar rutas anidadas

### 5.5 Sidebar de navegación
**Archivo:** `src/components/SidebarGestion/SidebarGestion.jsx`

```jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function SidebarGestion() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={`sidebar-gestion ${expanded ? 'expanded' : 'collapsed'}`}>
      <button onClick={() => setExpanded(!expanded)} className="sidebar-toggle">
        ☰
      </button>

      <nav className="sidebar-nav">
        <Link to="/tiendas" className="sidebar-link">Tiendas</Link>
        <Link to="/colaboradores" className="sidebar-link">Colaboradores</Link>
        <Link to="/coordinadores" className="sidebar-link">Coordinadores</Link>
        <Link to="/voluntarios" className="sidebar-link">Voluntarios</Link>
        <Link to="/campanyas" className="sidebar-link">Campañas</Link>
        <Link to="/bandeja" className="sidebar-link">Bandeja</Link>
      </nav>
    </aside>
  );
}
```

**Tareas:**
- [ ] Crear SidebarGestion
- [ ] Estilizar con CSS

### 5.6 RESUMEN: Fase 5 ✅
**Concepto aprendido:** React Router - SPA con navegación sin recargar

**Componentes/Páginas creados:**
- App.jsx con rutas
- ProtectedRoute
- TiendaDetalle, ColaboradorDetalle
- GestionLayout
- SidebarGestion
- NotFound

**Verificación:**
- [ ] Rutas públicas funcionan
- [ ] Rutas protegidas redirigen a login
- [ ] Parámetros dinámicos funcionan
- [ ] Rutas anidadas comparten layout

---

# FASE 6: AUTENTICACIÓN
## Temario: "Gestión de Autenticación en React"
**Duración:** 1.5 semanas | **Dificultad:** ⭐⭐⭐⭐ Alta

### Objetivos de aprendizaje
✅ Context API  
✅ useContext  
✅ Custom AuthProvider  
✅ JWT tokens  
✅ Protected routes con autenticación

### 6.1 Context API - Crear contexto de autenticación

**Concepto del temario:** "Context proporciona estado global sin prop drilling"

#### 6.1.1 Crear AuthContext
**Archivo:** `src/context/AuthContext.jsx`

```jsx
import { createContext } from 'react';

export const AuthContext = createContext(null);
```

**Tareas:**
- [ ] Crear AuthContext.jsx

#### 6.1.2 Crear AuthProvider
**Archivo:** `src/context/AuthProvider.jsx`

```jsx
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, verificar si hay sesión guardada
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
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
    }

    setCargando(false);
  }, []);

  const login = (userData, authToken) => {
    console.log('Login:', userData);
    
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

  const value = {
    usuario,
    estaAutenticado,
    token,
    cargando,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Aprendizajes aplicados (del temario):**
- createContext para contexto
- Provider que proporciona estado
- useEffect para restaurar sesión
- sessionStorage en lugar de localStorage

**Tareas:**
- [ ] Crear AuthProvider
- [ ] Entender flujo de login/logout

#### 6.1.3 Crear hook useAuth
**Archivo:** `src/hooks/useAuth.js`

```jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  
  return context;
};
```

**Aprendizajes aplicados:**
- Custom hook para acceder a contexto
- Error si se usa fuera del provider

**Tareas:**
- [ ] Crear useAuth hook

### 6.2 Integrar AuthProvider en App

**Archivo:** `src/App.jsx` (actualizar)

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';

// Componente que usa autenticación
function AppRoutes() {
  const { estaAutenticado, cargando } = useAuth();

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute isAuthenticated={estaAutenticado} />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route element={<GestionLayout />}>
          <Route path="/tiendas" element={<Tiendas />} />
          {/* ... más rutas ... */}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
```

**Tareas:**
- [ ] Actualizar App.jsx con AuthProvider
- [ ] Testear que cargando funciona

### 6.3 Actualizar página Login

**Archivo:** `src/pages/Login/Login.jsx` (completar)

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Header, Footer, Button, Input } from '../../components';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
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

      // Simular API call
      const respuesta = await fetch('/data/db.json');
      const data = await respuesta.json();

      // Buscar usuario en la BD simulada
      const usuarioValido = data.usuarios.find(u =>
        u.usuario === usuario && u.clave === password
      );

      if (!usuarioValido) {
        setError('Usuario o contraseña incorrectos');
        return;
      }

      // Login exitoso
      const token = `token_${usuarioValido.id}`; // Simulamos JWT
      login(usuarioValido, token);

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
              placeholder="admin, capitan, etc..."
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />

            <Button type="submit" disabled={cargando}>
              {cargando ? 'Entrando...' : 'Iniciar sesión'}
            </Button>
          </form>

          <p>
            ¿No tienes cuenta?{' '}
            <a href="/solicitar-acceso">Solicitar acceso</a>
          </p>

          <div className="login-info">
            <h4>Usuarios de prueba:</h4>
            <ul>
              <li>admin / admin</li>
              <li>capitan / capitan</li>
              <li>coordinador / coordinador</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- Usar hook useAuth
- Llamar login() del contexto
- Redirigir después de autenticación

**Tareas:**
- [ ] Actualizar página Login
- [ ] Testear login con usuarios mock

### 6.4 Actualizar Header con logout

**Archivo:** `src/components/Header/Header.jsx` (actualizar)

```jsx
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export function Header() {
  const { usuario, estaAutenticado, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <img src="/LOGO_BANCOSOL.png" alt="Bancosol" className="logo" />
        <h1>Sistema de Gestión Bancosol</h1>

        {estaAutenticado && (
          <div className="header-user">
            <span>Bienvenido, {usuario?.nombre || usuario?.usuario}</span>
            <Button onClick={handleLogout} className="btn-logout">
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
```

**Tareas:**
- [ ] Actualizar Header
- [ ] Testear que logout funciona

### 6.5 Página Welcome con roles
**Archivo:** `src/pages/Welcome/Welcome.jsx`

```jsx
import { useAuth } from '../../hooks/useAuth';
import { Header, Footer } from '../../components';
import { Link } from 'react-router-dom';

const PERMISOS_ROL = {
  'admin': ['tiendas', 'colaboradores', 'coordinadores', 'voluntarios', 'campanyas', 'bandeja'],
  'capitan': ['tiendas', 'colaboradores'],
  'coordinador': ['tiendas', 'colaboradores', 'voluntarios'],
  'capitan_coordinador': ['tiendas', 'colaboradores', 'bandeja'],
  'entidad_colaboradora': ['tiendas', 'colaboradores'],
  'responsable_tienda': ['tiendas', 'colaboradores']
};

const MENU_ITEMS = {
  'tiendas': { nombre: 'Tiendas', url: '/tiendas' },
  'colaboradores': { nombre: 'Colaboradores', url: '/colaboradores' },
  'coordinadores': { nombre: 'Coordinadores', url: '/coordinadores' },
  'voluntarios': { nombre: 'Voluntarios', url: '/voluntarios' },
  'campanyas': { nombre: 'Campañas', url: '/campanyas' },
  'bandeja': { nombre: 'Bandeja de Entrada', url: '/bandeja' }
};

export function Welcome() {
  const { usuario, estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <div>No autenticado</div>;
  }

  const rolUsuario = usuario?.rol || 'admin';
  const permisos = PERMISOS_ROL[rolUsuario] || [];
  const itemsDisponibles = permisos.map(permiso => MENU_ITEMS[permiso]);

  return (
    <>
      <Header />
      <main className="welcome-container">
        <h2>Bienvenido, {usuario?.nombre || usuario?.usuario}</h2>
        <p>Rol: <strong>{rolUsuario}</strong></p>

        <div className="welcome-menu">
          {itemsDisponibles.map(item => (
            <Link key={item.url} to={item.url} className="menu-item">
              {item.nombre}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

**Aprendizajes aplicados:**
- Usar useAuth para obtener usuario
- Control de acceso basado en rol
- Mostrar solo opciones permitidas

**Tareas:**
- [ ] Crear página Welcome
- [ ] Definir permisos por rol
- [ ] Testear diferentes roles

### 6.6 RESUMEN: Fase 6 ✅
**Concepto aprendido:** Context API - Estado global, autenticación, permisos

**Componentes/Hooks creados:**
- AuthContext
- AuthProvider
- useAuth hook
- Login page actualizado
- Welcome page
- Header con logout

**Verificación:**
- [ ] Login funciona
- [ ] Sesión persiste al recargar
- [ ] Logout limpia sesión
- [ ] Permisos por rol funcionan
- [ ] ProtectedRoute redirige correctamente

---

# FASE 7: INTEGRACIÓN COMPLETA
**Duración:** 2 semanas | **Dificultad:** ⭐⭐⭐⭐ Alta

### Objetivos de este fase
✅ Integrar todas las páginas de gestión  
✅ Implementar CRUD completo  
✅ Exportar a Excel  
✅ Búsqueda y filtrado  
✅ Validaciones  

### 7.1 Páginas de gestión completas

#### 7.1.1 Gestión de Tiendas - CRUD Completo
**Archivo:** `src/pages/Gestion/Tiendas/Tiendas.jsx` (completar)

```jsx
// Ya tiene estructura básica de Fase 3
// Aquí completamos con:
// - useAsync para cargar datos
// - Búsqueda y filtrado
// - Edit funcionalidad
// - Validaciones mejoradas
```

#### 7.1.2 Gestión de Colaboradores - CRUD + Excel
**Archivo:** `src/pages/Gestion/Colaboradores/Colaboradores.jsx`

```jsx
// Incluir:
// - Búsqueda filtrada (coordinador, usuario, localidad, zona)
// - Exportar a Excel
// - Edit funcionalidad completa
```

**Para exportar Excel, usar librería:**
```bash
npm install xlsx
```

```jsx
import * as XLSX from 'xlsx';

const handleExportarExcel = () => {
  const ws = XLSX.utils.json_to_sheet(colaboradores);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');
  XLSX.writeFile(wb, 'colaboradores.xlsx');
};
```

#### 7.1.3 Gestión de Coordinadores
#### 7.1.4 Gestión de Voluntarios
#### 7.1.5 Gestión de Campañas
#### 7.1.6 Bandeja de Entrada

### 7.2 Servicio API centralizado
**Archivo:** `src/services/api.js`

```jsx
const API_URL = 'http://localhost:3001';

export const apiService = {
  // Tiendas
  getTiendas: () => fetch(`${API_URL}/tiendas`).then(r => r.json()),
  getTiendaById: (id) => fetch(`${API_URL}/tiendas/${id}`).then(r => r.json()),
  createTienda: (data) => fetch(`${API_URL}/tiendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateTienda: (id, data) => fetch(`${API_URL}/tiendas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteTienda: (id) => fetch(`${API_URL}/tiendas/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),

  // Similar para colaboradores, coordinadores, etc.
};
```

### 7.3 Validaciones compartidas
**Archivo:** `src/utils/validations.js`

```jsx
export const validaciones = {
  requerido: (valor, nombre) => {
    if (!valor || valor.trim() === '') {
      return `${nombre} es requerido`;
    }
    return null;
  },

  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return 'Email inválido';
    }
    return null;
  },

  telefono: (telefono) => {
    const regex = /^[0-9]{6,}$/;
    if (!regex.test(telefono)) {
      return 'Teléfono inválido';
    }
    return null;
  }
};
```

---

# VERIFICACIÓN Y TESTING
**Duración:** 1 semana

### Checklist de verificación

#### Feature: Autenticación
- [ ] Login funciona con usuarios mock
- [ ] Contraseña incorrecta muestra error
- [ ] Logout limpia sesión
- [ ] Sesión persiste al F5
- [ ] ProtectedRoute redirige a login si no autenticado

#### Feature: Navegación
- [ ] Home muestra botones de login/solicitar acceso
- [ ] Welcome muestra menu según rol
- [ ] Links en sidebar funcionan
- [ ] Volver atrás funciona
- [ ] URL cambia sin recargar página

#### Feature: CRUD Tiendas
- [ ] Listar tiendas funciona
- [ ] Agregar tienda crea nueva entrada
- [ ] Eliminar tienda se confirma
- [ ] Click en tienda va a detalle
- [ ] Búsqueda filtra tiendas

#### Feature: CRUD Colaboradores
- [ ] Listar colaboradores funciona
- [ ] Agregar colaborador funciona
- [ ] Búsqueda por múltiples campos funciona
- [ ] Exportar a Excel funciona
- [ ] Validaciones funcionan

#### Feature: Componentes
- [ ] Header se renderiza correctamente
- [ ] Footer se renderiza correctamente
- [ ] Botones responden a clicks
- [ ] Formularios son controlados
- [ ] Lists con .map() funcionan

#### Feature: Estado
- [ ] useState actualiza componente
- [ ] useEffect carga datos
- [ ] Lifting state up funciona
- [ ] Context API proporciona autenticación

#### Feature: Rendimiento
- [ ] App carga en menos de 3s
- [ ] No hay console errors
- [ ] No hay memory leaks
- [ ] useCallback/useMemo funcionan

---

## 📚 MAPA DE APRENDIZAJE

```
FASE 1: Fundamentos         [semana 1]    ⭐
├─ Componentes
├─ JSX
├─ Props
└─ Listas

FASE 2: Interactividad      [semana 1-2]  ⭐⭐
├─ Event handlers
├─ Formularios controlados
└─ onChange/onSubmit

FASE 3: Estado              [semana 2-3]  ⭐⭐⭐
├─ useState
├─ Lifting state up
├─ useEffect
└─ Ciclo de vida

FASE 4: Avanzado            [semana 4]    ⭐⭐⭐
├─ useRef
├─ useCallback
├─ useMemo
└─ Custom hooks

FASE 5: Routing             [semana 4-5]  ⭐⭐⭐
├─ React Router
├─ Rutas protegidas
├─ Parámetros dinámicos
└─ Rutas anidadas

FASE 6: Autenticación       [semana 5-6]  ⭐⭐⭐⭐
├─ Context API
├─ useContext
├─ AuthProvider
└─ Permisos por rol

FASE 7: Integración         [semana 6-8]  ⭐⭐⭐⭐
├─ CRUD completo
├─ Validaciones
├─ Excel export
└─ Testing
```

---

## 🎯 CONCLUSIONES

Este plan te permite:

1. **Aprender React progresivamente** - Cada fase construye sobre la anterior
2. **Mantener el proyecto vivo** - No creas uno nuevo, migras el existente
3. **Aplicar teoría a práctica** - Cada concepto del temario se implementa inmediatamente
4. **Entender por qué** - No solo copias código, entiendes cada parte
5. **Practicar lo importante** - CRUD, autenticación, routing, estado

**Tiempo total:** 8-10 semanas (40-50 horas aprox)

**Próximos pasos:**
1. Setup: Crea proyecto React nuevo con estructura propuesta (Fase 0)
2. Comienza Fase 1: Crea componentes Header, Footer, Button
3. Testea: npm start debe funcionar sin errores
4. Continúa con cada fase en orden

¡Éxito en la migración! 🚀
