// VARIABLES GLOBALES
let colaboradores            = [];
let tiendas                  = [];
let colaboradorSeleccionadoId = null;
let modoModal                = 'anadir'; // 'anadir' | 'modificar'
let tablaBody, adminMenu, coordMenu;

const API_URL = 'http://localhost:3001';

const rolActual     = localStorage.getItem('userRole') || 'admin';
const usuarioActual = localStorage.getItem('userName') || rolActual;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    // 1º elementos del HTML
    tablaBody = document.getElementById('tabla-body');
    adminMenu = document.getElementById('admin-menu');
    coordMenu = document.getElementById('coord-menu');

    // 2º Permisos
    if (rolActual === 'admin') {
        adminMenu.style.display = 'grid';
    } else if (rolActual === 'coordinador' || rolActual === 'capitan_coordinador') {
        coordMenu.style.display = 'grid';
    }

    // 3º Cargamos y mostramos tablas
    await cargarColaboradores();
    await cargarTiendas();

    filtrarYCargarTabla();
    popularFiltros();

    // Filtros
    document.getElementById('filtro-localidad')
        .addEventListener('change', filtrarYCargarTabla);
    document.getElementById('filtro-coord')
        .addEventListener('change', filtrarYCargarTabla);

    // Botones CRUD — admin
    document.getElementById('btn-anadir')
        ?.addEventListener('click', abrirModalAnadir);
    document.getElementById('btn-modificar')
        ?.addEventListener('click', abrirModalModificar);
    document.getElementById('btn-eliminar')
        ?.addEventListener('click', eliminarColaborador);
    document.getElementById('btn-asignar')
        ?.addEventListener('click', abrirVistaAsignar);
    document.getElementById('btn-exportar')
        ?.addEventListener('click', exportarExcel);

    // Botones CRUD — coordinador
    document.getElementById('btn-anadir-pendiente')
        ?.addEventListener('click', abrirModalAniadirPendiente);
    document.getElementById('btn-exportar-coord')
        ?.addEventListener('click', exportarExcel);

    // Botones del formulario
    document.getElementById('btn-confirmar')
        .addEventListener('click', confirmarModal);
    document.getElementById('btn-cancelar')
        .addEventListener('click', cerrarFormulario);

    // Botones de asignar tienda
    document.getElementById('btn-confirmar-asignar')
        .addEventListener('click', confirmarAsignar);
    document.getElementById('btn-cancelar-asignar')
        .addEventListener('click', cerrarVistaAsignar);
});

