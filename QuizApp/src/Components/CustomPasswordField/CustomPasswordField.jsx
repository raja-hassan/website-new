import React, { useState } from "react";
import "./CustomPasswordField.scss";
import { FiEye, FiEyeOff } from "react-icons/fi";

function CustomPasswordField({id,label,placeholder,value,onChange,error,}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3 password-field-wrap">
      <label htmlFor={id} className="form-label fw-bold">
        {label}
      </label>
      <input
        type={showPassword ? "text" : "password"}
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {!error &&
        (showPassword ? (
          <FiEyeOff className="eye-icon" onClick={togglePasswordVisibility} />
        ) : (
          <FiEye className="eye-icon" onClick={togglePasswordVisibility} />
        ))}

{error && <p className="text-danger" style={{ fontSize: "15px" }}>{error}</p>} 
    </div>
  );
}

export default CustomPasswordField;
