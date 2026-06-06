import './home.css';
import { Link } from 'react-router-dom'


function Home() {
    return (
        <div className="index-home-wrapper">
            <main>
                <h1>Bienvenido a Bancosol</h1>
                <div className="home-box">
                    <section>
                        <Link to="/login"><button id="boton-login">Iniciar sesión</button></Link>
                        <Link to="/solicitar-acceso"><button id="boton-solicitar-acceso">Solicitar acceso</button></Link>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Home;
