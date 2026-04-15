function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("password").value;

  if (user === pass) {

    if (user === "admin") {
      window.location.href = "GestionUsuarios/welcome_admin.html";
    }
    else if (user === "capitan_coordinador") {
      window.location.href = "GestionUsuarios/welcome_capitan_coordinador.html";
    }
    else if (user === "capitan") {
      window.location.href = "GestionUsuarios/welcome_capitan.html";
    }
    else if (user === "coordinador") {
      window.location.href = "GestionUsuarios/welcome_coordinador.html";
    }
    else if (user === "entidad_colaboradora") {
      window.location.href = "GestionUsuarios/welcome_entidad_colaboradora.html";
    }
    else if (user === "responsable_tienda") {
      window.location.href = "GestionUsuarios/welcome_responsable_tienda.html";
    }
    else {
      alert("Usuario no válido");
    }

  } else {
    alert("Usuario y contraseña deben ser iguales");
  }
}