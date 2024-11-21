import React from 'react'

function CustomDateField(props) {
  return (
    <>
        <div className="mb-3">
            <label htmlFor="date" className="form-label fw-bold">{props.label}</label>
            <input type="date" className="form-control" id="date" placeholder={props.placeholder} />
        </div>
    </>
  )
}

export default CustomDateField