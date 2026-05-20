// Rutas para redireccionar al salir
const rutasPorGestion = {
    home_admin: '../../welcome/welcome_admin.html',
};

// URL base para el json-server
const API_URL = 'http://localhost:3001'; // json-server (puerto correcto que tengas disponible)
// Rol del usuario actual 
const rolActual = localStorage.getItem('userRole') || 'admin';

// Variables globales para almacenar los datos
let campanyas = [];
let cadenas = [];
let modo = 'anyadir';
let cadenaEnEdicion = null;

// Elementos del DOM
let divCampanyas, divCadenas;


// Esperamos a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', async function () {
    divCampanyas = document.querySelector("#campanya-container");
    divCadenas = document.querySelector("#cadenas-grid");   

    try {
        // Cargar los datos de campañas y cadenas desde el servidor antes de renderizar
        await cargarCadenas(); 
        await cargarCampanyas();

        // Una vez que los datos estén cargados, renderizamos los checkboxes
        rellenarCheckboxCampanyas("#campanya-container", campanyas);
        rellenarCheckboxCadenas("#cadenas-grid", cadenas);

        console.log('Datos renderizados correctamente');
    } catch (error) {
        console.error('Error al inicializar:', error);
    }

    // Botones para añadir, eliminar, modificar y guardar campañas
    const botonAnyadir = document.querySelector("#btn-anyadir");
    const botonEliminar = document.querySelector("#btn-eliminar");
    const botonModificar = document.querySelector("#btn-modificar");
    const botonGuardar = document.querySelector("#btn-guardar");

    // Add event listeners a los botones
    
    botonAnyadir.addEventListener('click', abrirModalAnadir);
    botonEliminar.addEventListener('click', abrirModalEliminar);
    botonModificar.addEventListener('click', abrirModalModificar);
    botonGuardar.addEventListener('click', abrirModalGuardar);
})

// CARGAR CAMPAÑAS Y CADENAS DESDE EL JSON-SERVER(db.json)
//
// fetch() devuelve una promesa. Con await esperamos a que
// se resuelva antes de continuar con el resto del código.
// .json() también es asíncrono: lee el cuerpo de la respuesta
// y lo convierte en objeto JavaScript
async function cargarCampanyas() {
    try {
        // Realizamos la petición al servidor(server-json) para obtener las campañas
        const respuesta = await fetch(`${API_URL}/campanyas`);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // Si la respuesta es correcta, convertimos el cuerpo de la respuesta a JSON
        campanyas = await respuesta.json()
        console.log('Camapañas cargadas: ', campanyas)

    } catch (error) {
        console.error(`Error al cargar las campañas: `, error);
        campanyas = [];
    }
}


async function cargarCadenas() {
    try {
        const respuesta = await fetch(`${API_URL}/cadenas`);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        cadenas = await respuesta.json()
        console.log('Cadenas cargadas: ', cadenas)

    } catch (error) {
        console.error(`Error al cargar las cadenas: `, error);
        cadenas = [];
    }
}

// Función para rellenar los checkboxes de cadenas en el DOM
function rellenarCheckboxCadenas(idCadenasGrid, valores) {
    const divCadenas = document.querySelector(idCadenasGrid)

    divCadenas.innerHTML = '';

    // Creamos un título para el bloque de cadenas
    for (const valor of valores) {
        // Creamos un div para cada checkbox y su etiqueta
        const divCheckbox = document.createElement('div');
        divCheckbox.className = 'checkbox-item';

        // Creamos el checkbox
        const input = document.createElement('input')
        input.type = 'checkbox';
        input.value = valor.id;
        input.id = valor.id
        input.name = valor.nombre
        input.textContent = valor.nombre;
        input.checked = valor.seleccionada;

        // Creamos la etiqueta para el checkbox
        const label = document.createElement('label');
        label.htmlFor = valor.id;
        label.textContent = valor.nombre

        // Añadimos el checkbox y su etiqueta al div, y luego el div al contenedor
        divCheckbox.appendChild(input);
        divCheckbox.appendChild(label);
        divCadenas.appendChild(divCheckbox);    
    }
}

