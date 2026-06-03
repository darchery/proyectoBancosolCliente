// Columna derecha: logo decorativo y botones de acción principales
function PanelAcciones({ onGenerar, onAbrirHistorico }) {
  return (
    <div className="right-column">
      <div className="character-container">
        <img
          src="/src/assets/images/LOGO_BANCOSOL.png"
          alt="Bancosol"
          className="opacity-05 grayscale"
        />
      </div>
      <div className="actions-frame">
        <div className="main-actions">
          <button onClick={onGenerar}>Generar campaña</button>
          <button onClick={onAbrirHistorico}>Ver histórico</button>
          <button className="btn-volver-menu">Menú Principal</button>
        </div>
      </div>
    </div>
  );
}

export default PanelAcciones
