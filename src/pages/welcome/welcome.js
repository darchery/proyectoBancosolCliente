// Manejo del botón de cerrar sesión por clase
const btnLogOut = document.querySelector(".boton-logout");

if (btnLogOut) {
    btnLogOut.addEventListener("click", () => {
        // Redirigir a la página de inicio (subiendo dos niveles desde welcome)
        window.location.href = "../home/index_home.html";
    });
}