function rellenarCheckboxCampanyas(idCampanyasContainer, valores) {
    const divCampanyas = document.querySelector(idCampanyasContainer);

    // Guardamos el título antes de limpiar el contenedor
    const h2 = divCampanyas.querySelector('h2')
    divCampanyas.innerHTML = '';
    divCampanyas.appendChild(h2)

    // Creamos un checkbox para cada campaña y lo añadimos al contenedor
    for (const valor of valores) {
        // Creamos un div para cada checkbox y su etiqueta
        const divCheckbox = document.createElement('div');
        divCheckbox.className = 'checkbox-item';
        divCheckbox.classList.add('mt-10');

        // Creamos el checkbox
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = valor.id;
        input.id = valor.id
        input.name = valor.nombre
        input.textContent = valor.nombre;
        input.checked = valor.seleccionada;

        // Creamos la etiqueta para el checkbox  
        const label = document.createElement('label');
        label.htmlFor = valor.id;
        label.textContent = valor.nombre
        label.classList.add('ml-8');

        // Añadimos el checkbox y su etiqueta al div, y luego el div al contenedor
        divCheckbox.appendChild(input);
        divCheckbox.appendChild(label);
        divCampanyas.appendChild(divCheckbox);
    }
}

// Funciones para abrir el model de añadir
function abrirModalAnadir() {
    modo = 'anyadir';
    cadenaEnEdicion = null;
    mostrarModalAnadir();
}

// Funciones para abrir el modal de eliminar 
function abrirModalEliminar() {
    modo = 'eliminar';
    mostrarModalEliminar();
}

// Funciones para abrir el modal de modificar
function abrirModalModificar() {
    modo = 'modificar';
    mostrarModalModificar();
}

// Función para cerrar cualquier modal (limpiar contenido y ocultar)   
function cerrarModal() {
    const modalOverlay = document.querySelector('#modal-overlay');
    const modalContent = document.querySelector('#modal-content');
    // Ocultar el modal (remover clase 'active') => fondo oscuro desaparece 
    modalOverlay.classList.remove('active');
    // Limpiar contenido del modal para evitar que se acumulen elementos al abrirlo varias veces
    modalContent.innerHTML = '';
    cadenaEnEdicion = null;
}

// Función para abrir el modal de guardar cambios
function abrirModalGuardar() {
    modo = 'guardar';
    mostrarModalGuardar();
}

// Funciones para mostrar los diferentes modales
function mostrarModalAnadir() {
    // Obtener contenedor del modal y limpiar contenido anterior
    const modalContent = document.querySelector('#modal-content');
    modalContent.innerHTML = '';

    // --- CREAR HEADER DEL MODAL ---
    const divHeader = document.createElement('div');
    divHeader.className = 'modal-header';

    // Título del modal
    const titulo = document.createElement('h2');
    titulo.textContent = 'Añadir nueva cadena';
    divHeader.appendChild(titulo);

    // Botón cerrar (X)
    const btnClose = document.createElement('button');
    btnClose.className = 'modal-close-btn';
    btnClose.textContent = '×';
    btnClose.onclick = cerrarModal;
    divHeader.appendChild(btnClose);

    // --- CREAR BODY DEL MODAL ---
    const bodyCadena = document.createElement('div');
    bodyCadena.className = 'modal-body';

    // Grupo de formulario
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    // Etiqueta del input
    const label = document.createElement('label');
    label.htmlFor = 'nombre-cadena';
    label.textContent = 'Nombre de la cadena:';
    // Input de texto para nombre
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'nombre-cadena';
    input.placeholder = 'Ej: Bancosol La Paz';
    input.required = true;
    
    // Añadir label e input al formulario
    formGroup.appendChild(label);
    formGroup.appendChild(input);
    bodyCadena.appendChild(formGroup);

    // --- CREAR FOOTER DEL MODAL ---
    const divFooter = document.createElement('div');
    divFooter.className = 'modal-footer';

    // Botón cancelar
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn-modal secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = cerrarModal;

    // Botón guardar
    const btnGuardar = document.createElement('button');
    btnGuardar.className = 'btn-modal primary';
    btnGuardar.textContent = 'Guardar Cadena';
    btnGuardar.onclick = guardarNuevaCadena;

    // Añadir botones al footer
    divFooter.appendChild(btnCancelar);
    divFooter.appendChild(btnGuardar);

    // --- MONTAR EL MODAL COMPLETO ---
    modalContent.appendChild(divHeader);
    modalContent.appendChild(bodyCadena);
    modalContent.appendChild(divFooter);
    
    // Mostrar el modal (activar clase 'active')
    document.querySelector('#modal-overlay').classList.add('active');
}

