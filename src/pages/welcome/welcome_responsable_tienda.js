const rutasPorGestion = {
    tiendas: '../gestion/gestionar_tiendas.html',
    colaboradores: '../gestion/gestionar_colaboradores.html',
    login: '../login/index_login.html'
};

document.addEventListener('DOMContentLoaded', () => {

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
        } else {
            console.warn(`Botón no encontrado: ${idBoton}`);
        }
    }

    // Vincular botón con su ruta
    configurarBoton('btn-tienda-resp-tienda', 'tiendas');
    configurarBoton('btn-colaboradores-resp-tienda', 'colaboradores');

    // Cerrar sesión
    const btnLogout = document.querySelector('.boton-logout');

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = rutasPorGestion['login'];
        });
    } else {
        console.warn("Botón de logout no encontrado");
    }

});
