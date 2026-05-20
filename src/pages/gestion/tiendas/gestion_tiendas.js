// npx json-server --port 3001 src/data/db.json
// VARIABLES GLOBALES
let tiendas = [];
let tiendaSeleccionadaId = null; 
let modoModal = 'anadir'; 
let tablaBody, menuAdmin;

const API_URL = 'http://localhost:3001';

// almacenamos rol actual porque segun cual sea tendrá diferentes funciones
const rolActual = localStorage.getItem('userRole') || 'admin';

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async function () {

    // 1º elementos del HTML
    tablaBody = document.getElementById('tabla-body');
    menuAdmin = document.getElementById('admin-menu');

    // 2º Permisos
    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.classList.remove('hidden');
    }

    // 3º Cargamos y mostramos tablas
    await cargarTiendas();
    filtrarYCargarTabla();
    popularFiltros();

    // 4º Filtramos
    const filtroCadena = document.getElementById('filtro-cadena');
    const filtroLocalidad = document.getElementById('filtro-localidad');
    const filtroZona = document.getElementById('filtro-zona');
    const filtroCoordinador = document.getElementById('filtro-coordinador');

    filtroCadena.addEventListener('change', filtrarYCargarTabla);
    filtroLocalidad.addEventListener('change', filtrarYCargarTabla);
    filtroZona.addEventListener('change', filtrarYCargarTabla);
    filtroCoordinador.addEventListener('change', filtrarYCargarTabla);

    // 5º Botones CRUD
    const btnAnadir = document.getElementById('btn-anadir');
    const btnModificar = document.getElementById('btn-modificar');
    const btnEliminar = document.getElementById('btn-eliminar');

    btnAnadir.addEventListener('click', abrirModalAnadir);
    btnModificar.addEventListener('click', abrirModalModificar);
    btnEliminar.addEventListener('click', eliminarTienda);

    // 6º Eventos del modal
    const btnConfirmar = document.getElementById('btn-confirmar');
    const btnCancelar = document.getElementById('btn-cancelar');

    btnConfirmar.addEventListener('click', confirmarModal);
    btnCancelar.addEventListener('click', cerrarModal);
});

// FUNCIONES
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

// Generamos opciones a partir de los datos reales del JSON.
// Usamos Set para eliminar valores duplicados
function popularFiltros() {
    // Obtener valores únicos
    const cadenasUnicas = tiendas.map(tienda => tienda.cadena);
    const localidadesUnicas = tiendas.map(tienda => tienda.localidad);
    const zonasUnicas = tiendas.map(tienda => tienda.zona);
    const coordinadoresUnicos = tiendas.map(tienda => tienda.coord);

    // Eliminar duplicados
    const cadenas = [...new Set(cadenasUnicas)];
    const localidades = [...new Set(localidadesUnicas)];
    const zonas = [...new Set(zonasUnicas)];
    const coordinadores = [...new Set(coordinadoresUnicos)];

    // Rellenar selects
    rellenarSelect('filtro-cadena', cadenas);
    rellenarSelect('filtro-localidad', localidades);
    rellenarSelect('filtro-zona', zonas);
    rellenarSelect('filtro-coordinador', coordinadores);
}


