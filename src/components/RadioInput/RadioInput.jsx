import React from "react";
const RadioInput = ({ name, value, label, checked, onChange }) => (
  <div className="col linha">
    <input
      type="radio"
      name={name}
      value={value}
      onChange={onChange}
      checked={checked}
    />
    {label}
  </div>
);

export default RadioInput;
