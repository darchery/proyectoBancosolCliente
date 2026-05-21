let correoGuardado = "";

// Esperamos a que el DOM esté completamente cargado para agregar el evento al formulario
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputCorreo = document.querySelector("#correo_solicitud");
    const info = document.querySelector("#info_solicitud");

    // Agregamos un evento submit al formulario para manejar el envío de la solicitud de acceso
    form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = inputCorreo.value.trim();
    correoGuardado = correo;

    try {
        const respuesta = await fetch('http://localhost:3001/solicitudes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo,
                fecha: new Date().toISOString()
            })
        });

        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        info.textContent = "Solicitud enviada correctamente. Revise su correo para la confirmación.";
        inputCorreo.value = '';

    } catch (error) {
        console.error('Error al guardar solicitud:', error);
        info.textContent = "Error al enviar la solicitud. Inténtelo de nuevo.";
    }
});
});