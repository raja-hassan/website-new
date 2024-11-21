function CustomTextField({ id, name, label, type, placeholder, value, onChange, error, className }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-bold">{label}</label>
      <input
        type={type || "text"}
        id={id}
        name={name} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`form-control ${className} ${error ? "is-invalid" : ""}`} 
      />
      {error && <p className="text-danger" style={{ fontSize: "15px" }}>{error}</p>} 
    </div>
  );
}

export default CustomTextField;
