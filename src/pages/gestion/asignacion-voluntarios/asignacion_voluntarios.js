// npx json-server --port 3001 src/data/db.json

// VARIABLES GLOBALES
let asignaciones = [];
let asignacionSeleccionadaId = null;
let modoModal = 'anadir';
let tablaBody, menuAdmin;

// CONSTANTES
const API_URL       = 'http://localhost:3001';
const rolActual     = localStorage.getItem('userRole') || 'admin';
const usuarioActual = localStorage.getItem('userName') || rolActual;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    tablaBody = document.querySelector('#tabla-body');
    menuAdmin = document.querySelector('#menu-admin');

    // Mostrar usuario
    const usuarioDisplay = document.querySelector('#usuario-display');
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

    // Rellenamos los selects de filtros con las opciones únicas obtenidas de las asignaciones
    rellenarSelect('filtro-localidad', localidades);
    rellenarSelect('filtro-cadena',    cadenas);
}

function rellenarSelect(idSelect, valores) {
    const select = document.querySelector('#' + idSelect);
    if (!select) return;
    select.innerHTML = '<option value="Todas">Todas</option>';
 
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

    // Si no hay asignaciones que coincidan con los filtros, mostramos un mensaje en la tabla indicando que no se encontraron resultados
    if (!filtradas.length) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center; padding:20px;">
                    No hay asignaciones con esos filtros
                </td>
            </tr>`;
        return;
    }

    // Pintamos las filas de la tabla con las asignaciones que cumplen los criterios de filtrado, 
    // y agregamos un evento click a cada fila para mostrar el detalle de la asignación al hacer clic
    filtradas.forEach(a => {
        const fila = document.createElement('tr');

        if (a.id === asignacionSeleccionadaId) {
            fila.classList.add('fila-seleccionada');  
        }

        const pendiente = a.pendienteValidacion
            ? ' <span style="color:orange;font-size:.75em;">(pendiente)</span>' : '';

        // Agregamos el contenido de cada celda de la fila con los datos de la asignación, y si la 
        // asignación está pendiente de validación, añadimos un indicador visual junto al nombre de la tienda    
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

    // Buscamos la asignación seleccionada en el array de asignaciones utilizando su ID para obtener todos sus detalles 
    // y mostrarlos en el formulario del modal para que el usuario pueda modificarlos
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

    // Validamos que los campos obligatorios (ID y Tienda) estén completos antes de intentar crear una nueva asignación,
    if (!id || !tienda) {
        alert('El ID y la Tienda son obligatorios.');
        return;
    }

    // Antes de crear una nueva asignación, verificamos que no exista ya una con el mismo ID para evitar duplicados, 
    // ya que el ID es un identificador único para cada asignación
    const existe = asignaciones.find(a => a.id === id);
    if (existe) {
        alert(`Ya existe una asignación con el ID "${id}".`);
        return;
    }

    // Si la validación es correcta, creamos un nuevo objeto de asignación con los datos ingresados en el formulario del modal,
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

    // Luego, enviamos una solicitud POST al servidor para guardar la nueva asignación en la base de datos, 
    // y si la operación es exitosa, recargamos la lista de asignaciones, actualizamos los filtros y la tabla, 
    // cerramos el modal y mostramos un mensaje de confirmación al usuario indicando que la asignación se ha añadido correctamente
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

        // Si la operación es exitosa, recargamos la lista de asignaciones, actualizamos los filtros y la tabla, 
        // mostramos el detalle de la asignación modificada, cerramos el modal y mostramos un mensaje de confirmación 
        // al usuario indicando que la asignación se ha modificado correctamente
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

    // Antes de intentar eliminar la asignación, verificamos que exista una asignación seleccionada para eliminar,
    const a = asignaciones.find(x => x.id === asignacionSeleccionadaId);
    // Si la validación es correcta, mostramos un mensaje de confirmación al usuario para asegurarnos de que realmente desea eliminar la asignación seleccionada
    const confirmado = confirm(
        `¿Seguro que quieres eliminar la asignación de "${a?.tienda}"?\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    // Si el usuario confirma la eliminación, enviamos una solicitud DELETE al servidor para eliminar la asignación seleccionada de la base de datos,
    try {
        const respuesta = await fetch(`${API_URL}/asignaciones/${asignacionSeleccionadaId}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        // Si la operación es exitosa, recargamos la lista de asignaciones, actualizamos los filtros y la tabla
        asignacionSeleccionadaId = null;
        ['d-tienda','d-domicilio','d-localidad','d-capitan',
         'd-viernes-manana','d-viernes-tarde','d-sabado-manana','d-sabado-tarde','d-obs']
            .forEach(id => document.querySelector('#' + id).textContent = '---');

        // Después de eliminar una asignación, recargamos la lista de asignaciones, actualizamos los filtros y la tabla para reflejar los cambios,
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
    // Al cerrar el modal, ocultamos el formulario y volvemos a mostrar el panel de detalle, 
    // además de limpiar los campos del formulario para que no queden datos residuales al abrirlo nuevamente
    document.querySelector('#vista-formulario').classList.add('hidden');
    document.querySelector('#vista-detalle').classList.remove('hidden');
    document.querySelector('#panel-titulo').textContent       = 'ASIGNACIÓN SELECCIONADA';
    limpiarModal();
}

function limpiarModal() {
    // Limpiamos los campos del formulario del modal para que no queden datos residuales al abrirlo nuevamente
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

    // Para exportar la asignación de voluntarios a un archivo Excel, primero transformamos el array de asignaciones en un formato adecuado para la librería XLSX
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

    // Luego, utilizamos la librería XLSX para crear un libro de Excel a partir de los datos transformados, y finalmente descargamos el archivo 
    // con el nombre "asignacion_voluntarios.xlsx"
    const hoja  = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Asignaciones');
    XLSX.writeFile(libro, 'asignacion_voluntarios.xlsx');
}