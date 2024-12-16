import React from 'react';

const Card = ({ children, bg = 'bg-gray-200', width = 'w-auto', height = 'h-auto', backgroundImage }) => {

  const style = { 
    backgroundImage: ` linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))
    ,url(${backgroundImage})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundRepeat:"no-repeat" 
  }

  return (
    <div className={`${bg} ${width} ${height} p-6 rounded-lg shadow-md  flex flex-col justify-between`} style={style}>
      {children}
    </div>
  );
};

export default Card;
