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
    // IMPORTANTE: Sin esta línea, los botones de acción nunca aparecerán
    localStorage.setItem('userRole', rol); 
    
    window.location.href = rutaDestino;
  } else {
    console.error('ERROR: El rol no se reconoce (' + rol + ')');
    alert("El rol del usuario no tiene una página asignada");
  }
}

const btnEntrar = document.getElementById("btn-entrar");

if (btnEntrar) {
  btnEntrar.addEventListener("click", async (evento) => {
    evento.preventDefault();

    const userIngresado = document.getElementById("input-usuario").value.trim();
    const passIngresada = document.getElementById("input-password").value.trim();

    if (!userIngresado || !passIngresada) {
      alert("Rellene ambos campos");
      return;
    }

    try {
      const respuesta = await fetch('usuarios.json');
      const usuariosDB = await respuesta.json();

      // Buscamos al usuario
      const usuarioValido = usuariosDB.find((u) => 
        u.usuario === userIngresado && u.clave === passIngresada
      );

      if (usuarioValido) {
        // Limpiamos cualquier rastro de sesión anterior
        localStorage.removeItem('userRole'); 
        
        console.log("Inicio de sesión correcto. Rol:", usuarioValido.rol);
        redirigirUsuario(usuarioValido.rol);
      } else {
        alert("Usuario o contraseña incorrectos.");
      }

    } catch (error) {
      console.error("Error al acceder a usuarios.json:", error);
      alert("Error de conexión con la base de datos");
    }
  });
}