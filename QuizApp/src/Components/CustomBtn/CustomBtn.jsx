import React from 'react';
import './CustomBtn.scss';

function CustomBtn(props) {
  return (
    <button type="submit" className="custom-btn">
      {props.btnText}
    </button>
  );
}

export default CustomBtn;
