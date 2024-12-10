import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root'); // Important for accessibility

const LoginModal = ({ isOpen, onClose }) => {
  const [isBusiness, setIsBusiness] = useState(false); // Track if the user is a business

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Login Modal"
      className="bg-white p-6 rounded shadow-lg max-w-md mx-auto relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>
      
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Log in</h2>

      {/* Username Input */}
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 mb-4 rounded"
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-4 rounded"
      />

      {/* Checkbox */}
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isBusiness}
          onChange={() => setIsBusiness(!isBusiness)}
          className="mr-2"
        />
        <span className="text-gray-700">Are you a business?</span>
      </label>

      {/* Log in Button with Dynamic Text */}
      <button
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500 mb-4"
        onClick={onClose}
      >
        {isBusiness ? "Log in as Business" : "Log in as Client"}
      </button>

      {/* Register Prompt */}
      <div className="text-center text-sm text-gray-600">
        Not a member yet?{" "}
        <Link className="text-indigo-800 hover:text-indigo-600" to="/register">
          Register here
        </Link>
      </div>
    </Modal>
  );
};

export default LoginModal;
