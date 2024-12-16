import React from 'react';
import Card from './Card';
import { deals } from '../../deals.json';
import coffePic from '../assets/images/coffee-beans-white-wooden-wall-closeup.jpg';

const DealsList = ({ searchQuery, sortOption }) => {
  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newPrice = (deal) => {
        return (parseFloat(deal['original price']) * ((100-parseFloat(deal.discount)) / 100))
  }

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortOption === 'price') {
      return newPrice(a) - newPrice(b);
    } else if (sortOption === 'date') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOption === 'discount') {
      return parseFloat(b.discount) - parseFloat(a.discount);
    }
    return 0;
  });
  

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
              <span className="ml-2 text-red-500">${newPrice(deal).toFixed(2)}</span>
            </p>
            <div className="flex justify-start mt-auto">
            <button className="bg-gray-700 text-white rounded-lg px-2 py-2 hover:bg-gray-500 mt-auto">
              Enter group
            </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DealsList;