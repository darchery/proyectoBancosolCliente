import './App.css'
import Home from './pages/home/index_home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GestionColaboradores from './pages/gestion/colaboradores/gestion_colaboradores'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/gestion/colaboradores"
          element={<GestionColaboradores />}
        />
        <Route
          path="/gestion/tiendas"
          element={<GestionTiendas />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App