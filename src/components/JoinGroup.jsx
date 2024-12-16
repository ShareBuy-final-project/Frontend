import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import dealsData from '../../deals.json'; // Import the deals data

Modal.setAppElement('#root'); // Set the app element for accessibility

function JoinGroup({ groupId, onClose }) {
  const [group, setGroup] = useState(null); // State to store the group data
  const [isModalOpen, setIsModalOpen] = useState(true); // State to manage modal open/close

  useEffect(() => {
    // Find the group data based on the group ID
    const fetchGroupData = () => {
      const groupData = dealsData.deals.find(deal => deal.id === parseInt(groupId));
      setGroup(groupData);
    };

    fetchGroupData();
  }, [groupId]);

  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const proceedToPayment = () => {
    // Handle proceed to payment logic here
    alert('Proceeding to payment...');
    closeModal();
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Join Group Modal"
      className="bg-white p-6 rounded shadow-lg max-w-md mx-auto relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={closeModal}
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
      <p className="mt-2 mb-4">{group.description}</p>
      <p className="mt-2 mb-4">Minimum group size: {group['minimum group size']}</p>
      <p className="mt-2 mb-4">Discount: {group.discount}%</p>
      <p className="mt-2 mb-4">Original Price: ${group['original price']}</p>
      <p className="mt-2 mb-4">New Price: ${(group['original price'] * (1 - group.discount / 100)).toFixed(2)}</p>
      <div className="flex justify-end space-x-4 mt-4">
        <button
          className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="bg-indigo-700 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
          onClick={proceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
    </Modal>
  );
}

export default JoinGroup;