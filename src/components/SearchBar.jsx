import React, { useState } from 'react';
import DropDown from './DropDown';

const SearchBar = ({ onSearch, onSort ,placeholder = "Search...", width="100%" }) => {
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    if (onSort) {
      onSort(option);
    }
  };

  const sortOptions = [
    { value: 'price', label: 'Price' },
    { value: 'date', label: 'Date' },
    { value: 'discount', label: 'Discount Percent' },
  ];

  return (
    <div className={`flex items-center w-[${width}]`}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="p-2 border border-gray-300 rounded-l-lg flex-grow ml-4"
        style={{ flexBasis: '90%' }}
      />
      <DropDown options={sortOptions} defaultLabel="Sort By" selectedOption={sortOption} onOptionChange={handleSortChange} rounded="rounded-l-lg" />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-indigo700 text-white rounded-r-lg hover:bg-indigo600 transition duration-300"
        style={{ flexBasis: '10%' }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;