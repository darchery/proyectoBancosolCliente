function welcome() {
    const usuario = document.getElementById('usuario').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    // Como 'GestionUsuarios' está al mismo nivel que la carpeta 'src'
    // primero salimos de src (../) y entramos en GestionUsuarios
    const folder = "../GestionUsuarios/";

    switch (usuario) {
        case "admin":
            if (password === "admin") {
                window.location.href = folder + "Welcome_admin.html"; // Ojo: pusiste 'Welcome_admin.html' en tu esquema
            } else {
                alert("Contraseña incorrecta");
            }
            break;

        case "capitan_coord":
            if (password === "capitan_coord") {
                window.location.href = folder + "capitan_coordinador.html";
            } else {
                alert("Contraseña incorrecta");
            }
            break;
        
        default:
            alert("El usuario introducido no existe.");
            break;
    }

}