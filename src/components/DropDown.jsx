import React from 'react';

const DropDown = ({ options = [], defaultLabel = "Select an option", selectedOption, onOptionChange, rounded="rounded-lg", ml="4" }) => {
  return (
    <select
      value={selectedOption}
      onChange={(event) => onOptionChange(event.target.value)}
      className= {`p-2 border border-gray-300 ${rounded} flex-1 ml-${ml}`}
      style={{ flexBasis: '20%' }}
    >
      <option value="">{defaultLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropDown;