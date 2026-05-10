// npx json-server --port 3001 src/data/datos.json

// VARIABLES GLOBALES
let asignaciones = [];
let asignacionSeleccionadaId = null;
let modoModal = 'anadir';
let tablaBody, menuAdmin;

const API_URL       = 'http://localhost:3001';
const rolActual     = localStorage.getItem('userRole') || 'admin';
const usuarioActual = localStorage.getItem('userName') || rolActual;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    tablaBody = document.getElementById('tabla-body');
    menuAdmin = document.getElementById('menu-admin');

    // Mostrar usuario
    const usuarioDisplay = document.getElementById('usuario-display');
    if (usuarioDisplay) usuarioDisplay.textContent = `${usuarioActual} (${rolActual})`;

    // Permisos
    if (rolActual === 'admin' || rolActual === 'coordinador') {
        if (menuAdmin) menuAdmin.classList.remove('hidden');
    }

    // Cargar datos y pintar tabla
    await cargarAsignaciones();
    filtrarYCargarTabla();
    popularFiltros();

    // Eventos filtros
    document.getElementById('filtro-localidad')
        ?.addEventListener('change', filtrarYCargarTabla);
    document.getElementById('filtro-cadena')
        ?.addEventListener('change', filtrarYCargarTabla);

    // Eventos botones CRUD
    document.getElementById('btn-anadir')
        .addEventListener('click', abrirModalAnadir);
    document.getElementById('btn-modificar')
        .addEventListener('click', abrirModalModificar);
    document.getElementById('btn-eliminar')
        .addEventListener('click', eliminarAsignacion);

    // Eventos modal
    document.getElementById('btn-confirmar')
        .addEventListener('click', confirmarModal);
    document.getElementById('btn-cancelar')
        .addEventListener('click', cerrarModal);
    document.getElementById('btn-exportar')
        .addEventListener('click', exportarAsignacionVoluntarios);
});

// CARGAR ASIGNACIONES
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
    const cadenas     = new Set(asignaciones.map(a => a.cadena));

    rellenarSelect('filtro-localidad', localidades);
    rellenarSelect('filtro-cadena',    cadenas);
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
        (cadenaSel    === 'Todas' || a.cadena    === cadenaSel)
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

    filtrarYCargarTabla();
}

// MODAL — AÑADIR
function abrirModalAnadir() {
    modoModal = 'anadir';
    document.getElementById('panel-titulo').textContent = 'AÑADIR ASIGNACIÓN';

    limpiarModal();
    document.getElementById('f-id').disabled = false;

    abrirModal();
}

// MODAL — MODIFICAR
function abrirModalModificar() {
    if (!asignacionSeleccionadaId) {
        alert('Selecciona primero una asignación de la tabla.');
        return;
    }

    const a = asignaciones.find(x => x.id === asignacionSeleccionadaId);
    if (!a) return;

    modoModal = 'modificar';
    document.getElementById('panel-titulo').textContent = 'MODIFICAR ASIGNACIÓN';

    document.getElementById('f-id').value             = a.id;
    document.getElementById('f-tienda').value         = a.tienda;
    document.getElementById('f-cadena').value         = a.cadena        || '';
    document.getElementById('f-domicilio').value      = a.domicilio;
    document.getElementById('f-localidad').value      = a.localidad;
    document.getElementById('f-capitan').value        = a.capitan;
    document.getElementById('f-viernes-manana').value = a.viernes_manana;
    document.getElementById('f-viernes-tarde').value  = a.viernes_tarde;
    document.getElementById('f-sabado-manana').value  = a.sabado_manana;
    document.getElementById('f-sabado-tarde').value   = a.sabado_tarde;
    document.getElementById('f-observaciones').value  = a.observaciones;

    document.getElementById('f-id').disabled = true;

    abrirModal();
}

// CONFIRMAR MODAL
function confirmarModal() {
    if (modoModal === 'anadir') {
        crearAsignacion();
    } else {
        actualizarAsignacion();
    }
}

