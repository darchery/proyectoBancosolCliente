import './login.css';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthHook';

const API_URL = "http://localhost:3001";

function Login() {
    const [usuarioInput, setUsuarioInput] = useState('');
    const [claveInput, setClaveInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
        const res = await fetch(`${API_URL}/usuarios`);
        const usuarios = await res.json();
        const encontrado = usuarios.find(
            u => u.usuario === usuarioInput && u.clave === claveInput
        );
        if (encontrado) {
            login({ usuario: encontrado.usuario, rol: encontrado.rol, id: encontrado.id });
            navigate('/welcome');
        } else {
            setError('Credenciales incorrectas');
        }
        } catch (err) {
        setError('Error de conexión con el servidor');
        }
    }

    return (
        <div className="login-wrapper">
        <main>
            <div className="login-box">
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="input-usuario">Usuario:</label>
                <input
                type="text" id="input-usuario" value={usuarioInput}
                onChange={e => setUsuarioInput(e.target.value)}
                />
                <label htmlFor="input-password">Contraseña:</label>
                <input
                type="password" id="input-password" value={claveInput}
                onChange={e => setClaveInput(e.target.value)}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" id="btn-entrar">Entrar</button>
            </form>
            <Link to="/">Volver al inicio</Link>
            </div>
        </main>
        </div>
    );

}

export default Login;
