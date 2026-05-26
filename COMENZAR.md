# PASOS INICIALES - COMEÇAR LA MIGRACIÓN
## Quick start en 5 minutos

---

## 1️⃣ PREPARAR EL ENTORNO

### Terminal 1: Crear proyecto React
```bash
cd /tmp  # o donde prefieras
npx create-react-app bancosol-react
cd bancosol-react
npm install react-router-dom
```

### Verificar que funciona
```bash
npm start
```
✅ Debe abrir localhost:3000 con página React por defecto

---

## 2️⃣ COPIAR ARCHIVOS CSS E IMÁGENES

### Copiar CSS
```bash
# Desde tu directorio del proyecto actual
cp src/assets/css/* bancosol-react/src/styles/

# Crear carpeta si no existe
mkdir -p bancosol-react/src/styles
```

### Copiar imágenes
```bash
cp src/assets/images/* bancosol-react/public/
```

---

## 3️⃣ COPIAR DATOS MOCK

```bash
# Copiar base de datos JSON
cp src/data/db.json bancosol-react/public/data/
mkdir -p bancosol-react/public/data
```

---

## 4️⃣ CREAR ESTRUCTURA DE CARPETAS

```bash
cd bancosol-react/src

# Crear carpetas
mkdir -p components/{Header,Footer,ui}
mkdir -p pages/{Home,Login,Welcome,Gestion/{Tiendas,Colaboradores}}
mkdir -p hooks
mkdir -p context
mkdir -p services
mkdir -p layouts
mkdir -p styles

# Crear archivos index.jsx
touch components/index.jsx
touch pages/index.jsx
```

**Resultado:**
```
src/
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── ui/
│   └── index.jsx
├── pages/
│   ├── Home/
│   ├── Login/
│   └── index.jsx
├── hooks/
├── context/
├── layouts/
├── services/
├── styles/
└── App.jsx
```

---

## 5️⃣ CREAR PRIMER COMPONENTE: Header

**Archivo:** `src/components/Header/Header.jsx`

```jsx
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

---

## 6️⃣ CREAR SEGUNDO COMPONENTE: Footer

**Archivo:** `src/components/Footer/Footer.jsx`

```jsx
export function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 Bancosol. Todos los derechos reservados.</p>
    </footer>
  );
}
```

---

## 7️⃣ ACTUALIZAR App.jsx

**Archivo:** `src/App.jsx`

```jsx
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

function App() {
  return (
    <>
      <Header />
      <main className="app-container">
        <h2>Bienvenido a Bancosol React</h2>
        <p>La migración ha comenzado! 🚀</p>
      </main>
      <Footer />
    </>
  );
}

export default App;
```

---

## 8️⃣ TESTEAR

```bash
npm start
```

✅ Deberías ver:
- Logo de Bancosol
- Título "Sistema de Gestión Bancosol"
- Tu contenido
- Footer

Si no funciona:
- Verifica que `public/LOGO_BANCOSOL.png` existe
- Revisa que los archivos CSS se copiaron correctamente
- Abre la consola (F12) y busca errores

---

## 9️⃣ COMMITS GIT

```bash
cd bancosol-react

# Iniciar git si no está
git init

# Crear rama para la migración
git branch migration/fase1
git checkout migration/fase1

# Agregar cambios
git add .
git commit -m "Fase 0: Setup inicial y componentes básicos"
```

---

## 🔟 VERIFICACIÓN FINAL

Ejecuta esta lista antes de continuar:

- [ ] `npm start` funciona sin errores
- [ ] Header se renderiza con logo
- [ ] Footer se renderiza
- [ ] Puedes ver contenido entre Header y Footer
- [ ] No hay warnings en consola
- [ ] Archivos CSS están en `src/styles/`
- [ ] Base de datos JSON está en `public/data/`
- [ ] Estructura de carpetas está correcta
- [ ] Git commit hecho

---

## ⏭️ PRÓXIMO PASO

Una vez que verificaste todo:

👉 **Ve a FASE 1: FUNDAMENTOS** en `PLAN_MIGRACION_REACT.md`

Crea los componentes:
1. Button.jsx
2. Input.jsx
3. Card.jsx
4. Página Home.jsx

---

## 🆘 TROUBLESHOOTING

### Error: "LOGO_BANCOSOL.png not found"
```bash
# Verifica que la imagen existe
ls public/
# Si no está, cópiala:
cp ../proyectoBancosolTCAW/src/assets/images/* ./public/
```

### Error: "Cannot find module 'Header'"
- Verifica que el archivo Header.jsx existe
- Revisa la ruta en el import
- Asegúrate que está en `src/components/Header/Header.jsx`

### CSS no se ve
```bash
# Verifica que los CSS están en src/styles/
ls src/styles/
# Si no están:
mkdir -p src/styles
cp ../proyectoBancosolTCAW/src/assets/css/* src/styles/
```

### npm start no funciona
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📝 NOTAS

- **No edites directamente create-react-app.** Los archivos de configuración pueden cambiar con updates.
- **Usa `npm install` con cuidado.** Revisa que las librerías son necesarias.
- **Commit frecuentemente.** Cada fase debe ser un commit Git diferente.
- **Testea en cada paso.** No dejes errores acumularse.

---

¡Listo para empezar? 🚀

**Ejecuta:**
```bash
npm start
```

**Luego continúa con la FASE 1 del plan completo.**
