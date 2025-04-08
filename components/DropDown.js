import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { COLORS, FONT } from '../constants/theme';

const DropDown = ({ label, selectedValue, onValueChange, options, width = '80%' }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);
  const [items, setItems] = useState(options);

  return (
    <View style={[styles.container, { width }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={onValueChange}
        placeholder="Select an option"
        style={styles.picker}
        dropDownContainerStyle={styles.dropDownContainer}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONT.arial,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.black,
  },
  dropDownContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 4,
    maxHeight: 200, 
  },
});

export default DropDown;