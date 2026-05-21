// npx json-server --port 3001 src/data/db.json

// VARIABLES GLOBALES
let asignaciones = [];
let asignacionSeleccionadaId = null;
let modoModal = 'anadir';
let tablaBody, menuAdmin;


const API_URL       = 'http://localhost:3001';
const rolActual     = localStorage.getItem('userRole') || 'admin';
const usuarioActual = localStorage.getItem('userName') || rolActual;

// Función para obtener el dashboard según el rol
function getDashboardURL() {
    const dashboards = {
        'admin': '../../welcome/welcome_admin.html',
        'coordinador': '../../welcome/welcome_coordinador.html',
        'capitan': '../../welcome/welcome_capitan.html',
        'capitan_coordinador': '../../welcome/welcome_capitan_coordinador.html',
        'entidad_colaboradora': '../../welcome/welcome_entidad_colaboradora.html',
        'responsable_tienda': '../../welcome/welcome_responsable_tienda.html'
    };
    return dashboards[rolActual] || '../../welcome/welcome_admin.html';
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    tablaBody = document.querySelector('#tabla-body');
    menuAdmin = document.querySelector('#menu-admin');

   
    // Permisos
    if (rolActual === 'admin' || rolActual === 'coordinador') {
        if (menuAdmin) menuAdmin.classList.remove('hidden');
    }

    // Cargar datos y pintar tabla
    await cargarAsignaciones();
    filtrarYCargarTabla();
    popularFiltros();

    // Eventos filtros
    document.querySelector('#filtro-localidad')
        ?.addEventListener('change', filtrarYCargarTabla);
    document.querySelector('#filtro-cadena')
        ?.addEventListener('change', filtrarYCargarTabla);

    // Eventos botones CRUD
    document.querySelector('#btn-anadir')
        .addEventListener('click', abrirModalAnadir);
    document.querySelector('#btn-modificar')
        .addEventListener('click', abrirModalModificar);
    document.querySelector('#btn-eliminar')
        .addEventListener('click', eliminarAsignacion);

    // Eventos modal
    document.querySelector('#btn-confirmar')
        .addEventListener('click', confirmarModal);
    document.querySelector('#btn-cancelar')
        .addEventListener('click', cerrarModal);
    document.querySelector('#btn-exportar')
        .addEventListener('click', exportarAsignacionVoluntarios);

    // Botón volver al menú principal
    document.querySelector('#btn-volver-menu')
        ?.addEventListener('click', () => window.location.href = getDashboardURL());
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
        mostrarErrorCarga('Error de conexión: No se pudieron cargar las asignaciones de voluntarios.');
        asignaciones = [];
    }
}

function mostrarErrorCarga(mensaje) {
    const contenedor = document.querySelector('.dashboard');
    if (!contenedor) return;
    if (document.querySelector('.mensaje-error-carga')) return;
    const div = document.createElement('div');
    div.className = 'mensaje-error-carga';
    div.textContent = mensaje;
    contenedor.prepend(div);
}

// POPULAR FILTROS DINÁMICAMENTE
function popularFiltros() {
    const localidades = new Set(asignaciones.map(a => a.localidad));
    const cadenas     = new Set(asignaciones.map(a => a.cadena));

    // Rellenamos los selects de filtros con las opciones únicas obtenidas de las asignaciones
    rellenarSelect('filtro-localidad', localidades);
    rellenarSelect('filtro-cadena',    cadenas);
}

