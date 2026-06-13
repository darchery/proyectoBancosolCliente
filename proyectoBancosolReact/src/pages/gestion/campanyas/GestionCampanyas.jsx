import { useState, useEffect } from "react";
import "../../../assets/css/style_gestion.css";
import PanelCampanyas from "./components/PanelCampanyas";
import PanelCadenas from "./components/PanelCadenas";
import PanelAcciones from "./components/PanelAcciones";
import ModalCampanyas from "./components/ModalCampanyas";

// URL del json-server
const API_URL = "http://localhost:3001";

function GestionCampanyas() {

    // Estado principal: campañas disponibles, cadenas y lo que tiene seleccionado el usuario
    const [campanyas, setCampanyas] = useState([]);
    const [cadenas, setCadenas] = useState([]);
    const [campanyaSeleccionada, setCampanyaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Controla si el modal está abierto y en qué modo (anyadir, eliminar, modificar, guardar, historico)
    const [modal, setModal] = useState({ abierto: false, modo: null });

    // Al montar el componente, cargamos campañas y cadenas a la vez
    useEffect(() => {
        (async () => {
            setCargando(true);
            await Promise.all([cargarCampanyas(), cargarCadenas()]);
            setCargando(false);
        })();
    }, []);

    // Trae las campañas desde el json-server
    async function cargarCampanyas() {
        try {
            const res = await fetch(`${API_URL}/campanyas`);
            if (!res.ok) throw new Error();
            setCampanyas(await res.json());
            setError(null);
        } catch {
            setError("No se pudieron cargar las campañas.");
            setCampanyas([]);
        }
    }

    // Trae las cadenas desde el json-server
    async function cargarCadenas() {
        try {
            const res = await fetch(`${API_URL}/cadenas`);
            if (!res.ok) throw new Error();
            setCadenas(await res.json());
            setError(null);
        } catch {
            setError("No se pudieron cargar las cadenas.");
            setCadenas([]);
        }
    }

    // Marca o desmarca una cadena en los checkboxes
    function handleToggleCadena(id) {
        setCadenas((prev) =>
            prev.map((c) => (c.id === id ? { ...c, seleccionada: !c.seleccionada } : c))
        );
    }

    // Abre el modal en el modo que se le indique
    function abrirModal(modo) {
        setModal({ abierto: true, modo });
    }

    // Cierra el modal y limpia el modo
    function cerrarModal() {
        setModal({ abierto: false, modo: null });
    }

    // Guarda una cadena nueva en la API
    async function handleGuardarNuevaCadena(nombre) {
        if (!nombre.trim()) return alert("Escribe un nombre para la cadena");
        const id = nombre.toLowerCase().replace(/\s+/g, "-");
        try {
            const res = await fetch(`${API_URL}/cadenas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, nombre: nombre.trim(), seleccionada: false }),
            });
            if (!res.ok) throw new Error();
            await cargarCadenas();
            cerrarModal();
            alert("Cadena añadida con éxito.");
        } catch {
            alert("Error al guardar la cadena.");
        }
    }

    // Elimina una cadena por su ID
    async function handleEliminarCadena(id) {
        if (!confirm("¿Estás seguro de que quieres eliminar esta cadena?")) return;
        try {
            const res = await fetch(`${API_URL}/cadenas/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            await cargarCadenas();
            cerrarModal();
            alert("Cadena eliminada con éxito");
        } catch {
            alert("Error al eliminar la cadena.");
        }
    }

    // Actualiza el nombre de una cadena existente
    async function handleModificarCadena(id, nuevoNombre) {
        if (!nuevoNombre.trim()) return alert("Ingresa un nombre");
        try {
            const cadenaActual = cadenas.find((c) => c.id === id);
            const res = await fetch(`${API_URL}/cadenas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...cadenaActual, nombre: nuevoNombre.trim() }),
            });
            if (!res.ok) throw new Error();
            await cargarCadenas();
            cerrarModal();
            alert("Cadena actualizada con éxito");
        } catch {
            alert("Error al actualizar la cadena.");
        }
    }

    // Guarda en la API el estado actual de todas las cadenas (seleccionadas o no)
    async function handleGuardarCambios() {
        try {
            for (const cadena of cadenas) {
                const res = await fetch(`${API_URL}/cadenas/${cadena.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cadena),
                });
                if (!res.ok) throw new Error();
            }
            await cargarCadenas();
            cerrarModal();
            alert("Cambios guardados con éxito");
        } catch {
            alert("Error al guardar cambios.");
        }
    }

    // Crea una nueva campaña combinando la campaña seleccionada y las cadenas marcadas
    async function handleGenerarCampanya() {
        if (!campanyaSeleccionada) return alert("Selecciona una campaña");
        const cadenasSel = cadenas.filter((c) => c.seleccionada);
        if (cadenasSel.length === 0) return alert("Selecciona al menos una cadena");

        const campanya = campanyas.find((c) => c.id === campanyaSeleccionada);
        const campanyaGenerada = {
            id: campanya.id + "-" + Date.now().toString().slice(-6),
            nombre: campanya.nombre + " - " + new Date().toLocaleDateString("es-ES"),
            tipo: campanya.id,
            cadenas: cadenasSel.map((c) => c.id),
        };

        try {
            const res = await fetch(`${API_URL}/campanyas_generadas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(campanyaGenerada),
            });
            if (!res.ok) throw new Error();
            alert("Campaña generada con éxito");
        } catch {
            alert("Error al generar la campaña.");
        }
    }

    // Se calcula cada vez que cambia el estado, para pasárselo al modal de guardar
    const cadenasSeleccionadas = cadenas.filter((c) => c.seleccionada);

    // Mientras cargan los datos se muestra un texto simple
    if (cargando) return <p style={{ padding: 20 }}>Cargando...</p>;

    return (
        <>
        <div className="page-campanya">
            {/*<Header titulo="GESTIÓN DE CAMPAÑAS" />*/}

            {/* Cuerpo: tres columnas (campañas, cadenas, acciones) */}
            <main className="management-container">
                {error && <div className="mensaje-error-carga">{error}</div>}

                <PanelCampanyas
                    campanyas={campanyas}
                    seleccionada={campanyaSeleccionada}
                    onSeleccionar={setCampanyaSeleccionada}
                />

                <PanelCadenas
                    cadenas={cadenas}
                    onToggleCadena={handleToggleCadena}
                    onAbrirModal={abrirModal}
                />

                <PanelAcciones
                    onGenerar={handleGenerarCampanya}
                    onAbrirHistorico={() => abrirModal("historico")}
                />
            </main>

            {/* Modal flotante para CRUD de cadenas e histórico */}
            {modal.abierto && (
                <ModalCampanyas
                    modo={modal.modo}
                    cadenas={cadenas}
                    cadenasSeleccionadas={cadenasSeleccionadas}
                    onGuardarNueva={handleGuardarNuevaCadena}
                    onEliminar={handleEliminarCadena}
                    onModificar={handleModificarCadena}
                    onGuardarCambios={handleGuardarCambios}
                    onCerrar={cerrarModal}
                />
            )}

        </div>
        </>
    );
}


export default GestionCampanyas