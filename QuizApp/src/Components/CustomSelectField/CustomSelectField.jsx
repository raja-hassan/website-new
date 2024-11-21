import React from 'react';
import './CustomSelectField.scss';

function CustomSelectField(props) {
  const selectValue = props.multiple
    ? props.value || []  
    : Array.isArray(props.value)
    ? props.value[0] || ''
    : props.value || '';

  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="form-label fw-bold">
        {props.label}
      </label>
      <select
        onChange={props.onChange}
        id={props.id}
        name={props.name}
        multiple={props.multiple}
        value={selectValue}
        className={`form-select ${props.error ? 'is-invalid' : ''}`} 
        aria-label={props.label}
      >
        {/* Placeholder as default option */}
        {!props.multiple && (
          <option value="" disabled>
            {props.placeholder}
          </option>
        )}

        {/* Rendering options */}
        {props.options?.length > 0 ? (
          props.options.map((option, i) => (
            <option value={option.value} key={`${props.id}_${i}`}>
              {option.label}
            </option>
          ))
        ) : (
          <option>No Options</option>
        )}
      </select>
      
      {props.error && <div className="text-danger mt-1" style={{ fontSize: "15px" }}>{props.error}</div>}
    </div>
  );
}

export default CustomSelectField;
