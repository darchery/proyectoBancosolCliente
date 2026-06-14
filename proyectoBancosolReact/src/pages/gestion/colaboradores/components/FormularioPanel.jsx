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

export default FormularioPanel;