const API_URL = "http://localhost:3001";

const rolActual = localStorage.getItem('userRole');
const usuarioActual = localStorage.getItem('userName') || rolActual;

if (!rolActual) {
    console.warn("No hay sesión activa. Redirigiendo a login...");
    window.location.href = '../index_login.html';
}

// VARIABLES GLOBALES 
let colaboradores = [];
let colaboradorSeleccionadoId = null;

// INICIALIZACIÓN 
window.onload = async function() {

    console.log("Rol detectado:", rolActual);

    const usuarioDisplay = document.getElementById('usuario-display');
    if (usuarioDisplay) usuarioDisplay.textContent = usuarioActual + ' (' + rolActual + ')';

    aplicarPermisos();

    await cargarColaboradores(); // CARGA DESDE JSON-SERVER

    cargarTabla();

    const filtroLocalidad = document.getElementById('filtro-localidad');
    const filtroCoord = document.getElementById('filtro-coord');

    if (filtroLocalidad) filtroLocalidad.addEventListener('change', cargarTabla);
    if (filtroCoord) filtroCoord.addEventListener('change', cargarTabla);
};

// CARGA DE DATOS 
async function cargarColaboradores() {
    try {
        const res = await fetch(`${API_URL}/colaboradores`);
        colaboradores = await res.json();
        console.log("Colaboradores cargados:", colaboradores);
    } catch (error) {
        console.error("Error cargando colaboradores:", error);
    }
}

// CONTROL DE PERMISOS 
function aplicarPermisos() {
    const badge     = document.getElementById('rol-badge');
    const menuAdmin = document.getElementById('menu-admin');
    const menuCoord = document.getElementById('menu-coordinador');

    if (menuAdmin) menuAdmin.style.display = 'none';
    if (menuCoord) menuCoord.style.display = 'none';

    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.style.display = 'grid';
        if (badge) badge.textContent = 'Acceso completo — Administrador';

    } else if (rolActual === 'coordinador' || rolActual === 'capitan_coordinador') {
        if (menuCoord) menuCoord.style.display = 'grid';
        if (badge) badge.textContent = 'Coordinadores: acceso limitado';

    } else {
        if (badge) badge.textContent = 'Acceso de solo lectura';
    }
}

// TABLA 
function cargarTabla() {

    const tabla = document.getElementById("tabla-body");
    if (!tabla) return;

    const localidadSel = document.getElementById('filtro-localidad')?.value || 'Todas';
    const coordSel     = document.getElementById('filtro-coord')?.value || 'Todas';

    tabla.innerHTML = "";

    const filtrados = colaboradores.filter(c => {
        return (
            (localidadSel === 'Todas' || c.localidad === localidadSel) &&
            (coordSel === 'Todas' || c.coord === coordSel)
        );
    });

    if (filtrados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;">No hay coincidencias</td></tr>`;
        return;
    }

    filtrados.forEach(c => {

        const pendiente = c.pendienteValidacion
            ? ' <span style="color:orange;font-size:.75em;">(pendiente)</span>'
            : '';

        tabla.innerHTML += `
        <tr onclick="verDetalle('${c.id}')" style="cursor:pointer;">
          <td>${c.nombre}${pendiente}</td>
          <td>${c.domicilio}</td>
          <td>${c.localidad}</td>
          <td>${c.colabora}</td>
          <td>${c.coord}</td>
          <td>${c.contacto1?.nombre || ''}</td>
          <td>${c.observaciones}</td>
        </tr>`;
    });
}

// Ver info
function verDetalle(id) {

    colaboradorSeleccionadoId = id;
    const c = colaboradores.find(x => x.id == id);
    if (!c) return;

    document.getElementById("d-nombre").innerText   = c.nombre;
    document.getElementById("d-dom").innerText      = c.domicilio;
    document.getElementById("d-cp").innerText       = c.cp + " - " + c.localidad;
    document.getElementById("d-colabora").innerText = c.colabora;
    document.getElementById("d-obs").innerText      = c.observaciones;

    document.getElementById("c1-nombre").innerText = c.contacto1.nombre;
    document.getElementById("c1-tel").innerText    = c.contacto1.tel;
    document.getElementById("c2-nombre").innerText = c.contacto2.nombre;
    document.getElementById("c2-tel").innerText    = c.contacto2.tel;
    document.getElementById("c3-nombre").innerText = c.contacto3.nombre;
    document.getElementById("c3-tel").innerText    = c.contacto3.tel;
}

// AÑADIR COLABORADOR (POST API) 
async function confirmarAnadir() {

    const nombre = document.getElementById('f-nombre')?.value.trim();
    if (!nombre) {
        alert("El campo COLABORADOR es obligatorio.");
        return;
    }

    const nuevo = {
        nombre,
        domicilio: document.getElementById('f-domicilio')?.value.trim() || '---',
        localidad: document.getElementById('f-localidad')?.value.trim() || '---',
        cp: document.getElementById('f-cp')?.value.trim() || '---',
        colabora: document.getElementById('f-colabora')?.value.trim() || '---',
        coord: document.getElementById('f-coord')?.value.trim() || '---',

        contacto1: {
            nombre: document.getElementById('f-c1-nombre')?.value.trim() || '---',
            tel: document.getElementById('f-c1-tel')?.value.trim() || '---'
        },
        contacto2: {
            nombre: document.getElementById('f-c2-nombre')?.value.trim() || '---',
            tel: document.getElementById('f-c2-tel')?.value.trim() || '---'
        },
        contacto3: {
            nombre: document.getElementById('f-c3-nombre')?.value.trim() || '---',
            tel: document.getElementById('f-c3-tel')?.value.trim() || '---'
        },

        observaciones: document.getElementById('f-obs')?.value.trim() || '',
        pendienteValidacion: window._panelPendiente || false
    };

    try {
        await fetch(`${API_URL}/colaboradores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevo)
        });

        await cargarColaboradores();
        cargarTabla();
        cerrarPanelAnadir();

        alert(`Colaborador "${nombre}" añadido correctamente.`);

    } catch (err) {
        console.error(err);
        alert("Error al guardar colaborador");
    }
}

// ELIMINAR
async function eliminarColaborador(id) {

    await fetch(`${API_URL}/colaboradores/${id}`, {
        method: "DELETE"
    });

    await cargarColaboradores();
    cargarTabla();
}

// PANEL AÑADIR 
function abrirPanelAnadir(pendiente) {

    window._panelPendiente = pendiente;

    document.getElementById('overlay-anadir').style.display = 'block';
    document.getElementById('panel-anadir').style.display   = 'block';
}

function cerrarPanelAnadir() {
    document.getElementById('overlay-anadir').style.display = 'none';
    document.getElementById('panel-anadir').style.display   = 'none';
}

// ACCIONES 
function accion(tipo) {

    switch (tipo) {

        case 'anadir':
            abrirPanelAnadir(false);
            break;

        case 'anadir-pendiente':
            abrirPanelAnadir(true);
            break;

        case 'eliminar':
            if (!colaboradorSeleccionadoId) return alert("Selecciona un colaborador.");
            if (confirm("¿Eliminar este colaborador?")) {
                eliminarColaborador(colaboradorSeleccionadoId);
                colaboradorSeleccionadoId = null;
            }
            break;

        case 'guardar':
            alert("Edición pendiente de implementación.");
            break;

        case 'exportar':
            alert("Exportando...");
            break;

        default:
            console.log("Acción no definida:", tipo);
    }
}