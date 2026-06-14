// Columna central: checkboxes de cadenas y botones para CRUD
// Cada cadena se marca/desmarca independientemente

function PanelCadenas({ cadenas, onToggleCadena, onAbrirModal }) {
  return (
    <div className="box cadenas-box">
      <h2>CADENAS</h2>
      <div className="checkbox-grid">
        {cadenas.map((c) => (
          <div className="checkbox-item" key={c.id}>
            <input
              type="checkbox"
              id={c.id}
              checked={c.seleccionada}
              onChange={() => onToggleCadena(c.id)}
            />
            <label htmlFor={c.id}>{c.nombre}</label>
          </div>
        ))}
      </div>

      {/* Botones para gestionar las cadenas (cada uno abre un modal distinto) */}
      <div className="cadenas-actions">
        <button onClick={() => onAbrirModal("anyadir")}>Añadir cadena</button>
        <button onClick={() => onAbrirModal("eliminar")}>Eliminar cadena</button>
        <button onClick={() => onAbrirModal("modificar")}>Modificar cadena</button>
        <button onClick={() => onAbrirModal("guardar")}>Guardar cadenas seleccionadas</button>
      </div>
    </div>
  );
}

export default PanelCadenas
