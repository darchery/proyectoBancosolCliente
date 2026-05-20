const rutasPorGestion = {
    tiendas: '../gestion/tiendas/gestionar_tiendas.html',
    voluntarios: '../gestion/asignacion-voluntarios/asignacion_voluntarios.html',
    campana: '../gestion/campanyas/gestionar_campanya.html',
    coordinadores: '../gestion/coordinadores/gestionar_coordinadores.html',
    colaboradores: '../gestion/colaboradores/gestionar_colaboradores.html',
    login: '../login/index_login.html',
    bandeja_entrada: '../gestion/bandeja-entrada/gestionar_bandeja_entrada.html'
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
        }
    }

    // Vincular cada botón con su ruta
    configurarBoton('btn-tienda-admin', 'tiendas');
    configurarBoton('btn-voluntarios-admin', 'voluntarios');
    configurarBoton('btn-campana-admin', 'campana');
    configurarBoton('btn-coordinadores-admin', 'coordinadores');
    configurarBoton('btn-colaboradores-admin', 'colaboradores');
    configurarBoton('btn-bandeja-entrada-admin', 'bandeja_entrada');


    // Cerrar sesión
    const btnLogout = document.getElementById('logout-btn-admin');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear(); 
            window.location.href = rutasPorGestion['login'];
        });
    }
});