import './Header.css';
import logoBanner from '../../assets/images/LOGO_BANCOSOL_BANNER.png';
import { useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    // Mapea rutas a títulos dinámicos
    const getTituloFromRuta = (ruta) => {
        const titulos = {
            '/gestion/campanyas': 'GESTIÓN DE CAMPAÑAS',
            '/gestion/colaboradores': 'GESTIÓN DE COLABORADORES',
            '/gestion/tiendas': 'GESTIÓN DE TIENDAS',
            '/solicitar-acceso': 'SOLICITAR ACCESO',
        };
        return titulos[ruta] || null;
    };

    const titulo = getTituloFromRuta(location.pathname);

    return (
        <>
            <header className="main-header">
                <div className="logo-area">
                    <img src={logoBanner} alt="Bancosol Logo" />
                    <div>   
                        {titulo && <h1 className="header-titulo">{titulo}</h1>}
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
