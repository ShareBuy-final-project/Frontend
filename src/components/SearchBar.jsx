import React, { useState } from 'react';
import SortByDropDown from './SortByDropDown';

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
      <SortByDropDown sortOption={sortOption} onSortChange={handleSortChange} />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-indigo-700 text-white rounded-r-lg hover:bg-indigo-600 transition duration-300"
        style={{ flexBasis: '10%' }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;