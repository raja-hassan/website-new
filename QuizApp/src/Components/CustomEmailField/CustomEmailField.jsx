import React from "react";
import "./CustomEmailField.scss";

function CustomEmailField({ id, label, placeholder, value, onChange, error }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-bold">
        {label}
      </label>
      <input
        type="email"
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="text-danger" style={{ fontSize: "15px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
export default CustomEmailField;
