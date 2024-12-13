import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import LoginModal from '../components/Login';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // For login modal
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For profile sidebar
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [username, setUsername] = useState(''); // Store the username

  const sidebarRef = useRef(null); // Reference to the sidebar

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSignOut = () => {
    setIsLoggedIn(false); // Reset the login status
    setUsername(''); // Reset username
    toggleSidebar(); // Close the sidebar
    alert('Signed out');
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  // Close the sidebar if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false); // Close the sidebar
      }
    };

    // Add event listener for outside clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Subcomponent for Logo and Cart
  const LogoCart = () => (
    <div className="flex items-center space-x-2">
      <NavLink to="/" className="flex items-center">
        <FaShoppingCart className="text-white text-3xl mr-1" />
        <span className="hidden md:block text-white text-2xl font-bold ml-2">ShareBuy</span>
      </NavLink>
    </div>
  );

  // Subcomponent for NavLinks (Login/Register) - Positioned on the left
  const NavLinks = () => (
    <div className="flex space-x-2 ml-auto">
      {!isLoggedIn && (
        <>
          <button
            onClick={openModal}
            className="text-white hover:bg-gray-900 rounded-md px-3 py-2"
          >
            Log in
          </button>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </>
      )}
    </div>
  );

  // Subcomponent for ProfileButton
  const ProfileButton = () => (
    <button
      className="text-white hover:text-gray-300 text-xl ml-auto p-2 rounded-full border-2 border-white"
      onClick={toggleSidebar}
    >
      <FaUser />
    </button>
  );


  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center w-full">
          {/* Left side (Logo and Cart) */}
          <LogoCart />

          {/* Centered Navigation Links (Login/Register) */}
          <NavLinks />

          {/* Profile Button (Visible after login) */}
          {isLoggedIn && <ProfileButton />}
        </div>
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <LoginModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onLogin={(username) => {
            setIsLoggedIn(true);
            setUsername(username);
            closeModal();
          }}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl z-index=20"
          onClick={toggleSidebar}
        >
          &times;
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-4">
            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-200 text-gray-600">
              <FaUser className="text-xl" />
            </div>
            <span>{username}</span>
          </h2>
          <ul className="space-y-2">
            <li>
              <NavLink to="/my-groups" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm mt-4 py-2 px-4 rounded-md bg-white hover:bg-gray-100 w-full">
                Your Groups
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-history" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm mt-4 py-2 px-4 rounded-md bg-white hover:bg-gray-100 w-full">
                Your History
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm mt-4 py-2 px-4 rounded-md bg-white hover:bg-gray-100 w-full">
                Settings
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm mt-4 py-2 px-4 rounded-md bg-white hover:bg-gray-100 w-full"
              >
                <FaSignOutAlt />
                <span>Sign out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