function mostrarModalEliminar() {
    // Obtener contenedor del modal y limpiar contenido anterior
    const modalContent = document.querySelector('#modal-content');
    modalContent.innerHTML = '';

    // --- CREAR HEADER DEL MODAL ---
    const divHeader = document.createElement('div');
    divHeader.className = 'modal-header'; 
    
    // Título del modal
    const titulo = document.createElement('h2');
    titulo.textContent = 'Eliminar cadena';
    divHeader.appendChild(titulo);

    // Botón cerrar (X)
    const btnClose = document.createElement('button');
    btnClose.className = 'modal-close-btn';
    btnClose.textContent = '×';
    btnClose.onclick = cerrarModal;
    divHeader.appendChild(btnClose);

    // --- CREAR BODY DEL MODAL ---
    const divBody = document.createElement('div');
    divBody.className = 'modal-body';

    // Instrucción al usuario
    const instruccion = document.createElement('p');
    instruccion.textContent = 'Selecciona la cadena que deseas eliminar:';
    instruccion.classList.add('text-muted', 'mb-16');
    divBody.appendChild(instruccion);

    // --- LISTAR TODAS LAS CADENAS CON RADIO BUTTONS ---
    const divItemsList = document.createElement('div');
    divItemsList.className = 'items-list';
    // Recorrer cada cadena y crear su fila
    cadenas.forEach(cadena => {
        const divItemRow = document.createElement('div');
        divItemRow.className = 'item-row';

        // Radio button para seleccionar cadena
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'cadena-eliminar';
        radio.value = cadena.id;

        // Nombre de la cadena
        const nombre = document.createElement('label');
        nombre.className = 'item-name';
        nombre.textContent = cadena.nombre;

    
        // Añadir radio y nombre a la fila
        divItemRow.appendChild(radio);
        divItemRow.appendChild(nombre);
        divItemsList.appendChild(divItemRow);
    });
    divBody.appendChild(divItemsList);

    // --- CREAR FOOTER DEL MODAL ---
    const divFooter = document.createElement('div');
    divFooter.className = 'modal-footer';

    // Botón cancelar
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn-modal secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = cerrarModal;

    // Botón eliminar (rojo)
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-modal danger';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = eliminarCadenaSeleccionada;

    // Añadir botones al footer
    divFooter.appendChild(btnCancelar);
    divFooter.appendChild(btnEliminar);

    // --- MONTAR EL MODAL COMPLETO ---
    modalContent.appendChild(divHeader);
    modalContent.appendChild(divBody);
    modalContent.appendChild(divFooter);

    // Mostrar el modal (activar clase 'active')
    document.querySelector('#modal-overlay').classList.add('active');
}

