import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GestionColaboradores from './pages/gestion/colaboradores/gestion_colaboradores'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gestion/colaboradores" element={<GestionColaboradores />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
