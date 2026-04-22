const rutasPorRol = {
    'admin': '/src/GestionUsuarios/welcome_admin.html',
    'capitan': '/src/GestionUsuarios/welcome_capitan.html',
    'coordinador': '/src/GestionUsuarios/welcome_coordinador.html',
    'capitan_coordinador': '/src/GestionUsuarios/welcome_capitan_coordinador.html',
    'entidad_colaboradora': '/src/GestionUsuarios/welcome_entidad_colaboradora.html',
    'responsable_tienda': '/src/GestionUsuarios/welcome_responsable_tienda.html'
};

function redirigirUsuario(rol) {
  const rutaDestino = rutasPorRol[rol];

  if (rutaDestino) {
    window.location.href = rutaDestino;
  } else {
    console.error('ERROR: El rol no se reconoce (' + rol + ')');
    alert("El rol del usuario no tiene una página asignada");
  }
}

const btnEntrar = document.getElementById("btn-entrar");

if (btnEntrar) {
  btnEntrar.addEventListener("click", async (evento) => {
    evento.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const userIngresado = document.getElementById("input-usuario").value;
    const passIngresada = document.getElementById("input-password").value;

    if (!userIngresado || !passIngresada) {
      alert("Rellene ambos campos");
      return;
    }

    try {
      const respuesta = await fetch('usuarios.json');
      const usuariosDB = await respuesta.json();

      const usuarioValido = usuariosDB.find((u) => 
        u.usuario === userIngresado && u.clave === passIngresada
      );

      if (usuarioValido) {
        console.log("Inicio de sesión correcto, su rol es:", usuarioValido.rol);
        redirigirUsuario(usuarioValido.rol);
      } else {
        alert("Usuario o contraseña incorrectos.");
      }

    } catch (error) {
      console.error("Error al acceder a la base de datos simulada (usuarios.json):", error);
      alert("Ha habido un error de conexión");
    }
  });
}
