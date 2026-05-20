let correoGuardado = "";

// Esperamos a que el DOM esté completamente cargado para agregar el evento al formulario
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputCorreo = document.getElementById("correo_solicitud");
    const info = document.getElementById("info_solicitud");

    // Agregamos un evento submit al formulario para manejar el envío de la solicitud de acceso
    form.addEventListener("submit", function (e) {
        e.preventDefault(); 

        // Guardamos el correo ingresado en la variable global y mostramos un mensaje de confirmación al usuario
        const correo = inputCorreo.value;
        correoGuardado = correo;
        info.textContent = "Solicitud enviada correctamente. Revise su correo para la confirmación.";
        console.log("Variable:", correoGuardado);
    });
});