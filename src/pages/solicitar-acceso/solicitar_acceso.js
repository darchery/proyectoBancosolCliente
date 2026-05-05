let correoGuardado = "";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputCorreo = document.getElementById("correo_solicitud");
    const info = document.getElementById("info_solicitud");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const correo = inputCorreo.value;

        correoGuardado = correo;

        info.textContent = "Solicitud enviada correctamente. Revise su correo para la confirmación.";

        console.log("Variable:", correoGuardado);
    });
});