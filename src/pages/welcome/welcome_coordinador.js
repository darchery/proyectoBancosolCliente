const rutasPorGestion = {
    tiendas: '../gestion/tiendas/gestionar_tiendas.html',
    colaboradores: '../gestion/colaboradores/gestionar_colaboradores.html',
    login: '../login/index_login.html',
    voluntarios: '../gestion/asignacion-voluntarios/asignacion_voluntarios.html',
};

document.addEventListener('DOMContentLoaded', () => {

    function configurarBoton(idBoton, claveRuta) {
        const boton = document.querySelector('#' + idBoton);
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

    // Vincular botones con sus rutas
    configurarBoton('btn-tienda-coor', 'tiendas');
    configurarBoton('btn-colaboradores-coor', 'colaboradores');
    configurarBoton('btn-voluntarios-coor', 'voluntarios');

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
