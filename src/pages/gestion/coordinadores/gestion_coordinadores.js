// npx json-server --port 3001 src/data/db.json
// VARIABLES GLOBALES

let coordinadores = [];
let coordinadorSeleccionadoId = null; 
let modoModal = 'anadir'; 
let tablaBody, menuAdmin;

const API_URL = 'http://localhost:3001'; // json-server

// almacenamos rol actual porque segun cual sea tendrá diferentes funciones
const rolActual = localStorage.getItem('userRole') || 'admin';

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    // 1º elementos del HTML
    tablaBody = document.querySelector('#tabla-body');
    menuAdmin = document.querySelector('#admin-menu');

    // 2º Permisos
    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.classList.remove('hidden');
    }

    // 3º Cargamos y mostramos tablas
    await cargarCoordinadores();
    filtrarYCargarTabla();
    popularFiltros();

    // 4º Filtramos
    document.querySelector('#filtro-entidad')
        ?.addEventListener('change', filtrarYCargarTabla);
    document.querySelector('#filtro-area')
        ?.addEventListener('change', filtrarYCargarTabla);

    // 5º Botones CRUD
    document.querySelector('#btn-anadir')
        ?.addEventListener('click', abrirModalAnadir);

    document.querySelector('#btn-modificar')
        ?.addEventListener('click', abrirModalModificar);

    document.querySelector('#btn-eliminar')
        ?.addEventListener('click', eliminarCoordinador);

    // 6º Eventos del modal
    document.querySelector('#btn-confirmar')
        ?.addEventListener('click', confirmarModal);

    document.querySelector('#btn-cancelar')
        ?.addEventListener('click', cerrarModal);
});

// FUNCIONES
// Traemos datos del JSON y los guardamos en la vble coordinadores
async function cargarCoordinadores() {
    try {
        const respuesta = await fetch(`${API_URL}/coordinadores`);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        coordinadores = await respuesta.json();
        console.log('Coordinadores cargados:', coordinadores);

    } catch (error) {
        console.error('Error al cargar coordinadores:', error);
        coordinadores = [];
    }
}

// POPULAR LOS FILTROS DINÁMICAMENTE
function popularFiltros() {
    // Usamos Sets para obtener valores únicos de entidades y áreas
    const entidades = new Set(coordinadores.map(c => c.entidad).filter(Boolean));
    const areas     = new Set(coordinadores.map(c => c.area).filter(Boolean));

    // Rellenamos los <select> con las opciones obtenidas
    rellenarSelect('#filtro-entidad', entidades);
    rellenarSelect('#filtro-area',    areas);
}

// Añade las opciones a un <select> dado su selector y un Set de valores
function rellenarSelect(selector, valores) {
    const select = document.querySelector(selector);
    if (!select) return;

    // Conservamos solo la primera opción ("Todas")
    select.innerHTML = '<option value="Todas">Todas</option>';

    // Añadimos las opciones únicas al select
    for (const valor of valores) {
        const option = document.createElement('option');
        option.value = valor;
        option.textContent = valor;
        select.appendChild(option);
    }
}

