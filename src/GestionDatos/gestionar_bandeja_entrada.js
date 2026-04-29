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
    const tbody = document.getElementById('tabla-mensajes');
    tbody.innerHTML = '';

    mensajesMock.forEach(mensaje => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${mensaje.fecha}</td>
            <td>${mensaje.remitente}</td>
            <td>${mensaje.asunto}</td>
            <td><span class="badge ${mensaje.estado.toLowerCase()}">${mensaje.estado}</span></td>
        `;
        
        // Evento para ver detalles al hacer clic en la fila
        tr.addEventListener('click', () => mostrarDetalle(mensaje));
        tbody.appendChild(tr);
    });
}

/**
 * Muestra el contenido de un mensaje en el panel lateral
 */
function mostrarDetalle(mensaje) {
    const contenedor = document.getElementById('contenido-detalle');
    contenedor.innerHTML = `
        <div class="mensaje-detalle">
            <p><strong>De:</strong> ${mensaje.remitente}</p>
            <p><strong>Fecha:</strong> ${mensaje.fecha}</p>
            <p><strong>Asunto:</strong> ${mensaje.asunto}</p>
            <hr>
            <p style="margin-top: 15px; line-height: 1.5;">${mensaje.contenido}</p>
        </div>
    `;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarTabla();

    // Configurar botones de acción
    document.getElementById('btn-responder')?.addEventListener('click', () => {
        alert('Funcionalidad de respuesta no implementada aún.');
    });

    document.getElementById('btn-archivar')?.addEventListener('click', () => {
        alert('Mensaje archivado correctamente.');
    });

    document.getElementById('btn-eliminar')?.addEventListener('click', () => {
        if(confirm('¿Está seguro de que desea eliminar este mensaje?')) {
            alert('Mensaje eliminado.');
        }
    });
});
