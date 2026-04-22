// 1. Datos (Tu minibase de datos de tiendas)
const tiendas = [
    { id: 'CARREFOUR_001', nombre: 'Carrefour Hiper', cadena: 'CARREFOUR', zona: 'Axarquía', domicilio: 'c/ Arroyo de Totalán, nº 36 - CC LA VICTORIA', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_002', nombre: 'Carrefour Market', cadena: 'CARREFOUR', zona: 'Axarquía', domicilio: 'Plaza Don Antonio Estrada, s/n - La Cala del Moral', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_003', nombre: 'Carrefour Express', cadena: 'CARREFOUR', zona: 'Costa del Sol', domicilio: 'c/ Ronda, s/n', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_004', nombre: 'CARREFOUR EXPRESS', cadena: 'CARREFOUR', zona: 'Málaga Capital', domicilio: 'Pasaje Tamayo y Baus, 2', localidad: 'MALAGA', coord: 'Aranxa' }
];

// Variables globales para las referencias del DOM
let tablaBody, selectCadena, selectLocalidad, selectCoord, menuAdmin;

window.onload = function() {
    // ASIGNACIÓN DE REFERENCIAS (Se hace dentro del onload para asegurar que el HTML existe)
    tablaBody = document.getElementById('tabla-body');
    selectCadena = document.getElementById('filtro-cadena');
    selectLocalidad = document.getElementById('filtro-localidad');
    selectCoord = document.getElementById('filtro-coordinador');
    menuAdmin = document.getElementById('admin-menu');

    // --- LÓGICA DE SEGURIDAD BASADA EN TU LOGIN ---
    
    // Obtenemos el rol que guardaste en redirigirUsuario(usuarioValido.rol)
    const rolActual = localStorage.getItem('userRole');
    
    console.log("Sistema de Gestión: Verificando rol guardado...", rolActual);

    if (rolActual === 'admin') {
        // Si el rol en el JSON era 'admin', mostramos los botones
        if (menuAdmin) {
            menuAdmin.style.display = 'grid'; // Activamos el grid del CSS
            console.log("Acceso de Administrador confirmado. Botones visibles.");
        }
    } else {
        // Si el rol es 'capitan', 'coordinador' o no existe, eliminamos los botones
        if (menuAdmin) {
            menuAdmin.remove(); 
            console.log("Acceso limitado. Se han eliminado los botones de edición.");
        }
    }

    // CARGA DE DATOS Y EVENTOS
    filtrarYCargarTabla();
    
    if (selectCadena) selectCadena.addEventListener('change', filtrarYCargarTabla);
    if (selectLocalidad) selectLocalidad.addEventListener('change', filtrarYCargarTabla);
    if (selectCoord) selectCoord.addEventListener('change', filtrarYCargarTabla);
};

// Función para filtrar y mostrar en tabla
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
        tablaBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No hay coincidencias</td></tr>';
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

// Función para mostrar detalle lateral
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