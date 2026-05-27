import './login.css';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

function Login() {
    return (
        <div className="login">
            <Header />
            <main>
                <div className="login-box">
                    <h1>Iniciar sesión</h1>
                    
                    <label htmlFor="input-usuario">Usuario:</label>
                    <input type="text" id="input-usuario" />

                    <label htmlFor="input-password">Contraseña:</label>
                    <input type="password" id="input-password" />

                    <button id="btn-entrar">Entrar</button>
                    
                    <a href="/">Volver al inicio</a>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Login;
