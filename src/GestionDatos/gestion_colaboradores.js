const colaboradores = [
{
 id:"1",
 nombre:"A0362-AYUNTAMIENTO DE ALMACHAR",
 domicilio:"Calle Almería, 14",
 localidad:"ALMACHAR",
 cp:"29718",
 colabora:"RINCON DE LA VICTORIA",
 coord:"JM Cobos",
 contacto1:{nombre:"Mario Torre", tel:"555 555 555"},
 contacto2:{nombre:"María Vallejo", tel:"333 333 333"},
 contacto3:{nombre:"Fijo Ayuntamiento", tel:"999 999 999"},
 observaciones:"10 voluntarios - Formación jueves 19:45"
},
{
 id:"2",
 nombre:"Guardia Civil",
 domicilio:"---",
 localidad:"---",
 cp:"---",
 colabora:"---",
 coord:"JM Cobos",
 contacto1:{nombre:"---", tel:"---"},
 contacto2:{nombre:"---", tel:"---"},
 contacto3:{nombre:"---", tel:"---"},
 observaciones:""
}
];

const tabla = document.getElementById("tabla-body");

// Cargar tabla
function cargarTabla(){
 tabla.innerHTML = "";

 colaboradores.forEach(c=>{
  tabla.innerHTML += `
  <tr onclick="verDetalle('${c.id}')">
    <td>${c.nombre}</td>
    <td>${c.domicilio}</td>
    <td>${c.localidad}</td>
    <td>${c.colabora}</td>
    <td>${c.coord}</td>
    <td>${c.contacto1.nombre}</td>
    <td>${c.observaciones}</td>
  </tr>
  `;
 });
}

// Mostrar detalle
function verDetalle(id){
 const c = colaboradores.find(x => x.id == id);

 document.getElementById("d-nombre").innerText = c.nombre;
 document.getElementById("d-dom").innerText = c.domicilio;
 document.getElementById("d-cp").innerText = c.cp + " - " + c.localidad;
 document.getElementById("d-colabora").innerText = c.colabora;

 document.getElementById("c1-nombre").innerText = c.contacto1.nombre;
 document.getElementById("c1-tel").innerText = c.contacto1.tel;

 document.getElementById("c2-nombre").innerText = c.contacto2.nombre;
 document.getElementById("c2-tel").innerText = c.contacto2.tel;

 document.getElementById("c3-nombre").innerText = c.contacto3.nombre;
 document.getElementById("c3-tel").innerText = c.contacto3.tel;

 document.getElementById("d-obs").innerText = c.observaciones;
}

// Inicializar
cargarTabla();
