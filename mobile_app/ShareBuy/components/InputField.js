import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONT } from '../constants/theme';

const InputField = ({ icon, placeholder, keyboardType, value, onChangeText, isValid }) => (
  <View style={[styles.inputContainer, !isValid && styles.invalidInput]}>
    <Icon name={icon} size={20} color={COLORS.gray} style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  invalidInput: {
    borderColor: 'red',
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONT.arial,
    color: COLORS.black,
    paddingLeft: 40,
  },
});

export default InputField;
