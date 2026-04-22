// 1. Datos
const tiendas = [
    { id: 'CARREFOUR_001', nombre: 'Carrefour Hiper', cadena: 'CARREFOUR', zona: 'Axarquía', domicilio: 'c/ Arroyo de Totalán, nº 36 - CC LA VICTORIA', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_002', nombre: 'Carrefour Market', cadena: 'CARREFOUR', zona: 'Axarquía', domicilio: 'Plaza Don Antonio Estrada, s/n - La Cala del Moral', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_003', nombre: 'Carrefour Express', cadena: 'CARREFOUR', zona: 'Costa del Sol', domicilio: 'c/ Ronda, s/n', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_004', nombre: 'CARREFOUR EXPRESS', cadena: 'CARREFOUR', zona: 'Málaga Capital', domicilio: 'Pasaje Tamayo y Baus, 2', localidad: 'MALAGA', coord: 'Aranxa' }
];

// 2. Variables de referencia (Las declaramos pero las asignaremos dentro del onload)
let tablaBody, selectCadena, selectLocalidad, selectZonaGeografica, selectCoord, menuAdmin;

window.onload = function() {
    // Asignamos las referencias ahora que el HTML ya existe
    tablaBody = document.getElementById('tabla-body');
    selectCadena = document.getElementById('filtro-cadena');
    selectLocalidad = document.getElementById('filtro-localidad');
    selectZonaGeografica = document.getElementById('filtro-zonaGeografica');
    selectCoord = document.getElementById('filtro-coordinador');
    menuAdmin = document.getElementById('admin-menu');

    // SEGURIDAD DE ROL
    const rolActual = localStorage.getItem('userRole');
    console.log("Rol detectado:", rolActual);

    if (rolActual === 'admin') {
        if (menuAdmin) {
            menuAdmin.style.display = 'grid'; // Forzamos visibilidad
            console.log("Botones de administrador activados");
        }
    } else {
        if (menuAdmin) {
            menuAdmin.remove(); // Eliminamos si no es admin
        }
    }

    // CARGA INICIAL DE DATOS
    filtrarYCargarTabla();

    // ASIGNACIÓN DE EVENTOS
    if (selectCadena) selectCadena.addEventListener('change', filtrarYCargarTabla);
    if (selectLocalidad) selectLocalidad.addEventListener('change', filtrarYCargarTabla);
    if (selectZonaGeografica) selectZonaGeografica.addEventListener('change', filtrarYCargarTabla);
    if (selectCoord) selectCoord.addEventListener('change', filtrarYCargarTabla);
};

// 3. Función de filtrado
function filtrarYCargarTabla() {
    if (!tablaBody) return;

    const cadenaSel = selectCadena.value;
    const localidadSel = selectLocalidad.value;
    const geografiaSel = selectZonaGeografica.value;
    const coordSel = selectCoord.value;

    tablaBody.innerHTML = '';

    const filtrados = tiendas.filter(tienda => {
        const cumpleCadena = (cadenaSel === "Todas" || tienda.cadena === cadenaSel);
        const cumpleLocalidad = (localidadSel === "Todas" || tienda.localidad === localidadSel);
        const cumpleGeografia = (geografiaSel === "Todas" || tienda.zona === geografiaSel);
        const cumpleCoord = (coordSel === "Todas" || tienda.coord === coordSel);
        return cumpleCadena && cumpleLocalidad && cumpleGeografia && cumpleCoord;
    });

    if (filtrados.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No hay datos</td></tr>';
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

// 4. Función de detalle
function mostrarDetalle(id) {
    const tienda = tiendas.find(t => t.id === id);
    if(tienda) {
        document.getElementById('det-id').innerText = tienda.id;
        document.getElementById('det-dom').innerText = tienda.domicilio;
        document.getElementById('det-loc').innerText = tienda.localidad;
        const detCampana = document.getElementById('det-v-m');
        if (detCampana) detCampana.innerText = `Asignado a: ${tienda.coord}`;
    }
}