// FILTRAR Y MOSTRAR LA TABLA
function filtrarYCargarTabla() {

    if (!tablaBody) return;

    // Obtenemos los valores seleccionados en los filtros
    const entidadSel = document.querySelector('#filtro-entidad')?.value || 'Todas';
    const areaSel    = document.querySelector('#filtro-area')?.value    || 'Todas';

    tablaBody.innerHTML = '';

    // Filtramos los coordinadores según los criterios seleccionados
    const filtrados = coordinadores.filter(c => {
        return (
            (entidadSel === 'Todas' || c.entidad === entidadSel) &&
            (areaSel    === 'Todas' || c.area    === areaSel)
        );
    });

    // Si no hay coordinadores que mostrar, mostramos un mensaje en la tabla
    if (filtrados.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="8"> No hay coordinadores con esos filtros </td>
            </tr>`;
        return;
    }

    // Creamos las filas de la tabla con los coordinadores filtrados
    filtrados.forEach(c => {
        const fila = document.createElement('tr');
        fila.style.cursor = 'pointer';

        if (c.id === coordinadorSeleccionadoId) {
            fila.style.backgroundColor = '#fde8e8';
        }

        // Rellenamos las celdas de la fila con los datos del coordinador
        fila.innerHTML = `
            <td>${c.nombre}</td>
            <td>${c.entidad}</td>
            <td>${c.area}</td>
            <td>${c.telefono || ''}</td>
            <td>${c.email || ''}</td>
            <td style="text-align:center">${c.tiendas || 0}</td>
            <td>${c.usuario || ''}</td>
            <td>************</td>
        `;

        fila.addEventListener('click', () => mostrarDetalle(c.id));
        tablaBody.appendChild(fila);
    });
}

// Datos panel lateral
function mostrarDetalle(id) {

    coordinadorSeleccionadoId = id;

    // Buscamos el coordinador seleccionado en la lista completa (no filtrada)
    const c = coordinadores.find(coord => coord.id === id);
    if (!c) return;

    // Rellenamos el panel lateral con los datos del coordinador seleccionado
    document.querySelector('#det-id').textContent      = c.id;
    document.querySelector('#det-entidad').textContent = c.entidad || '---';
    document.querySelector('#det-area').textContent    = c.area || '---';
    document.querySelector('#det-tlf').textContent     = c.telefono || '---';
    document.querySelector('#det-email').textContent   = c.email || '---';
    document.querySelector('#det-tiendas').textContent = c.tiendas || '0';
    document.querySelector('#det-usuario').textContent = c.usuario || '---';

    filtrarYCargarTabla();
}

// ABRIR MODAL PARA AÑADIR
function abrirModalAnadir() {
    modoModal = 'anadir';
    document.querySelector('#panel-titulo').textContent = 'AÑADIR COORDINADOR';

    // Limpiamos el formulario y habilitamos el campo ID para la creación
    limpiarModal();
    document.querySelector('#f-id').disabled = false;

    // Abrimos el modal para añadir un nuevo coordinador
    abrirModal();
}

// ABRIR MODAL PARA MODIFICAR
function abrirModalModificar() {

    if (!coordinadorSeleccionadoId) {
        alert('Selecciona primero un coordinador de la tabla.');
        return;
    }

    // Buscamos el coordinador seleccionado en la lista completa (no filtrada)
    const c = coordinadores.find(coord => coord.id === coordinadorSeleccionadoId);
    if (!c) return;

    modoModal = 'modificar';
    document.querySelector('#panel-titulo').textContent = 'MODIFICAR COORDINADOR';

    // Rellenamos el formulario con los datos del coordinador seleccionado
    document.querySelector('#f-id').value      = c.id;
    document.querySelector('#f-nombre').value  = c.nombre;
    document.querySelector('#f-entidad').value = c.entidad || '';
    document.querySelector('#f-area').value    = c.area || '';
    document.querySelector('#f-tlf').value     = c.telefono || '';
    document.querySelector('#f-email').value   = c.email || '';
    document.querySelector('#f-tiendas').value = c.tiendas || 0;
    document.querySelector('#f-usuario').value = c.usuario || '';
    document.querySelector('#f-pass').value    = c.password || '';

    document.querySelector('#f-id').disabled = true;

    abrirModal();
}

// EDITAR/CREAR
function confirmarModal() {
    // Según el modo del modal, llamamos a la función correspondiente para crear o actualizar el coordinador
    if (modoModal === 'anadir') {
        crearCoordinador();
    } else {
        actualizarCoordinador();
    }
}

// FUNCIONES CRUD
async function crearCoordinador() {

    const id     = document.querySelector('#f-id').value.trim();
    const nombre = document.querySelector('#f-nombre').value.trim();

    // Validamos que el ID y el Nombre estén completos, ya que son campos obligatorios para crear un nuevo coordinador
    if (!id || !nombre) {
        alert('El ID y el Nombre son obligatorios.');
        return;
    }

    // Verificamos que no exista otro coordinador con el mismo ID para evitar duplicados
    const existe = coordinadores.find(c => c.id === id);
    if (existe) {
        alert(`Ya existe un coordinador con el ID "${id}".`);
        return;
    }

    // Creamos un nuevo objeto coordinador con los datos ingresados en el formulario
    const nuevoCoord = {
        id,
        nombre,
        entidad:  document.querySelector('#f-entidad').value.trim(),
        area:     document.querySelector('#f-area').value.trim(),
        telefono: document.querySelector('#f-tlf').value.trim(),
        email:    document.querySelector('#f-email').value.trim(),
        tiendas:  parseInt(document.querySelector('#f-tiendas').value) || 0,
        usuario:  document.querySelector('#f-usuario').value.trim(),
        password: document.querySelector('#f-pass').value.trim()
    };

    // Enviamos una solicitud POST al servidor para crear el nuevo coordinador
    try {
        const respuesta = await fetch(`${API_URL}/coordinadores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCoord)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // Si la creación fue exitosa, recargamos los coordinadores, actualizamos los filtros y la tabla, y cerramos el modal
        await cargarCoordinadores();
        popularFiltros();
        filtrarYCargarTabla();
        cerrarModal();

        alert(`Coordinador "${nombre}" añadido correctamente.`);

    } catch (error) {
        console.error('Error al crear coordinador:', error);
        alert('No se pudo guardar el coordinador.');
    }
}

