
import PropTypes from 'prop-types';

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

TextBox.propTypes = {
  ph: PropTypes.string,
  mb: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  border: PropTypes.string,
};

export default TextBox