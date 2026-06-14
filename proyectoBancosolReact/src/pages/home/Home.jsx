import './home.css';
import { Link } from 'react-router-dom'


function Home() {
    return (
        <div className="index-home-wrapper">
            <main>
                <div className="home-box">
                    <h1>Bienvenido a Bancosol</h1>
                    <section>
                        <Link to="/login" className="btn-link">Iniciar sesión</Link>
                        <Link to="/solicitar-acceso" className="btn-link">Solicitar acceso</Link>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Home;
