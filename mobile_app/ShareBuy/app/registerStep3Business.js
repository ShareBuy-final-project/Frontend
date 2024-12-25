import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation } from '@react-navigation/native';

const RegisterStep3Business = () => {
  const navigation = useNavigation();
  const [businessName, setBusinessName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    // Handle the next step
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>
          What is your business name?
        </Text>
        <InputField
          icon="building"
          placeholder="Business Name"
          keyboardType="default"
          value={businessName}
          onChangeText={setBusinessName}
          isValid={true}
          label="Business Name"
        />
        <InputField
          icon="id-card"
          placeholder="Business Number"
          keyboardType="default"
          value={businessNumber}
          onChangeText={setBusinessNumber}
          isValid={true}
          label="Business Number"
        />
        <InputField
          icon="info-circle"
          placeholder="Description"
          keyboardType="default"
          value={description}
          onChangeText={setDescription}
          isValid={true}
          label="Description"
        />
        <View style={[styles.buttonContainer, { marginTop: 60 }]}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>next</Text>
            <Icon name="arrow-right" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 50,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
    marginBottom: 40,
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

export default RegisterStep3Business;
