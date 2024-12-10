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
      <div className='mb-4 mt-2'>
        <SearchBar onSearch={handleSearch} onSort={handleSort} placeholder='search here for any deal or product' />
      </div>
      <DealsList searchQuery={searchQuery} sortOption={sortOption} />
    </>
  );
};

export default HomePage;