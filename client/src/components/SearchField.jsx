import React from 'react';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchField = ({ name, placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="form-control"
    />
  );
};

export default SearchField;