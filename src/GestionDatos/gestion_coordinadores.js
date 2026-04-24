// Simulación de datos (Mini Base de Datos)
const coordinadores = [
    { nombre: 'Arantxa', entidad: 'BANCOSOL', area: 'MALAGA', tlf: '600111222', email: 'ara@sol.es', tiendas: 72, usuario: 'Arantxa', password: 'password1' },
    { nombre: 'Cristóbal Aragón', entidad: 'BANCOSOL', area: 'INTERIOR', tlf: '600333444', email: 'cris@sol.es', tiendas: 48, usuario: 'Aragón' , password: 'password2' },
    { nombre: 'Diego Vazquez', entidad: 'BANCOSOL', area: 'COSTA OCCIDENTAL', tlf: '', email: '', tiendas: 43, usuario: 'Diego' , password: 'password3' },
    { nombre: 'Fran Jimenez', entidad: 'LOS OLIVOS', area: 'MALAGA', tlf: '', email: '', tiendas: 12, usuario: 'FranJim', password: 'password4'},
    { nombre: 'José M Cobos', entidad: 'BANCOSOL', area: 'AXARQUIA', tlf: '', email: '', tiendas: 40, usuario: 'JMCobos' , password: 'password5' }
];

document.addEventListener('DOMContentLoaded', () => {
    const tablaBody = document.getElementById('tabla-body');
    const menuAdmin = document.getElementById('admin-menu');
    const rolActual = localStorage.getItem('userRole') || 'admin'; // Forzamos admin para ver los botones ahora

    console.log("Cargando datos en la tabla...");

    // 1. Mostrar/Ocultar botones según rol
    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.style.display = 'grid';
    } else {
        if (menuAdmin) menuAdmin.style.display = 'none';
    }

    // 2. Llenar la tabla
    if (tablaBody) {
        tablaBody.innerHTML = ''; // Limpiar antes de llenar

        coordinadores.forEach(c => {
            const fila = `
                <tr>
                    <td>${c.nombre}</td>
                    <td>${c.entidad}</td>
                    <td>${c.area}</td>
                    <td>${c.tlf}</td>
                    <td>${c.email}</td>
                    <td style="text-align:center">${c.tiendas}</td>
                    <td>${c.usuario}</td>
                    <td>************</td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });
        console.log("Tabla cargada con éxito");
    } else {
        console.error("No se encontró el elemento 'tabla-body'");
    }
});