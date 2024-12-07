import React, { useState } from 'react';

const TextBox = ({ph = 'text', mb = 'mb-2',value ,onChange}) => {  
    return (
      <div>
        <input 
          type="text" 
          value={value} 
          onChange={onChange} 
          placeholder={ph}
          className={`${mb} p-2 border border-gray-300 rounded-lg`}
        />
      </div>
    );
  };

export default TextBox