document.addEventListener('DOMContentLoaded', async () => {

    const tablaBody = document.getElementById('tabla-body');
    const menuAdmin = document.getElementById('admin-menu');

    const rolActual = localStorage.getItem('userRole') || 'admin';

    console.log("Cargando coordinadores...");

    // PERMISOS
    if (rolActual === 'admin') {
        if (menuAdmin) menuAdmin.style.display = 'grid';
    } else {
        if (menuAdmin) menuAdmin.style.display = 'none';
    }

    // CARGAR DATOS DESDE JSON-SERVER
    let coordinadores = [];

    try {
        const res = await fetch('http://localhost:3001/coordinadores');
        coordinadores = await res.json();
        console.log("Coordinadores cargados:", coordinadores);
    } catch (error) {
        console.error("Error cargando coordinadores:", error);
        return;
    }

    // RELLENAR TABLA
    if (tablaBody) {

        tablaBody.innerHTML = '';

        coordinadores.forEach(c => {
            const fila = `
                <tr>
                    <td>${c.nombre}</td>
                    <td>${c.entidad}</td>
                    <td>${c.area}</td>
                    <td>${c.tlf || ''}</td>
                    <td>${c.email || ''}</td>
                    <td style="text-align:center">${c.tiendas}</td>
                    <td>${c.usuario}</td>
                    <td>************</td>
                </tr>
            `;

            tablaBody.innerHTML += fila;
        });

        console.log("Tabla de coordinadores cargada correctamente");
    } else {
        console.error("No se encontró el elemento 'tabla-body'");
    }
});