import React, { useState, useEffect, useRef } from 'react';
import { BiSortAlt2 } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, onSort, placeholder = "Search...", width = "100%" }) => {
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    if (onSearch) onSearch(event.target.value); // Trigger search on input change
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    if (onSort) onSort(option);
    setIsSortOpen(false);
  };

  const toggleFilterDropdown = () => setIsFilterOpen(!isFilterOpen);
  const toggleSortModal = () => setIsSortOpen(!isSortOpen);

  // Close filter and sort modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close Filter modal
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest('.filter-button')
      ) {
        setIsFilterOpen(false);
      }

      // Close Sort modal
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target) &&
        !event.target.closest('.sort-button')
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex items-center justify-center w-[${width}]`}>
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="p-2 border border-gray-300 rounded-lg w-full pl-10 pr-10"
        />
        <FaSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      <div className="ml-4 flex space-x-4 relative">
        {/* Sort Button */}
        <button
          className="sort-button flex items-center px-4 py-2 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 transition duration-300"
          onClick={toggleSortModal}
        >
          <BiSortAlt2 className="mr-2" />
          <span className="text-xs">Sort</span>
        </button>

        {/* Filter Button */}
        <button
          className="filter-button flex items-center px-4 py-2 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 transition duration-300"
          onClick={toggleFilterDropdown}
        >
          <FaSearch className="mr-2" />
          <span className="text-xs">Filter</span>
        </button>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div
            ref={filterRef}
            className="absolute top-full right-0 mt-2 bg-white p-4 rounded-lg w-80 shadow-lg border border-gray-300 z-10"
          >
            <div className="border-b border-gray-400 pb-3 mb-2">
              <h2 className="block text-xs font-medium mb-2">Filter</h2>
            </div>
            <div className="space-y-3">
              <div className="border-b border-gray-400 pb-3">
                <label className="block text-xs font-medium mb-2">Date range</label>
                <div className="flex space-x-2">
                  <input type="date" className="border p-1.5 rounded-lg w-1/2 text-xs" />
                  <input type="date" className="border p-1.5 rounded-lg w-1/2 text-xs" />
                </div>
              </div>
              <div className="border-b border-gray-400 pb-3">
                <label className="block text-xs font-medium mb-2">Activity type</label>
                <select className="border p-1.5 rounded-lg w-full text-xs">
                  <option>All warehouses</option>
                </select>
              </div>
              <div className="flex justify-between mt-3">
                <button
                  className="px-4 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Reset all
                </button>
                <button
                  className="px-4 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sort Modal */}
        {isSortOpen && (
          <div
            ref={sortRef}
            className="absolute top-full right-0 mt-2 bg-white p-4 rounded-lg w-80 shadow-lg border border-gray-300 z-10"
          >
            <div className="space-y-3">
              <button
                className="w-full text-xs p-2 text-left hover:bg-gray-100"
                onClick={() => handleSortChange('Price')}
              >
                Sort by Price
              </button>
              <button
                className="w-full text-xs p-2 text-left hover:bg-gray-100"
                onClick={() => handleSortChange('Date')}
              >
                Sort by Date
              </button>
              <button
                className="w-full text-xs p-2 text-left hover:bg-gray-100"
                onClick={() => handleSortChange('Discount')}
              >
                Sort by Discount
              </button>
            </div>
            <div className="flex justify-between mt-3">
              <button
                className="px-4 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => handleSortChange('')}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
