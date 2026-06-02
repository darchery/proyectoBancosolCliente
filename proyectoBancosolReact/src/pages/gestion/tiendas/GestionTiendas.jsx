// T1: npx json-server --watch src/data/db.json --port 3001
// T2: npm run dev 
import { useState, useEffect, useMemo } from "react";

// Importar los CSS del proyecto
import "../../../assets/css/header_comun.css";
import "../../../assets/css/footer_comun.css";
import "../../../assets/css/style_gestion.css";

const API_URL = "http://localhost:3001";

const FORM_VACIO = {
  id: "", nombre: "", cadena: "", zona: "", domicilio: "", localidad: "", coord: "",
};

// Subcomponentes

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

function DetallePanel({ tienda }) {
  if (!tienda) {
    return (
      <div>
        <div> ID: </div>
        <div> NOMBRE: </div>
        <div> CADENA: </div>
        <div> DOMICILIO: </div>
        <div> LOCALIDAD: </div>
        <div> ZONA: </div>
        <div> COORD: </div>
      </div>
    );
  }

  const campos = [
    ["ID",          tienda.id],
    ["NOMBRE",      tienda.nombre],
    ["CADENA",      tienda.cadena],
    ["DOMICILIO",   tienda.domicilio],
    ["LOCALIDAD",   tienda.localidad],
    ["ZONA",        tienda.zona],
    ["COORDINADOR", tienda.coord],
  ];

  return (
    <div>
      {campos.map(([label, val]) => (
        <div className="detail-row" key={label}
          style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "0.9em" }}>
          <span style={{ fontWeight: "bold", minWidth: "95px" }}>{label}:</span>
          <span>{val}</span>
        </div>
      ))}
    </div>
  );
}

function FormularioPanel({ form, onChange, modoModal }) {
  const campo = (label, field, required = false, disabled = false) => (
    <div key={field}
      style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "0.9em" }}>
      <span style={{ fontWeight: "bold", minWidth: "95px" }}>{label}{required && " *"}</span>
      <input
        value={form[field]}
        disabled={disabled}
        onChange={(e) => onChange(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="max-h-70vh" style={{ padding: "10px 5px" }}>
      {campo("ID",          "id",        true,  modoModal === "modificar")}
      {campo("NOMBRE",      "nombre",    true)}
      {campo("CADENA",      "cadena")}
      {campo("ZONA",        "zona")}
      {campo("DOMICILIO",   "domicilio")}
      {campo("LOCALIDAD",   "localidad")}
      {campo("COORDINADOR", "coord")}
    </div>
  );
}

