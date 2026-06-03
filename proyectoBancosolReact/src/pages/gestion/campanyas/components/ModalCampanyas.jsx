import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001";

// Títulos que se muestran en la cabecera del modal según el modo
const TITULOS = {
  anyadir: "Añadir nueva cadena",
  eliminar: "Eliminar cadena",
  modificar: "Modificar cadena",
  guardar: "Confirmar cambios",
  historico: "Histórico de Campañas Generadas",
};

function ModalCampanyas({
  modo,
  cadenas,
  cadenasSeleccionadas,
  onGuardarNueva,
  onEliminar,
  onModificar,
  onGuardarCambios,
  onCerrar,
}) {

  // Estado interno del modal
  const [nombreCadena, setNombreCadena] = useState("");
  const [cadenaSel, setCadenaSel] = useState(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [historico, setHistorico] = useState([]);
  const [cargandoHistorico, setCargandoHistorico] = useState(false);

  // Cada vez que cambia el modo, se inician los campos del modal
  useEffect(() => {
    if (modo === "anyadir") {
      setNombreCadena("");
    } else if (modo === "modificar") {
      setCadenaSel(null);
      setNombreEdit("");
    } else if (modo === "historico") {
      cargarHistorico();
    }
  }, [modo]);

  // Carga las campañas ya generadas desde el servidor
  async function cargarHistorico() {
    setCargandoHistorico(true);
    try {
      const res = await fetch(`${API_URL}/campanyas_generadas`);
      if (!res.ok) throw new Error();
      setHistorico(await res.json());
    } catch {
      setHistorico([]);
    }
    setCargandoHistorico(false);
  }

  // Al hacer clic en una cadena para modificar, se guarda y se rellena su nombre
  function handleSeleccionarCadena(id) {
    setCadenaSel(id);
    const cadena = cadenas.find((c) => c.id === id);
    if (cadena) setNombreEdit(cadena.nombre);
  }

  return (
    // Clic en el fondo oscuro cierra el modal
    <div className="modal-overlay active" onClick={onCerrar}>
      {/* stopPropagation evita que el clic dentro del modal lo cierre */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del modal*/}
        <div className="modal-header">
          <h2>{TITULOS[modo]}</h2>
          <button className="modal-close-btn" onClick={onCerrar}>×</button>
        </div>

        {/* Cuerpo del modal que cambia según el modo */}
        <div className="modal-body">
          {/* Modo añadir: input para escribir el nombre de la cadena */}
          {modo === "anyadir" && (
            <div className="form-group">
              <label htmlFor="nombre-cadena">Nombre de la cadena:</label>
              <input
                type="text"
                id="nombre-cadena"
                placeholder="Ej: Bancosol La Paz"
                value={nombreCadena}
                onChange={(e) => setNombreCadena(e.target.value)}
                required
              />
            </div>
          )}

          {/* Modo eliminar: lista con radios para elegir qué cadena borrar */}
          {modo === "eliminar" && (
            <>
              <p className="text-muted mb-16">Selecciona la cadena que deseas eliminar:</p>
              <div className="items-list">
                {cadenas.map((c) => (
                  <div className="item-row" key={c.id} onClick={() => setCadenaSel(c.id)}>
                    <input
                      type="radio"
                      name="cadena-eliminar"
                      value={c.id}
                      checked={cadenaSel === c.id}
                      onChange={() => setCadenaSel(c.id)}
                    />
                    <label className="item-name">{c.nombre}</label>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Modo modificar: seleccionar cadena y luego editar el nombre */}
          {modo === "modificar" && (
            <>
              <p className="text-muted mb-16">Selecciona la cadena que deseas modificar:</p>
              <div className="items-list">
                {cadenas.map((c) => (
                  <div className="item-row" key={c.id} onClick={() => handleSeleccionarCadena(c.id)}>
                    <input
                      type="radio"
                      name="cadena-modificar"
                      value={c.id}
                      checked={cadenaSel === c.id}
                      onChange={() => handleSeleccionarCadena(c.id)}
                    />
                    <span className="item-name">{c.nombre}</span>
                  </div>
                ))}
              </div>
              {/* El input de edición aparece solo cuando hay una cadena seleccionada */}
              {cadenaSel && (
                <div className="form-group mt-20">
                  <label htmlFor="nombre-cadena-edit">Nombre de la cadena:</label>
                  <input
                    type="text"
                    id="nombre-cadena-edit"
                    placeholder="Ej: Bancosol La Paz"
                    value={nombreEdit}
                    onChange={(e) => setNombreEdit(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          )}

          {/* Modo guardar: resumen de las cadenas marcadas y confirmación */}
          {modo === "guardar" && (
            <>
              <p className="text-dark mb-16"><strong>Cadenas seleccionadas:</strong></p>
              <div className="bg-light-gray p-12 rounded-6 mb-16">
                <p className="m-0 text-muted">
                  {cadenasSeleccionadas.length > 0
                    ? cadenasSeleccionadas.map((c) => c.nombre).join(", ")
                    : "Ninguna cadena seleccionada"}
                </p>
              </div>
              <p className="text-muted">¿Deseas guardar estos cambios?</p>
            </>
          )}

          {/* Modo histórico: lista de campañas ya generadas */}
          {modo === "historico" && (
            <>
              {cargandoHistorico ? (
                <p className="text-muted">Cargando histórico...</p>
              ) : historico.length === 0 ? (
                <p className="text-muted text-center">No hay campañas generadas aún.</p>
              ) : (
                <div className="max-h-400px">
                  {historico.map((c) => (
                    <div className="border-bottom-light p-12 mb-10 bg-off-white rounded-4" key={c.id}>
                      <p className="my-4 fs-12"><strong>ID:</strong> {c.id}</p>
                      <p className="my-4"><strong>Nombre:</strong> {c.nombre}</p>
                      <p className="my-4 fs-12"><strong>Tipo:</strong> {c.tipo}</p>
                      <p className="my-4 fs-12 text-secondary"><strong>Cadenas:</strong> {c.cadenas.join(", ")}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer del modal: botón Cancelar y botón de acción según el modo */}
        <div className="modal-footer">
          {modo !== "historico" && (
            <>
              <button className="btn-modal secondary" onClick={onCerrar}>Cancelar</button>
              {modo === "anyadir" && (
                <button className="btn-modal primary" onClick={() => onGuardarNueva(nombreCadena)}>
                  Guardar Cadena
                </button>
              )}
              {modo === "eliminar" && (
                <button className="btn-modal danger" onClick={() => cadenaSel && onEliminar(cadenaSel)} disabled={!cadenaSel}>
                  Eliminar
                </button>
              )}
              {modo === "modificar" && (
                <button className="btn-modal primary" onClick={() => cadenaSel && onModificar(cadenaSel, nombreEdit)} disabled={!cadenaSel}>
                  Guardar cambios
                </button>
              )}
              {modo === "guardar" && (
                <button className="btn-modal primary" onClick={onGuardarCambios}>
                  Guardar Cambios
                </button>
              )}
            </>
          )}
          {modo === "historico" && (
            <button className="btn-modal primary" onClick={onCerrar}>Cerrar</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalCampanyas
