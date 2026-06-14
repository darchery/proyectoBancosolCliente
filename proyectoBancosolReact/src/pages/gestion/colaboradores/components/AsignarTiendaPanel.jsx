import { useState } from "react";

function AsignarTiendaPanel({ tiendas, tiendaActual, onConfirmar, onCancelar }) {
    const [tiendaId, setTiendaId] = useState(tiendaActual || "");

    return (
        <>
            <p className="fs-09 mb-8">
                Selecciona la tienda a asignar al colaborador:
            </p>
            <div className="detail-row">
                <span>TIENDA</span>
                <select
                    className="w-100 p-4"
                    value={tiendaId}
                    onChange={(e) => setTiendaId(e.target.value)}
                >
                    <option value="">-- Sin asignar --</option>
                    {tiendas.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.nombre} ({t.localidad})
                        </option>
                    ))}
                </select>
            </div>
            <div className="action-buttons mt-10">
                <button className="btn btn-primary" onClick={() => onConfirmar(tiendaId || null)}>
                    Asignar
                </button>
                <button className="btn btn-secondary" onClick={onCancelar}>
                    Cancelar
                </button>
            </div>
        </>
    );
}

export default AsignarTiendaPanel;