function rellenarSelect(idSelect, valores) {
    const select = document.getElementById(idSelect);

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

    const filtroCadena = document.getElementById('filtro-cadena');
    const filtroLocalidad = document.getElementById('filtro-localidad');
    const filtroZona = document.getElementById('filtro-zona');
    const filtroCoordinador = document.getElementById('filtro-coordinador');
        
    const cadenaSel = filtroCadena.value || 'Todas';
    const localidadSel = filtroLocalidad.value || 'Todas';
    const zonaSel = filtroZona.value || 'Todas';
    const coordSel = filtroCoordinador.value || 'Todas';

    tablaBody.innerHTML = '';

    //solo pasa la tienda que cumpla todas las condiciones: Si no hay resultados mostramos msj 
    const filtradas = tiendas.filter(tienda => {

        const coincideCadena = cadenaSel==='Todas' || tienda.cadena===cadenaSel;
        const coincideLocalidad = localidadSel==='Todas' || tienda.localidad===localidadSel;
        const coincideZona = zonaSel==='Todas' || tienda.zona===zonaSel;
        const coincideCoordinador = coordSel==='Todas' || tienda.coord===coordSel;

        return ( coincideCadena && coincideLocalidad && coincideZona && coincideCoordinador);
    });

    if (filtradas.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td> No hay tiendas con esos filtros </td>
            </tr>
        `;
        return;
    }

    // Recorremos las tiendas ya filtradas
    filtradas.forEach(tienda => {
        const fila = document.createElement('tr');

        if (tienda.id === tiendaSeleccionadaId) {
            fila.classList.add('fila-seleccionada');  
        }

        fila.innerHTML = `
            <td>${tienda.nombre}</td>
            <td>${tienda.cadena}</td>
            <td>${tienda.domicilio}</td>
            <td>${tienda.localidad}</td>
            <td>${tienda.coord}</td>
        `;

        fila.addEventListener('click', () => mostrarDetalle(tienda.id));
        tablaBody.appendChild(fila);
    });
}

// Datos panel lateral
function mostrarDetalle(id) {

    tiendaSeleccionadaId = id;

    const tienda = tiendas.find(t => t.id === id);
    if (!tienda) return;

    const detalleId = document.getElementById('det-id');
    const detalleCadena = document.getElementById('det-cadena');
    const detalleDomicilio = document.getElementById('det-dom');
    const detalleLocalidad = document.getElementById('det-loc');
    const detalleZona = document.getElementById('det-zona');
    const detalleCoordinador = document.getElementById('det-coord');

    detalleId.textContent = tienda.id;
    detalleCadena.textContent = tienda.cadena;
    detalleDomicilio.textContent = tienda.domicilio;
    detalleLocalidad.textContent = tienda.localidad;
    detalleZona.textContent = tienda.zona;
    detalleCoordinador.textContent = tienda.coord;

    filtrarYCargarTabla();
}

// ABRIR MODAL PARA AÑADIR
function abrirModalAnadir() {
    modoModal = 'anadir';
    document.getElementById('panel-titulo').textContent = 'AÑADIR TIENDA';

    limpiarModal();
    document.getElementById('f-id').disabled = false;

    abrirModal();
}

// ABRIR MODAL PARA MODIFICAR
function abrirModalModificar() {

    if (!tiendaSeleccionadaId) {
        alert('Selecciona primero una tienda de la tabla.');
        return;
    }

    const tienda = tiendas.find(t => t.id === tiendaSeleccionadaId);
    if (!tienda) return;

    modoModal = 'modificar';
    document.getElementById('panel-titulo').textContent = 'MODIFICAR TIENDA';

    const inputId = document.getElementById('f-id');
    const inputNombre = document.getElementById('f-nombre');
    const inputCadena = document.getElementById('f-cadena');
    const inputZona = document.getElementById('f-zona');
    const inputDomicilio = document.getElementById('f-domicilio');
    const inputLocalidad = document.getElementById('f-localidad');
    const inputCoordinador = document.getElementById('f-coord');

    inputId.value = tienda.id;
    inputNombre.value = tienda.nombre;
    inputCadena.value = tienda.cadena;
    inputZona.value = tienda.zona;
    inputDomicilio.value = tienda.domicilio;
    inputLocalidad.value = tienda.localidad;
    inputCoordinador.value = tienda.coord;

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
    const inputId = document.getElementById('f-id');
    const inputNombre = document.getElementById('f-nombre');

    const id = inputId.value();
    const nombre = inputNombre.value();

    if (!id || !nombre) {
        alert('El ID y el Nombre son obligatorios.');
        return;
    }

    const existe = tiendas.find(t => t.id === id);
    if (existe) {
        alert(`Ya existe una tienda con el ID "${id}".`);
        return;
    }

    //NUEVA TIENDA
    const inputCadena = document.getElementById('f-cadena');
    const inputZona = document.getElementById('f-zona');
    const inputDomicilio = document.getElementById('f-domicilio');
    const inputLocalidad = document.getElementById('f-localidad');
    const inputCoord = document.getElementById('f-coord');

    // Crear objeto
    const nuevaTienda = {
        id,
        nombre,
        cadena: valor(inputCadena) || '---',
        zona: valor(inputZona) || '---',
        domicilio: valor(inputDomicilio) || '---',
        localidad: valor(inputLocalidad) || '---',
        coord: valor(inputCoord)|| '---'
    };

    try {
        const respuesta = await fetch(`${API_URL}/tiendas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTienda) 
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
async function actualizarTienda() {
    
    const inputNombre = document.getElementById('f-nombre');
    const nombre = inputNombre.value();
    
    if (!nombre) {
        alert('El Nombre es obligatorio.');
        return;
    }

    const cadenaInput = document.getElementById('f-cadena');
    const zonaInput = document.getElementById('f-zona');
    const domicilioInput = document.getElementById('f-domicilio');
    const localidadInput = document.getElementById('f-localidad');
    const coordInput = document.getElementById('f-coord');

    const tiendaActualizada = {
        id: tiendaSeleccionadaId,
        nombre,
        cadena: cadenaInput.value() || '---',
        zona: zonaInput.value() || '---',
        domicilio: domicilioInput.value() || '---',
        localidad: localidadInput.value() || '---',
        coord: coordInput.value() || '---'
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
        const camposDetalle = [
            'det-id',
            'det-cadena',
            'det-dom',
            'det-loc',
            'det-zona',
            'det-coord'
        ];

        camposDetalle.forEach(id => {
            const elemento = document.getElementById(id);
            elemento.textContent = '---';
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
const vistaDetalle = document.getElementById('vista-detalle');
const vistaFormulario = document.getElementById('vista-formulario');
const panelTitulo = document.getElementById('panel-titulo');

function abrirModal() {
    vistaDetalle.classList.add('hidden');
    vistaFormulario.classList.remove('hidden');
}

function cerrarModal() {
    vistaFormulario.classList.add('hidden');
    vistaDetalle.classList.remove('hidden');
    panelTitulo.textContent = 'TIENDA SELECCIONADA';
    limpiarModal();
}

function limpiarModal() {
    const inputs = [
        'f-id',
        'f-nombre',
        'f-cadena',
        'f-zona',
        'f-domicilio',
        'f-localidad',
        'f-coord'
    ];

    inputs.forEach(id => {
        document.getElementById(id).value = '';
    });
}
