import './solicitar_acceso.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const API_URL = "http://localhost:3001";

function SolicitarAcceso() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, fecha: new Date().toISOString() }),
      });
      if (res.ok) {
        setMensaje('Solicitud enviada. Recibirá respuesta por correo.');
        setCorreo('');
      }
    } catch {
      setMensaje('Error al enviar la solicitud.');
    }
  }

  return (
    <div className="solicitar-acceso-wrapper">
      <Header />
      <main>
        <h1>Solicitud de acceso</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="correo_solicitud">
            Introduzca su correo electrónico:
          </label>
          <input
            type="email" id="correo_solicitud"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            placeholder="ejemplo@correo.com" required
          />
          <button type="submit" id="btn-enviar">Enviar solicitud</button>
          {mensaje && <p id="info_solicitud">{mensaje}</p>}
        </form>
        <Link to="/">Volver al inicio</Link>
      </main>
      <Footer />
    </div>
  );
}

export default SolicitarAcceso;