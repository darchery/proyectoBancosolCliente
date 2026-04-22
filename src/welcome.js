function welcome() {
    const usuario = document.getElementById('usuario').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    // Como 'GestionUsuarios' está al mismo nivel que la carpeta 'src'
    // primero salimos de src (../) y entramos en GestionUsuarios
    const folder = "../GestionUsuarios/";

    switch (usuario) {
        case "admin":
            if (password === "admin") {
                window.location.href = folder + "welcome_admin.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "capitan_coord":
            if (password === "capitan_coord") {
                window.location.href = folder + "welcome_capitan_coordinador.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;
        
        case "capitan":
            if (password === "capitan") {
                window.location.href = folder + "welcome_capitan.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "coord":
            if (password === "coord") {
                window.location.href = folder + "welcome_coordinador.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "colab":
            if (password === "colab") {
                window.location.href = folder + "welcome_entidad_colaboradora.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "responsable":
            if (password === "responsable") {
                window.location.href = folder + "welcome_responsable_tienda.html";
            } else {
                alert("Contraseña incorrecta");
            }
        break;  

            welcome_responsable_tienda
        default:
            alert("El usuario introducido no existe.");
            break;
    }

}