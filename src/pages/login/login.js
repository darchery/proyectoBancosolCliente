const rutasPorRol = {
    'admin': '/src/pages/welcome/welcome_admin.html',
    'capitan': '/src/pages/welcome/welcome_capitan.html',
    'coordinador': '/src/pages/welcome/welcome_coordinador.html',
    'capitan_coordinador': '/src/pages/welcome/welcome_capitan_coordinador.html',
    'entidad_colaboradora': '/src/pages/welcome/welcome_entidad_colaboradora.html',
    'responsable_tienda': '/src/pages/welcome/welcome_responsable_tienda.html'
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

const btnEntrar = document.querySelector("#btn-entrar");

if (btnEntrar) {
  btnEntrar.addEventListener("click", async (evento) => {
    evento.preventDefault();

    const userIngresado = document.querySelector("#input-usuario").value.trim();
    const passIngresada = document.querySelector("#input-password").value.trim();

    if (!userIngresado || !passIngresada) {
      alert("Rellene ambos campos");
      return;
    }

    try {
       const respuesta = await fetch('../../data/db.json');
      const db = await respuesta.json();
      const usuariosDB = db.usuarios;

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
      console.error("Error al acceder a db.json:", error);
      alert("Error de conexión con la base de datos");
    }
  });
}