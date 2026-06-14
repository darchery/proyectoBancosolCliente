import { Link } from 'react-router-dom';
import './unauthorized.css';

export default function Unauthorized() {
  return (
    <div className="unauthorized-wrapper">
      <main>
        <div className="unauthorized-box">
          <h1>Acceso no autorizado</h1>
          <p>No tienes permisos para acceder a esta página.</p>
          <Link to="/" className="btn-volver">Volver al inicio</Link>
        </div>
      </main>
    </div>
  );
}