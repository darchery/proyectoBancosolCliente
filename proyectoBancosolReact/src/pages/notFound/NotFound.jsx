import { Link } from 'react-router-dom';
import './not_found.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function NotFound() {
  return (
    <div className="not-found-wrapper">
      <Header />
      <main>
        <h1>404 — Página no encontrada</h1>
        <Link to="/">Volver al inicio</Link>
      </main>
      <Footer />
    </div>

  );
}