function rellenarSelect(idSelect, valores) {
    const select = document.querySelector('#' + idSelect);
    if (!select) return;
    
    select.innerHTML = ''; // Limpieza permitida
    const optDefault = document.createElement('option');
    optDefault.value = 'Todas';
    optDefault.textContent = 'Todas';
    select.appendChild(optDefault);
 
    // Agregamos cada valor único como una opción en el select correspondiente
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

    const localidadSel = document.querySelector('#filtro-localidad')?.value || 'Todas';
    const cadenaSel    = document.querySelector('#filtro-cadena')?.value    || 'Todas';

    tablaBody.innerHTML = ''; 

    // Filtramos las asignaciones según los criterios seleccionados en los filtros de localidad y cadena
    const filtradas = asignaciones.filter(a =>
        (localidadSel === 'Todas' || a.localidad === localidadSel) &&
        (cadenaSel    === 'Todas' || a.cadena    === cadenaSel)
    );

    // Si no hay asignaciones que coincidan con los filtros, mostramos un mensaje en la tabla
    if (!filtradas.length) {
        const filaVacia = document.createElement('tr');
        const celdaVacia = document.createElement('td');
        celdaVacia.setAttribute('colspan', '9');
        celdaVacia.classList.add('empty-row-msg');
        celdaVacia.textContent = 'No hay asignaciones con esos filtros';
        filaVacia.appendChild(celdaVacia);
        tablaBody.appendChild(filaVacia);
        return;
    }

    // Pintamos las filas de la tabla con las asignaciones que cumplen los criterios
    filtradas.forEach(a => {
        const fila = document.createElement('tr');
        fila.classList.add('cursor-pointer');

        if (a.id === asignacionSeleccionadaId) {
            fila.classList.add('fila-seleccionada');  
        }

        // Celda Tienda + Badge Pendiente
        const tdTienda = document.createElement('td');
        tdTienda.textContent = a.tienda;
        if (a.pendienteValidacion) {
            const spanPendiente = document.createElement('span');
            spanPendiente.classList.add('badge-pendiente');
            spanPendiente.textContent = ' (pendiente)';
            tdTienda.appendChild(spanPendiente);
        }
        fila.appendChild(tdTienda);

        const campos = [
            a.domicilio,
            a.localidad,
            a.capitan,
            a.viernes_manana,
            a.viernes_tarde,
            a.sabado_manana,
            a.sabado_tarde,
            a.observaciones
        ];

        campos.forEach(texto => {
            const td = document.createElement('td');
            td.textContent = texto;
            fila.appendChild(td);
        });

        // Agregamos un evento click a cada fila para mostrar el detalle de la asignación al hacer clic
        fila.addEventListener('click', () => mostrarDetalle(a.id));
        tablaBody.appendChild(fila);
    });
}

// MOSTRAR DETALLE EN EL PANEL LATERAL
function mostrarDetalle(id) {
    asignacionSeleccionadaId = id;

    // Buscamos la asignación seleccionada en el array de asignaciones utilizando su ID para obtener todos sus detalles y mostrarlos en el panel lateral
    const a = asignaciones.find(x => x.id === id);
    if (!a) return;

    // Al hacer clic en una fila de la tabla, mostramos el detalle de la asignación seleccionada en el panel lateral,
    document.querySelector('#d-tienda').textContent         = a.tienda;
    document.querySelector('#d-domicilio').textContent      = a.domicilio;
    document.querySelector('#d-localidad').textContent      = a.localidad;
    document.querySelector('#d-capitan').textContent        = a.capitan;
    document.querySelector('#d-viernes-manana').textContent = a.viernes_manana;
    document.querySelector('#d-viernes-tarde').textContent  = a.viernes_tarde;
    document.querySelector('#d-sabado-manana').textContent  = a.sabado_manana;
    document.querySelector('#d-sabado-tarde').textContent   = a.sabado_tarde;
    document.querySelector('#d-obs').textContent            = a.observaciones;

    // Además, al seleccionar una asignación, resaltamos la fila correspondiente en la tabla para indicar visualmente cuál está activa
    filtrarYCargarTabla();
}

// MODAL — AÑADIR
function abrirModalAnadir() {
    modoModal = 'anadir';
    document.querySelector('#panel-titulo').textContent = 'AÑADIR ASIGNACIÓN';
    
    limpiarModal();
    document.querySelector('#f-id').disabled = false;
    
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
    document.querySelector('#panel-titulo').textContent = 'MODIFICAR ASIGNACIÓN';

    document.querySelector('#f-id').value             = a.id;
    document.querySelector('#f-tienda').value         = a.tienda;
    document.querySelector('#f-cadena').value         = a.cadena        || '';
    document.querySelector('#f-domicilio').value      = a.domicilio;
    document.querySelector('#f-localidad').value      = a.localidad;
    document.querySelector('#f-capitan').value        = a.capitan;
    document.querySelector('#f-viernes-manana').value = a.viernes_manana;
    document.querySelector('#f-viernes-tarde').value  = a.viernes_tarde;
    document.querySelector('#f-sabado-manana').value  = a.sabado_manana;
    document.querySelector('#f-sabado-tarde').value   = a.sabado_tarde;
    document.querySelector('#f-observaciones').value  = a.observaciones;

    document.querySelector('#f-id').disabled = true;

    abrirModal();
}

