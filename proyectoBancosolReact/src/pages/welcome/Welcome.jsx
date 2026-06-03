import './welcome.css';  // o importar style_welcome.css desde assets
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuthHook';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const menuPorRol = {
    admin: ['Tiendas', 'Colaboradores', 'Coordinadores', 'Campañas'],
    capitan: ['Asignación Voluntarios'],
    coordinador: ['Tiendas', 'Colaboradores'],
    capitan_coordinador: ['Tiendas', 'Colaboradores', 'Asignación Voluntarios'],
    entidad_colaboradora: ['Bandeja Entrada'],
  };

  const opciones = menuPorRol[usuario?.rol] || [];

  return (
    <div className="welcome-wrapper">
      <Header />
      <main>
        <h1>Bienvenido {usuario?.rol}</h1>
        <div className="welcome-box">
          <section>
            {opciones.map(op => (
              <button key={op}>{op}</button>
            ))}
          </section>
        </div>
        <div className="logout-container">
          <button className="boton-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Welcome;