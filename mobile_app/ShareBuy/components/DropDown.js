import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, FONT } from '../constants/theme';

const DropDown = ({ selectedValue, onValueChange, options, label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONT.arial,
    marginBottom: 5,
  },
  pickerContainer: {
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 0,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default DropDown;
