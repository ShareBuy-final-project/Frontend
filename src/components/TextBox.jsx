import React, { useState } from 'react';

const TextBox = ({ph = 'text', mb = 'mb-2'}) => {
    const [text, setText] = useState('');
  
    const handleChange = (event) => {
      setText(event.target.value);
    };
  
    return (
      <div>
        <input 
          type="text" 
          value={text} 
          onChange={handleChange} 
          placeholder={ph}
          className={`${mb} p-2 border border-gray-300 rounded-lg`}
        />
      </div>
    );
  };

export default TextBox