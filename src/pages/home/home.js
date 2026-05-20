const btnLogin = document.getElementById("boton-login");
const btnSolicitar = document.getElementById("boton-solicitar-acceso");

if (btnLogin) {
    // Agregamos un evento click al botón de inicio de sesión para redirigir al usuario a la página de login
    btnLogin.addEventListener("click", () => {
        window.location.href = "../login/index_login.html";
    });
}

if (btnSolicitar) {
    // Agregamos un evento click al botón de solicitar acceso para redirigir al usuario a la página de solicitud de acceso
    btnSolicitar.addEventListener("click", () => {
        window.location.href = "../solicitar-acceso/index_solicitar_acceso.html";
    });
}
