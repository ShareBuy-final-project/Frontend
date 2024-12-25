import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONT } from '../constants/theme';

const InputField = ({ icon, placeholder, keyboardType, value, onChangeText, isValid, label }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
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
  </View>
);

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
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
