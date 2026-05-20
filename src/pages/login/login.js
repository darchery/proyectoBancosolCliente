// Mapeo de roles a rutas de bienvenida
const rutasPorRol = {
    'admin': '/src/pages/welcome/welcome_admin.html',
    'capitan': '/src/pages/welcome/welcome_capitan.html',
    'coordinador': '/src/pages/welcome/welcome_coordinador.html',
    'capitan_coordinador': '/src/pages/welcome/welcome_capitan_coordinador.html',
    'entidad_colaboradora': '/src/pages/welcome/welcome_entidad_colaboradora.html',
    'responsable_tienda': '/src/pages/welcome/welcome_responsable_tienda.html'
};

// Función para redirigir al usuario según su rol
function redirigirUsuario(rol) {
  const rutaDestino = rutasPorRol[rol];

  if (rutaDestino) {
    // IMPORTANTE: Sin esta línea, los botones de acción nunca aparecerán
    localStorage.setItem('userRole', rol); 
    
    // Redirigimos al usuario a la página correspondiente
    window.location.href = rutaDestino;
  } else {
    console.error('ERROR: El rol no se reconoce (' + rol + ')');
    alert("El rol del usuario no tiene una página asignada");
  }
}

const btnEntrar = document.getElementById("btn-entrar");

// Agregamos el evento click al botón de inicio de sesión
if (btnEntrar) {
  btnEntrar.addEventListener("click", async (evento) => {
    evento.preventDefault();

    // Obtenemos los valores ingresados por el usuario
    const userIngresado = document.getElementById("input-usuario").value.trim();
    const passIngresada = document.getElementById("input-password").value.trim();

    // Validamos que ambos campos estén completos
    if (!userIngresado || !passIngresada) {
      alert("Rellene ambos campos");
      return;
    }

    // Intentamos acceder a la base de datos y validar al usuario
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
        // Redirigimos al usuario según su rol
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