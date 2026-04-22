const rolActual = localStorage.getItem('userRole');

if (!rolActual) {
    console.warn("No hay sesión activa. Redirigiendo a login...");
    window.location.href = '../index_login.html';
}

// MINI BASE DE DATOS
const tiendas = [
    { id: 'CARREFOUR_001', nombre: 'Carrefour Hiper', cadena: 'CARREFOUR', zona: 'Axarquía', domicilio: 'c/ Arroyo de Totalán, nº 36 - CC LA VICTORIA', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_002', nombre: 'Carrefour Market', cadena: 'CARREFOUR', zona: 'Axarquía', domicilio: 'Plaza Don Antonio Estrada, s/n - La Cala del Moral', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_003', nombre: 'Carrefour Express', cadena: 'CARREFOUR', zona: 'Costa del Sol', domicilio: 'c/ Ronda, s/n', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_004', nombre: 'CARREFOUR EXPRESS', cadena: 'CARREFOUR', zona: 'Málaga Capital', domicilio: 'Pasaje Tamayo y Baus, 2', localidad: 'MALAGA', coord: 'Aranxa' }
];

// VARIABLES GLOBALES
let tablaBody, selectCadena, selectLocalidad, selectCoord, menuAdmin;

// INICIALIZACIÓN
window.onload = function() {

    // Referencias DOM
    tablaBody = document.getElementById('tabla-body');
    selectCadena = document.getElementById('filtro-cadena');
    selectLocalidad = document.getElementById('filtro-localidad');
    selectCoord = document.getElementById('filtro-coordinador');
    menuAdmin = document.getElementById('admin-menu');

    console.log("Rol detectado:", rolActual);


    // CONTROL DE PERMISOS

    if (rolActual === 'admin') {
        if (menuAdmin) {
            menuAdmin.style.display = 'grid';
            console.log("✔ Admin: acceso completo");
        }
    } else {
        if (menuAdmin) {
            menuAdmin.style.display = 'none'; // mejor que remove()
            console.log("Usuario sin permisos: botones ocultos");
        }
    }


    // CARGA DE DATOS
    filtrarYCargarTabla();

    // Eventos filtros
    if (selectCadena) selectCadena.addEventListener('change', filtrarYCargarTabla);
    if (selectLocalidad) selectLocalidad.addEventListener('change', filtrarYCargarTabla);
    if (selectCoord) selectCoord.addEventListener('change', filtrarYCargarTabla);
};

// FILTRAR Y MOSTRAR TABLA
function filtrarYCargarTabla() {
    if (!tablaBody || !selectCadena) return;

    const cadenaSel = selectCadena.value;
    const localidadSel = selectLocalidad.value;
    const coordSel = selectCoord.value;

    tablaBody.innerHTML = '';

    const filtrados = tiendas.filter(tienda => {
        const cumpleCadena = (cadenaSel === "Todas" || tienda.cadena === cadenaSel);
        const cumpleLocalidad = (localidadSel === "Todas" || tienda.localidad === localidadSel);
        const cumpleCoord = (coordSel === "Todas" || tienda.coord === coordSel);
        return cumpleCadena && cumpleLocalidad && cumpleCoord;
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
        const row = `
            <tr onclick="mostrarDetalle('${tienda.id}')" style="cursor:pointer">
                <td>${tienda.nombre}</td>
                <td style="text-align:center"><input type="checkbox" checked></td>
                <td>${tienda.domicilio}</td>
                <td>${tienda.localidad}</td>
                <td>${tienda.coord}</td>
            </tr>
        `;
        tablaBody.innerHTML += row;
    });
}

// DETALLE DE TIENDA
function mostrarDetalle(id) {
    const tienda = tiendas.find(t => t.id === id);

    if (tienda) {
        document.getElementById('det-id').innerText = tienda.id;
        document.getElementById('det-dom').innerText = tienda.domicilio;
        document.getElementById('det-loc').innerText = tienda.localidad;

        const detCampana = document.getElementById('det-v-m');
        if (detCampana) {
            detCampana.innerText = `Asignado a: ${tienda.coord}`;
        }
    }
}