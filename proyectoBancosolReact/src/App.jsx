import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import { ProtectedRoute } from './ProtectedRoute';
import { RolRequerido } from './RolRequerido';
import { ProveedorAuten } from './ProveedorAuten';

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

function App() {
  return (
    <>
      <ProveedorAuten>
        <BrowserRouter>
          <Routes>

            <Route index element={<Login />} />

            <Route element={<RutaProtegida />}>

              <Route element={<Cabecera />}>

                <Route element={<RolRequerido puestos={['admin']} />}>
                  <Route path="/welcome_admin" element={<WelcomeAdmin />} />
                  <Route path="/gestion/colaboradores_admin" element={<GestionColaboradoresAdmin />} />
                  <Route path="/gestion/tienda_admin" element={<GestionTiendaAdmin />} />
                </Route>

                <Route element={<RolRequerido puestos={['coordinador']} />}>
                  <Route path="/welcome_coordinador" element={<WelcomeCoordinador />} />
                  <Route path="/gestion/colaboradores_coordinador" element={<GestionColaboradoresCoordinador />} />
                  <Route path="/gestion/tienda_coordinador" element={<GestionTiendaCoordinador />} />
                </Route>

              </Route>
              
            </Route>

          </Routes>
        </BrowserRouter>
      </ProveedorAuten>
    </>
  );
}

export default App
