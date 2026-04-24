const rutasPorGestion = {
    tiendas: '../GestionDatos/gestionar_tiendas.html',
    colaboradores: '../GestionDatos/gestionar_colaboradores.html',
    login: '../index_login.html'
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

    // Vinculamos cada botón de tu HTML con su ruta correspondiente
    configurarBoton('btn-tienda-cap-coor', 'tiendas');
    configurarBoton('btn-colaboradores-cap-coor', 'colaboradores');
        configurarBoton('btn-bandeja-cap-coor', 'bandeja_entrada');

    // CERRAR SESIÓN
    const btnLogout = document.querySelector('.boton-logout'); // usamos class porque no hay ID

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = rutasPorGestion['login'];
        });
    } else {
        console.warn("Botón de logout no encontrado");
    }

});