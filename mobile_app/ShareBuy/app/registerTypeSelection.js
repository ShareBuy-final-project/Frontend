import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const RegisterTypeSelection = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = () => {
    if (selectedOption) {
      navigation.navigate('register', {
        selectedOption,
      });
    } else {
      Alert.alert('Selection Required', 'Please select an option to proceed.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.header, { marginBottom: 100 }]}>Who are you?</Text>
        <TouchableOpacity
          style={[
            styles.option,
            selectedOption === 'private' ? styles.selectedPrivateOption : styles.privateOption,
          ]}
          onPress={() => setSelectedOption('private')}
        >
          <Text style={styles.optionText}>I am a private person</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            selectedOption === 'business' ? styles.selectedBusinessOption : styles.businessOption,
          ]}
          onPress={() => setSelectedOption('business')}
        >
          <Text style={styles.optionText}>I am a business owner</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonContainer, { marginTop: 60 }]}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>next</Text>
            <Icon name="arrow-right" size={20} color={COLORS.white} />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  header: {
    fontSize: 50,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
    marginBottom: 40,
  },
  option: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  privateOption: {
    backgroundColor: COLORS.lightYellow,
  },
  selectedPrivateOption: {
    backgroundColor: COLORS.darkYellow,
  },
  businessOption: {
    backgroundColor: COLORS.lightPurple,
  },
  selectedBusinessOption: {
    backgroundColor: COLORS.darkPurple,
  },
  optionText: {
    color: COLORS.black,
    fontSize: 18,
    fontFamily: FONT.arialBold,
  },
  buttonContainer: {
    width: '25%',
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 0,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONT.arialBold,
    marginRight: 10,
    textAlign: 'center',
  },
});

export default RegisterTypeSelection;
