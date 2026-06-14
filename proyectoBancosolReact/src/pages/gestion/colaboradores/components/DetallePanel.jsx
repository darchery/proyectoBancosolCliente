function DetallePanel({ colaborador, onValidar }) {
    if (!colaborador) {
        return (
            <p className="text-muted text-center mt-10">
                Selecciona un colaborador de la tabla para ver sus detalles.
            </p>
        );
    }

    const c = colaborador;
    const campos = [
        ["NOMBRE", c.nombre],
        ["DOMICILIO", c.domicilio],
        ["CP", c.cp],
        ["LOCALIDAD", c.localidad],
        ["COLABORA EN", c.colabora],
        ["COORDINADOR", c.coord],
        ["TIENDA ID", c.tiendaId],
    ];

    return (
        <>
            {campos.map(([label, val]) => (
                <div className="detail-row" key={label}>
                    <span>{label}:</span>
                    <strong>{val || "---"}</strong>
                </div>
            ))}

            <div className="panel-header mt-10">CONTACTOS</div>
            {[c.contacto1, c.contacto2, c.contacto3].map((ct, i) => (
                <div className="detail-row" key={i}>
                    <span>Contacto {i + 1}:</span>
                    <strong>{ct?.nombre ? `${ct.nombre} — ${ct.tel}` : "---"}</strong>
                </div>
            ))}

            <div className="panel-header mt-10">OBSERVACIONES</div>
            <div className="detail-row">
                <strong>{c.observaciones || "---"}</strong>
            </div>

            {c.pendienteValidacion && onValidar && (
                <div className="action-buttons mt-10">
                    <button className="btn btn-success full-width" onClick={onValidar}>
                        Validar colaborador
                    </button>
                </div>
            )}
        </>
    );
}

export default DetallePanel;