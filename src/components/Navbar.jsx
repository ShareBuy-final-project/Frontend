import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import Modal from '../components/Modal'; // Import the Modal component
import LoginPage from '../pages/LoginPage'; // Import the LoginPage

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <nav className="bg-indigo700 border-b border-indigo500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* Logo */}
              <NavLink to="/" className="flex items-center">
                <FaShoppingCart className="text-white text-3xl inline mr-1" />
                <span className="hidden md:block text-white text-2xl font-bold ml-2">
                ShareBuy
                </span>
              </NavLink>
            {/* Navigation Links */}
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink to="/home" className={linkClass}>
                  Home
                </NavLink>

                {/* Log in Link */}
                <button
                  onClick={openModal}
                  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >
                  log in
                </button>

                <NavLink to="/register" className={linkClass}>
                  register
                </NavLink>
                <NavLink to="/about" className={linkClass}>
                  about
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Login Page */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LoginPage />
      </Modal>
    </nav>
  );
};

export default Navbar;
