import './Header.css';
import logo from '../../assets/images/LOGO_BANCOSOL.png';
import { Outlet } from 'react-router-dom';

function Header({ titulo }) {
    return (
        <>
            <header className="main-header">
                <div className="logo-area">
                    <img id="logo" src={logo} alt="Bancosol Logo" />
                    {titulo && <h1 className="header-titulo">{titulo}</h1>}
                </div>
            </header>
            {/*<Outlet />*/}
        </>
    );
}

export default Header;
