import React from 'react';

const Button = ({ label, onClick, className}) => {
  return (
    <button onClick={onClick} 
        className={`px-4 py-2 bg-indigo700 text-white rounded-lg hover:bg-indigo600 transition duration-300 ${className}`}>
      {label}
    </button>
  );
};

export default Button;