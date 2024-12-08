import PropTypes from 'prop-types';

const Card = ({ children, bg = 'bg-gray-200', width = 'w-auto', height = 'h-auto' }) => {
  return (
    <div className={`${bg} ${width} ${height} p-6 rounded-lg shadow-md`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  bg: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Card