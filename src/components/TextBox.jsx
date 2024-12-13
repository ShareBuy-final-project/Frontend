const TextBox = ({ph = 'text', mb = 'mb-2',value ,onChange, border = 'border-gray-300', width = 'w-full', height = 'h-auto', isTextarea = false, rows = 4 }) => {  
    return (
      <div className={mb}>
        {isTextarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={ph}
          rows={rows}
          className={`p-2 border ${border} ${width} rounded-lg resize-none`}
        />
      ) : (
        <input 
          type="text" 
          value={value} 
          onChange={onChange} 
          placeholder={ph}
          className={`p-2 border ${border} ${width} ${height} rounded-lg`}
        />
      )}
      </div>
    );
  };

export default TextBox
