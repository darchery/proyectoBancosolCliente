const rutasPorGestion = {
    home_admin: '../../welcome/welcome_admin.html',
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