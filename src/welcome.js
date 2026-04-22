function welcome() {
    const usuario = document.getElementById('usuario').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    // Definimos la ruta base para salir de 'src' y entrar en 'welcomes'
    const folder = "../GestionUsuarios/";

    // Lógica de redirección por roles
    switch (usuario) {
        case "admin":
            if (password === "admin123") {
                window.location.href = folder + "welcome_administrador.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "capitan_coord":
            if (password === "cc123") {
                window.location.href = folder + "capitan_coordinador.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "capitan":
            if (password === "cap123") {
                window.location.href = folder + "welcome_capitan.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "coordinador":
            if (password === "coord123") {
                window.location.href = folder + "welcome_coordinador.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "entidad":
            if (password === "ent123") {
                window.location.href = folder + "welcome_enditad_colaboradora.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "responsable":
            if (password === "resp123") {
                window.location.href = folder + "welcome_responsable_tienda.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        default:
            alert("El usuario introducido no existe.");
            break;
    }

    window.location.href = "../src/index_login.html";
}