// CONFIRMAR MODAL
function confirmarModal() {
    // Dependiendo del modo en que se haya abierto el modal (añadir o modificar)
    if (modoModal === 'anadir') {
        crearAsignacion();
    } else {
        actualizarAsignacion();
    }
}

// CREAR — POST
async function crearAsignacion() {
    const id     = document.querySelector('#f-id').value.trim();
    const tienda = document.querySelector('#f-tienda').value.trim();

    
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
        cadena:         document.querySelector('#f-cadena').value.trim()         || '---',
        domicilio:      document.querySelector('#f-domicilio').value.trim()      || '---',
        localidad:      document.querySelector('#f-localidad').value.trim()      || '---',
        capitan:        document.querySelector('#f-capitan').value.trim()        || '---',
        viernes_manana: document.querySelector('#f-viernes-manana').value.trim() || '---',
        viernes_tarde:  document.querySelector('#f-viernes-tarde').value.trim()  || '---',
        sabado_manana:  document.querySelector('#f-sabado-manana').value.trim()  || '---',
        sabado_tarde:   document.querySelector('#f-sabado-tarde').value.trim()   || '---',
        observaciones:  document.querySelector('#f-observaciones').value.trim()  || ''
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
    const tienda = document.querySelector('#f-tienda').value.trim();

    if (!tienda) {
        alert('El campo Tienda es obligatorio.');
        return;
    }

    // Antes de intentar modificar la asignación, verificamos que exista una asignación seleccionada para actualizar,
    const actualizada = {
        id:             asignacionSeleccionadaId,
        tienda,
        cadena:         document.querySelector('#f-cadena').value.trim()         || '---',
        domicilio:      document.querySelector('#f-domicilio').value.trim()      || '---',
        localidad:      document.querySelector('#f-localidad').value.trim()      || '---',
        capitan:        document.querySelector('#f-capitan').value.trim()        || '---',
        viernes_manana: document.querySelector('#f-viernes-manana').value.trim() || '---',
        viernes_tarde:  document.querySelector('#f-viernes-tarde').value.trim()  || '---',
        sabado_manana:  document.querySelector('#f-sabado-manana').value.trim()  || '---',
        sabado_tarde:   document.querySelector('#f-sabado-tarde').value.trim()   || '---',
        observaciones:  document.querySelector('#f-observaciones').value.trim()  || ''
    };
    
    // Si la validación es correcta, enviamos una solicitud PATCH al servidor para actualizar la asignación seleccionada en la base de datos,
    try {
        const respuesta = await fetch(`${API_URL}/asignaciones/${asignacionSeleccionadaId}`, {
            method:  'PATCH',
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
            .forEach(id => document.querySelector('#' + id).textContent = '---');

        
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
    // Al abrir el modal, ocultamos el panel de detalle para mostrar solo el formulario del modal
    document.querySelector('#vista-detalle').classList.add('hidden');
    document.querySelector('#vista-formulario').classList.remove('hidden');
}

function cerrarModal() {
    // Al cerrar el modal, ocultamos el formulario y volvemos a mostrar el panel de detalle
    // limpiamos los campos
    document.querySelector('#vista-formulario').classList.add('hidden');
    document.querySelector('#vista-detalle').classList.remove('hidden');
    document.querySelector('#panel-titulo').textContent       = 'ASIGNACIÓN SELECCIONADA';
    limpiarModal();
}

function limpiarModal() {
    // Limpiamos los campos
    ['f-id','f-tienda','f-cadena','f-domicilio','f-localidad','f-capitan',
     'f-viernes-manana','f-viernes-tarde','f-sabado-manana','f-sabado-tarde','f-observaciones']
        .forEach(id => document.querySelector('#' + id).value = '');
}

// EXPORTAR ASIGNACIÓN DE VOLUNTARIOS A EXCEL
function exportarAsignacionVoluntarios() {
    if (asignaciones.length === 0) {
        alert('No hay asignaciones de voluntarios para exportar.');
        return;
    }

    // transformamos el array
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