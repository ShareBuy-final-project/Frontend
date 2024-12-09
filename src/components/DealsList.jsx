import React from 'react';
import Card from './Card';
import { deals } from '../../deals.json';

const DealsList = ({ searchQuery, sortOption }) => {
  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortOption === 'price') {
      return parseFloat(a['original price']) - parseFloat(b['original price']);
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
        const discount = parseFloat(deal.discount);
        const newPrice = originalPrice - (originalPrice * discount / 100);

        return (
          <Card key={index}>
            <h2 className="text-2xl font-bold">{deal.name}</h2>
            <p className="mt-2 mb-4">{deal.description}</p>
            <p className="mt-2 mb-4">
              <del>${originalPrice.toFixed(2)}</del> 
              <span className="ml-2 text-red-500">${newPrice.toFixed(2)}</span>
            </p>
          </Card>
        );
      })}
    </div>
  );
};

export default DealsList;