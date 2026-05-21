// Variable global para el rol actual
const rolActual = localStorage.getItem('userRole') || 'admin';

// Función auxiliar para obtener el dashboard según el rol
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

// Datos de ejemplo para la bandeja de entrada
const mensajesMock = [
    { 
        id: 1, 
        fecha: '2024-05-20', 
        remitente: 'Juan Pérez (Coordinador)', 
        asunto: 'Incidencia en Tienda Alcampo', 
        estado: 'Pendiente',
        contenido: 'Hola, falta material de cartelería en la zona de cajas. ¿Podrían enviarnos más?'
    },
    { 
        id: 2, 
        fecha: '2024-05-19', 
        remitente: 'María López (Tienda)', 
        asunto: 'Nueva solicitud de acceso', 
        estado: 'Leído',
        contenido: 'Solicito acceso para el nuevo responsable de turno de la tarde.'
    },
    { 
        id: 3, 
        fecha: '2024-05-18', 
        remitente: 'Sistema', 
        asunto: 'Resumen diario de voluntarios', 
        estado: 'Archivado',
        contenido: 'El resumen de hoy muestra un total de 45 voluntarios activos.'
    }
];

/**
 * Carga los mensajes en la tabla
 */
function cargarTabla() {
    const tbody = document.querySelector('#tabla-mensajes');
    tbody.innerHTML = ''; // Limpieza permitida

    // Recorremos el array de mensajes y creamos una fila para cada uno
    mensajesMock.forEach(mensaje => {
        const tr = document.createElement('tr');
        
        const campos = [mensaje.fecha, mensaje.remitente, mensaje.asunto];
        campos.forEach(texto => {
            const td = document.createElement('td');
            td.textContent = texto;
            tr.appendChild(td);
        });

        // Celda de estado con badge
        const tdEstado = document.createElement('td');
        const spanEstado = document.createElement('span');
        spanEstado.classList.add('badge', mensaje.estado.toLowerCase());
        spanEstado.textContent = mensaje.estado;
        tdEstado.appendChild(spanEstado);
        tr.appendChild(tdEstado);
        
        // Evento para ver detalles al hacer clic en la fila
        tr.addEventListener('click', () => mostrarDetalle(mensaje));
        tbody.appendChild(tr);
    });
}

/**
 * Muestra el contenido de un mensaje en el panel lateral
 */
function mostrarDetalle(mensaje) {
    const contenedor = document.querySelector('#contenido-detalle');
    contenedor.innerHTML = ''; // Limpieza permitida

    const div = document.createElement('div');
    div.classList.add('mensaje-detalle');

    const crearP = (etiqueta, valor) => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = etiqueta + ': ';
        p.appendChild(strong);
        p.appendChild(document.createTextNode(valor));
        return p;
    };

    div.appendChild(crearP('De', mensaje.remitente));
    div.appendChild(crearP('Fecha', mensaje.fecha));
    div.appendChild(crearP('Asunto', mensaje.asunto));
    
    div.appendChild(document.createElement('hr'));

    const pContenido = document.createElement('p');
    pContenido.classList.add('mt-10'); // Usando clase del CSS en lugar de inline style
    pContenido.textContent = mensaje.contenido;
    div.appendChild(pContenido);

    contenedor.appendChild(div);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargamos los mensajes en la tabla al cargar la página
    cargarTabla();

    // Configurar botones de acción
    document.querySelector('#btn-responder')?.addEventListener('click', () => {
        alert('Funcionalidad de respuesta no implementada aún.');
    });

    document.querySelector('#btn-archivar')?.addEventListener('click', () => {
        alert('Mensaje archivado correctamente.');
    });

    document.querySelector('#btn-eliminar')?.addEventListener('click', () => {
        if(confirm('¿Está seguro de que desea eliminar este mensaje?')) {
            alert('Mensaje eliminado.');
        }
    });

    // Botón volver al menú principal
    document.querySelector('#btn-volver-menu')
        ?.addEventListener('click', () => window.location.href = getDashboardURL());
});