// Función para actualizar un coordinador existente con los datos ingresados en el formulario
async function actualizarCoordinador() {

    const nombre = document.querySelector('#f-nombre').value.trim();

    if (!nombre) {
        alert('El Nombre es obligatorio.');
        return;
    }

    // Creamos un objeto con los datos actualizados del coordinador, manteniendo el mismo ID
    const coordActualizado = {
        id:       coordinadorSeleccionadoId,
        nombre,
        entidad:  document.querySelector('#f-entidad').value.trim(),
        area:     document.querySelector('#f-area').value.trim(),
        telefono: document.querySelector('#f-tlf').value.trim(),
        email:    document.querySelector('#f-email').value.trim(),
        tiendas:  parseInt(document.querySelector('#f-tiendas').value) || 0,
        usuario:  document.querySelector('#f-usuario').value.trim(),
        password: document.querySelector('#f-pass').value.trim()
    };

    // Enviamos una solicitud PUT al servidor para actualizar el coordinador seleccionado con los nuevos datos
    try {
        const respuesta = await fetch(`${API_URL}/coordinadores/${coordinadorSeleccionadoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(coordActualizado)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // Si la actualización fue exitosa, recargamos los coordinadores, actualizamos los filtros y la tabla, mostramos 
        // el detalle del coordinador actualizado y cerramos el modal
        await cargarCoordinadores();
        popularFiltros();
        filtrarYCargarTabla();
        mostrarDetalle(coordinadorSeleccionadoId);
        cerrarModal();

        alert(`Coordinador "${nombre}" modificado correctamente.`);

    } catch (error) {
        console.error('Error al modificar coordinador:', error);
        alert('No se pudo modificar el coordinador.');
    }
}

// Función para eliminar el coordinador seleccionado después de confirmar la acción con el usuario
async function eliminarCoordinador() {

    if (!coordinadorSeleccionadoId) {
        alert('Selecciona primero un coordinador de la tabla.');
        return;
    }

    // Buscamos el coordinador seleccionado en la lista completa (no filtrada) para mostrar su nombre en la confirmación
    const c = coordinadores.find(coord => coord.id === coordinadorSeleccionadoId);
    const confirmado = confirm(
        `¿Seguro que quieres eliminar a "${c?.nombre}"?\nEsta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    // Enviamos una solicitud DELETE al servidor para eliminar el coordinador seleccionado
    try {
        const respuesta = await fetch(`${API_URL}/coordinadores/${coordinadorSeleccionadoId}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // Si la eliminación fue exitosa, recargamos los coordinadores, actualizamos los filtros y la tabla, 
        // limpiamos el panel lateral y mostramos un mensaje de éxito
        coordinadorSeleccionadoId = null;
        ['#det-id','#det-entidad','#det-area','#det-tlf','#det-email','#det-tiendas','#det-usuario']
            .forEach(selector => {
                const el = document.querySelector(selector);
                if (el) el.textContent = '---';
            });

        // Recargamos los coordinadores y actualizamos la tabla y los filtros para reflejar la eliminación
        await cargarCoordinadores();
        popularFiltros();
        filtrarYCargarTabla();

        alert('Coordinador eliminado correctamente.');

    } catch (error) {
        console.error('Error al eliminar coordinador:', error);
        alert('No se pudo eliminar el coordinador.');
    }
}

// Modales
function abrirModal() {
    const vistaDetalle = document.querySelector('#vista-detalle');
    const vistaForm = document.querySelector('#vista-formulario');
    // Para mostrar el formulario del modal, ocultamos el panel de detalle y mostramos el formulario
    if (vistaDetalle) vistaDetalle.classList.add('hidden');
    if (vistaForm) vistaForm.classList.remove('hidden');
}

function cerrarModal() {
    const vistaDetalle = document.querySelector('#vista-detalle');
    const vistaForm = document.querySelector('#vista-formulario');
    // Para cerrar el modal, ocultamos el formulario y mostramos el panel de detalle
    if (vistaForm) vistaForm.classList.add('hidden');
    if (vistaDetalle) vistaDetalle.classList.remove('hidden');
    
    const panelTitulo = document.querySelector('#panel-titulo');
    // Al cerrar el modal, restablecemos el título del panel lateral a su estado original
    if (panelTitulo) panelTitulo.textContent = 'COORDINADOR SELECCIONADO';

    limpiarModal();
}

function limpiarModal() {
    // Limpiamos los campos del formulario para que no queden datos residuales al abrir el modal para añadir o modificar
    ['#f-id','#f-nombre','#f-entidad','#f-area','#f-tlf','#f-email','#f-tiendas','#f-usuario', '#f-pass']
        .forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.value = '';
        });
}
