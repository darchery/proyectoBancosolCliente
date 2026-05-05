// Datos iniciales de campañas y cadenas
const datosCampanya = {
    campanyas: [
        { id: 'primavera', nombre: 'PRIMAVERA', activa: false },
        { id: 'gran-recogida', nombre: 'GRAN RECOGIDA', activa: true }
    ],
    cadenas: [
        { id: 'alcampo', nombre: 'ALCAMPO', seleccionada: true },
        { id: 'lidl', nombre: 'LIDL', seleccionada: true },
        { id: 'aldi', nombre: 'ALDI', seleccionada: true },
        { id: 'makro', nombre: 'MAKRO', seleccionada: false },
        { id: 'carrefour', nombre: 'CARREFOUR', seleccionada: false },
        { id: 'mas', nombre: 'MAS', seleccionada: true },
        { id: 'dia', nombre: 'DIA', seleccionada: true },
        { id: 'mercadona', nombre: 'MERCADONA', seleccionada: true },
        { id: 'eci', nombre: 'EL CORTE INGLES', seleccionada: false },
        { id: 'suma', nombre: 'SUMA', seleccionada: false },
        { id: 'eljamon', nombre: 'EL JAMON', seleccionada: true },
        { id: 'eroski', nombre: 'EROSKI', seleccionada: false }
    ]
};

const rutasPorGestion = {
    home_admin: '../GestionUsuarios/welcome_admin.html',
};

/**
 * Renderiza las campañas en el contenedor correspondiente
 */
function cargarCampanyas() {
    const container = document.getElementById('campanya-container');
    // Mantener el título H2
    const h2 = container.querySelector('h2');
    container.innerHTML = '';
    container.appendChild(h2);

    datosCampanya.campanyas.forEach(camp => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.style.marginTop = '10px';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = camp.id;
        input.checked = camp.activa;
        
        const label = document.createElement('label');
        label.htmlFor = camp.id;
        label.textContent = camp.nombre;
        label.style.marginLeft = '8px';

        div.appendChild(input);
        div.appendChild(label);
        container.appendChild(div);
    });
}

/**
 * Renderiza las cadenas en la cuadrícula
 */
function cargarCadenas() {
    const grid = document.getElementById('cadenas-grid');
    grid.innerHTML = '';

    datosCampanya.cadenas.forEach(cadena => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = cadena.id;
        input.checked = cadena.seleccionada;
        
        const label = document.createElement('label');
        label.htmlFor = cadena.id;
        label.textContent = cadena.nombre;

        div.appendChild(input);
        div.appendChild(label);
        grid.appendChild(div);
    });
}

// Inicializar la carga cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarCampanyas();
    cargarCadenas();

    // Ejemplo de manejador para el botón Guardar
    document.getElementById('btn-guardar').addEventListener('click', () => {
        alert('Cambios guardados localmente (Simulación)');
        console.log('Datos actuales:', datosCampanya);
    });

        // Botón salir 
    const btnSalir = document.getElementById('btn-salir-campanya');
    if (btnSalir) {
        btnSalir.addEventListener('click', () => {
            localStorage.clear(); 
            window.location.href = rutasPorGestion['home_admin'];
        });
    }
});

// Faltan las funcionalidades principales