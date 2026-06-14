import { useState, useEffect, useMemo } from "react";
import { useAuth } from '../../../hooks/useAuthHook';
import { useNavigate } from 'react-router-dom';

import "../../../assets/css/style_gestion.css";
import FilaTabla from "./components/FilaTabla";
import DetallePanel from "./components/DetallePanel";
import FormularioPanel from "./components/FormularioPanel";

const API_URL = "http://localhost:3001";

const FORM_VACIO = {
  id: "", nombre: "", cadena: "", zona: "", domicilio: "", localidad: "", coord: "",
};

const errorMensaje = "Error. ¿Está arrancado json-server?"; 

// Componente principal
function GestionTiendas() {
  const navigate = useNavigate();

  const [tiendas, setTiendas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [selectedId, setSelectedId] = useState(null);
  const [filtroCadena, setFiltroCadena] = useState("Todas");
  const [filtroLocalidad, setFiltroLocalidad] = useState("Todas");
  const [filtroZona, setFiltroZona] = useState("Todas");
  const [filtroCoord, setFiltroCoord] = useState("Todas");

  const [vistaPanel, setVistaPanel] = useState("detalle");
  const [modoModal, setModoModal] = useState("anadir");
  const [panelTitulo, setPanelTitulo] = useState("TIENDA SELECCIONADA");
  const [form, setForm] = useState(FORM_VACIO);

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
      setError(null);
    } catch {
      setError("No se pudo conectar con el servidor para cargar las tiendas.");
      setTiendas([]);
    }
  }

  const cadenas = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.cadena).filter(Boolean))], [tiendas]);
  const localidades = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.localidad).filter(Boolean))], [tiendas]);
  const zonas = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.zona).filter(Boolean))], [tiendas]);
  const coords = useMemo(() => ["Todas", ...new Set(tiendas.map((t) => t.coord).filter(Boolean))], [tiendas]);

  const tiendasFiltradas = useMemo(() =>
    tiendas.filter((t) =>
      (filtroCadena === "Todas" || t.cadena === filtroCadena)    &&
      (filtroLocalidad === "Todas" || t.localidad === filtroLocalidad) &&
      (filtroZona === "Todas" || t.zona === filtroZona)      &&
      (filtroCoord === "Todas" || t.coord === filtroCoord)
    ),
    [tiendas, filtroCadena, filtroLocalidad, filtroZona, filtroCoord]
  );

  const tiendaSeleccionada = tiendas.find((t) => t.id === selectedId) || null;

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
      id: t.id || "",
      nombre: t.nombre || "",
      cadena: t.cadena || "",
      zona: t.zona || "",
      domicilio: t.domicilio || "",
      localidad: t.localidad || "",
      coord: t.coord || "",
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
      nombre: form.nombre.trim(),
      cadena: form.cadena.trim(),
      zona: form.zona.trim(),
      domicilio: form.domicilio.trim(),
      localidad: form.localidad.trim(),
      coord: form.coord.trim(),
    };

    if (modoModal === "anadir") {
      try {

        const res = await fetch(`${API_URL}/tiendas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        });
        if (!res.ok) throw new Error();
        await cargarTiendas();
        cerrarFormulario();

      } catch { alert(errorMensaje); }

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
      
      } catch { alert(errorMensaje); }
    }
  }

  async function eliminarTienda() {
    if (!selectedId) return alert("Selecciona primero una tienda de la tabla.");

    const t = tiendas.find((x) => x.id === selectedId);
    if (!confirm(`¿Seguro que quieres eliminar "${t?.nombre}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/tiendas/${selectedId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSelectedId(null);
      setVistaPanel("detalle");
      await cargarTiendas();
    
    } catch {alert(errorMensaje); }
  }

  return (
    <div>
      <main className="dashboard">

        {/* BANNER ERROR */}
        {error && (
          <div className="mensaje-error-carga">{error}</div>
        )}

        {/* filtros */}
        <section className="filters">

          <div className="filter-group">
            <label>CADENA</label>
            <select value={filtroCadena} onChange={(e) => setFiltroCadena(e.target.value)}>
              {cadenas.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>

            <label>LOCALIDAD</label>
            <select value={filtroLocalidad} onChange={(e) => setFiltroLocalidad(e.target.value)}>
              {localidades.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>ZONA GEOGRÁFICA</label>
            <select value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)}>
              {zonas.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>

            <label>COORDINADOR</label>
            <select value={filtroCoord} onChange={(e) => setFiltroCoord(e.target.value)}>
              {coords.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </section>

        <div className="content-layout">

          {/* tabla */}
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
                    <tr><td colSpan={5} className="empty-row-msg">No hay tiendas con esos filtros</td></tr>
                  ) : (
                    tiendasFiltradas.map((t) => (
                      <FilaTabla
                        key = {t.id}
                        t = {t}
                        seleccionado = {selectedId}
                        onSeleccionar = {seleccionarTienda}
                      />
                    ))
                  )}
                </tbody>
              </table>

          </section>

          {/* panel lateral */}
          <aside className="details-panel">
            <div className="panel-header">{panelTitulo}</div>

            {/* Vista de detalle: visible por defecto */}
            {vistaPanel === "detalle" && (
              <DetallePanel tienda={tiendaSeleccionada} />
            )}

            {/* Vista de formulario: oculta hasta que se pulse Añadir o Modificar */}
            {vistaPanel === "formulario" && (
              <>
                <FormularioPanel
                  form={form}
                  onChange={cambiarForm}
                  modoModal={modoModal}
                />
                
                <div>
                  <button onClick={confirmarModal}>Guardar</button>
                  <button onClick={cerrarFormulario}>Cancelar</button>
                </div>
              </>
            )}
          
            {/* No es necesario controlar por que rol */}
            {vistaPanel === "detalle" && (
              <div className="action-buttons" id="admin-menu">
                  <button onClick={abrirAnadir}>Añadir tienda</button>
                  <button onClick={abrirModificar}>Modificar tienda</button>
                  <button onClick={eliminarTienda}> Eliminar tienda </button>
              </div>
            )}

            {/* Botón volver al menú principal */}
            <div className="action-buttons">
              <button onClick={() => navigate('/welcome')}> Menú Principal </button>
            </div>

          </aside>
        </div>

      </main>
    </div>
  );
}

export default GestionTiendas