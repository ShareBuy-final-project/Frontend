import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal'; // Import the Register modal

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Register modal
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const sidebarRef = useRef(null);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUsername('');
    toggleSidebar();
    alert('Signed out');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center w-full">
          <div className="flex items-center space-x-2">
            <NavLink to="/" className="flex items-center">
              <FaShoppingCart className="text-white text-3xl mr-1" />
              <span className="text-white text-2xl font-bold ml-2">ShareBuy</span>
            </NavLink>
          </div>

          <div className="flex space-x-2 ml-auto">
            {!isLoggedIn && (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-white hover:bg-gray-900 rounded-md px-3 py-2"
                >
                  Log in
                </button>
                <button
                  onClick={openRegisterModal}
                  className="text-white hover:bg-gray-900 rounded-md px-3 py-2"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {isLoggedIn && (
            <button
              className="text-white hover:text-gray-300 text-xl ml-auto p-2 rounded-full border-2 border-white"
              onClick={toggleSidebar}
            >
              <FaUser />
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={(username) => {
          setIsLoggedIn(true);
          setUsername(username);
          closeLoginModal();
        }}
      />

      {/* Register Modal */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
    </nav>
  );
};

export default Navbar;
