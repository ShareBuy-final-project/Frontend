import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONT } from '../constants/theme';

const InputField = ({ icon, placeholder, keyboardType, value, onChangeText, label, secureTextEntry, marginTop, marginBottom, marginLeft, marginRight, borderColor = COLORS.black, editable = true }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, { marginTop, marginBottom, marginLeft, marginRight }]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, { borderColor }]}>
        <Icon name={icon} size={20} color={COLORS.gray} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible} // Toggle visibility
          editable={editable}
        />
        {secureTextEntry && editable && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={20}
              color={COLORS.gray}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
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
    paddingLeft: 30,
  },
  eyeIcon: {
    position: 'center',
  },
});

export default InputField;
