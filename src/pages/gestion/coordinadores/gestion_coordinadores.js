// npx json-server --port 3001 src/data/db.json
// VARIABLES GLOBALES
let coordinadores = [];
let coordinadorSeleccionadoId = null; 
let modoModal = 'anadir'; 
let tablaBody, menuAdmin;
let vistaDetalle, vistaFormulario, panelTitulo;

const API_URL = 'http://localhost:3001';

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
    rellenarFiltros();

    // 4º Filtramos
    const filtroEntidad = document.querySelector('#filtro-entidad');
    const filtroArea = document.querySelector('#filtro-area');

    filtroEntidad.addEventListener('change', filtrarYCargarTabla);
    filtroArea.addEventListener('change', filtrarYCargarTabla);

    // 5º Botones CRUD
    const btnAnadir = document.querySelector('#btn-anadir');
    const btnModificar = document.querySelector('#btn-modificar');
    const btnEliminar = document.querySelector('#btn-eliminar');

    btnAnadir.addEventListener('click', abrirModalAnadir);
    btnModificar.addEventListener('click', abrirModalModificar);
    btnEliminar.addEventListener('click', eliminarCoordinador);
    
    // 6º Eventos del modal
    const btnConfirmar = document.querySelector('#btn-confirmar');
    const btnCancelar = document.querySelector('#btn-cancelar');

    btnConfirmar.addEventListener('click', confirmarModal);
    btnCancelar.addEventListener('click', cerrarModal);

    vistaDetalle = document.querySelector('#vista-detalle');
    vistaFormulario = document.querySelector('#vista-formulario');
    panelTitulo = document.querySelector('#panel-titulo');
});

// FUNCIONES
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

// Generamos opciones a partir de los datos reales del JSON.
// Usamos Set para eliminar valores duplicados
function rellenarFiltros() {
    // Obtener valores únicos
    const entidadesUnicas = coordinadores.map(c => c.entidad);
    const areasUnicas = coordinadores.map(c => c.area);

    // Eliminar duplicados
    const entidades = [...new Set(entidadesUnicas)];
    const areas = [...new Set(areasUnicas)];

    // Rellenar selects
    rellenarSelect('#filtro-entidad', entidades);
    rellenarSelect('#filtro-area', areas);
}


