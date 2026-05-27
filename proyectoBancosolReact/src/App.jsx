import './App.css'
import Home from './pages/home/index_home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GestionColaboradores from './pages/gestion/colaboradores/gestion_colaboradores'


function App() {

  return (
    <>
      <Home />
            
    </>
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/gestion/colaboradores" element={<GestionColaboradores />} />
      </Routes>
    </BrowserRouter>
    </div>
    
  )
}

export default App
