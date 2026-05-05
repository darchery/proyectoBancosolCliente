function importarHTML(url, contenedor) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            contenedor.innerHTML = data;
        })
        .catch(error => {
            console.error('Error al importar el archivo HTML:', error);
        });
}

importarHTML('/src/footer_comun.html', document.querySelector('footer'));