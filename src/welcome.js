const btnLogOut = document.querySelectorAll(".logout-btn");

if (btnLogOut) {
    btnLogOut.addEventListener("click", () => {
        window.location.href = "index_home.html";
    });
}