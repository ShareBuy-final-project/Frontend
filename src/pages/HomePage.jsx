import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import DealsList from '../components/DealsList';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  return (
    <>
      <div className='mb-2 p-4'> 
        <SearchBar
          onSearch={handleSearch}
          onSort={handleSort}
          placeholder='Search here for any deal or product'
        />
      </div>
      <div className="p-6"> 
        <DealsList searchQuery={searchQuery} sortOption={sortOption} />
      </div>
    </>
  );
};

export default HomePage;