function mostrarModalModificar() {
    // Obtener contenedor del modal y limpiar contenido anterior
    const modalContent = document.querySelector('#modal-content');
    modalContent.innerHTML = '';

    // --- CREAR HEADER DEL MODAL ---
    const divHeader = document.createElement('div');
    divHeader.className = 'modal-header';

    // Título del modal
    const titulo = document.createElement('h2');
    titulo.textContent = 'Modificar cadena';
    divHeader.appendChild(titulo);

    // Botón cerrar (X)
    const btnClose = document.createElement('button');
    btnClose.className = 'modal-close-btn';
    btnClose.textContent = '×';
    btnClose.onclick = cerrarModal;
    divHeader.appendChild(btnClose);

    // --- CREAR BODY DEL MODAL ---
    const divBody = document.createElement('div');
    divBody.className = 'modal-body';

    // Instrucción al usuario
    const instruccion = document.createElement('p');
    instruccion.textContent = 'Selecciona la cadena que deseas modificar:';
    instruccion.classList.add('text-muted', 'mb-16');
    divBody.appendChild(instruccion);

    // --- LISTAR TODAS LAS CADENAS CON RADIO BUTTONS ---
    const divItemsList = document.createElement('div');
    divItemsList.className = 'items-list';
    // Recorrer cada cadena y crear su fila
    cadenas.forEach(cadena => {
        const divItemRow = document.createElement('div');
        divItemRow.className = 'item-row';
        // Al hacer clic en la fila, seleccionar cadena para editar
        divItemRow.onclick = () => seleccionarCadenaParaEditar(cadena.id);

        // Radio button para seleccionar cadena
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'cadena-modificar';
        radio.value = cadena.id;

        // Nombre de la cadena
        const nombre = document.createElement('span');
        nombre.className = 'item-name';
        nombre.textContent = cadena.nombre;

        // Añadir radio y nombre a la fila
        divItemRow.appendChild(radio);
        divItemRow.appendChild(nombre);
        divItemsList.appendChild(divItemRow);
    });
    divBody.appendChild(divItemsList);

    // --- CREAR FORMULARIO DE EDICIÓN (oculto inicialmente) ---
    const divFormEdicion = document.createElement('div');
    divFormEdicion.id = 'form-edicion';
    divFormEdicion.classList.add('mt-20', 'hidden');

    // Grupo de formulario
    const divFormGroup = document.createElement('div');
    divFormGroup.className = 'form-group';
    
    // Etiqueta del input
    const label = document.createElement('label');
    label.htmlFor = 'nombre-cadena-edit';
    label.textContent = 'Nombre de la cadena:';

    // Input de texto para editar nombre
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'nombre-cadena-edit';
    input.placeholder = 'Ej: Bancosol La Paz';
    input.required = true;

    // Añadir label e input al formulario
    divFormGroup.appendChild(label);
    divFormGroup.appendChild(input);
    divFormEdicion.appendChild(divFormGroup);
    divBody.appendChild(divFormEdicion);

    // --- CREAR FOOTER DEL MODAL ---
    const divFooter = document.createElement('div');
    divFooter.className = 'modal-footer';

    // Botón cancelar
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn-modal secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = cerrarModal;

    // Botón guardar cambios (oculto hasta seleccionar cadena)
    const btnGuardar = document.createElement('button');
    btnGuardar.id = 'btn-confirmar-edit';
    btnGuardar.className = 'btn-modal primary';
    btnGuardar.textContent = 'Guardar cambios';
    btnGuardar.classList.add('hidden');
    btnGuardar.onclick = confirmarEdicionCadena;

    // Añadir botones al footer
    divFooter.appendChild(btnCancelar);
    divFooter.appendChild(btnGuardar);

    // --- MONTAR EL MODAL COMPLETO ---
    modalContent.appendChild(divHeader);
    modalContent.appendChild(divBody);
    modalContent.appendChild(divFooter);
    // Mostrar el modal (activar clase 'active')
    document.querySelector('#modal-overlay').classList.add('active');
}

