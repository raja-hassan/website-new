import React from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomRadioField({ id, label, name, onChange }) {
  return (
    <div className="form-check border-bottom border-dark mb-2">
      <input
        className="form-check-input"
        type="radio"
        name={name}  
        id={id}
        onChange={onChange}
        style={{
          borderColor: '#495057', 
          borderWidth: '2px',     
          outline: 'none'        
        }}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default CustomRadioField;