// Componente principal
export default function GestionTiendas() {
  const rolActual = localStorage.getItem("userRole") || "admin";
  const esAdmin   = rolActual === "admin";

  const [tiendas,    setTiendas]    = useState([]);
  const [errorCarga, setErrorCarga] = useState(null);
  const [cargando,   setCargando]   = useState(true);

  const [selectedId,      setSelectedId]      = useState(null);
  const [filtroCadena,    setFiltroCadena]    = useState("Todas");
  const [filtroLocalidad, setFiltroLocalidad] = useState("Todas");
  const [filtroZona,      setFiltroZona]      = useState("Todas");
  const [filtroCoord,     setFiltroCoord]     = useState("Todas");

  const [vistaPanel,  setVistaPanel]  = useState("detalle");
  const [modoModal,   setModoModal]   = useState("anadir");
  const [panelTitulo, setPanelTitulo] = useState("TIENDA SELECCIONADA");
  const [form,        setForm]        = useState(FORM_VACIO);

  useEffect(() => {
    (async () => {
      setCargando(true);
      await cargarTiendas();
      setCargando(false);
    })();
  }, []);

  async function cargarTiendas() {
    try {
      const res = await fetch(`${API_URL}/tiendas`);
      if (!res.ok) throw new Error();
      setTiendas(await res.json());
      setErrorCarga(null);
    } catch {
      setErrorCarga("No se pudo conectar con el servidor para cargar las tiendas.");
      setTiendas([]);
    }
  }

  const cadenas     = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.cadena).filter(Boolean))],    [tiendas]);
  const localidades = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.localidad).filter(Boolean))], [tiendas]);
  const zonas       = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.zona).filter(Boolean))],      [tiendas]);
  const coords      = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.coord).filter(Boolean))],     [tiendas]);

  const tiendasFiltradas = useMemo(() =>
    tiendas.filter((t) =>
      (filtroCadena    === "Todas" || t.cadena    === filtroCadena)    &&
      (filtroLocalidad === "Todas" || t.localidad === filtroLocalidad) &&
      (filtroZona      === "Todas" || t.zona      === filtroZona)      &&
      (filtroCoord     === "Todas" || t.coord     === filtroCoord)
    ),
    [tiendas, filtroCadena, filtroLocalidad, filtroZona, filtroCoord]
  );

  const tiendaSeleccionada = tiendas.find((t) => t.id === selectedId) || null;

  if (!esAdmin) {
    return <p style={{ padding: 20 }}>No tienes permiso para acceder a esta página.</p>;
  }

  function seleccionarTienda(id) {
    setSelectedId(id);
    setPanelTitulo("TIENDA SELECCIONADA");
    setVistaPanel("detalle");
  }

  function cambiarForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function rellenarFormDesdeTienda(t) {
    setForm({
      id:        t.id        || "",
      nombre:    t.nombre    || "",
      cadena:    t.cadena    || "",
      zona:      t.zona      || "",
      domicilio: t.domicilio || "",
      localidad: t.localidad || "",
      coord:     t.coord     || "",
    });
  }

  function abrirAnadir() {
    setModoModal("anadir");
    setForm(FORM_VACIO);
    setPanelTitulo("AÑADIR TIENDA");
    setVistaPanel("formulario");
  }

  function abrirModificar() {
    if (!selectedId) return alert("Selecciona primero una tienda de la tabla.");
    const t = tiendas.find((x) => x.id === selectedId);
    if (!t) return;
    setModoModal("modificar");
    rellenarFormDesdeTienda(t);
    setPanelTitulo("MODIFICAR TIENDA");
    setVistaPanel("formulario");
  }

  function cerrarFormulario() {
    setPanelTitulo("TIENDA SELECCIONADA");
    setVistaPanel("detalle");
    setForm(FORM_VACIO);
  }

  async function confirmarModal() {
    if (!form.nombre.trim()) return alert("El campo NOMBRE es obligatorio.");

    const obj = {
      nombre:    form.nombre.trim(),
      cadena:    form.cadena.trim(),
      zona:      form.zona.trim(),
      domicilio: form.domicilio.trim(),
      localidad: form.localidad.trim(),
      coord:     form.coord.trim(),
    };

    if (modoModal === "anadir") {
      if (!form.id.trim()) return alert("El campo ID es obligatorio.");
      if (tiendas.find((t) => t.id === form.id.trim()))
        return alert(`Ya existe una tienda con el ID "${form.id.trim()}".`);

      try {
        const res = await fetch(`${API_URL}/tiendas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: form.id.trim(), ...obj }),
        });
        if (!res.ok) throw new Error();
        await cargarTiendas();
        cerrarFormulario();
        alert(`Tienda "${obj.nombre}" añadida correctamente.`);
      } catch {
        alert("No se pudo guardar la tienda. ¿Está arrancado json-server?");
      }
    } else {
      try {
        const res = await fetch(`${API_URL}/tiendas/${selectedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedId, ...obj }),
        });
        if (!res.ok) throw new Error();
        await cargarTiendas();
        cerrarFormulario();
        alert(`Tienda "${obj.nombre}" modificada correctamente.`);
      } catch {
        alert("No se pudo modificar la tienda. ¿Está arrancado json-server?");
      }
    }
  }

  async function eliminarTienda() {
    if (!selectedId) return alert("Selecciona primero una tienda de la tabla.");
    const t = tiendas.find((x) => x.id === selectedId);
    if (!confirm(`¿Seguro que quieres eliminar "${t?.nombre}"?\nEsta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`${API_URL}/tiendas/${selectedId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSelectedId(null);
      setVistaPanel("detalle");
      await cargarTiendas();
      alert("Tienda eliminada correctamente.");
    } catch {
      alert("No se pudo eliminar la tienda. ¿Está arrancado json-server?");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f4f7f6" }}>

      {/* HEADER */}
      <header className="main-header">
        <div className="logo-area">
          <img
            id="logo"
            src="/src/assets/images/LOGO_BANCOSOL_FOOTER.png"
            alt="Bancosol Logo"
          />
          <h1 style={{ color: "#293189", margin: 0, fontSize: "1.8em", fontWeight: "bold" }}>
            GESTIÓN DE TIENDAS
          </h1>
        </div>
      </header>

      {/* MAIN */}
      <main className="dashboard" style={{ flex: 1 }}>

        {/* BANNER ERROR */}
        {errorCarga && (
          <div className="mensaje-error-carga">{errorCarga}</div>
        )}

        {/* FILTROS */}
        <section className="filters">
          {/* Columna izquierda */}
          <div className="filter-group">
            <label style={{ fontWeight: "bold", fontSize: "13px" }}>CADENA</label>
            <select value={filtroCadena} onChange={(e) => setFiltroCadena(e.target.value)}>
              {cadenas.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>

            <label style={{ fontWeight: "bold", fontSize: "13px" }}>LOCALIDAD</label>
            <select value={filtroLocalidad} onChange={(e) => setFiltroLocalidad(e.target.value)}>
              {localidades.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Columna derecha */}
          <div className="filter-group">
            <label style={{ fontWeight: "bold", fontSize: "13px" }}>ZONA GEOGRÁFICA</label>
            <select value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)}>
              {zonas.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>

            <label style={{ fontWeight: "bold", fontSize: "13px" }}>COORDINADOR</label>
            <select value={filtroCoord} onChange={(e) => setFiltroCoord(e.target.value)}>
              {coords.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </section>

        {/* TABLA + PANEL */}
        <div className="content-layout">

          {/* TABLA */}
          <section className="table-container">
            
              <table>

                <thead>
                  <tr>
                    {["TIENDA", "CADENA", "DOMICILIO", "LOCALIDAD", "COORDINADOR GR"]
                      .map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                
                <tbody>
                  {tiendasFiltradas.length === 0 ? (
                    <tr>
                        No hay tiendas con esos filtros
                    </tr>
                  ) : (
                    tiendasFiltradas.map((t) => (
                      <FilaTabla
                        key={t.id}
                        t={t}
                        seleccionado={selectedId}
                        onSeleccionar={seleccionarTienda}
                      />
                    ))
                  )}
                </tbody>
              </table>

          </section>

          {/* PANEL LATERAL */}
          <aside className="details-panel">
            {/* Cabecera del panel */}
            <div className="panel-header">{panelTitulo}</div>

            {/* Vista detalle */}
            {vistaPanel === "detalle" && (
              <DetallePanel tienda={tiendaSeleccionada} />
            )}

            {/* Vista formulario */}
            {vistaPanel === "formulario" && (
              <>
                <FormularioPanel
                  form={form}
                  onChange={cambiarForm}
                  modoModal={modoModal}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                  <button onClick={confirmarModal}>Guardar</button>
                  <button onClick={cerrarFormulario}>Cancelar</button>
                </div>
              </>
            )}

            {/* Botones admin — sólo en vista detalle */}
            {esAdmin && vistaPanel === "detalle" && (
              <div id="admin-menu" style={{ marginTop: "12px" }}>
                {/* Fila: Añadir + Modificar */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                  <button onClick={abrirAnadir}>Añadir tienda</button>
                  <button onClick={abrirModificar}>Modificar tienda</button>
                </div>
                {/* Fila: Eliminar (ancho completo) */}
                <div>
                  <button onClick={eliminarTienda}> Eliminar tienda </button>
                </div>
              </div>
            )}

            {/* Botón Menú Principal */}
            <div>
              <button onClick={() => alert("Menú principal no disponible en modo standalone.")}> Menú Principal </button>
            </div>

          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Bancosol | Grupo 4 | Tecnologías del Cliente para Aplicaciones Web</p>
      </footer>

    </div>
  );
}