function rellenarSelect(selector, valores) {
    const select = document.querySelector(selector);

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

    const filtroEntidad = document.querySelector('#filtro-entidad');
    const filtroArea = document.querySelector('#filtro-area');

    const entidadSel = filtroEntidad.value || 'Todas';
    const areaSel = filtroArea.value || 'Todas';

    tablaBody.innerHTML = '';

    // Filtramos los coordinadores según los criterios seleccionados
    const filtrados = coordinadores.filter(c => {

        const coincideEntidad = entidadSel==='Todas' || c.entidad===entidadSel;
        const coincideArea = areaSel==='Todas' || c.area===areaSel;

        return coincideEntidad && coincideArea;
    });

    if (filtrados.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="8"> No hay coordinadores con esos filtros </td>
            </tr>
        `;
        return;
    }

    // Creamos las filas de la tabla con los coordinadores filtrados
    filtrados.forEach(c => {
        const fila = document.createElement('tr');

        if (c.id === coordinadorSeleccionadoId) {
            fila.classList.add('fila-seleccionada');  
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

    const coord = coordinadores.find(coord => coord.id === id);
    if (!coord) return;

    // Rellenamos el panel lateral con los datos del coordinador seleccionado
    const detId = document.querySelector('#det-id');
    const detEntidad = document.querySelector('#det-entidad');
    const detArea = document.querySelector('#det-area');
    const detTlf = document.querySelector('#det-tlf');
    const detEmail = document.querySelector('#det-email');
    const detTiendas = document.querySelector('#det-tiendas');
    const detUsuario = document.querySelector('#det-usuario');

    detId.textContent = coord.id;
    detEntidad.textContent = coord.entidad;
    detArea.textContent = coord.area;
    detTlf.textContent = coord.telefono;
    detEmail.textContent = coord.email;
    detTiendas.textContent = coord.tiendas || '0';
    detUsuario.textContent = coord.usuario;

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

    const coord = coordinadores.find(c => c.id === coordinadorSeleccionadoId);
    if (!coord) return;

    modoModal = 'modificar';
    document.querySelector('#panel-titulo').textContent = 'MODIFICAR COORDINADOR';

    const inputId = document.querySelector('#f-id');
    const inputNombre = document.querySelector('#f-nombre');
    const inputEntidad = document.querySelector('#f-entidad');
    const inputArea = document.querySelector('#f-area');
    const inputTlf = document.querySelector('#f-tlf');
    const inputEmail = document.querySelector('#f-email');
    const inputTiendas = document.querySelector('#f-tiendas');
    const inputUsuario = document.querySelector('#f-usuario');
    const inputPass = document.querySelector('#f-pass');

    inputId.value = coord.id;
    inputNombre.value = coord.nombre;
    inputEntidad.value = coord.entidad;
    inputArea.value = coord.area;
    inputTlf.value = coord.telefono;
    inputEmail.value = coord.email;
    inputTiendas.value = coord.tiendas || 0;
    inputUsuario.value = coord.usuario;
    inputPass.value = coord.password;

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

// FUNCIONES CRUD
async function crearCoordinador() {
    const inputId = document.querySelector('#f-id'); 
    const inputNombre = document.querySelector('#f-nombre'); 

    const id = inputId.value;
    const nombre = inputNombre.value;

    if (!id || !nombre) {
        alert('El ID y el Nombre son obligatorios.');
        return;
    }

    const existe = coordinadores.find(c => c.id === id);
    if (existe) {
        alert(`Ya existe un coordinador con el ID "${id}".`);
        return;
    }

    // Crear obj
    const nuevoCoord = {
        id,
        nombre,
        entidad: document.querySelector('#f-entidad').value,
        area: document.querySelector('#f-area').value,
        telefono: document.querySelector('#f-tlf').value,
        email: document.querySelector('#f-email').value,
        tiendas: parseInt(document.querySelector('#f-tiendas').value) || 0,
        usuario: document.querySelector('#f-usuario').value,
        password: document.querySelector('#f-pass').value
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
        rellenarFiltros();
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

    const inputNombre = document.querySelector('#f-nombre');
    const nombre = inputNombre.value;

    if (!nombre) {
        alert('El Nombre es obligatorio.');
        return;
    }

    // Creamos un objeto con los datos actualizados del coordinador, manteniendo el mismo ID
    const coordActualizado = {
        id:       coordinadorSeleccionadoId,
        nombre,
        entidad:  document.querySelector('#f-entidad').value,
        area:     document.querySelector('#f-area').value,
        telefono: document.querySelector('#f-tlf').value,
        email:    document.querySelector('#f-email').value,
        tiendas:  parseInt(document.querySelector('#f-tiendas').value) || 0,
        usuario:  document.querySelector('#f-usuario').value,
        password: document.querySelector('#f-pass').value
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
        rellenarFiltros();
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

        // Si la eliminación fue exitosa, recargamos los coordinadores, actualizamos los filtros y la tabla, 
        // limpiamos el panel lateral y mostramos un mensaje de éxito
        coordinadorSeleccionadoId = null;
        const camposDetalle = [
            'det-id',
            'det-entidad',
            'det-area',
            'det-tlf',
            'det-email',
            'det-tiendas', 
            'det-usuario'
        ];
        camposDetalle.forEach(id => {
                const elemento = document.getElementById(id);
                if (elemento) elemento.textContent = '---';
            });

        // Recargamos los coordinadores y actualizamos la tabla y los filtros para reflejar la eliminación
        await cargarCoordinadores();
        rellenarFiltros();
        filtrarYCargarTabla();

        alert('Coordinador eliminado correctamente.');

    } catch (error) {
        console.error('Error al eliminar coordinador:', error);
        alert('No se pudo eliminar el coordinador.');
    }
}

// Modales
function abrirModal() {
    vistaDetalle.classList.add('hidden');
    vistaFormulario.classList.remove('hidden');
}

function cerrarModal() {
    vistaFormulario.classList.add('hidden');
    vistaDetalle.classList.remove('hidden');
    panelTitulo.textContent = 'COORDINADOR SELECCIONADO';
    limpiarModal();
}

function limpiarModal() {
    const inputs = [
        'f-id',
        'f-nombre',
        'f-entidad',
        'f-area',
        'f-tlf',
        'f-email',
        'f-tiendas', 
        'f-usuario', 
        'f-pass'
    ];

    inputs.forEach(id => {
        document.getElementById(id).value = '';
    });
}
