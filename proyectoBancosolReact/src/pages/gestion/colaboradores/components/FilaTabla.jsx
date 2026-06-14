function FilaTabla({ c, seleccionado, onSeleccionar }) {
    const esSeleccionado = c.id === seleccionado;
    return (
        <tr
            className={`cursor-pointer${esSeleccionado ? " fila-seleccionada" : ""}`}
            onClick={() => onSeleccionar(c.id)}
        >
            <td>
                {c.nombre}
                {c.pendienteValidacion && (
                    <span className="badge-pendiente"> (pendiente)</span>
                )}
            </td>
            <td>{c.domicilio || "---"}</td>
            <td>{c.localidad || "---"}</td>
            <td>{c.colabora || "---"}</td>
            <td>{c.coord || "---"}</td>
            <td>{c.contacto1?.nombre || "---"}</td>
            <td>{c.observaciones || ""}</td>
        </tr>
    );
}
 
export default FilaTabla;
 