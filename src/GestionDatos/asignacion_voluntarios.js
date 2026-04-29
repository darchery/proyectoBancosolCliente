const API_URL = "http://localhost:3001";

const rolActual = localStorage.getItem('userRole');
const usuarioActual = localStorage.getItem('userName') || rolActual;

if (!rolActual) {
    console.warn("No hay sesión activa. Redirigiendo a login...");
    window.location.href = '../index_login.html';
}

// VARIABLES
let asignaciones = [];

// INICIALIZACIÓN
window.onload = async function() {

    const usuarioDisplay = document.getElementById('usuario-display');
    if (usuarioDisplay) {
        usuarioDisplay.textContent = usuarioActual + ' (' + rolActual + ')';
    }

    aplicarPermisos();

    await cargarAsignaciones();

    cargarTabla();

    const filtroLocalidad = document.getElementById('filtro-localidad');
    const filtroCadena    = document.getElementById('filtro-cadena');

    if (filtroLocalidad) filtroLocalidad.addEventListener('change', cargarTabla);
    if (filtroCadena)    filtroCadena.addEventListener('change', cargarTabla);
};

// CARGAR DATOS
async function cargarAsignaciones() {
    try {
        const res = await fetch(`${API_URL}/asignaciones`);
        asignaciones = await res.json();
        console.log("Asignaciones cargadas:", asignaciones);
    } catch (error) {
        console.error("Error cargando asignaciones:", error);
    }
}

// PERMISOS
function aplicarPermisos() {

    const badge     = document.getElementById('rol-badge');
    const menuAdmin = document.getElementById('menu-admin');

    if (menuAdmin) menuAdmin.style.display = 'none';

    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.style.display = 'grid';
        if (badge) badge.textContent = 'Acceso completo — Administrador';

    } else if (rolActual === 'coordinador' || rolActual === 'capitan_coordinador') {
        if (badge) badge.textContent = 'Coordinador — acceso limitado';

    } else {
        if (badge) badge.textContent = 'Solo lectura';
    }
}

// TABLA
function cargarTabla() {

    const tabla = document.getElementById("tabla-body");
    if (!tabla) return;

    const localidadSel = document.getElementById('filtro-localidad')?.value || 'Todas';
    const cadenaSel    = document.getElementById('filtro-cadena')?.value || 'Todas';

    tabla.innerHTML = "";

    const filtrados = asignaciones.filter(a => {
        return (
            (localidadSel === 'Todas' || a.localidad === localidadSel) &&
            (cadenaSel === 'Todas' || a.tienda.toUpperCase().includes(cadenaSel))
        );
    });

    if (filtrados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:20px;">No hay datos</td></tr>`;
        return;
    }

    filtrados.forEach(a => {

        const pendiente = a.pendienteValidacion
            ? ' <span style="color:orange;font-size:.75em;">(pendiente)</span>'
            : '';

        tabla.innerHTML += `
        <tr>
          <td>${a.tienda}${pendiente}</td>
          <td>${a.domicilio}</td>
          <td>${a.localidad}</td>
          <td>${a.capitan}</td>
          <td>${a.viernes_manana}</td>
          <td>${a.viernes_tarde}</td>
          <td>${a.sabado_manana}</td>
          <td>${a.sabado_tarde}</td>
          <td>${a.observaciones}</td>
        </tr>`;
    });
}

// ACCIONES (placeholder igual que tu otro módulo)
function accion(tipo) {

    switch (tipo) {

        case 'anadir':
            alert("Función añadir pendiente");
            break;

        case 'modificar':
            alert("Función modificar pendiente");
            break;

        case 'guardar':
            alert("Guardando cambios...");
            break;

        case 'exportar':
            alert("Exportando...");
            break;

        case 'cancelar':
            cargarTabla();
            break;

        default:
            console.log("Acción no definida:", tipo);
    }
}