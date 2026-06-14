import './welcome.css';  // o importar style_welcome.css desde assets
import { useAuth } from '../../hooks/useAuthHook';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  // Sólo hemos implementado dos roles: admin y coordinador
  const menuPorRol = {
    admin: ['Tiendas', 'Colaboradores', 'Campañas'],
    coordinador: ['Colaboradores']
  };

  const rutasPorOpcion = {
    'Tiendas': '/gestion/tiendas',
    'Colaboradores': '/gestion/colaboradores',
    'Coordinadores': '/gestion/coordinadores',
    'Campañas': '/gestion/campanyas',
    'Asignación Voluntarios': '/gestion/asignacion-voluntarios',
    'Bandeja Entrada': '/gestion/bandeja-entrada',
  };

  const opciones = menuPorRol[usuario?.rol] || [];

  function handleNavegar(opcion) {
    const ruta = rutasPorOpcion[opcion];
    if (ruta) navigate(ruta);
  }

  return (
    <div className="welcome-wrapper">
      <main>
        <h1>Bienvenido {usuario?.rol}</h1>
        <div className="welcome-box">
          <section>
            {opciones.map(op => (
              <button key={op} onClick={() => handleNavegar(op)}>{op}</button>
            ))}
          </section>
        </div>
        <div className="logout-container">
          <button className="boton-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </main>
    </div>
  );
}

export default Welcome;