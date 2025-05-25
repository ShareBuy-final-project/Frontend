import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Menu } from 'react-native-paper';

const SearchBar = ({ value, onChangeText, categories, onCategorySelect }) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.searchContainer}>
      <Icon name="search" size={24} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={value}
        onChangeText={onChangeText}
      />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu}>
            <Icon name="filter-list" size={24} color="#f08080" />
          </TouchableOpacity>
        }
      >
        {categories.map((item) => (
          <Menu.Item
            key={item.value}
            title={item.label}
            onPress={() => {
              onCategorySelect(item.value);
              closeMenu();
            }}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    width: '100%',
  justifyContent: 'space-between'
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
});

export default SearchBar;
