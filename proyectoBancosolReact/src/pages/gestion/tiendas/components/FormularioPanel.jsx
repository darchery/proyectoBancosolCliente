function FormularioPanel({ form, onChange, modoModal }) {
  const campo = (label, field, required = false, disabled = false) => (
    <div key={field}>
      <span>{label}{required && " *"}</span>
      <input
        value={form[field]}
        disabled={disabled}
        onChange={(e) => onChange(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="max-h-70vh">
      {campo("NOMBRE", "nombre", true)}
      {campo("CADENA", "cadena")}
      {campo("ZONA", "zona")}
      {campo("DOMICILIO", "domicilio")}
      {campo("LOCALIDAD", "localidad")}
      {campo("COORDINADOR", "coord")}
    </div>
  );
}

export default FormularioPanel;
