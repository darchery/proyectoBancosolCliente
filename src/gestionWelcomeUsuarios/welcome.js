// Manejo del botón de cerrar sesión por clase
const btnLogOut = document.querySelector(".boton-logout");

if (btnLogOut) {
    btnLogOut.addEventListener("click", () => {
        // Redirigir a la página de inicio (subiendo un nivel desde GestionUsuarios)
        window.location.href = "../index_home.html";
    });
}
