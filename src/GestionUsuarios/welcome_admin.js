const rutasPorGestion = {
    'tiendas':    '../GestionDatos/gestionar_tiendas.html',
    'voluntarios':'../GestionDatos/gestionar_voluntarios.html',
    'campana':    '../GestionDatos/gestionar_campanya.html',
    'coordinadores': '../GestionDatos/gestionar_coordinadores.html',
    'colaboradores': '../GestionDatos/gestionar_colaboradores.html',
    'login':      '../index_login.html'
};

document.addEventListener('DOMContentLoaded', () => {
    
    // Función genérica para redirigir según el ID del botón
    function configurarBoton(idBoton, claveRuta) {
        const boton = document.getElementById(idBoton);
        if (boton) {
            boton.addEventListener('click', () => {
                const destino = rutasPorGestion[claveRuta];
                if (destino) {
                    window.location.href = destino;
                } else {
                    console.error(`La ruta para ${claveRuta} no está definida.`);
                }
            });
        }
    }

    // Vinculamos cada botón de tu HTML con su ruta correspondiente
    configurarBoton('btn-tienda-admin', 'tiendas');
    configurarBoton('btn-voluntarios-admin', 'voluntarios');
    configurarBoton('btn-campana-admin', 'campana');
    configurarBoton('btn-coordinadores-admin', 'coordinadores');
    configurarBoton('btn-colaboradores-admin', 'colaboradores');


    // CERRAR SESIÓN 
    const btnLogout = document.getElementById('logout-btn-admin');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear(); 
            window.location.href = rutasPorGestion['login'];
        });
    }
});