// CREAR — POST
async function crearAsignacion() {
    const id     = document.getElementById('f-id').value.trim();
    const tienda = document.getElementById('f-tienda').value.trim();

    if (!id || !tienda) {
        alert('El ID y la Tienda son obligatorios.');
        return;
    }

    const existe = asignaciones.find(a => a.id === id);
    if (existe) {
        alert(`Ya existe una asignación con el ID "${id}".`);
        return;
    }

    const nueva = {
        id,
        tienda,
        cadena:         document.getElementById('f-cadena').value.trim()         || '---',
        domicilio:      document.getElementById('f-domicilio').value.trim()      || '---',
        localidad:      document.getElementById('f-localidad').value.trim()      || '---',
        capitan:        document.getElementById('f-capitan').value.trim()        || '---',
        viernes_manana: document.getElementById('f-viernes-manana').value.trim() || '---',
        viernes_tarde:  document.getElementById('f-viernes-tarde').value.trim()  || '---',
        sabado_manana:  document.getElementById('f-sabado-manana').value.trim()  || '---',
        sabado_tarde:   document.getElementById('f-sabado-tarde').value.trim()   || '---',
        observaciones:  document.getElementById('f-observaciones').value.trim()  || ''
    };

    try {
        const respuesta = await fetch(`${API_URL}/asignaciones`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(nueva)
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        await cargarAsignaciones();
        popularFiltros();
        filtrarYCargarTabla();
        cerrarModal();

        alert(`Asignación "${tienda}" añadida correctamente.`);

    } catch (error) {
        console.error('Error al crear asignación:', error);
        alert('No se pudo guardar. ¿Está arrancado json-server?');
    }
}

// ACTUALIZAR — PUT
async function actualizarAsignacion() {
    const tienda = document.getElementById('f-tienda').value.trim();

    if (!tienda) {
        alert('El campo Tienda es obligatorio.');
        return;
    }

    const actualizada = {
        id:             asignacionSeleccionadaId,
        tienda,
        cadena:         document.getElementById('f-cadena').value.trim()         || '---',
        domicilio:      document.getElementById('f-domicilio').value.trim()      || '---',
        localidad:      document.getElementById('f-localidad').value.trim()      || '---',
        capitan:        document.getElementById('f-capitan').value.trim()        || '---',
        viernes_manana: document.getElementById('f-viernes-manana').value.trim() || '---',
        viernes_tarde:  document.getElementById('f-viernes-tarde').value.trim()  || '---',
        sabado_manana:  document.getElementById('f-sabado-manana').value.trim()  || '---',
        sabado_tarde:   document.getElementById('f-sabado-tarde').value.trim()   || '---',
        observaciones:  document.getElementById('f-observaciones').value.trim()  || ''
    };

    try {
        const respuesta = await fetch(`${API_URL}/asignaciones/${asignacionSeleccionadaId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(actualizada)
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        await cargarAsignaciones();
        popularFiltros();
        filtrarYCargarTabla();
        mostrarDetalle(asignacionSeleccionadaId);
        cerrarModal();

        alert(`Asignación "${tienda}" modificada correctamente.`);

    } catch (error) {
        console.error('Error al modificar asignación:', error);
        alert('No se pudo modificar. ¿Está arrancado json-server?');
    }
}

// ELIMINAR — DELETE
async function eliminarAsignacion() {
    if (!asignacionSeleccionadaId) {
        alert('Selecciona primero una asignación de la tabla.');
        return;
    }

    const a = asignaciones.find(x => x.id === asignacionSeleccionadaId);
    const confirmado = confirm(
        `¿Seguro que quieres eliminar la asignación de "${a?.tienda}"?\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    try {
        const respuesta = await fetch(`${API_URL}/asignaciones/${asignacionSeleccionadaId}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        asignacionSeleccionadaId = null;
        ['d-tienda','d-domicilio','d-localidad','d-capitan',
         'd-viernes-manana','d-viernes-tarde','d-sabado-manana','d-sabado-tarde','d-obs']
            .forEach(id => document.getElementById(id).textContent = '---');

        await cargarAsignaciones();
        popularFiltros();
        filtrarYCargarTabla();

        alert('Asignación eliminada correctamente.');

    } catch (error) {
        console.error('Error al eliminar asignación:', error);
        alert('No se pudo eliminar. ¿Está arrancado json-server?');
    }
}

// HELPERS MODAL
function abrirModal() {
    document.getElementById('vista-detalle').classList.add('hidden');
    document.getElementById('vista-formulario').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('vista-formulario').classList.add('hidden');
    document.getElementById('vista-detalle').classList.remove('hidden');
    document.getElementById('panel-titulo').textContent       = 'ASIGNACIÓN SELECCIONADA';
    limpiarModal();
}

function limpiarModal() {
    ['f-id','f-tienda','f-cadena','f-domicilio','f-localidad','f-capitan',
     'f-viernes-manana','f-viernes-tarde','f-sabado-manana','f-sabado-tarde','f-observaciones']
        .forEach(id => document.getElementById(id).value = '');
}

// EXPORTAR ASIGNACIÓN DE VOLUNTARIOS A EXCEL
function exportarAsignacionVoluntarios() {
    if (asignaciones.length === 0) {
        alert('No hay asignaciones de voluntarios para exportar.');
        return;
    }

    const datos = asignaciones.map(a => ({
        'ID':               a.id             || '',
        'TIENDA':           a.tienda         || '',
        'CADENA':           a.cadena         || '',
        'DOMICILIO':        a.domicilio      || '',
        'LOCALIDAD':        a.localidad      || '',
        'CAPITÁN':          a.capitan        || '',
        'VIERNES MAÑANA':   a.viernes_manana || '',
        'VIERNES TARDE':    a.viernes_tarde  || '',
        'SÁBADO MAÑANA':    a.sabado_manana  || '',
        'SÁBADO TARDE':     a.sabado_tarde   || '',
        'OBSERVACIONES':    a.observaciones  || '',
        'PENDIENTE':        a.pendienteValidacion ? 'Sí' : 'No'
    }));

    const hoja  = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Asignaciones');
    XLSX.writeFile(libro, 'asignacion_voluntarios.xlsx');
}