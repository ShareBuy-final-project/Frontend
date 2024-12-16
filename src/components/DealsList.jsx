import React, { useState, useEffect } from 'react';
import Card from './Card';
import { deals } from '../../deals.json';
import JoinGroup from './JoinGroup'; // Import the JoinGroup component

const DealsList = ({ searchQuery, sortOption }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close
  const [selectedGroupId, setSelectedGroupId] = useState(null); // State to store the selected group ID
  const [filteredDeals, setFilteredDeals] = useState(deals); // State to store filtered deals
  const [sortedDeals, setSortedDeals] = useState(deals); // State to store sorted deals

  useEffect(() => {
    const filtered = deals.filter(deal =>
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDeals(filtered);
  }, [searchQuery]);

  useEffect(() => {
    const sorted = [...filteredDeals].sort((a, b) => {
      if (sortOption === 'Price') {
        return parseFloat(a['original price']) - parseFloat(b['original price']);
      } else if (sortOption === 'Date') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === 'Discount') {
        return parseFloat(b.discount) - parseFloat(a.discount);
      }
      return 0;
    });
    setSortedDeals(sorted);
  }, [sortOption, filteredDeals]);

  const openGroupModal = (id) => {
    setSelectedGroupId(id);
    setIsModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsModalOpen(false);
    setSelectedGroupId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sortedDeals.map((deal, index) => {
        const originalPrice = parseFloat(deal['original price']);
        const imagePath = `src/assets/images/${deal.image}`;
        return (
          <Card key={index} backgroundImage={imagePath}>
            <h2 className="text-2xl font-bold">{deal.name}</h2>
            <p className="mt-2 mb-4">{deal.description}</p>
            <p className="mt-2 mb-4">
              <del>${originalPrice.toFixed(2)}</del>
              <span className="ml-2 text-red-500">${(originalPrice * (1 - deal.discount / 100)).toFixed(2)}</span>
            </p>
            <div className="flex justify-start mt-auto">
              <button
                className="bg-gray-700 text-white rounded-lg px-2 py-2 hover:bg-gray-500 mt-auto"
                onClick={() => openGroupModal(deal.id)} // Open the modal with the selected group ID
              >
                Join group
              </button>
            </div>
          </Card>
        );
      })}
      {isModalOpen && (
        <JoinGroup groupId={selectedGroupId} onClose={closeGroupModal} />
      )}
    </div>
  );
};

export default DealsList;