// Columna izquierda: muestra las campañas disponibles como checkboxes
// Solo se puede seleccionar una campaña a la vez

function PanelCampanyas({ campanyas, seleccionada, onSeleccionar }) {
  return (
    <div className="campanya-column">
      <div className="box campanya-box">
        <h2>CAMPAÑA</h2>
        {campanyas.map((c) => (
          <div className="checkbox-item mt-10" key={c.id}>
            <input
              type="checkbox"
              id={c.id}
              checked={seleccionada === c.id}
              onChange={() => onSeleccionar(c.id === seleccionada ? null : c.id)}
            />
            <label className="ml-8" htmlFor={c.id}>{c.nombre}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PanelCampanyas