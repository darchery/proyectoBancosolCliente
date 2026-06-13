import { useState, useEffect, useMemo } from "react";
import { useAuth } from '../../../hooks/useAuthHook';
import { useNavigate } from 'react-router-dom';
// import * as XLSX from "xlsx";

const API_URL = "http://localhost:3001";

/*
const DASHBOARD_URLS = {
    admin: "../../welcome/welcome_admin.html",
    coordinador: "../../welcome/welcome_coordinador.html",
};
*/

const FORM_VACIO = {
    nombre: "", domicilio: "", cp: "", localidad: "",
    colabora: "", zona: "", coord: "",
    c1nombre: "", c1tel: "",
    c2nombre: "", c2tel: "",
    c3nombre: "", c3tel: "",
    obs: "",
};


function FilaTabla({ c, seleccionado, onSeleccionar }) {
    const esSeleccionado = c.id === seleccionado;
    return (
        <tr
            className={`cursor-pointer${esSeleccionado ? " fila-seleccionada" : ""}`}
            onClick={() => onSeleccionar(c.id)}
        >
            <td>
                {c.nombre}
                {c.pendienteValidacion && (
                    <span className="badge-pendiente"> (pendiente)</span>
                )}
            </td>
            <td>{c.domicilio || "---"}</td>
            <td>{c.localidad || "---"}</td>
            <td>{c.colabora || "---"}</td>
            <td>{c.coord || "---"}</td>
            <td>{c.contacto1?.nombre || "---"}</td>
            <td>{c.observaciones || ""}</td>
        </tr>
    );
}




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




function FormularioPanel({ form, onChange }) {
    const campo = (label, field, required = false) => (
        <div className="detail-row" key={field}>
            <span>{label}{required && " *"}</span>
            <input
                className="input-field"
                value={form[field]}
                onChange={(e) => onChange(field, e.target.value)}
            />
        </div>
    );

    return (
        <div className="max-h-70vh">
            {campo("NOMBRE", "nombre", true)}
            {campo("DOMICILIO", "domicilio")}
            {campo("CP", "cp")}
            {campo("LOCALIDAD", "localidad")}
            {campo("COLABORA EN", "colabora")}
            {campo("ZONA", "zona")}
            {campo("COORDINADOR", "coord")}

            <div className="panel-header mt-10">CONTACTO 1</div>
            {campo("Nombre", "c1nombre")}
            {campo("Teléfono", "c1tel")}

            <div className="panel-header mt-10">CONTACTO 2</div>
            {campo("Nombre", "c2nombre")}
            {campo("Teléfono", "c2tel")}

            <div className="panel-header mt-10">CONTACTO 3</div>
            {campo("Nombre", "c3nombre")}
            {campo("Teléfono", "c3tel")}

            <div className="panel-header mt-10">OBSERVACIONES</div>
            <textarea
                className="input-field w-100 p-4"
                rows={3}
                value={form.obs}
                onChange={(e) => onChange("obs", e.target.value)}
            />
        </div>
    );
}

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