function mostrarModalGuardar() {
    // Obtener contenedor del modal y limpiar contenido anterior
    const modalContent = document.querySelector('#modal-content');
    modalContent.innerHTML = '';
    
    // Obtener las cadenas seleccionadas DIRECTAMENTE DEL DOM (checkboxes marcados)
    const cadenasCheckboxes = Array.from(document.querySelectorAll('#cadenas-grid input[type="checkbox"]'));
    const cadenasSeleccionadas = cadenasCheckboxes.filter(cb => cb.checked).map(cb => {
        const cadena = cadenas.find(c => c.id === cb.id);
        return cadena?.nombre || '';
    }).join(', ');

    // --- CREAR HEADER DEL MODAL ---
    const divHeader = document.createElement('div');
    divHeader.className = 'modal-header';

    // Título del modal
    const titulo = document.createElement('h2');
    titulo.textContent = 'Confirmar cambios';
    divHeader.appendChild(titulo);

    // Botón cerrar (X)
    const btnClose = document.createElement('button');
    btnClose.className = 'modal-close-btn';
    btnClose.textContent = '×';
    btnClose.onclick = cerrarModal;
    divHeader.appendChild(btnClose);

    // --- CREAR BODY DEL MODAL ---
    const divBody = document.createElement('div');
    divBody.className = 'modal-body';

    // Título de cadenas seleccionadas
    const subtitulo = document.createElement('p');
    subtitulo.innerHTML = '<strong>Cadenas seleccionadas:</strong>';
    subtitulo.classList.add('text-dark', 'mb-16');
    divBody.appendChild(subtitulo);

    // --- MOSTRAR CADENAS EN UN CONTENEDOR ---
    const divContenedorCadenasSeleccionadas = document.createElement('div');
    divContenedorCadenasSeleccionadas.classList.add('bg-light-gray', 'p-12', 'rounded-6', 'mb-16');

    // Listar cadenas seleccionadas
    const cadenasText = document.createElement('p');
    cadenasText.textContent = cadenasSeleccionadas || 'Ninguna cadena seleccionada';
    cadenasText.classList.add('m-0', 'text-muted');
    divContenedorCadenasSeleccionadas.appendChild(cadenasText);
    divBody.appendChild(divContenedorCadenasSeleccionadas);

    // Pregunta de confirmación
    const pregunta = document.createElement('p');
    pregunta.textContent = '¿Deseas guardar estos cambios?';
    pregunta.classList.add('text-muted');
    divBody.appendChild(pregunta);

    // --- CREAR FOOTER DEL MODAL ---
    const divFooter = document.createElement('div');
    divFooter.className = 'modal-footer';

    // Botón cancelar
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn-modal secondary';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.onclick = cerrarModal;

    // Botón guardar cambios
    const btnGuardar = document.createElement('button');
    btnGuardar.className = 'btn-modal primary';
    btnGuardar.textContent = 'Guardar Cambios';
    btnGuardar.onclick = guardarCambiosCadenas;

    // Añadir botones al footer
    divFooter.appendChild(btnCancelar);
    divFooter.appendChild(btnGuardar);

    // --- MONTAR EL MODAL COMPLETO ---
    modalContent.appendChild(divHeader);
    modalContent.appendChild(divBody);
    modalContent.appendChild(divFooter);
    // Mostrar el modal (activar clase 'active')
    document.querySelector('#modal-overlay').classList.add('active');
}

