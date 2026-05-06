// npx json-server --port 3001 src/data/datos.json

// VARIABLES GLOBALES
let asignaciones = [];
let asignacionSeleccionadaId = null;

const API_URL    = 'http://localhost:3001';
const rolActual  = localStorage.getItem('userRole') || 'admin';
const usuarioActual = localStorage.getItem('userName') || rolActual;

// Referencias DOM
let tablaBody, menuAdmin;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    tablaBody = document.getElementById('tabla-body');
    menuAdmin = document.getElementById('menu-admin');

    // Mostrar usuario
    const usuarioDisplay = document.getElementById('usuario-display');
    if (usuarioDisplay) usuarioDisplay.textContent = `${usuarioActual} (${rolActual})`;

    // Permisos
    aplicarPermisos();

    // Cargar datos y pintar tabla
    await cargarAsignaciones();
    filtrarYCargarTabla();
    popularFiltros();

    // Eventos filtros
    document.getElementById('filtro-localidad')
        ?.addEventListener('change', filtrarYCargarTabla);
    document.getElementById('filtro-cadena')
        ?.addEventListener('change', filtrarYCargarTabla);
});

// CARGAR ASIGNACIONES DESDE JSON-SERVER
async function cargarAsignaciones() {
    try {
        const respuesta = await fetch(`${API_URL}/asignaciones`);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        asignaciones = await respuesta.json();
        console.log('Asignaciones cargadas:', asignaciones);
    } catch (error) {
        console.error('Error al cargar asignaciones:', error);
        asignaciones = [];
    }
}

// POPULAR FILTROS DINÁMICAMENTE
function popularFiltros() {
    const localidades = new Set(asignaciones.map(a => a.localidad));
    const cadenas     = new Set(asignaciones.map(a => a.tienda)); // ajusta si tienes campo cadena

    rellenarSelect('filtro-localidad', localidades);
    // rellenarSelect('filtro-cadena', cadenas); // descomenta si procede
}

function rellenarSelect(idSelect, valores) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    select.innerHTML = '<option value="Todas">Todas</option>';
    for (const valor of valores) {
        const option = document.createElement('option');
        option.value = valor;
        option.textContent = valor;
        select.appendChild(option);
    }
}

// FILTRAR Y PINTAR LA TABLA
function filtrarYCargarTabla() {
    if (!tablaBody) return;

    const localidadSel = document.getElementById('filtro-localidad')?.value || 'Todas';
    const cadenaSel    = document.getElementById('filtro-cadena')?.value    || 'Todas';

    tablaBody.innerHTML = '';

    const filtradas = asignaciones.filter(a =>
        (localidadSel === 'Todas' || a.localidad === localidadSel) &&
        (cadenaSel    === 'Todas' || a.tienda.toUpperCase().includes(cadenaSel.toUpperCase()))
    );

    if (!filtradas.length) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center; padding:20px;">
                    No hay asignaciones con esos filtros
                </td>
            </tr>`;
        return;
    }

    filtradas.forEach(a => {
        const fila = document.createElement('tr');
        fila.style.cursor = 'pointer';

        if (a.id === asignacionSeleccionadaId) {
            fila.style.backgroundColor = '#fde8e8';
        }

        const pendiente = a.pendienteValidacion
            ? ' <span style="color:orange;font-size:.75em;">(pendiente)</span>' : '';

        fila.innerHTML = `
            <td>${a.tienda}${pendiente}</td>
            <td>${a.domicilio}</td>
            <td>${a.localidad}</td>
            <td>${a.capitan}</td>
            <td>${a.viernes_manana}</td>
            <td>${a.viernes_tarde}</td>
            <td>${a.sabado_manana}</td>
            <td>${a.sabado_tarde}</td>
            <td>${a.observaciones}</td>
        `;

        fila.addEventListener('click', () => mostrarDetalle(a.id));
        tablaBody.appendChild(fila);
    });
}

// MOSTRAR DETALLE EN EL PANEL LATERAL
function mostrarDetalle(id) {
    asignacionSeleccionadaId = id;

    const a = asignaciones.find(x => x.id === id);
    if (!a) return;

    document.getElementById('d-tienda').textContent         = a.tienda;
    document.getElementById('d-domicilio').textContent      = a.domicilio;
    document.getElementById('d-localidad').textContent      = a.localidad;
    document.getElementById('d-capitan').textContent        = a.capitan;
    document.getElementById('d-viernes-manana').textContent = a.viernes_manana;
    document.getElementById('d-viernes-tarde').textContent  = a.viernes_tarde;
    document.getElementById('d-sabado-manana').textContent  = a.sabado_manana;
    document.getElementById('d-sabado-tarde').textContent   = a.sabado_tarde;
    document.getElementById('d-obs').textContent            = a.observaciones;

    // Repintamos para resaltar la fila seleccionada
    filtrarYCargarTabla();
}

// PERMISOS
function aplicarPermisos() {
    if (!menuAdmin) return;

    if (rolActual === 'admin') {
        menuAdmin.style.display = 'grid';
    } else {
        menuAdmin.style.display = 'none';
    }
}

// ACCIONES (placeholders — expande igual que en tiendas cuando los necesites)
function accion(tipo) {
    switch (tipo) {
        case 'anadir':
            alert('Función añadir pendiente');
            break;
        case 'modificar':
            if (!asignacionSeleccionadaId) {
                alert('Selecciona primero una asignación de la tabla.');
                return;
            }
            alert('Función modificar pendiente');
            break;
        case 'guardar':
            alert('Guardando cambios...');
            break;
        case 'exportar':
            alert('Exportando...');
            break;
        case 'cancelar':
            filtrarYCargarTabla();
            break;
        default:
            console.log('Acción no definida:', tipo);
    }
}