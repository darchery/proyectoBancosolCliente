// npm install react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RutaProtegida } from './hooks/RutaProtegida';
import { RolRequerido } from './hooks/RolRequerido';
import { ProveedorAuten } from './hooks/ProveedorAuten';

import NotFound from './pages/notFound/NotFound';
import Unauthorized from './pages/unauthorized/Unauthorized';

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
          <Header />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/solicitar-acceso" element={<SolicitarAcceso />} />

            {/* Rutas protegidas => Requieren login */}
            <Route element={<RutaProtegida />}>
              <Route element={<RolRequerido roles={['admin', 'coordinador']} />}>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/gestion/colaboradores" element={<GestionColaboradores />} />
                <Route path="/gestion/tiendas" element={<GestionTiendas />} />
                <Route path="/gestion/campanyas" element={<GestionCampanyas />} />
              </Route>
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
          <Footer />
        </BrowserRouter>
      </ProveedorAuten>
    </>
  );
}

export default App;
