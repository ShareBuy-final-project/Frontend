import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root'); // Important for accessibility

const LoginModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose} // Use onClose here
      contentLabel="Login Modal"
      className="bg-white p-6 rounded shadow-lg max-w-md mx-auto relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose} // Close the modal
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Log in</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 mb-4 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-4 rounded"
      />
      <button
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500"
        onClick={onClose} // Close on login button click
      >
        Log in
      </button>

      {/* Improved "Not a member yet?" section */}
      <div className="text-center mt-4">
        <span className="text-gray-600">Not a member yet?</span>
        <Link
          to="/register"
          className="text-indigo-600 font-semibold hover:underline ml-1"
          onClick={onClose}
        >
          Click here
        </Link>
      </div>
    </Modal>
  );
};

export default LoginModal;