// FUNCIONES
// Traemos datos del JSON y los guardamos en la vble tienda
async function cargarColaboradores() {
    try {
        const res = await fetch(`${API_URL}/colaboradores`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        colaboradores = await res.json();
    } catch (err) {
        console.error('Error cargando colaboradores:', err);
        colaboradores = [];
    }
}

async function cargarTiendas() {
    try {
        const res = await fetch(`${API_URL}/tiendas`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        tiendas = await res.json();
    } catch (err) {
        console.error('Error cargando tiendas:', err);
        tiendas = [];
    }
}

// FILTROS
function popularFiltros() {
    const localidades   = new Set(colaboradores.map(c => c.localidad));
    const coordinadores = new Set(colaboradores.map(c => c.coord));

    rellenarSelect('filtro-localidad', localidades);
    rellenarSelect('filtro-coord',     coordinadores);
}

function rellenarSelect(idSelect, valores) {
    const select = document.getElementById(idSelect);
    select.innerHTML = '<option value="Todas">Todas</option>';
    for (const valor of valores) {
        const opt = document.createElement('option');
        opt.value       = valor;
        opt.textContent = valor;
        select.appendChild(opt);
    }
}

// FILTRAR Y MOSTRAR LA TABLA
function filtrarYCargarTabla() {
    if (!tablaBody) return;

    const localidadSel = document.getElementById('filtro-localidad')?.value || 'Todas';
    const coordSel     = document.getElementById('filtro-coord')?.value     || 'Todas';

    tablaBody.innerHTML = '';

    const filtrados = colaboradores.filter(c =>
        (localidadSel === 'Todas' || c.localidad === localidadSel) &&
        (coordSel     === 'Todas' || c.coord     === coordSel)
    );

    if (filtrados.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td> No hay colaboradores con esos filtros</td>
            </tr>`;
        return;
    }

    filtrados.forEach(c => {
        const fila = document.createElement('tr');
        fila.style.cursor = 'pointer';

        if (c.id === colaboradorSeleccionadoId) {
            fila.style.backgroundColor = '#fde8e8';
        }

        const pendiente = c.pendienteValidacion
            ? ' <span style="color:orange;font-size:.75em;">(pendiente)</span>'
            : '';

        fila.innerHTML = `
            <td>${c.nombre}${pendiente}</td>
            <td>${c.domicilio  || '---'}</td>
            <td>${c.localidad  || '---'}</td>
            <td>${c.colabora   || '---'}</td>
            <td>${c.coord      || '---'}</td>
            <td>${c.contacto1?.nombre || '---'}</td>
            <td>${c.observaciones || ''}</td>
        `;

        fila.addEventListener('click', () => mostrarDetalle(c.id));
        tablaBody.appendChild(fila);
    });
}

// Datos panel lateral
function mostrarDetalle(id) {
    colaboradorSeleccionadoId = id;

    const c = colaboradores.find(x => x.id === id);
    if (!c) return;

    document.getElementById('det-nombre').textContent   = c.nombre        || '---';
    document.getElementById('det-dom').textContent      = c.domicilio     || '---';
    document.getElementById('det-cp').textContent       = c.cp            || '---';
    document.getElementById('det-localidad').textContent = c.localidad    || '---';
    document.getElementById('det-colabora').textContent = c.colabora      || '---';
    document.getElementById('det-coord').textContent    = c.coord         || '---';
    document.getElementById('det-tienda').textContent   = c.tiendaId      || '---';
    document.getElementById('det-obs').textContent      = c.observaciones || '---';

    document.getElementById('det-c1').textContent =
        c.contacto1?.nombre ? `${c.contacto1.nombre} — ${c.contacto1.tel}` : '---';
    document.getElementById('det-c2').textContent =
        c.contacto2?.nombre ? `${c.contacto2.nombre} — ${c.contacto2.tel}` : '---';
    document.getElementById('det-c3').textContent =
        c.contacto3?.nombre ? `${c.contacto3.nombre} — ${c.contacto3.tel}` : '---';

    mostrarVista('detalle');
    filtrarYCargarTabla();
}

// CONTROL DE VISTAS DEL PANEL
function mostrarVista(cual) {
    document.getElementById('vista-detalle').style.display   = cual === 'detalle'  ? 'block' : 'none';
    document.getElementById('vista-formulario').style.display = cual === 'formulario' ? 'block' : 'none';
    document.getElementById('vista-asignar').style.display   = cual === 'asignar'  ? 'block' : 'none';
}

// AÑADIR
function abrirModalAnadir() {
    modoModal = 'anadir';
    document.getElementById('panel-titulo').textContent = 'AÑADIR COLABORADOR';
    limpiarFormulario();
    mostrarVista('formulario');
}

function abrirModalAniadirPendiente() {
    modoModal = 'anadir-pendiente';
    document.getElementById('panel-titulo').textContent = 'AÑADIR COLABORADOR (Pendiente validación)';
    limpiarFormulario();
    mostrarVista('formulario');
}

// MODIFICAR
function abrirModalModificar() {
    if (!colaboradorSeleccionadoId) {
        alert('Selecciona primero un colaborador de la tabla.');
        return;
    }

    const c = colaboradores.find(x => x.id === colaboradorSeleccionadoId);
    if (!c) return;

    modoModal = 'modificar';
    document.getElementById('panel-titulo').textContent = 'MODIFICAR COLABORADOR';

    // Rellenamos el formulario con los datos actuales
    document.getElementById('f-nombre').value     = c.nombre        || '';
    document.getElementById('f-domicilio').value  = c.domicilio     || '';
    document.getElementById('f-cp').value         = c.cp            || '';
    document.getElementById('f-localidad').value  = c.localidad     || '';
    document.getElementById('f-colabora').value   = c.colabora      || '';
    document.getElementById('f-coord-input').value = c.coord        || '';
    document.getElementById('f-c1-nombre').value  = c.contacto1?.nombre || '';
    document.getElementById('f-c1-tel').value     = c.contacto1?.tel    || '';
    document.getElementById('f-c2-nombre').value  = c.contacto2?.nombre || '';
    document.getElementById('f-c2-tel').value     = c.contacto2?.tel    || '';
    document.getElementById('f-c3-nombre').value  = c.contacto3?.nombre || '';
    document.getElementById('f-c3-tel').value     = c.contacto3?.tel    || '';
    document.getElementById('f-obs').value        = c.observaciones || '';

    mostrarVista('formulario');
}

// Crear o actualizar
function confirmarModal() {
    if (modoModal === 'anadir' || modoModal === 'anadir-pendiente') {
        crearColaborador();
    } else {
        actualizarColaborador();
    }
}

// CRUD
// CREAR COLABORADOR — POST
async function crearColaborador() {
    const nombre = document.getElementById('f-nombre').value.trim();

    if (!nombre) {
        alert('El campo NOMBRE es obligatorio.');
        return;
    }

    const nuevo = construirObjeto();
    nuevo.pendienteValidacion = (modoModal === 'anadir-pendiente');

    try {
        const res = await fetch(`${API_URL}/colaboradores`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(nuevo)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await cargarColaboradores();
        popularFiltros();
        filtrarYCargarTabla();
        cerrarFormulario();

        alert(`Colaborador "${nombre}" añadido correctamente.`);

    } catch (err) {
        console.error('Error al crear colaborador:', err);
        alert('No se pudo guardar el colaborador. ¿Está arrancado json-server?');
    }
}

// ACTUALIZAR COLABORADOR — PUT
async function actualizarColaborador() {
    const nombre = document.getElementById('f-nombre').value.trim();

    if (!nombre) {
        alert('El campo NOMBRE es obligatorio.');
        return;
    }

    // Conservamos el tiendaId y pendienteValidacion que ya tenía
    const original = colaboradores.find(x => x.id === colaboradorSeleccionadoId);

    const actualizado = {
        ...construirObjeto(),
        id:                   colaboradorSeleccionadoId,
        tiendaId:             original?.tiendaId             || null,
        pendienteValidacion:  original?.pendienteValidacion  || false
    };

    try {
        const res = await fetch(`${API_URL}/colaboradores/${colaboradorSeleccionadoId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(actualizado)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await cargarColaboradores();
        popularFiltros();
        filtrarYCargarTabla();
        mostrarDetalle(colaboradorSeleccionadoId);
        cerrarFormulario();

        alert(`Colaborador "${nombre}" modificado correctamente.`);

    } catch (err) {
        console.error('Error al modificar colaborador:', err);
        alert('No se pudo modificar el colaborador. ¿Está arrancado json-server?');
    }
}

// ELIMINAR COLABORADOR — DELETE
async function eliminarColaborador() {
    if (!colaboradorSeleccionadoId) {
        alert('Selecciona primero un colaborador de la tabla.');
        return;
    }

    const c = colaboradores.find(x => x.id === colaboradorSeleccionadoId);
    const confirmado = confirm(
        `¿Seguro que quieres eliminar "${c?.nombre}"?\nEsta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    try {
        const res = await fetch(`${API_URL}/colaboradores/${colaboradorSeleccionadoId}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        colaboradorSeleccionadoId = null;
        limpiarDetalle();

        await cargarColaboradores();
        popularFiltros();
        filtrarYCargarTabla();

        alert('Colaborador eliminado correctamente.');

    } catch (err) {
        console.error('Error al eliminar colaborador:', err);
        alert('No se pudo eliminar el colaborador. ¿Está arrancado json-server?');
    }
}

// ASIGNAR TIENDA
function abrirVistaAsignar() {
    if (!colaboradorSeleccionadoId) {
        alert('Selecciona primero un colaborador de la tabla.');
        return;
    }

    // Populamos el select de tiendas
    const select = document.getElementById('f-tienda-id');
    select.innerHTML = '<option value="">-- Sin asignar --</option>';

    tiendas.forEach(t => {
        const opt = document.createElement('option');
        opt.value       = t.id;
        opt.textContent = `${t.nombre} (${t.localidad})`;
        select.appendChild(opt);
    });

    // Marcamos la tienda que ya tiene asignada (si hay)
    const c = colaboradores.find(x => x.id === colaboradorSeleccionadoId);
    if (c?.tiendaId) select.value = c.tiendaId;

    document.getElementById('panel-titulo').textContent = 'ASIGNAR A TIENDA';
    mostrarVista('asignar');
}

async function confirmarAsignar() {
    const tiendaId = document.getElementById('f-tienda-id').value || null;

    const original    = colaboradores.find(x => x.id === colaboradorSeleccionadoId);
    const actualizado = { ...original, tiendaId };

    try {
        const res = await fetch(`${API_URL}/colaboradores/${colaboradorSeleccionadoId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(actualizado)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await cargarColaboradores();
        filtrarYCargarTabla();
        mostrarDetalle(colaboradorSeleccionadoId);

        const nombre = tiendaId
            ? tiendas.find(t => t.id === tiendaId)?.nombre || tiendaId
            : 'ninguna';
        alert(`Tienda asignada: ${nombre}`);

    } catch (err) {
        console.error('Error al asignar tienda:', err);
        alert('No se pudo asignar la tienda.');
    }
}

function cerrarVistaAsignar() {
    document.getElementById('panel-titulo').textContent = 'COLABORADOR SELECCIONADO';
    mostrarVista('detalle');
}

// EXPORTAR A EXCEL
function exportarExcel() {
    if (colaboradores.length === 0) {
        alert('No hay colaboradores para exportar.');
        return;
    }

    const datos = colaboradores.map(c => ({
        'ID':               c.id            || '',
        'NOMBRE':           c.nombre        || '',
        'DOMICILIO':        c.domicilio     || '',
        'CP':               c.cp            || '',
        'LOCALIDAD':        c.localidad     || '',
        'COLABORA EN':      c.colabora      || '',
        'COORDINADOR':      c.coord         || '',
        'TIENDA ID':        c.tiendaId      || '',
        'CONTACTO 1':       c.contacto1?.nombre || '',
        'TEL 1':            c.contacto1?.tel    || '',
        'CONTACTO 2':       c.contacto2?.nombre || '',
        'TEL 2':            c.contacto2?.tel    || '',
        'CONTACTO 3':       c.contacto3?.nombre || '',
        'TEL 3':            c.contacto3?.tel    || '',
        'OBSERVACIONES':    c.observaciones || '',
        'PENDIENTE':        c.pendienteValidacion ? 'Sí' : 'No'
    }));

    const hoja   = XLSX.utils.json_to_sheet(datos);
    const libro  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Colaboradores');
    XLSX.writeFile(libro, 'colaboradores.xlsx');
}

// HELPERS
// Construye el objeto colaborador desde los campos del formulario
function construirObjeto() {
    return {
        nombre:     document.getElementById('f-nombre').value.trim()      || '',
        domicilio:  document.getElementById('f-domicilio').value.trim()   || '---',
        cp:         document.getElementById('f-cp').value.trim()          || '---',
        localidad:  document.getElementById('f-localidad').value.trim()   || '---',
        colabora:   document.getElementById('f-colabora').value.trim()    || '---',
        coord:      document.getElementById('f-coord-input').value.trim() || '---',
        contacto1: {
            nombre: document.getElementById('f-c1-nombre').value.trim() || '---',
            tel:    document.getElementById('f-c1-tel').value.trim()    || '---'
        },
        contacto2: {
            nombre: document.getElementById('f-c2-nombre').value.trim() || '---',
            tel:    document.getElementById('f-c2-tel').value.trim()    || '---'
        },
        contacto3: {
            nombre: document.getElementById('f-c3-nombre').value.trim() || '---',
            tel:    document.getElementById('f-c3-tel').value.trim()    || '---'
        },
        observaciones: document.getElementById('f-obs').value.trim() || ''
    };
}

function limpiarFormulario() {
    ['f-nombre','f-domicilio','f-cp','f-localidad','f-colabora','f-coord-input',
     'f-c1-nombre','f-c1-tel','f-c2-nombre','f-c2-tel','f-c3-nombre','f-c3-tel','f-obs']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
}

function cerrarFormulario() {
    document.getElementById('panel-titulo').textContent = 'COLABORADOR SELECCIONADO';
    mostrarVista('detalle');
    limpiarFormulario();
}

function limpiarDetalle() {
    ['det-nombre','det-dom','det-cp','det-localidad','det-colabora',
     'det-coord','det-tienda','det-obs','det-c1','det-c2','det-c3']
        .forEach(id => {
            document.getElementById(id).textContent = '---';
        });
}