import './Header.css';
import logo from '../../assets/images/LOGO_BANCOSOL.png';

function Header() {
    return (
        <header className="main-header">
            <div className="logo-area">
                <img id="logo" src={logo} alt="Bancosol Logo" />
            </div>
        </header>
    );
}

export default Header;
