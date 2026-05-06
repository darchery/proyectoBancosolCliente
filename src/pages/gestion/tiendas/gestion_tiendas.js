// VARIABLES GLOBALES

let tiendas = [];
let tiendaSeleccionadaId = null; 
let modoModal = 'anadir'; 
let tablaBody, menuAdmin;

const API_URL = 'http://localhost:3001'; // json-server

// almacenamos rol actual porque segun cual sea tendrá diferentes funciones
const rolActual = localStorage.getItem('userRole') || 'admin';

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    // 1º elementos del HTML
    tablaBody = document.getElementById('tabla-body');
    menuAdmin = document.getElementById('admin-menu');

    // 2º Permisos
    if (rolActual === 'admin') {
        menuAdmin.style.display = 'grid';
    }

    // 3º Cargamos y mostramos tablas
    await cargarTiendas();
    filtrarYCargarTabla();
    popularFiltros();

    // 4º Filtramos
    document.getElementById('filtro-cadena')
        .addEventListener('change', filtrarYCargarTabla);
    document.getElementById('filtro-localidad')
        .addEventListener('change', filtrarYCargarTabla);
    document.getElementById('filtro-zona')
        .addEventListener('change', filtrarYCargarTabla);
    document.getElementById('filtro-coordinador')
        .addEventListener('change', filtrarYCargarTabla);

    // 5º Botones CRUD
    document.getElementById('btn-anadir')
        .addEventListener('click', abrirModalAnadir);

    document.getElementById('btn-modificar')
        .addEventListener('click', abrirModalModificar);

    document.getElementById('btn-eliminar')
        .addEventListener('click', eliminarTienda);

    // 6º Eventos del modal
    document.getElementById('btn-confirmar')
        .addEventListener('click', confirmarModal);

    document.getElementById('btn-cancelar')
        .addEventListener('click', cerrarModal);
});

// FUNCIONES
// Traemos datos del JSON y los guardamos en la vble tienda
async function cargarTiendas() {
    try {
        const respuesta = await fetch(`${API_URL}/tiendas`);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        tiendas = await respuesta.json();
        console.log('Tiendas cargadas:', tiendas);

    } catch (error) {
        console.error('Error al cargar tiendas:', error);
        tiendas = [];
    }
}

// POPULAR LOS FILTROS DINÁMICAMENTE
// Generamos opciones a partir de los datos reales del JSON.
// Usamos Set para eliminar valores duplicados
function popularFiltros() {

    const cadenas       = new Set(tiendas.map(t => t.cadena));
    const localidades   = new Set(tiendas.map(t => t.localidad));
    const zonas         = new Set(tiendas.map(t => t.zona));
    const coordinadores = new Set(tiendas.map(t => t.coord));

    rellenarSelect('filtro-cadena',      cadenas);
    rellenarSelect('filtro-localidad',   localidades);
    rellenarSelect('filtro-zona',        zonas);
    rellenarSelect('filtro-coordinador', coordinadores);
}

