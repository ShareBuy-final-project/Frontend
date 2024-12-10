import React, { useState, useEffect, useRef } from 'react';
import { BiSortAlt2 } from 'react-icons/bi';  // Import the BiSortAlt2 icon
import { FaSearch } from 'react-icons/fa';  // Assuming you're using FaSearch for the search icon

const SearchBar = ({ onSearch, onSort, placeholder = "Search...", width = "100%" }) => {
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State to toggle filter dropdown
  const [isSortOpen, setIsSortOpen] = useState(false); // State to toggle sort modal
  const filterRef = useRef(null);  // Reference for the filter modal
  const sortRef = useRef(null);  // Reference for the sort modal

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

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleSortModal = () => {
    setIsSortOpen(!isSortOpen);
  };

  // Close filter and sort modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (filterRef.current && !filterRef.current.contains(event.target)) &&
        (sortRef.current && !sortRef.current.contains(event.target))
      ) {
        setIsFilterOpen(false); // Close the filter modal if clicking outside
        setIsSortOpen(false);   // Close the sort modal if clicking outside
      }
    };

    // Attach event listener to document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
        <button
          className="flex items-center px-4 py-2 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 transition duration-300"
          onClick={toggleSortModal}  // Toggle sort modal
        >
          <BiSortAlt2 className="mr-2" /> {/* BiSortAlt2 icon */}
          <span className="text-xs">Sort</span> {/* Smaller text */}
        </button>
        <button
          className="flex items-center px-4 py-2 bg-gray-200 text-black text-sm rounded-lg hover:bg-gray-300 transition duration-300"
          onClick={toggleFilterDropdown}  // Toggle filter dropdown
        >
          <FaSearch className="mr-2" />
          <span className="text-xs">Filter</span> {/* Smaller text */}
        </button>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div
            ref={filterRef}  // Attach the reference to the filter modal
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
              <div className="border-b border-gray-400 pb-3">
                <label className="block text-xs font-medium mb-2">Status</label>
                <select className="border p-1.5 rounded-lg w-full text-xs">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="border-b border-gray-400 pb-3">
                <label className="block text-xs font-medium mb-2">Filter options</label>
              </div>
              <div className="flex justify-between mt-3">
                <button
                  className="px-4 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsFilterOpen(false)}  // Close dropdown
                >
                  Reset all
                </button>
                <button
                  className="px-4 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => setIsFilterOpen(false)}  // Close dropdown after apply
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
            ref={sortRef}  // Attach the reference to the sort modal
            className="absolute top-full right-0 mt-2 bg-white p-4 rounded-lg w-80 shadow-lg border border-gray-300 z-10"
          >
            <div className="border-b border-gray-400 pb-3 mb-2">
              <h2 className="block text-xs font-medium mb-2">Sort</h2>
            </div>
            <div className="space-y-3">
              <button
                className="w-full text-xs p-2 text-left hover:bg-gray-100"
                onClick={() => handleSortChange('Name')}
              >
                Sort by Name
              </button>
              <button
                className="w-full text-xs p-2 text-left hover:bg-gray-100"
                onClick={() => handleSortChange('Date')}
              >
                Sort by Date
              </button>
              <button
                className="w-full text-xs p-2 text-left hover:bg-gray-100"
                onClick={() => handleSortChange('Price')}
              >
                Sort by Price
              </button>
            </div>
            <div className="flex justify-between mt-3">
              <button
                className="px-4 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setIsSortOpen(false)}  // Close sort modal
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setIsSortOpen(false)}  // Close sort modal after apply
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
