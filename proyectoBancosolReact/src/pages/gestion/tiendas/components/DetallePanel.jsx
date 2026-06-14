function DetallePanel({ tienda }) {
  if (!tienda) {
    return (
      <div>
        <div className="detail-row"><span>ID:</span><strong>---</strong></div>
        <div className="detail-row"><span>NOMBRE:</span><strong>---</strong></div>
        <div className="detail-row"><span>CADENA:</span><strong>---</strong></div>
        <div className="detail-row"><span>DOMICILIO:</span><strong>---</strong></div>
        <div className="detail-row"><span>LOCALIDAD:</span><strong>---</strong></div>
        <div className="detail-row"><span>ZONA:</span><strong>---</strong></div>
        <div className="detail-row"><span>COORDINADOR:</span><strong>---</strong></div>
      </div>
    );
  }

  const campos = [
    ["ID", tienda.id],
    ["NOMBRE", tienda.nombre],
    ["CADENA", tienda.cadena],
    ["DOMICILIO", tienda.domicilio],
    ["LOCALIDAD", tienda.localidad],
    ["ZONA", tienda.zona],
    ["COORDINADOR", tienda.coord],
  ];

  return (
    <div>
      {campos.map(([label, val]) => (
        <div className="detail-row" key={label}>
          <span>{label} :</span>
          <span className="fw-bold">{val}</span>
        </div>
      ))}
    </div>
  );
}

export default DetallePanel;
