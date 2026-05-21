// VARIABLES GLOBALES
let colaboradores            = [];
let tiendas                  = [];
let colaboradorSeleccionadoId = null;
let modoModal                = 'anadir'; // 'anadir' | 'modificar'
let tablaBody, adminMenu, coordMenu;

const API_URL = 'http://localhost:3001';

const rolActual     = localStorage.getItem('userRole') || 'admin';
const usuarioActual = localStorage.getItem('userName') || rolActual;

// funcion para obtener el dashboard según el rol 
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

// Incializacion
document.addEventListener('DOMContentLoaded', async function () {

    
    tablaBody = document.querySelector('#tabla-body');
    adminMenu = document.querySelector('#admin-menu');
    coordMenu = document.querySelector('#coord-menu');
    

    //Permisos depenediente del rol
    if (rolActual === 'admin') {
        if (adminMenu) adminMenu.classList.remove('hidden');
    } else if (rolActual === 'coordinador' || rolActual === 'capitan_coordinador') {
        if (coordMenu) coordMenu.classList.remove('hidden');
    }

    
    await cargarColaboradores();
    await cargarTiendas();

    filtrarYCargarTabla();
    rellenarFiltros();


    // Filtros
    document.querySelector('#filtro-localidad')
        .addEventListener('change', filtrarYCargarTabla);
    document.querySelector('#filtro-coord')
        .addEventListener('change', filtrarYCargarTabla);
    document.querySelector('#filtro-zona')
        .addEventListener('change', filtrarYCargarTabla);


    // Botones CRUD del admin
    document.querySelector('#btn-anadir')
        ?.addEventListener('click', abrirModalAnadir);
    document.querySelector('#btn-modificar')
        ?.addEventListener('click', abrirModalModificar);
    document.querySelector('#btn-eliminar')
        ?.addEventListener('click', eliminarColaborador);
    document.querySelector('#btn-asignar')
        ?.addEventListener('click', abrirVistaAsignar);
    document.querySelector('#btn-exportar')
        ?.addEventListener('click', exportarExcel);
    document.querySelector('#btn-validar')
        ?.addEventListener('click', validarColaborador);

    // Botones CRUD del coordinador
    document.querySelector('#btn-anadir-pendiente')
        ?.addEventListener('click', abrirModalAniadirPendiente);
    document.querySelector('#btn-exportar-coord')
        ?.addEventListener('click', exportarExcel);

    // Botones del formulario
    document.querySelector('#btn-confirmar')
        .addEventListener('click', confirmarModal);
    document.querySelector('#btn-cancelar')
        .addEventListener('click', cerrarFormulario);

    // Botones de asignar tienda
    document.querySelector('#btn-confirmar-asignar')
        .addEventListener('click', confirmarAsignar);
    document.querySelector('#btn-cancelar-asignar')
        .addEventListener('click', cerrarVistaAsignar);

    // Boton para volver al menu principal
    document.querySelector('#btn-volver-menu')
        ?.addEventListener('click', () => window.location.href = getDashboardURL());
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
        mostrarErrorCarga('No se pudo conectar con el servidor para cargar los colaboradores.');
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
        mostrarErrorCarga('No se pudo conectar con el servidor para cargar las tiendas.');
        tiendas = [];
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

// FILTROS
function rellenarFiltros() {
    const localidades   = new Set(colaboradores.map(c => c.localidad));
    const coordinadores = new Set(colaboradores.map(c => c.coord));
    const zonas         = new Set(colaboradores.map(c => c.zona));

    rellenarSelect('filtro-localidad', localidades);
    rellenarSelect('filtro-coord',     coordinadores);
    rellenarSelect('filtro-zona',      zonas); 
}

function rellenarSelect(idSelect, valores) {
    const select = document.querySelector('#' + idSelect);
    
    // Limpiamos y añadimos la opción por defecto usando los métodos de clase
    select.innerHTML = ''; 
    const optDefault = document.createElement('option');
    optDefault.value = 'Todas';
    optDefault.textContent = 'Todas';
    select.appendChild(optDefault);

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

    const localidadSel = document.querySelector('#filtro-localidad')?.value || 'Todas';
    const coordSel     = document.querySelector('#filtro-coord')?.value     || 'Todas';
    const zonaSel      = document.querySelector('#filtro-zona')?.value      || 'Todas';

    tablaBody.innerHTML = ''; 

    const filtrados = colaboradores.filter(c =>
        (localidadSel === 'Todas' || c.localidad === localidadSel) &&
        (coordSel     === 'Todas' || c.coord     === coordSel) &&
        (zonaSel      === 'Todas' || c.zona      === zonaSel)
    );

    if (filtrados.length === 0) {
        const filaVacia = document.createElement('tr');
        const celdaVacia = document.createElement('td');
        celdaVacia.setAttribute('colspan', '7');
        celdaVacia.classList.add('empty-row-msg');
        celdaVacia.textContent = 'No hay colaboradores con esos filtros';
        filaVacia.appendChild(celdaVacia);
        tablaBody.appendChild(filaVacia);
        return;
    }

    filtrados.forEach(c => {
        const fila = document.createElement('tr');
        fila.classList.add('cursor-pointer');

        if (c.id === colaboradorSeleccionadoId) {
            fila.classList.add('fila-seleccionada');
        }

        
        const tdNombre = document.createElement('td');
        tdNombre.textContent = c.nombre;
        if (c.pendienteValidacion) {
            const spanPendiente = document.createElement('span');
            spanPendiente.classList.add('badge-pendiente');
            spanPendiente.textContent = ' (pendiente)';
            tdNombre.appendChild(spanPendiente);
        }
        fila.appendChild(tdNombre);

        
        const campos = [
            c.domicilio     || '---',
            c.localidad     || '---',
            c.colabora      || '---',
            c.coord         || '---',
            c.contacto1?.nombre || '---',
            c.observaciones || ''
        ];

        campos.forEach(texto => {
            const td = document.createElement('td');
            td.textContent = texto;
            fila.appendChild(td);
        });

        fila.addEventListener('click', () => mostrarDetalle(c.id));
        tablaBody.appendChild(fila);
    });
}

// Datos panel lateral
function mostrarDetalle(id) {
    colaboradorSeleccionadoId = id;

    const c = colaboradores.find(x => x.id === id);
    if (!c) return;

    document.querySelector('#det-nombre').textContent   = c.nombre        || '---';
    document.querySelector('#det-dom').textContent      = c.domicilio     || '---';
    document.querySelector('#det-cp').textContent       = c.cp            || '---';
    document.querySelector('#det-localidad').textContent = c.localidad    || '---';
    document.querySelector('#det-colabora').textContent = c.colabora      || '---';
    document.querySelector('#det-coord').textContent    = c.coord         || '---';
    document.querySelector('#det-tienda').textContent   = c.tiendaId      || '---';
    document.querySelector('#det-obs').textContent      = c.observaciones || '---';

    document.querySelector('#det-c1').textContent =
        c.contacto1?.nombre ? `${c.contacto1.nombre} — ${c.contacto1.tel}` : '---';
    document.querySelector('#det-c2').textContent =
        c.contacto2?.nombre ? `${c.contacto2.nombre} — ${c.contacto2.tel}` : '---';
    document.querySelector('#det-c3').textContent =
        c.contacto3?.nombre ? `${c.contacto3.nombre} — ${c.contacto3.tel}` : '---';

    // Mostrar botón validar solo si es admin y el colaborador está pendiente
    const btnValidar = document.querySelector('#btn-validar');
    if (btnValidar) {
        if (rolActual === 'admin' && c.pendienteValidacion) {
            btnValidar.classList.remove('hidden');
        } else {
            btnValidar.classList.add('hidden');
        }
    }

    mostrarVista('detalle');
    filtrarYCargarTabla();
}

// CONTROL DE VISTAS DEL PANEL
function mostrarVista(cual) {
    const vistaDetalle = document.querySelector('#vista-detalle');
    const vistaForm = document.querySelector('#vista-formulario');
    const vistaAsignar = document.querySelector('#vista-asignar');

    if (vistaDetalle) {
        if (cual === 'detalle') vistaDetalle.classList.remove('hidden');
        else vistaDetalle.classList.add('hidden');
    }
    if (vistaForm) {
        if (cual === 'formulario') vistaForm.classList.remove('hidden');
        else vistaForm.classList.add('hidden');
    }
    if (vistaAsignar) {
        if (cual === 'asignar') vistaAsignar.classList.remove('hidden');
        else vistaAsignar.classList.add('hidden');
    }
}

// AÑADIR
function abrirModalAnadir() {
    modoModal = 'anadir';
    document.querySelector('#panel-titulo').textContent = 'AÑADIR COLABORADOR';
    limpiarFormulario();
    mostrarVista('formulario');
}

function abrirModalAniadirPendiente() {
    modoModal = 'anadir-pendiente';
    document.querySelector('#panel-titulo').textContent = 'AÑADIR COLABORADOR (Pendiente validación)';
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
    document.querySelector('#panel-titulo').textContent = 'MODIFICAR COLABORADOR';

    // Rellenamos el formulario con los datos actuales
    document.querySelector('#f-nombre').value     = c.nombre        || '';
    document.querySelector('#f-domicilio').value  = c.domicilio     || '';
    document.querySelector('#f-cp').value         = c.cp            || '';
    document.querySelector('#f-localidad').value  = c.localidad     || '';
    document.querySelector('#f-colabora').value   = c.colabora      || '';
    document.querySelector('#f-zona').value        = c.zona          || '';
    document.querySelector('#f-coord-input').value = c.coord        || '';
    document.querySelector('#f-c1-nombre').value  = c.contacto1?.nombre || '';
    document.querySelector('#f-c1-tel').value     = c.contacto1?.tel    || '';
    document.querySelector('#f-c2-nombre').value  = c.contacto2?.nombre || '';
    document.querySelector('#f-c2-tel').value     = c.contacto2?.tel    || '';
    document.querySelector('#f-c3-nombre').value  = c.contacto3?.nombre || '';
    document.querySelector('#f-c3-tel').value     = c.contacto3?.tel    || '';
    document.querySelector('#f-obs').value        = c.observaciones || '';

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
// CREAR COLABORADOR 
async function crearColaborador() {
    const nombre = document.querySelector('#f-nombre').value.trim();

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
        rellenarFiltros();
        filtrarYCargarTabla();
        cerrarFormulario();

        alert(`Colaborador "${nombre}" añadido correctamente.`);

    } catch (err) {
        console.error('Error al crear colaborador:', err);
        alert('No se pudo guardar el colaborador. ¿Está arrancado json-server?');
    }
}

// ACTUALIZAR COLABORADOR 
async function actualizarColaborador() {
    const nombre = document.querySelector('#f-nombre').value.trim();

    if (!nombre) {
        alert('El campo NOMBRE es obligatorio.');
        return;
    }

    // Conservamos el tiendaId y pendienteValidacion que ya tenía
    const original = colaboradores.find(x => x.id === colaboradorSeleccionadoId);

    const actualizado = {
        ...construirObjeto(),
        id:                  colaboradorSeleccionadoId,
        tiendaId:            original?.tiendaId            || null,
        pendienteValidacion: original?.pendienteValidacion || false
    };

    try {
        const res = await fetch(`${API_URL}/colaboradores/${colaboradorSeleccionadoId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(actualizado)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await cargarColaboradores();
        rellenarFiltros();
        filtrarYCargarTabla();
        mostrarDetalle(colaboradorSeleccionadoId);
        cerrarFormulario();

        alert(`Colaborador "${nombre}" modificado correctamente.`);

    } catch (err) {
        console.error('Error al modificar colaborador:', err);
        alert('No se pudo modificar el colaborador. ¿Está arrancado json-server?');
    }
}

// ELIMINAR COLABORADOR
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
        rellenarFiltros();
        filtrarYCargarTabla();

        alert('Colaborador eliminado correctamente.');

    } catch (err) {
        console.error('Error al eliminar colaborador:', err);
        alert('No se pudo eliminar el colaborador. ¿Está arrancado json-server?');
    }
}

// VALIDAR COLABORADOR — quita pendienteValidacion (solo lo puede hacer el admin)
async function validarColaborador() {
    if (!colaboradorSeleccionadoId) return;

    const original = colaboradores.find(x => x.id === colaboradorSeleccionadoId);
    if (!original) return;

    const confirmado = confirm(
        `¿Validar al colaborador "${original.nombre}"?\nSe quitará la marca de pendiente.`
    );
    if (!confirmado) return;

    const actualizado = { ...original, pendienteValidacion: false };

    try {
        const res = await fetch(`${API_URL}/colaboradores/${colaboradorSeleccionadoId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(actualizado)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await cargarColaboradores();
        rellenarFiltros();
        filtrarYCargarTabla();
        mostrarDetalle(colaboradorSeleccionadoId);

        alert(`Colaborador "${original.nombre}" validado correctamente.`);

    } catch (err) {
        console.error('Error al validar colaborador:', err);
        alert('No se pudo validar el colaborador. ¿Está arrancado json-server?');
    }
}

// ASIGNAR TIENDA
function abrirVistaAsignar() {
    if (!colaboradorSeleccionadoId) {
        alert('Selecciona primero un colaborador de la tabla.');
        return;
    }

    
    const select = document.querySelector('#f-tienda-id');
    select.innerHTML = ''; // Limpieza permitida
    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.textContent = '-- Sin asignar --';
    select.appendChild(optDefault);

    tiendas.forEach(t => {
        const opt = document.createElement('option');
        opt.value       = t.id;
        opt.textContent = `${t.nombre} (${t.localidad})`;
        select.appendChild(opt);
    });

    // Marcamos la tienda que ya tiene asignada (si hay)
    const c = colaboradores.find(x => x.id === colaboradorSeleccionadoId);
    if (c?.tiendaId) select.value = c.tiendaId;

    document.querySelector('#panel-titulo').textContent = 'ASIGNAR A TIENDA';
    mostrarVista('asignar');
}

async function confirmarAsignar() {
    const tiendaId = document.querySelector('#f-tienda-id').value || null;

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
    document.querySelector('#panel-titulo').textContent = 'COLABORADOR SELECCIONADO';
    mostrarVista('detalle');
}

// EXPORTAR A EXCEL
function exportarExcel() {
    if (colaboradores.length === 0) {
        alert('No hay colaboradores para exportar.');
        return;
    }

    const datos = colaboradores.map(c => ({
        'ID':            c.id            || '',
        'NOMBRE':        c.nombre        || '',
        'DOMICILIO':     c.domicilio     || '',
        'CP':            c.cp            || '',
        'LOCALIDAD':     c.localidad     || '',
        'ZONA':          c.zona          || '',
        'COLABORA EN':   c.colabora      || '',
        'COORDINADOR':   c.coord         || '',
        'TIENDA ID':     c.tiendaId      || '',
        'CONTACTO 1':    c.contacto1?.nombre || '',
        'TEL 1':         c.contacto1?.tel    || '',
        'CONTACTO 2':    c.contacto2?.nombre || '',
        'TEL 2':         c.contacto2?.tel    || '',
        'CONTACTO 3':    c.contacto3?.nombre || '',
        'TEL 3':         c.contacto3?.tel    || '',
        'OBSERVACIONES': c.observaciones || '',
        'PENDIENTE':     c.pendienteValidacion ? 'Sí' : 'No'
    }));

    const hoja  = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Colaboradores');
    XLSX.writeFile(libro, 'colaboradores.xlsx');
}

// HELPERS
function construirObjeto() {
    return {
        nombre:     document.querySelector('#f-nombre').value.trim()      || '',
        domicilio:  document.querySelector('#f-domicilio').value.trim()   || '---',
        cp:         document.querySelector('#f-cp').value.trim()          || '---',
        localidad:  document.querySelector('#f-localidad').value.trim()   || '---',
        colabora:   document.querySelector('#f-colabora').value.trim()    || '---',
        zona:       document.querySelector('#f-zona').value.trim()        || '---',
        coord:      document.querySelector('#f-coord-input').value.trim() || '---',
        contacto1: {
            nombre: document.querySelector('#f-c1-nombre').value.trim() || '---',
            tel:    document.querySelector('#f-c1-tel').value.trim()    || '---'
        },
        contacto2: {
            nombre: document.querySelector('#f-c2-nombre').value.trim() || '---',
            tel:    document.querySelector('#f-c2-tel').value.trim()    || '---'
        },
        contacto3: {
            nombre: document.querySelector('#f-c3-nombre').value.trim() || '---',
            tel:    document.querySelector('#f-c3-tel').value.trim()    || '---'
        },
        observaciones: document.querySelector('#f-obs').value.trim() || ''
    };
}

function limpiarFormulario() {
    ['f-nombre','f-domicilio','f-cp','f-localidad','f-colabora','f-zona','f-coord-input',
     'f-c1-nombre','f-c1-tel','f-c2-nombre','f-c2-tel','f-c3-nombre','f-c3-tel','f-obs']
        .forEach(id => {
            const el = document.querySelector('#' + id);
            if (el) el.value = '';
        });
}

function cerrarFormulario() {
    document.querySelector('#panel-titulo').textContent = 'COLABORADOR SELECCIONADO';
    mostrarVista('detalle');
    limpiarFormulario();
}

function limpiarDetalle() {
    ['det-nombre','det-dom','det-cp','det-localidad','det-colabora',
     'det-coord','det-tienda','det-obs','det-c1','det-c2','det-c3']
        .forEach(id => {
            document.querySelector('#' + id).textContent = '---';
        });

    // Ocultamos el botón validar al limpiar el detalle
    const btnValidar = document.querySelector('#btn-validar');
    if (btnValidar) btnValidar.classList.add('hidden');
}