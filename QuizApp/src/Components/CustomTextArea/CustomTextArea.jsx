import React from 'react';

function CustomTextArea(props) {
  return (
    <div className="mb-3">
      <label htmlFor={props.id} name={props.name} className="form-label fw-bold">
        {props.label}
      </label>
      <textarea
        className={`form-control ${props.error ? 'is-invalid' : ''}`} 
        id={props.id}
        name={props.name}
        rows="3"
        onChange={props.onChange}
        value={props.value}  
      ></textarea>
      
      {props.error && <div className="text-danger mt-1">{props.error}</div>}
    </div>
  );
}

export default CustomTextArea;
