const TextBox = ({ph = 'text', mb = 'mb-2',value ,onChange, border = 'border-gray-300'}) => {  
    return (
      <div>
        <input 
          type="text" 
          value={value} 
          onChange={onChange} 
          placeholder={ph}
          className={`${mb} p-2 border ${border} rounded-lg`}
        />
      </div>
    );
  };

export default TextBox
