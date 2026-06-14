function FilaTabla({ t, seleccionado, onSeleccionar }) {
  const esSeleccionado = t.id === seleccionado;
  return (
    <tr
      className={`cursor-pointer${esSeleccionado ? " fila-seleccionada" : ""}`}
      onClick={() => onSeleccionar(t.id)}
    >
      <td>{t.nombre}</td>
      <td>{t.cadena}</td>
      <td>{t.domicilio}</td>
      <td>{t.localidad}</td>
      <td>{t.coord}</td>
    </tr>
  );
}

export default FilaTabla;