export default function GestionColaboradores() {
    //const rolActual = localStorage.getItem("userRole") || "admin";
    //const esAdmin = rolActual === "admin";
    //const esCoord = rolActual === "coordinador";

    const { usuario } = useAuth();
    const navigate = useNavigate();
    const esAdmin = usuario?.rol === "admin";
    const esCoord = usuario?.rol === "coordinador";

    if (!esAdmin && !esCoord) {
        return <p style={{ padding: 20 }}>No tienes permiso para acceder a esta página.</p>;
    }

    const [colaboradores, setColaboradores] = useState([]);
    const [tiendas, setTiendas] = useState([]);
    const [errorCarga, setErrorCarga] = useState(null);
    const [cargando, setCargando] = useState(true);

    const [selectedId, setSelectedId] = useState(null);
    const [filtroLocalidad, setFiltroLocalidad] = useState("Todas");
    const [filtroCoord, setFiltroCoord] = useState("Todas");
    const [filtroZona, setFiltroZona] = useState("Todas");

    const [vistaPanel, setVistaPanel] = useState("detalle");
    const [modoModal, setModoModal] = useState("anadir");
    const [panelTitulo, setPanelTitulo] = useState("COLABORADOR SELECCIONADO");
    const [form, setForm] = useState(FORM_VACIO);


    useEffect(() => {
        (async () => {
            setCargando(true);
            await Promise.all([cargarColaboradores(), cargarTiendas()]);
            setCargando(false);
        })();
    }, []);

    async function cargarColaboradores() {
        try {
            const res = await fetch(`${API_URL}/colaboradores`);
            if (!res.ok) throw new Error();
            setColaboradores(await res.json());
        } catch {
            setErrorCarga("No se pudo conectar con el servidor para cargar los colaboradores.");
            setColaboradores([]);
        }
    }

    async function cargarTiendas() {
        try {
            const res = await fetch(`${API_URL}/tiendas`);
            if (!res.ok) throw new Error();
            setTiendas(await res.json());
        } catch {
            setTiendas([]);
        }
    }


    const localidades = useMemo(
        () => ["Todas", ...new Set(colaboradores.map((c) => c.localidad).filter(Boolean))],
        [colaboradores]
    );
    const coords = useMemo(
        () => ["Todas", ...new Set(colaboradores.map((c) => c.coord).filter(Boolean))],
        [colaboradores]
    );
    const zonas = useMemo(
        () => ["Todas", ...new Set(colaboradores.map((c) => c.zona).filter(Boolean))],
        [colaboradores]
    );

    const colaboradoresFiltrados = useMemo(() =>
        colaboradores.filter((c) =>
            (filtroLocalidad === "Todas" || c.localidad === filtroLocalidad) &&
            (filtroCoord === "Todas" || c.coord === filtroCoord) &&
            (filtroZona === "Todas" || c.zona === filtroZona)
        ),
        [colaboradores, filtroLocalidad, filtroCoord, filtroZona]
    );

    const colaboradorSeleccionado = colaboradores.find((c) => c.id === selectedId) || null;

    function seleccionarColaborador(id) {
        setSelectedId(id);
        setPanelTitulo("COLABORADOR SELECCIONADO");
        setVistaPanel("detalle");
    }

    // ── Form helpers ───────────────────────────────────────────────────────────
    function cambiarForm(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function construirObjeto() {
        return {
            nombre: form.nombre.trim() || "",
            domicilio: form.domicilio.trim() || "---",
            cp: form.cp.trim() || "---",
            localidad: form.localidad.trim() || "---",
            colabora: form.colabora.trim() || "---",
            zona: form.zona.trim() || "---",
            coord: form.coord.trim() || "---",
            contacto1: { nombre: form.c1nombre.trim() || "---", tel: form.c1tel.trim() || "---" },
            contacto2: { nombre: form.c2nombre.trim() || "---", tel: form.c2tel.trim() || "---" },
            contacto3: { nombre: form.c3nombre.trim() || "---", tel: form.c3tel.trim() || "---" },
            observaciones: form.obs.trim() || "",
        };
    }

    function rellenarFormDesdeColaborador(c) {
        setForm({
            nombre: c.nombre || "",
            domicilio: c.domicilio || "",
            cp: c.cp || "",
            localidad: c.localidad || "",
            colabora: c.colabora || "",
            zona: c.zona || "",
            coord: c.coord || "",
            c1nombre: c.contacto1?.nombre || "",
            c1tel: c.contacto1?.tel || "",
            c2nombre: c.contacto2?.nombre || "",
            c2tel: c.contacto2?.tel || "",
            c3nombre: c.contacto3?.nombre || "",
            c3tel: c.contacto3?.tel || "",
            obs: c.observaciones || "",
        });
    }

    // ── Abrir vistas ───────────────────────────────────────────────────────────
    function abrirAnadir() {
        setModoModal("anadir");
        setForm(FORM_VACIO);
        setPanelTitulo("AÑADIR COLABORADOR");
        setVistaPanel("formulario");
    }

    function abrirAniadirPendiente() {
        setModoModal("anadir-pendiente");
        setForm(FORM_VACIO);
        setPanelTitulo("AÑADIR COLABORADOR (Pendiente validación)");
        setVistaPanel("formulario");
    }

    function abrirModificar() {
        if (!selectedId) return alert("Selecciona primero un colaborador de la tabla.");
        const c = colaboradores.find((x) => x.id === selectedId);
        if (!c) return;
        setModoModal("modificar");
        rellenarFormDesdeColaborador(c);
        setPanelTitulo("MODIFICAR COLABORADOR");
        setVistaPanel("formulario");
    }

    function abrirAsignar() {
        if (!selectedId) return alert("Selecciona primero un colaborador de la tabla.");
        setPanelTitulo("ASIGNAR A TIENDA");
        setVistaPanel("asignar");
    }

    function cerrarFormulario() {
        setPanelTitulo("COLABORADOR SELECCIONADO");
        setVistaPanel("detalle");
        setForm(FORM_VACIO);
    }

    // ── CRUD ───────────────────────────────────────────────────────────────────
    async function confirmarModal() {
        if (!form.nombre.trim()) return alert("El campo NOMBRE es obligatorio.");
        const obj = construirObjeto();

        if (modoModal === "anadir" || modoModal === "anadir-pendiente") {
            obj.pendienteValidacion = modoModal === "anadir-pendiente";
            try {
                const res = await fetch(`${API_URL}/colaboradores`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(obj),
                });
                if (!res.ok) throw new Error();
                await cargarColaboradores();
                cerrarFormulario();
                alert(`Colaborador "${obj.nombre}" añadido correctamente.`);
            } catch {
                alert("No se pudo guardar el colaborador. ¿Está arrancado json-server?");
            }
        } else {
            const original = colaboradores.find((x) => x.id === selectedId);
            const actualizado = {
                ...obj,
                id: selectedId,
                tiendaId: original?.tiendaId || null,
                pendienteValidacion: original?.pendienteValidacion || false,
            };
            try {
                const res = await fetch(`${API_URL}/colaboradores/${selectedId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(actualizado),
                });
                if (!res.ok) throw new Error();
                await cargarColaboradores();
                cerrarFormulario();
                alert(`Colaborador "${obj.nombre}" modificado correctamente.`);
            } catch {
                alert("No se pudo modificar el colaborador. ¿Está arrancado json-server?");
            }
        }
    }

    async function eliminarColaborador() {
        if (!selectedId) return alert("Selecciona primero un colaborador de la tabla.");
        const c = colaboradores.find((x) => x.id === selectedId);
        if (!confirm(`¿Seguro que quieres eliminar "${c?.nombre}"?\nEsta acción no se puede deshacer.`)) return;

        try {
            const res = await fetch(`${API_URL}/colaboradores/${selectedId}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setSelectedId(null);
            setVistaPanel("detalle");
            await cargarColaboradores();
            alert("Colaborador eliminado correctamente.");
        } catch {
            alert("No se pudo eliminar el colaborador. ¿Está arrancado json-server?");
        }
    }

    async function validarColaborador() {
        if (!selectedId) return;
        const original = colaboradores.find((x) => x.id === selectedId);
        if (!confirm(`¿Validar al colaborador "${original?.nombre}"?\nSe quitará la marca de pendiente.`)) return;

        try {
            const res = await fetch(`${API_URL}/colaboradores/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...original, pendienteValidacion: false }),
            });
            if (!res.ok) throw new Error();
            await cargarColaboradores();
            alert(`Colaborador "${original.nombre}" validado correctamente.`);
        } catch {
            alert("No se pudo validar el colaborador.");
        }
    }

    async function confirmarAsignar(tiendaId) {
        const original = colaboradores.find((x) => x.id === selectedId);
        try {
            const res = await fetch(`${API_URL}/colaboradores/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...original, tiendaId }),
            });
            if (!res.ok) throw new Error();
            await cargarColaboradores();
            setPanelTitulo("COLABORADOR SELECCIONADO");
            setVistaPanel("detalle");
            const nombre = tiendaId
                ? tiendas.find((t) => t.id === tiendaId)?.nombre || tiendaId
                : "ninguna";
            alert(`Tienda asignada: ${nombre}`);
        } catch {
            alert("No se pudo asignar la tienda.");
        }
    }

    // ── Exportar Excel ─────────────────────────────────────────────────────────
    function exportarExcel() {
        if (colaboradores.length === 0) return alert("No hay colaboradores para exportar.");
        const datos = colaboradores.map((c) => ({
            "ID": c.id || "",
            "NOMBRE": c.nombre || "",
            "DOMICILIO": c.domicilio || "",
            "CP": c.cp || "",
            "LOCALIDAD": c.localidad || "",
            "ZONA": c.zona || "",
            "COLABORA EN": c.colabora || "",
            "COORDINADOR": c.coord || "",
            "TIENDA ID": c.tiendaId || "",
            "CONTACTO 1": c.contacto1?.nombre || "",
            "TEL 1": c.contacto1?.tel || "",
            "CONTACTO 2": c.contacto2?.nombre || "",
            "TEL 2": c.contacto2?.tel || "",
            "CONTACTO 3": c.contacto3?.nombre || "",
            "TEL 3": c.contacto3?.tel || "",
            "OBSERVACIONES": c.observaciones || "",
            "PENDIENTE": c.pendienteValidacion ? "Sí" : "No",
        }));
        const hoja = XLSX.utils.json_to_sheet(datos);
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, "Colaboradores");
        XLSX.writeFile(libro, "colaboradores.xlsx");
    }

    function volverMenu() {
        navigate('/welcome');
    }


    return (
        <div>
            <main className="dashboard">

                {/* BANNER ERROR */}
                {errorCarga && (
                    <div className="mensaje-error-carga">{errorCarga}</div>
                )}

                {/* FILTROS */}
                <section className="filters">
                    <div className="filter-group">
                        <label>LOCALIDAD</label>
                        <select value={filtroLocalidad} onChange={(e) => setFiltroLocalidad(e.target.value)}>
                            {localidades.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>

                        <label>COORDINADOR</label>
                        <select value={filtroCoord} onChange={(e) => setFiltroCoord(e.target.value)}>
                            {coords.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>ZONA GEOGRÁFICA</label>
                        <select value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)}>
                            {zonas.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                </section>

                {/* TABLA + PANEL */}
                <div className="content-layout">

                    {/* TABLA */}
                    <section className="table-container">
                        {cargando ? (
                            <p className="text-muted text-center mt-10">Cargando colaboradores…</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        {["COLABORADOR", "DOMICILIO", "LOCALIDAD", "COLABORA EN", "COORDINADOR", "CONTACTO PRINCIPAL", "OBSERVACIONES"]
                                            .map((h) => <th key={h}>{h}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {colaboradoresFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="empty-row-msg">
                                                No hay colaboradores con esos filtros
                                            </td>
                                        </tr>
                                    ) : (
                                        colaboradoresFiltrados.map((c) => (
                                            <FilaTabla
                                                key={c.id}
                                                c={c}
                                                seleccionado={selectedId}
                                                onSeleccionar={seleccionarColaborador}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </section>

                    {/* PANEL LATERAL */}
                    <aside className="details-panel">
                        <div className="panel-header" id="panel-titulo">{panelTitulo}</div>

                        {/* Vista detalle */}
                        {vistaPanel === "detalle" && (
                            <DetallePanel
                                colaborador={colaboradorSeleccionado}
                                onValidar={
                                    esAdmin && colaboradorSeleccionado?.pendienteValidacion
                                        ? validarColaborador
                                        : null
                                }
                            />
                        )}

                        {/* Vista formulario */}
                        {vistaPanel === "formulario" && (
                            <>
                                <FormularioPanel form={form} onChange={cambiarForm} />
                                <div className="action-buttons mt-10">
                                    <button className="btn btn-primary" onClick={confirmarModal}>Guardar</button>
                                    <button className="btn btn-secondary" onClick={cerrarFormulario}>Cancelar</button>
                                </div>
                            </>
                        )}

                        {/* Vista asignar tienda */}
                        {vistaPanel === "asignar" && (
                            <AsignarTiendaPanel
                                tiendas={tiendas}
                                tiendaActual={colaboradorSeleccionado?.tiendaId}
                                onConfirmar={confirmarAsignar}
                                onCancelar={() => {
                                    setPanelTitulo("COLABORADOR SELECCIONADO");
                                    setVistaPanel("detalle");
                                }}
                            />
                        )}

                        {/* Botones admin */}
                        {esAdmin && vistaPanel === "detalle" && (
                            <div className="action-buttons mt-10" id="admin-menu">
                                <button className="btn btn-primary" onClick={abrirAnadir}>Añadir</button>
                                <button className="btn btn-primary" onClick={abrirModificar}>Modificar</button>
                                <button className="btn btn-danger" onClick={eliminarColaborador}>Eliminar</button>
                                <button className="btn btn-primary" onClick={abrirAsignar}>Asignar tienda</button>
                                <button className="btn btn-secondary full-width" onClick={exportarExcel}>
                                    Exportar Excel
                                </button>
                            </div>
                        )}

                        {/* Botones coordinador */}
                        {esCoord && vistaPanel === "detalle" && (
                            <div className="action-buttons mt-10" id="coord-menu">
                                <button className="btn btn-primary full-width" onClick={abrirAniadirPendiente}>
                                    Añadir
                                </button>
                                <button className="btn btn-secondary full-width" onClick={exportarExcel}>
                                    Exportar Excel
                                </button>
                            </div>
                        )}

                        {/* Volver al menú */}
                        <div className="action-buttons mt-10">
                            <button className="btn-volver-menu full-width" onClick={volverMenu}>
                                Menú Principal
                            </button>
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}
