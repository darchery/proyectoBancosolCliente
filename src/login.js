function login() {
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin") {
    window.location.href = "welcome_admin.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}