// Funciones CRUD para las cadenas
async function guardarNuevaCadena() {
    // Obtener el nombre de la nueva cadena desde el input del modal
    const nombre = document.querySelector('#nombre-cadena').value.trim();

    // Validar que se haya ingresado un nombre
    if (!nombre) {
        alert('Por favor, ingresa un nombre para la cadena');
        return;
    }

    try {
        // Crear un nuevo objeto cadena con el nombre ingresado
        // Generar ID: nombre en minusculas separado por guiones
        const id = nombre.toLowerCase().replace(/\s+/g, '-');
        const nuevaCadena = {
            nombre: nombre,
            seleccionada: false,
            id: id
        };

        // Enviar la nueva cadena al servidor para guardarla
        const respuesta = await fetch(`${API_URL}/cadenas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCadena)
        });

        // Verificar si la respuesta del servidor es correcta
        if (!respuesta.ok) {
            throw new Error(`Error al guardar: ${respuesta.status}`);
        }


        // Recargar las cadenas desde el servidor para actualizar la lista
        await cargarCadenas();
        // Volver a renderizar los checkboxes con la nueva lista de cadenas
        rellenarCheckboxCadenas("#cadenas-grid", cadenas);
        
        // Mostrar mensaje de éxito y cerrar el modal
        alert('¡Cadena añadida con éxito!');
        cerrarModal();

    } catch (error) {
        console.error('Error al guardar la cadena:', error);
        alert('Error al guardar la cadena. Intenta de nuevo.');
    }
}

async function eliminarCadenaSeleccionada() {
    // Obtener el radio button seleccionado para eliminar la cadena correspondiente
    const radioSeleccionado = document.querySelector('input[name="cadena-eliminar"]:checked');

    // Validar que se haya seleccionado una cadena para eliminar
    if (!radioSeleccionado) {
        alert('Por favor, selecciona una cadena para eliminar');
        return;
    }

    // Obtener el ID de la cadena a eliminar desde el valor del radio button seleccionado
    const idCadena = radioSeleccionado.value;
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta cadena?');

    if (!confirmacion) return;

    try {
        // Enviar la solicitud al servidor para eliminar la cadena seleccionada
        const respuesta = await fetch(`${API_URL}/cadenas/${idCadena}`, {
            method: 'DELETE'
        });

        // Verificar si la respuesta del servidor es correcta
        if (!respuesta.ok) {
            throw new Error(`Error al eliminar: ${respuesta.status}`);
        }

        // Recargar las cadenas desde el servidor para actualizar la lista
        await cargarCadenas();
        rellenarCheckboxCadenas("#cadenas-grid", cadenas);
        
        // Mostrar mensaje de éxito y cerrar el modal
        alert('¡Cadena eliminada con éxito!');
        cerrarModal();

    } catch (error) {
        console.error('Error al eliminar la cadena:', error);
        alert('Error al eliminar la cadena. Intenta de nuevo.');
    }
}

function seleccionarCadenaParaEditar(idCadena) {
    // Buscar la cadena seleccionada en la lista de cadenas para cargar sus datos en el formulario de edición
    cadenaEnEdicion = cadenas.find(c => c.id === idCadena);
    
    // Marcar el radio button seleccionado para indicar qué cadena se está editando
    const radio = document.querySelector(`input[name="cadena-modificar"][value="${idCadena}"]`);
    // Si se encuentra el radio button correspondiente a la cadena seleccionada, marcarlo como seleccionado
    if (radio) radio.checked = true;
    
    const formEdicion = document.querySelector('#form-edicion');
    const btnConfirmarEdit = document.querySelector('#btn-confirmar-edit');
    
    // Si se ha encontrado la cadena para editar, mostrar el formulario de edición y 
    // cargar los datos de la cadena en el input correspondiente
    if (formEdicion && btnConfirmarEdit && cadenaEnEdicion) {
        // Mostrar el formulario de edición y el botón de confirmar cambios
        formEdicion.classList.remove('hidden');
        btnConfirmarEdit.classList.remove('hidden');
        
        // Cargar el nombre de la cadena seleccionada en el input del formulario de edición
        document.querySelector('#nombre-cadena-edit').value = cadenaEnEdicion.nombre;
    }
}

async function confirmarEdicionCadena() {
    // Validar que se haya seleccionado una cadena para editar antes de intentar guardar los cambios
    if (!cadenaEnEdicion) {
        alert('Por favor, selecciona una cadena para editar');
        return;
    }

    // Obtener el nuevo nombre de la cadena desde el input del formulario de edición
    const nombre = document.querySelector('#nombre-cadena-edit').value.trim();

    // Validar que se haya ingresado un nombre para la cadena antes de intentar guardar los cambios
    if (!nombre) {
        alert('Por favor, ingresa un nombre para la cadena');
        return;
    }

    // Intentar guardar los cambios de la cadena editada enviando una solicitud al servidor
    try {
        const cadenaActualizada = {
            ...cadenaEnEdicion,
            nombre: nombre
        };

        // Enviar la solicitud al servidor para actualizar la cadena editada con el nuevo nombre
        const respuesta = await fetch(`${API_URL}/cadenas/${cadenaEnEdicion.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cadenaActualizada)
        });

        if (!respuesta.ok) {
            throw new Error(`Error al actualizar: ${respuesta.status}`);
        }

        // Recargar las cadenas desde el servidor para actualizar la lista con los cambios realizados
        await cargarCadenas();
        rellenarCheckboxCadenas("#cadenas-grid", cadenas);
        
        // Mostrar mensaje de éxito y cerrar el modal
        alert('¡Cadena actualizada con éxito!');
        cerrarModal();

    } catch (error) {
        console.error('Error al actualizar la cadena:', error);
        alert('Error al actualizar la cadena. Intenta de nuevo.');
    }
}

