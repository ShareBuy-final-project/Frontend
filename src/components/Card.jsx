import React, { Children } from 'react'

const Card = ({children, bg='bg-gray-200'}) => {
  return (
    <div className={`${bg} p-6 rounded-lg shadow-md `}>
        {children}
    </div>
  )
}

export default Card