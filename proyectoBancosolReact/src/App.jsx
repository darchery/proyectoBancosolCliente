//import Home from './pages/home/Home';
//import NotFound from './pages/notFound/NotFound';

// npm install react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import { ProtectedRoute } from './ProtectedRoute';
//import { RolRequerido } from './RolRequerido';;
import { ProveedorAuten } from './hooks/ProveedorAuten';

// TODO: Poner ruta concreta
/*
import Cabecera from './components/Cabecera';
import Login from './components/Login';
import WelcomeAdmin from './components/WelcomeAdmin';
import GestionColaboradoresAdmin from './components/GestionColaboradoresAdmin';
import GestionTiendaAdmin from './components/GestionTiendaAdmin';
import WelcomeCoordinador from './components/WelcomeCoordinador';
import GestionColaboradoresCoordinador from './components/GestionColaboradoresCoordinador';
import GestionTiendaCoordinador from './components/GestionTiendaCoordinador';
*/

import GestionTiendas from "./pages/gestion/tiendas/GestionTiendas";
import GestionCampanyas from "./pages/gestion/campanyas/GestionCampanyas";

function App() {
  return (
    <ProveedorAuten>
      <BrowserRouter>
        <Routes>
          {/* Ruta principal → Gestión de Tiendas */}
          <Route path="/" element={<GestionTiendas />} />
          <Route path="/tiendas" element={<GestionTiendas />} />
          <Route path="/campanyas" element={<GestionCampanyas />} />
        </Routes>
      </BrowserRouter>
    </ProveedorAuten>
  );
}

/*
function App() {
  return (
    <>
      <ProveedorAuten>
        <BrowserRouter>
          <Routes>
            Rutas públicas 
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/solicitar-acceso" element={<SolicitarAcceso />} />

            Rutas protegidas => Requieren login
            <Route element={<RutaProtegida />}>

              <Route element={<Cabecera />}>

                <Route element={<RolRequerido roles={['admin']} />}>
                  <Route path="/welcome_admin" element={<WelcomeAdmin />} />
                  <Route path="/gestion/colaboradores_admin" element={<GestionColaboradoresAdmin />} />
                  <Route path="/gestion/tienda_admin" element={<GestionTiendaAdmin />} />
                  <Route path="/gestion/campanya_admin" element={<GestionCampanyas />} />
                </Route>

                <Route element={<RolRequerido roles={['coordinador']} />}>
                  <Route path="/welcome_coordinador" element={<WelcomeCoordinador />} />
                  <Route path="/gestion/colaboradores_coordinador" element={<GestionColaboradoresCoordinador />} />
                  <Route path="/gestion/tienda_coordinador" element={<GestionTiendaCoordinador />} />
                </Route>

              </Route>
              
            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </ProveedorAuten>
    </>
  );
}
*/

export default App;
