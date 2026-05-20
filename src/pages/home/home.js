const btnLogin = document.querySelector("#boton-login");
const btnSolicitar = document.querySelector("#boton-solicitar-acceso");

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
