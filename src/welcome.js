const btnLogOut = document.getElementById("logout-btn");

if (btnLogOut) {
    btnLogOut.addEventListener("click", () => {
        window.location.href = "index_home.html";
    });
}