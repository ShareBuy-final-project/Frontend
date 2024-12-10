import React from 'react'

const SortByDropDown = ({ sortOption, onSortChange }) => {
    return (
      <select
        value={sortOption}
        onChange={(event) => onSortChange(event.target.value)}
        className="p-2 border border-gray-300 rounded-l-lg flex-grow ml-4"
        style={{ flexBasis: '20%' }}
      >
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="date">Date</option>
        <option value="discount">Discount Percent</option>
      </select>
    );
  };

export default SortByDropDown