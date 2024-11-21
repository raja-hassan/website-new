import React from 'react';
import './CustomNumberField.scss';

function CustomNumberField({ label, placeholder, value, onChange }) {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="InputText" className="form-label fw-bold">{label}</label>
        <input 
          type="number" 
          className="form-control" 
          id="InputText" 
          placeholder={placeholder} 
          value={value} 
          onChange={onChange} 
        />
      </div>
    </>
  );
}

export default CustomNumberField;
