// 1. Minibase de datos con la propiedad "cadena" añadida
const tiendas = [
    { id: 'CARREFOUR_001', nombre: 'Carrefour Hiper', cadena: 'CARREFOUR', domicilio: 'c/ Arroyo de Totalán, nº 36 - CC LA VICTORIA', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_002', nombre: 'Carrefour Market', cadena: 'CARREFOUR', domicilio: 'Plaza Don Antonio Estrada, s/n - La Cala del Moral', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_003', nombre: 'Carrefour Express', cadena: 'CARREFOUR', domicilio: 'c/ Ronda, s/n', localidad: 'RINCON DE LA VICTORIA', coord: 'JM Cobos' },
    { id: 'CARREFOUR_004', nombre: 'CARREFOUR EXPRESS', cadena: 'CARREFOUR', domicilio: 'Pasaje Tamayo y Baus, 2', localidad: 'MALAGA', coord: 'Aranxa' }
];

// Referencias a los elementos
const tablaBody = document.getElementById('tabla-body');

const selectCadena = document.getElementById('filtro-cadena');
const selectLocalidad = document.getElementById('filtro-localidad');
const selectZonaGeografica = document.getElementById('filtro-zonaGeografica');
const selectCoord = document.getElementById('filtro-coordinador');


function filtrarYCargarTabla() {
    const cadenaSel = selectCadena.value;
    const localidadSel = selectLocalidad.value;
    const geografiaSel = selectZonaGeografica.value;
    const coordSel = selectCoord.value;


    // Limpiamos la tabla
    tablaBody.innerHTML = '';

    // Filtramos el array original
    const filtrados = tiendas.filter(tienda => {
        const cumpleCadena = (cadenaSel === "Todas" || tienda.cadena === cadenaSel);
        const cumpleLocalidad = (localidadSel === "Todas" || tienda.localidad === localidadSel);
        const cumpleGeografia = (geografiaSel === "Todas" || tienda.localidad === localidadSel);
        const cumpleLocalidad = (localidadSel === "Todas" || tienda.localidad === localidadSel);
        
        return cumpleCadena && cumpleLocalidad;
    });

    // Dibujamos solo los filtrados
    filtrados.forEach(tienda => {
        const row = `
            <tr onclick="mostrarDetalle('${tienda.id}')">
                <td>${tienda.nombre}</td>
                <td><input type="checkbox" checked></td>
                <td>${tienda.domicilio}</td>
                <td>${tienda.localidad}</td>
                <td>${tienda.coord}</td>
            </tr>
        `;
        tablaBody.innerHTML += row;
    });
}

// 3. Función para mostrar detalles (se mantiene igual, solo corregí el ID)
function mostrarDetalle(id) {
    const tienda = tiendas.find(t => t.id === id);
    if(tienda) {
        document.getElementById('det-id').innerText = tienda.id;
        document.getElementById('det-dom').innerText = tienda.domicilio;
        document.getElementById('det-loc').innerText = tienda.localidad;
        // Aquí podrías personalizar según la tienda si tuvieras más datos
        document.getElementById('det-v-m').innerText = "362-AYUNTAMIENTO DE ALMACHAR - María Vallejo";
    }
}

// 4. Escuchadores de eventos: se ejecutan cada vez que cambias un select
selectCadena.addEventListener('change', filtrarYCargarTabla);
selectLocalidad.addEventListener('change', filtrarYCargarTabla);

// Inicializar la tabla por primera vez
filtrarYCargarTabla();