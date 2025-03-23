import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registerBusiness } from '../apiCalls/userApiCalls';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const RegisterBusinessContactInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, email, phone, password, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category } = route.params;
  const [websiteLink, setWebsiteLink] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleNext = async () => {
    try {
      const response = await registerBusiness({
        fullName,
        email,
        phone,
        password,
        state,
        city,
        street,
        streetNumber,
        zipCode,
        businessName,
        businessNumber,
        description,
        category,
        websiteLink,
        contactEmail,
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful 🎉',
          text2: 'You can now login to your account',
        });
        navigation.navigate('welcome');
      } 
      else {
        Alert.alert('Registration Error', response.data.error);
        throw new Error(response.data.error);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 201 range
        console.error('Registration Error:', error.response.data);
        Alert.alert('Registration Error', `Server Error: ${error.response.data.error}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Registration Error:', error.request);
        Alert.alert('Registration Error', 'No response from server. Please check your network connection.');
      } else {
        // Something else happened
        console.error('Registration Error:', error.message);
        Alert.alert('Registration Error', `An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>
          Business Contact Information
        </Text>
        <InputField
          icon="link"
          placeholder="Website Link"
          keyboardType="url"
          value={websiteLink}
          onChangeText={setWebsiteLink}
          label="Website Link"
        />
        <InputField
          icon="envelope"
          placeholder="Contact Email"
          keyboardType="email-address"
          value={contactEmail}
          onChangeText={setContactEmail}
          label="Contact Email"
        />
        <View style={[styles.buttonContainer, { width: '50%', marginTop: 40 }]}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>finish registration</Text>
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
    marginBottom: 20,
  },
  buttonContainer: {
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
    width: '100%', // Ensure the button takes the full width of the container
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONT.arialBold,
    textAlign: 'center',
  },
});

export default RegisterBusinessContactInfo;