async function guardarCambiosCadenas() {
    try {
        // Obtener todas las cadenas y actualizar su estado de selección basado en los checkboxes del DOM
        const cadenasActualizadas = cadenas.map(cadena => {
            // Usar atributo selector en lugar de ID selector para evitar problemas con caracteres especiales
            const checkboxElement = document.querySelector(`#cadenas-grid input[value="${cadena.id}"]`);
            return {
                ...cadena,
                seleccionada: checkboxElement?.checked || false
            };
        });

        // Actualizar todas las cadenas en la API con su nuevo estado de selección
        for (const cadena of cadenasActualizadas) {
            const respuesta = await fetch(`${API_URL}/cadenas/${cadena.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cadena)
            });
            
            if (!respuesta.ok) {
                throw new Error(`Error al actualizar cadena ${cadena.id}: ${respuesta.status}`);
            }
        }

        // Recargar las cadenas desde el servidor para asegurar que todo está sincronizado
        await cargarCadenas();
        rellenarCheckboxCadenas("#cadenas-grid", cadenas);
        
        // Mostrar mensaje de éxito y cerrar el modal
        alert('¡Cambios guardados con éxito!');
        cerrarModal();

    } catch (error) {
        console.error('Error al guardar cambios:', error);
        alert('Error al guardar cambios. Intenta de nuevo.');
    }
}

// Botón para salir de la gestión de campañas (limpiar localStorage y redirigir a home)
const btnSalir = document.querySelector('#btn-salir-campanya');
if (btnSalir) {
    btnSalir.addEventListener('click', () => {
        // Limpiar localStorage para eliminar cualquier dato relacionado con la sesión o gestión actual
        localStorage.clear();
        window.location.href = rutasPorGestion['home_admin'];
    });
}

// Función para generar la campaña (guardar en campanyas_generadas)
async function generarCampanya() {
    try {
        // Obtener la campaña seleccionada del DOM (checkbox marcado en columna izquierda)
        const checkboxCampanya = document.querySelector('#campanya-container input[type="checkbox"]:checked');
        if (!checkboxCampanya) {
            alert('Por favor, selecciona una campaña');
            return;
        }

        // Obtener la campaña seleccionada del array
        const idCampanya = checkboxCampanya.id;
        const campanyaSeleccionada = campanyas.find(c => c.id === idCampanya);
        
        if (!campanyaSeleccionada) {
            alert('Error: no se encontró la campaña seleccionada');
            return;
        }

        // Obtener las cadenas seleccionadas del DOM (checkboxes marcados en columna central)
        const cadenasCheckboxes = Array.from(document.querySelectorAll('#cadenas-grid input[type="checkbox"]:checked'));
        if (cadenasCheckboxes.length === 0) {
            alert('Por favor, selecciona al menos una cadena');
            return;
        }

        // Mapear IDs de cadenas seleccionadas
        const cadenasSeleccionadas = cadenasCheckboxes.map(cb => cb.value);

        // Crear el objeto de campaña generada siguiendo el formato del JSON
        const campanyaGenerada = {
            id: campanyaSeleccionada.id + '-' + Date.now().toString().slice(-6),
            nombre: campanyaSeleccionada.nombre + ' - ' + new Date().toLocaleDateString('es-ES'),
            tipo: campanyaSeleccionada.id,
            cadenas: cadenasSeleccionadas
        };

        // Guardar la campaña generada en el servidor (en /campanyas_generadas)
        const respuesta = await fetch(`${API_URL}/campanyas_generadas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campanyaGenerada)
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error(`Error al generar campaña: ${respuesta.status} - ${errorText}`);
        }

        // Mostrar mensaje de éxito
        alert('¡Campaña generada con éxito!');

    } catch (error) {
        console.error('Error al generar la campaña:', error);
        alert('Error al generar la campaña. Intenta de nuevo.');
    }
}

// Boton para generar campaña
const btnGenerar = document.querySelector('#btn-generar');
if (btnGenerar) {
    btnGenerar.addEventListener('click', generarCampanya);
}

