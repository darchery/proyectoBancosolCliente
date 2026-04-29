let tiendas = [];

// VARIABLES GLOBALES
let tablaBody, selectCadena, selectLocalidad, selectCoord, menuAdmin;
const rolActual = localStorage.getItem('userRole') || 'admin';

// INICIALIZACIÓN
window.onload = async function () {

    // Referencias DOM
    tablaBody = document.getElementById('tabla-body');
    selectCadena = document.getElementById('filtro-cadena');
    selectLocalidad = document.getElementById('filtro-localidad');
    selectCoord = document.getElementById('filtro-coordinador');
    menuAdmin = document.getElementById('admin-menu');

    console.log("Rol detectado:", rolActual);

    // CONTROL DE PERMISOS
    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.style.display = 'grid';
    } else {
        if (menuAdmin) menuAdmin.style.display = 'none';
    }

    // CARGAR TIENDAS DESDE API
    await cargarTiendas();

    filtrarYCargarTabla();

    // Eventos filtros
    selectCadena?.addEventListener('change', filtrarYCargarTabla);
    selectLocalidad?.addEventListener('change', filtrarYCargarTabla);
    selectCoord?.addEventListener('change', filtrarYCargarTabla);
};

//  CARGAR TIENDAS (API) 
async function cargarTiendas() {
    try {
        const res = await fetch('http://localhost:3001/tiendas');
        tiendas = await res.json();
        console.log("Tiendas cargadas:", tiendas);
    } catch (error) {
        console.error("Error cargando tiendas:", error);
    }
}

//  FILTRAR Y MOSTRAR TABLA 
function filtrarYCargarTabla() {

    if (!tablaBody) return;

    const cadenaSel = selectCadena?.value || 'Todas';
    const localidadSel = selectLocalidad?.value || 'Todas';
    const coordSel = selectCoord?.value || 'Todas';

    tablaBody.innerHTML = '';

    const filtrados = tiendas.filter(tienda => {
        return (
            (cadenaSel === "Todas" || tienda.cadena === cadenaSel) &&
            (localidadSel === "Todas" || tienda.localidad === localidadSel) &&
            (coordSel === "Todas" || tienda.coord === coordSel)
        );
    });

    if (filtrados.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:20px;">
                    No hay coincidencias
                </td>
            </tr>`;
        return;
    }

    filtrados.forEach(tienda => {
        tablaBody.innerHTML += `
            <tr onclick="mostrarDetalle('${tienda.id}')" style="cursor:pointer">
                <td>${tienda.nombre}</td>
                <td style="text-align:center"><input type="checkbox" checked></td>
                <td>${tienda.domicilio}</td>
                <td>${tienda.localidad}</td>
                <td>${tienda.coord}</td>
            </tr>
        `;
    });
}

//  DETALLE TIENDA ─
function mostrarDetalle(id) {

    const tienda = tiendas.find(t => t.id === id);
    if (!tienda) return;

    document.getElementById('det-id').innerText = tienda.id;
    document.getElementById('det-dom').innerText = tienda.domicilio;
    document.getElementById('det-loc').innerText = tienda.localidad;

    const detCampana = document.getElementById('det-v-m');
    if (detCampana) {
        detCampana.innerText = `Asignado a: ${tienda.coord}`;
    }
}