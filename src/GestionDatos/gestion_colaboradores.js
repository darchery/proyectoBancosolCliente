// ─── CONTROL DE SESIÓN Y ROL ───────────────────────────────────────────────
const rolActual = localStorage.getItem('userRole');
const usuarioActual = localStorage.getItem('userName') || rolActual;

if (!rolActual) {
    console.warn("No hay sesión activa. Redirigiendo a login...");
    window.location.href = '../index_login.html';
}


const colaboradores = [
{
  id:"1",
  nombre:"A0362-AYUNTAMIENTO DE ALMACHAR",
  domicilio:"Calle Almería, 14",
  localidad:"ALMACHAR",
  cp:"29718",
  colabora:"RINCON DE LA VICTORIA",
  coord:"JM Cobos",
  contacto1:{nombre:"Mario Torre (Concejal)", email:"", tel:"555 555 555"},
  contacto2:{nombre:"María Vallejo", email:"", tel:"333 333 333"},
  contacto3:{nombre:"Fijo Ayuntamiento", email:"", tel:"999 999 999"},
  observaciones:"10 voluntarios - Formación jueves 19:45",
  pendienteValidacion: false
},
{
  id:"2",
  nombre:"Guardia Civil",
  domicilio:"---",
  localidad:"---",
  cp:"---",
  colabora:"---",
  coord:"JM Cobos",
  contacto1:{nombre:"---", email:"", tel:"---"},
  contacto2:{nombre:"---", email:"", tel:"---"},
  contacto3:{nombre:"---", email:"", tel:"---"},
  observaciones:"",
  pendienteValidacion: false
}
];

// ─── VARIABLES GLOBALES ────────────────────────────────────────────────────
let colaboradorSeleccionadoId = null;

// ─── INICIALIZACIÓN ────────────────────────────────────────────────────────
window.onload = function() {
    console.log("Rol detectado:", rolActual);

    // Mostrar usuario en cabecera
    const usuarioDisplay = document.getElementById('usuario-display');
    if (usuarioDisplay) usuarioDisplay.textContent = usuarioActual + ' (' + rolActual + ')';

    aplicarPermisos();
    cargarTabla();

    // Eventos filtros
    const filtroLocalidad = document.getElementById('filtro-localidad');
    const filtroCoord = document.getElementById('filtro-coord');
    if (filtroLocalidad) filtroLocalidad.addEventListener('change', cargarTabla);
    if (filtroCoord) filtroCoord.addEventListener('change', cargarTabla);
};

// ─── CONTROL DE PERMISOS POR ROL ──────────────────────────────────────────
function aplicarPermisos() {
    const badge     = document.getElementById('rol-badge');
    const menuAdmin = document.getElementById('menu-admin');
    const menuCoord = document.getElementById('menu-coordinador');

    // Ocultar todo por defecto
    if (menuAdmin) menuAdmin.style.display = 'none';
    if (menuCoord) menuCoord.style.display = 'none';

    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.style.display = 'grid';
        if (badge) badge.textContent = 'Acceso completo — Administrador';
        console.log("✔ Admin: acceso completo");

    } else if (rolActual === 'coordinador' || rolActual === 'capitan_coordinador') {
        if (menuCoord) menuCoord.style.display = 'grid';
        if (badge) badge.textContent = 'Coordinadores: actualizar contactos, añadir (pendiente validación) o exportar';
        console.log("✔ Coordinador: acceso restringido");

    } else {
        if (badge) badge.textContent = 'Acceso de solo lectura';
        console.log("Usuario sin permisos de edición");
    }
}

