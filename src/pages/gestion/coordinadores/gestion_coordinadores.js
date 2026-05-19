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

    const entidades = new Set(coordinadores.map(c => c.entidad).filter(Boolean));
    const areas     = new Set(coordinadores.map(c => c.area).filter(Boolean));

    rellenarSelect('#filtro-entidad', entidades);
    rellenarSelect('#filtro-area',    areas);
}

// Añade las opciones a un <select> dado su selector y un Set de valores
function rellenarSelect(selector, valores) {
    const select = document.querySelector(selector);
    if (!select) return;

    // Conservamos solo la primera opción ("Todas")
    select.innerHTML = '<option value="Todas">Todas</option>';

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

    //leemos valor del filtro
    const entidadSel = document.querySelector('#filtro-entidad')?.value || 'Todas';
    const areaSel    = document.querySelector('#filtro-area')?.value    || 'Todas';

    tablaBody.innerHTML = '';

    const filtrados = coordinadores.filter(c => {
        return (
            (entidadSel === 'Todas' || c.entidad === entidadSel) &&
            (areaSel    === 'Todas' || c.area    === areaSel)
        );
    });

    if (filtrados.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="8"> No hay coordinadores con esos filtros </td>
            </tr>`;
        return;
    }

    filtrados.forEach(c => {
        const fila = document.createElement('tr');
        fila.style.cursor = 'pointer';

        if (c.id === coordinadorSeleccionadoId) {
            fila.style.backgroundColor = '#fde8e8';
        }

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

    const c = coordinadores.find(coord => coord.id === id);
    if (!c) return;

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

    limpiarModal();
    document.querySelector('#f-id').disabled = false;

    abrirModal();
}

// ABRIR MODAL PARA MODIFICAR
function abrirModalModificar() {

    if (!coordinadorSeleccionadoId) {
        alert('Selecciona primero un coordinador de la tabla.');
        return;
    }

    const c = coordinadores.find(coord => coord.id === coordinadorSeleccionadoId);
    if (!c) return;

    modoModal = 'modificar';
    document.querySelector('#panel-titulo').textContent = 'MODIFICAR COORDINADOR';

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
    if (modoModal === 'anadir') {
        crearCoordinador();
    } else {
        actualizarCoordinador();
    }
}

async function crearCoordinador() {

    const id     = document.querySelector('#f-id').value.trim();
    const nombre = document.querySelector('#f-nombre').value.trim();

    if (!id || !nombre) {
        alert('El ID y el Nombre son obligatorios.');
        return;
    }

    const existe = coordinadores.find(c => c.id === id);
    if (existe) {
        alert(`Ya existe un coordinador con el ID "${id}".`);
        return;
    }

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

    try {
        const respuesta = await fetch(`${API_URL}/coordinadores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCoord)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

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

async function actualizarCoordinador() {

    const nombre = document.querySelector('#f-nombre').value.trim();

    if (!nombre) {
        alert('El Nombre es obligatorio.');
        return;
    }

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

    try {
        const respuesta = await fetch(`${API_URL}/coordinadores/${coordinadorSeleccionadoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(coordActualizado)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

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

async function eliminarCoordinador() {

    if (!coordinadorSeleccionadoId) {
        alert('Selecciona primero un coordinador de la tabla.');
        return;
    }

    const c = coordinadores.find(coord => coord.id === coordinadorSeleccionadoId);
    const confirmado = confirm(
        `¿Seguro que quieres eliminar a "${c?.nombre}"?\nEsta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {
        const respuesta = await fetch(`${API_URL}/coordinadores/${coordinadorSeleccionadoId}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        coordinadorSeleccionadoId = null;
        ['#det-id','#det-entidad','#det-area','#det-tlf','#det-email','#det-tiendas','#det-usuario']
            .forEach(selector => {
                const el = document.querySelector(selector);
                if (el) el.textContent = '---';
            });

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
    if (vistaDetalle) vistaDetalle.classList.add('hidden');
    if (vistaForm) vistaForm.classList.remove('hidden');
}

function cerrarModal() {
    const vistaDetalle = document.querySelector('#vista-detalle');
    const vistaForm = document.querySelector('#vista-formulario');
    if (vistaForm) vistaForm.classList.add('hidden');
    if (vistaDetalle) vistaDetalle.classList.remove('hidden');

    const panelTitulo = document.querySelector('#panel-titulo');
    if (panelTitulo) panelTitulo.textContent = 'COORDINADOR SELECCIONADO';

    limpiarModal();
}

function limpiarModal() {
    ['#f-id','#f-nombre','#f-entidad','#f-area','#f-tlf','#f-email','#f-tiendas','#f-usuario', '#f-pass']
        .forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.value = '';
        });
}
