import React from 'react'
import { NavLink } from 'react-router-dom'
import {FaShoppingCart} from 'react-icons/fa'

const Navbar = () => {
  const linkClass = ({isActive}) => isActive ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2":
                  "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div
            className="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
          >
            {/* <!-- Logo --> */}
           
            <a className="flex flex-shrink-0 items-center mr-4" href="/">
            <FaShoppingCart className="text-white text-3xl inline mr-1" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">ShareBuy</span>
            </a>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink to='/'
                  className={linkClass}
                  >Home</NavLink>
                <NavLink to='/log-in'
                  className={linkClass}
                  >log in</NavLink>
                <NavLink to='/register'
                  className={linkClass}
                  >register</NavLink>
                <NavLink to='/about'
                 className={linkClass}
                  >about</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar