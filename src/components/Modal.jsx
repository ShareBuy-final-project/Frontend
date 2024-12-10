import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    // If modal is not open, do not render it
    if (!isOpen) return null;

    // Close the modal when clicking on the overlay
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(); // Trigger the onClose callback
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleOverlayClick} // Attach click event on the overlay
        >
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* Modal Content */}
                {children}
            </div>
        </div>
    );
};

export default Modal;
