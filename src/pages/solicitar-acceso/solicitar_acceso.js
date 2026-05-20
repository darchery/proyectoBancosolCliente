let correoGuardado = "";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputCorreo = document.querySelector("#correo_solicitud");
    const info = document.querySelector("#info_solicitud");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const correo = inputCorreo.value;

        correoGuardado = correo;

        info.textContent = "Solicitud enviada correctamente. Revise su correo para la confirmación.";

        console.log("Variable:", correoGuardado);
    });
});