// ─── CARGAR TABLA ──────────────────────────────────────────────────────────
function cargarTabla() {
    const tabla = document.getElementById("tabla-body");
    if (!tabla) return;

    const localidadSel = document.getElementById('filtro-localidad')?.value || 'Todas';
    const coordSel     = document.getElementById('filtro-coord')?.value     || 'Todas';

    tabla.innerHTML = "";

    const filtrados = colaboradores.filter(c => {
        const cumpleLocalidad = (localidadSel === 'Todas' || c.localidad === localidadSel);
        const cumpleCoord     = (coordSel === 'Todas'     || c.coord === coordSel);
        return cumpleLocalidad && cumpleCoord;
    });

    if (filtrados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;">No hay coincidencias</td></tr>`;
        return;
    }

    filtrados.forEach(c => {
        const pendiente = c.pendienteValidacion
            ? ' <span style="color:orange;font-size:.75em;">(pendiente validación)</span>'
            : '';
        tabla.innerHTML += `
        <tr onclick="verDetalle('${c.id}')" style="cursor:pointer;">
          <td>${c.nombre}${pendiente}</td>
          <td>${c.domicilio}</td>
          <td>${c.localidad}</td>
          <td>${c.colabora}</td>
          <td>${c.coord}</td>
          <td>${c.contacto1.nombre}</td>
          <td>${c.observaciones}</td>
        </tr>`;
    });
}

// ─── MOSTRAR DETALLE ───────────────────────────────────────────────────────
function verDetalle(id) {
    colaboradorSeleccionadoId = id;
    const c = colaboradores.find(x => x.id == id);
    if (!c) return;

    document.getElementById("d-nombre").innerText   = c.nombre;
    document.getElementById("d-dom").innerText      = c.domicilio;
    document.getElementById("d-cp").innerText       = c.cp + " - " + c.localidad;
    document.getElementById("d-colabora").innerText = c.colabora;
    document.getElementById("d-obs").innerText      = c.observaciones;

    // Vista solo lectura
    document.getElementById("c1-nombre").innerText = c.contacto1.nombre;
    document.getElementById("c1-tel").innerText    = c.contacto1.tel;
    document.getElementById("c2-nombre").innerText = c.contacto2.nombre;
    document.getElementById("c2-tel").innerText    = c.contacto2.tel;
    document.getElementById("c3-nombre").innerText = c.contacto3.nombre;
    document.getElementById("c3-tel").innerText    = c.contacto3.tel;


}

// ─── ACCIONES ──────────────────────────────────────────────────────────────
function accion(tipo) {
    switch (tipo) {

        case 'guardar':
        case 'guardar-contactos':
            if (!colaboradorSeleccionadoId) {
                alert("Selecciona primero un colaborador.");
                return;
            }
            // La edición de contactos se realizará desde formulario/modal aparte (pendiente implementar)
            alert("Para modificar contactos, use el formulario de edición del colaborador.");
            break;

        case 'anadir':
            alert("Función: Añadir nuevo colaborador (Admin).");
            break;

        case 'anadir-pendiente':
            alert("Colaborador añadido. Quedará pendiente de validación por el Administrador.");
            // En una implementación real, se marcaría pendienteValidacion:true y se notificaría al admin
            break;

        case 'modificar':
            if (!colaboradorSeleccionadoId) { alert("Selecciona un colaborador."); return; }
            alert("Función: Modificar colaborador (Admin).");
            break;

        case 'eliminar':
            if (!colaboradorSeleccionadoId) { alert("Selecciona un colaborador."); return; }
            if (confirm("¿Eliminar este colaborador?")) {
                const idx = colaboradores.findIndex(x => x.id == colaboradorSeleccionadoId);
                if (idx !== -1) colaboradores.splice(idx, 1);
                colaboradorSeleccionadoId = null;
                cargarTabla();
            }
            break;

        case 'asignar':
            if (!colaboradorSeleccionadoId) { alert("Selecciona un colaborador."); return; }
            alert("Función: Asignar colaborador a tienda (Admin).");
            break;

        case 'exportar':
            alert("Exportando listado de colaboradores...");
            break;

        case 'cancelar':
            if (colaboradorSeleccionadoId) verDetalle(colaboradorSeleccionadoId);
            break;
    }
}