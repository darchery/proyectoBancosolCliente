const btnLogOut = document.querySelector(".boton-logout");

if (btnLogOut) {
    btnLogOut.addEventListener("click", () => {
        window.location.href = "../home/index_home.html";
    });
}
