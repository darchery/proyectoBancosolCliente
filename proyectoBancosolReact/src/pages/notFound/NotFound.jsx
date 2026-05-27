import { Link } from 'react-router-dom';
export function NotFound() {
  return (
    <main>
      <h2>404 — Página no encontrada</h2>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}