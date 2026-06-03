// npm install react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RutaProtegida } from './hooks/RutaProtegida';
import { RolRequerido } from './hooks/RolRequerido';
import { ProveedorAuten } from './hooks/ProveedorAuten';

// TODO: Poner ruta concreta

import NotFound from './pages/notFound/NotFound';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/home/Home';

import Login from './pages/login/Login';
import SolicitarAcceso from './pages/solicitar-acceso/SolicitarAcceso';

import Welcome from './pages/welcome/Welcome';
import GestionColaboradores from './pages/gestion/colaboradores/GestionColaboradores';
import GestionTiendas from './pages/gestion/tiendas/GestionTiendas';
import GestionCampanyas from './pages/gestion/campanyas/GestionCampanyas';

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

             {/*Rutas protegidas => Requieren login*/}
            <Route element={<RutaProtegida />}>

              <Route element={<Header />}>

                <Route element={<RolRequerido roles={['admin']} />}>
                  <Route path="/welcome_admin" element={<WelcomeAdmin />} />
                  <Route path="/gestion/colaboradores_admin" element={<GestionColaboradoresAdmin />} />
                  <Route path="/gestion/tienda_admin" element={<GestionTiendaAdmin />} />
                </Route>

                <Route element={<RolRequerido roles={['coordinador']} />}>
                  <Route path="/welcome_coordinador" element={<Welcome />} />
                  <Route path="/gestion/colaboradores" element={<GestionColaboradores />} />
                  <Route path="/gestion/tienda" element={<GestionTiendas />} />
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

export default App;
