const btnLogin = document.getElementById("boton-login");
const btnSolicitar = document.getElementById("boton-solicitar-acceso");

if (btnLogin) {
    btnLogin.addEventListener("click", () => {
        window.location.href = "../login/index_login.html";
    });
}

if (btnSolicitar) {
    btnSolicitar.addEventListener("click", () => {
        window.location.href = "../solicitar-acceso/index_solicitar_acceso.html";
    });
}