// Función para cargar las campañas generadas
async function cargarCampanyasGeneradas() {
    try {
        const respuesta = await fetch(`${API_URL}/campanyas_generadas`);
        if (!respuesta.ok) {
            throw new Error(`Error al cargar: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error('Error al cargar campañas generadas:', error);
        return [];
    }
}

// Función para abrir el modal de histórico
function abrirModalHistorico() {
    mostrarModalHistorico();
}

// Función para mostrar el modal con el histórico de campañas generadas
async function mostrarModalHistorico() {
    const modalContent = document.querySelector('#modal-content');
    modalContent.innerHTML = '';

    // Cargar campañas generadas desde el servidor
    const campanyasGeneradas = await cargarCampanyasGeneradas();

    // --- CREAR HEADER DEL MODAL ---
    const divHeader = document.createElement('div');
    divHeader.className = 'modal-header';

    // Título del modal
    const titulo = document.createElement('h2');
    titulo.textContent = 'Histórico de Campañas Generadas';
    divHeader.appendChild(titulo);

    // Botón cerrar (X)
    const btnClose = document.createElement('button');
    btnClose.className = 'modal-close-btn';
    btnClose.textContent = '×';
    btnClose.onclick = cerrarModal;
    divHeader.appendChild(btnClose);

    // --- CREAR BODY DEL MODAL ---
    const divBody = document.createElement('div');
    divBody.className = 'modal-body';

    if (campanyasGeneradas.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay campañas generadas aún.';
        mensaje.classList.add('text-muted', 'text-center');
        divBody.appendChild(mensaje);
    } else {
        // Crear tabla o lista de campañas generadas
        const divLista = document.createElement('div');
        divLista.classList.add('max-h-400px');

        campanyasGeneradas.forEach((campanya, index) => {
            // Contenedor de cada campaña
            const divCampanya = document.createElement('div');
            divCampanya.classList.add('border-bottom-light', 'p-12', 'mb-10', 'bg-off-white', 'rounded-4');

            // ID de campaña
            const idElem = document.createElement('p');
            idElem.innerHTML = `<strong>ID:</strong> ${campanya.id}`;
            idElem.classList.add('my-4', 'fs-12');
            divCampanya.appendChild(idElem);

            // Nombre de campaña
            const nombreElem = document.createElement('p');
            nombreElem.innerHTML = `<strong>Nombre:</strong> ${campanya.nombre}`;
            nombreElem.classList.add('my-4');
            divCampanya.appendChild(nombreElem);

            // Tipo de campaña
            const tipoElem = document.createElement('p');
            tipoElem.innerHTML = `<strong>Tipo:</strong> ${campanya.tipo}`;
            tipoElem.classList.add('my-4', 'fs-12');
            divCampanya.appendChild(tipoElem);

            // Cadenas participantes
            const cadenasElem = document.createElement('p');
            cadenasElem.innerHTML = `<strong>Cadenas:</strong> ${campanya.cadenas.join(', ')}`;
            cadenasElem.classList.add('my-4', 'fs-12', 'text-secondary');
            divCampanya.appendChild(cadenasElem);

            divLista.appendChild(divCampanya);
        });

        divBody.appendChild(divLista);
    }

    // --- CREAR FOOTER DEL MODAL ---
    const divFooter = document.createElement('div');
    divFooter.className = 'modal-footer';

    // Botón cerrar
    const btnCerrar = document.createElement('button');
    btnCerrar.className = 'btn-modal primary';
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.onclick = cerrarModal;
    divFooter.appendChild(btnCerrar);

    // --- MONTAR EL MODAL COMPLETO ---
    modalContent.appendChild(divHeader);
    modalContent.appendChild(divBody);
    modalContent.appendChild(divFooter);

    // Mostrar el modal (activar clase 'active')
    document.querySelector('#modal-overlay').classList.add('active');
}

// Botón para ver histórico
const btnHistorico = document.querySelector('#btn-historico');
if (btnHistorico) {
    btnHistorico.addEventListener('click', abrirModalHistorico);
}
