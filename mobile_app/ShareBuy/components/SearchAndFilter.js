import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import SearchBar from './SearchBar';  // Import the SearchBar component
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchAndFilter = ({ value, onChangeText, onSortPress, onFilterPress }) => {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar value={value} onChangeText={onChangeText} />

      {/* Sort Button */}
      <TouchableOpacity onPress={onSortPress} style={styles.button}>
        <Icon name="sort" size={24} color="#888" />
      </TouchableOpacity>

      {/* Filter Button */}
      <TouchableOpacity onPress={onFilterPress} style={styles.button}>
        <Icon name="filter-list" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  button: {
    padding: 5,
    marginLeft: 10,  // Adjust margin to space out the buttons and the search bar
  },
});

export default SearchAndFilter;