// Añade las opciones a un <select> dado su id y un Set de valores
function rellenarSelect(idSelect, valores) {
    const select = document.getElementById(idSelect);

    // Conservamos solo la primera opción ("Todas")
    select.innerHTML = '<option value="Todas">Todas</option>';

    // for..of recorre cualquier iterable, incluido un Set
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
    const cadenaSel    = document.getElementById('filtro-cadena')?.value     || 'Todas';
    const localidadSel = document.getElementById('filtro-localidad')?.value  || 'Todas';
    const zonaSel      = document.getElementById('filtro-zona')?.value        || 'Todas';
    const coordSel     = document.getElementById('filtro-coordinador')?.value || 'Todas';

    tablaBody.innerHTML = '';

    //solo pasa la tienda que cumpla todas las condiciones: Si no hay resultados mostramos msj 
    const filtradas = tiendas.filter(tienda => {
        return (
            (cadenaSel    === 'Todas' || tienda.cadena    === cadenaSel)    &&
            (localidadSel === 'Todas' || tienda.localidad === localidadSel) &&
            (zonaSel      === 'Todas' || tienda.zona      === zonaSel)      &&
            (coordSel     === 'Todas' || tienda.coord     === coordSel)
        );
    });

    if (filtradas.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td> No hay tiendas con esos filtros </td>
            </tr>`;
        return;
    }

    // Recorremos las tiendas ya filtradas
    filtradas.forEach(tienda => {
        const fila = document.createElement('tr');
        fila.style.cursor = 'pointer';

        // Resaltamos la fila que está seleccionada actualmente
        if (tienda.id === tiendaSeleccionadaId) {
            fila.style.backgroundColor = '#fde8e8';
        }

        fila.innerHTML = `
            <td>${tienda.nombre}</td>
            <td>${tienda.cadena}</td>
            <td>${tienda.domicilio}</td>
            <td>${tienda.localidad}</td>
            <td>${tienda.coord}</td>
        `;

        // Al pulsar la fila se muestra el detalle en el panel lateral
        fila.addEventListener('click', () => mostrarDetalle(tienda.id));

        tablaBody.appendChild(fila);
    });
}

// Datos panel lateral
function mostrarDetalle(id) {

    tiendaSeleccionadaId = id;

    const tienda = tiendas.find(t => t.id === id);
    if (!tienda) return;

    document.getElementById('det-id').textContent     = tienda.id;
    document.getElementById('det-cadena').textContent = tienda.cadena;
    document.getElementById('det-dom').textContent    = tienda.domicilio;
    document.getElementById('det-loc').textContent    = tienda.localidad;
    document.getElementById('det-zona').textContent   = tienda.zona;
    document.getElementById('det-coord').textContent  = tienda.coord;

    // Repintamos la tabla para que se vea la fila resaltada
    filtrarYCargarTabla();
}

// ABRIR MODAL PARA AÑADIR
// Limpia todos los campos y abre el modal en modo 'anadir'
function abrirModalAnadir() {
    modoModal = 'anadir';
    document.getElementById('panel-titulo').textContent = 'AÑADIR TIENDA';

    limpiarModal();

    // El campo ID es editable al añadir (el usuario lo escribe)
    document.getElementById('f-id').disabled = false;

    abrirModal();
}

// ABRIR MODAL PARA MODIFICAR
// Rellena los campos con los datos de la tienda seleccionada
// y abre el modal en modo 'modificar'
function abrirModalModificar() {

    if (!tiendaSeleccionadaId) {
        alert('Selecciona primero una tienda de la tabla.');
        return;
    }

    const tienda = tiendas.find(t => t.id === tiendaSeleccionadaId);
    if (!tienda) return;

    modoModal = 'modificar';
    document.getElementById('panel-titulo').textContent = 'MODIFICAR TIENDA';

    // Rellenamos los campos con los datos actuales de la tienda
    document.getElementById('f-id').value        = tienda.id;
    document.getElementById('f-nombre').value    = tienda.nombre;
    document.getElementById('f-cadena').value    = tienda.cadena;
    document.getElementById('f-zona').value      = tienda.zona;
    document.getElementById('f-domicilio').value = tienda.domicilio;
    document.getElementById('f-localidad').value = tienda.localidad;
    document.getElementById('f-coord').value     = tienda.coord;

    // El ID no se puede cambiar al modificar
    document.getElementById('f-id').disabled = true;

    abrirModal();
}

// EDITAR/CREAR
function confirmarModal() {
    if (modoModal === 'anadir') {
        crearTienda();
    } else {
        actualizarTienda();
    }
}

// CREAR TIENDA — post
// fetch con opciones:
//   method: 'POST'   → tipo de petición HTTP
//   headers          → le decimos al servidor que enviamos JSON
//   body             → datos convertidos a texto con JSON.stringif
async function crearTienda() {

    const id     = document.getElementById('f-id').value.trim();
    const nombre = document.getElementById('f-nombre').value.trim();

    if (!id || !nombre) {
        alert('El ID y el Nombre son obligatorios.');
        return;
    }

    // Comprobamos que el ID no esté ya en uso
    const existe = tiendas.find(t => t.id === id);
    if (existe) {
        alert(`Ya existe una tienda con el ID "${id}".`);
        return;
    }

    const nuevaTienda = {
        id,
        nombre,
        cadena:    document.getElementById('f-cadena').value.trim()    || '---',
        zona:      document.getElementById('f-zona').value.trim()       || '---',
        domicilio: document.getElementById('f-domicilio').value.trim() || '---',
        localidad: document.getElementById('f-localidad').value.trim() || '---',
        coord:     document.getElementById('f-coord').value.trim()     || '---'
    };

    try {
        const respuesta = await fetch(`${API_URL}/tiendas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTienda)   // objeto JavaScript → texto JSON
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        await cargarTiendas();
        popularFiltros();
        filtrarYCargarTabla();
        cerrarModal();

        alert(`Tienda "${nombre}" añadida correctamente.`);

    } catch (error) {
        console.error('Error al crear tienda:', error);
        alert('No se pudo guardar la tienda. ¿Está arrancado json-server?');
    }
}

// ACTUALIZAR TIENDA — put
// PUT reemplaza el recurso completo en el servidor.
async function actualizarTienda() {

    const nombre = document.getElementById('f-nombre').value.trim();

    if (!nombre) {
        alert('El Nombre es obligatorio.');
        return;
    }

    const tiendaActualizada = {
        id:        tiendaSeleccionadaId,
        nombre,
        cadena:    document.getElementById('f-cadena').value.trim()    || '---',
        zona:      document.getElementById('f-zona').value.trim()       || '---',
        domicilio: document.getElementById('f-domicilio').value.trim() || '---',
        localidad: document.getElementById('f-localidad').value.trim() || '---',
        coord:     document.getElementById('f-coord').value.trim()     || '---'
    };

    try {
        const respuesta = await fetch(`${API_URL}/tiendas/${tiendaSeleccionadaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tiendaActualizada)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        await cargarTiendas();
        popularFiltros();
        filtrarYCargarTabla();
        mostrarDetalle(tiendaSeleccionadaId);
        cerrarModal();

        alert(`Tienda "${nombre}" modificada correctamente.`);

    } catch (error) {
        console.error('Error al modificar tienda:', error);
        alert('No se pudo modificar la tienda. ¿Está arrancado json-server?');
    }
}

// ELIMINAR TIENDA — delete
// Pide confirmación antes de hacer la petición DELETE.
async function eliminarTienda() {

    if (!tiendaSeleccionadaId) {
        alert('Selecciona primero una tienda de la tabla.');
        return;
    }

    const tienda = tiendas.find(t => t.id === tiendaSeleccionadaId);
    const confirmado = confirm(
        `¿Seguro que quieres eliminar "${tienda?.nombre}"?\nEsta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {
        const respuesta = await fetch(`${API_URL}/tiendas/${tiendaSeleccionadaId}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // Limpiamos la selección y reseteamos el panel lateral
        tiendaSeleccionadaId = null;
        ['det-id','det-cadena','det-dom','det-loc','det-zona','det-coord']
            .forEach(id => {
                document.getElementById(id).textContent = '---';
            });

        await cargarTiendas();
        popularFiltros();
        filtrarYCargarTabla();

        alert('Tienda eliminada correctamente.');

    } catch (error) {
        console.error('Error al eliminar tienda:', error);
        alert('No se pudo eliminar la tienda. ¿Está arrancado json-server?');
    }
}

// Modales
function abrirModal() {
    document.getElementById('vista-detalle').style.display    = 'none';
    document.getElementById('vista-formulario').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('vista-formulario').style.display = 'none';
    document.getElementById('vista-detalle').style.display    = 'block';
    document.getElementById('panel-titulo').textContent       = 'TIENDA SELECCIONADA';
    limpiarModal();
}

function limpiarModal() {
    ['f-id','f-nombre','f-cadena','f-zona','f-domicilio','f-localidad','f-coord']
        .forEach(id => {
            document.getElementById(id).value = '';
        });
}
