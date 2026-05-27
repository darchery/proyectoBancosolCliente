import './home.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

function Home() {
    return (
        <div className="index-home-wrapper">
            <Header />
            <main>
                <h1>Bienvenido a Bancosol</h1>
                <div className="home-box">
                    <section>
                        <button id="boton-login">Iniciar sesión</button>
                        <button id="boton-solicitar-acceso">Solicitar acceso</button>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Home;
