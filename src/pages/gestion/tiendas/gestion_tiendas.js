// DECLARACION DE VARIBLES GLOBALES
let tiendas = [];

// almacenamos rol actual porque segun cual sea tendrá diferentes funciones
const rolAct = localStorage.getItem('userRole'); 

let tablaBody, selectCadena, selectLocalidad, selectCoord, menuAdmin;

// INICIALIZACION
document.addEventListener('DOMContentLoaded', async function ()
{
    //1º elementos del HTML
    tablaBody    = document.getElementById('tabla-body');
    selectCadena = document.getElementById('filtro-cadena');
    selectLocalidad = document.getElementById('filtro-localidad');
    selectCoord  = document.getElementById('filtro-coordinador');
    menuAdmin    = document.getElementById('admin-menu');

    // Permisos segun rol
    if (rolAct === 'admin') { menuAdmin.style.display = 'grid';} 
    else { menuAdmin.style.display = 'none';}

    // Cargamos y mostramos tablas
    await cargarTiendas();
    filtrarYCargarTabla();

    // Filtros
    selectCadena?.addEventListener('change', filtrarYCargarTabla);
    selectLocalidad?.addEventListener('change', filtrarYCargarTabla);
    selectCoord?.addEventListener('change', filtrarYCargarTabla);

});

// FUNCIONES
// Traemos datos del JSON y los guardamos en la vble tienda
async function cargarTiendas() {
    try {
        const respuesta = await fetch('../../../data/datos.json');
        const datos = await respuesta.json();

        tiendas = datos.tiendas;
 
    } catch (error) {
        console.error("Error al cargar el JSON:", error);
        tiendas = [];
    }
}

function filtrarYCargarTabla() {
 
    if (!tablaBody) return;
 
    //leemos valor del filtro
    const cadenaSel    = selectCadena?.value    || 'Todas';
    const localidadSel = selectLocalidad?.value || 'Todas';
    const coordSel     = selectCoord?.value     || 'Todas';
 
    tablaBody.innerHTML = '';

    //solo pasa la tienda que cumpla todas las condiciones: Si no hay resultados mostramos msj 
    const filtradas = tiendas.filter(tienda => {
        const coincideCadena =  (cadenaSel === 'Todas' || tienda.cadena === cadenaSel);
        const coincideLocalidad =   (localidadSel === 'Todas' || tienda.localidad === localidadSel);
        const coincideCoord =   (coordSel === 'Todas' || tienda.coord === coordSel);

        return coincideCadena && coincideLocalidad && coincideCoord;
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

        fila.innerHTML = `
            <td>${tienda.nombre}</td>
            <td><button class="btn-delete">🗑</button></td>
            <td>${tienda.domicilio}</td>
            <td>${tienda.localidad}</td>
            <td>${tienda.coord}</td>
        `;

        fila.addEventListener('click', () => mostrarDetalle(tienda.id));

        // eliminar
        fila.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarTienda(tienda.id);
        });

        tablaBody.appendChild(fila);
    });
}
 
function mostrarDetalle(id) {
    let tienda = null;

    for (let i = 0; i < tiendas.length; i++) {
        if (tiendas[i].id === id) {
            tienda = tiendas[i];
            break;
        }
    }
    if (!tienda) return;

    document.getElementById('det-id').textContent  = tienda.id;
    document.getElementById('det-dom').textContent = tienda.domicilio;
    document.getElementById('det-loc').textContent = tienda.localidad;
 
    const detViernes = document.getElementById('det-v-m');
    if (detViernes) detViernes.textContent = tienda.zona || 'Sin asignar';
    
    const detSabado = document.getElementById('det-s-m');
    if (detSabado) detSabado.textContent = `Coordinador: ${tienda.coord}`;
} 

// CRUD 
function crearTienda(nuevaTienda) {
    tiendas.push(nuevaTienda);
    filtrarYCargarTabla();
}

function eliminarTienda(id) {
    tiendas = tiendas.filter(t => t.id !== id);
    filtrarYCargarTabla();
}