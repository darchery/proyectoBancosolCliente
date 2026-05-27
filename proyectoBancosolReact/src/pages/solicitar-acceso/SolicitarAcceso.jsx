import './solicitar_acceso.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

function SolicitarAcceso(){
    return(
        <div class="solicitar-acceso-wrapper">
            <Header />
            <main>
                <h1>Solicitud de acceso</h1>
                <form>
                    <label for="correo_solicitud">
                        Introduzca su correo electrónico:
                    </label>

                    <input type="email" id="correo_solicitud" name="correo_solicitud" placeholder="ejemplo@correo.com" required />

                    <button type="submit" id="btn-enviar">Enviar solicitud</button>

                    <p id="info_solicitud"></p>
                </form>
            </main>
            <Footer />
        </div>
    )
}

export default SolicitarAcceso;