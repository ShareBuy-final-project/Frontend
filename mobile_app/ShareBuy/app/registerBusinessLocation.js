import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation, useRoute } from '@react-navigation/native';

const RegisterBusinessLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, email, phone, password, businessName, businessNumber, description, category } = route.params;
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleNext = () => {
    if (!state) {
      Alert.alert('Invalid Input', 'State field must be filled in.');
    } else if (!city) {
      Alert.alert('Invalid Input', 'City field must be filled in.');
    } else if (!street) {
      Alert.alert('Invalid Input', 'Street field must be filled in.');
    } else if (!streetNumber) {
      Alert.alert('Invalid Input', 'Street Number field must be filled in.');
    } else {
      navigation.navigate('registerBusinessContactInfo', {
        fullName,
        email,
        phone,
        password,
        businessName,
        businessNumber,
        description,
        category,
        state,
        city,
        street,
        streetNumber,
        zipCode,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>
          Where can we find you?
        </Text>
        <View style={styles.inputWrapper}>
          <InputField
            icon="map-marker"
            placeholder="State"
            keyboardType="default"
            value={state}
            onChangeText={setState}
            label="State"
          />
          <Text style={styles.mandatory}>*</Text>
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            icon="map-marker"
            placeholder="City"
            keyboardType="default"
            value={city}
            onChangeText={setCity}
            label="City"
          />
          <Text style={styles.mandatory}>*</Text>
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            icon="map-marker"
            placeholder="Street"
            keyboardType="default"
            value={street}
            onChangeText={setStreet}
            label="Street"
          />
          <Text style={styles.mandatory}>*</Text>
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            icon="map-marker"
            placeholder="Street Number"
            keyboardType="default"
            value={streetNumber}
            onChangeText={setStreetNumber}
            label="Street Number"
          />
          <Text style={styles.mandatory}>*</Text>
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            icon="map-marker"
            placeholder="Zip Code"
            keyboardType="default"
            value={zipCode}
            onChangeText={setZipCode}
            label="Zip Code"
          />
          <Text style={styles.mandatory}> </Text>
        </View>
        <View style={[styles.buttonContainer, { marginTop: 40 }]}>
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
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%', 
    justifyContent: 'center', 
  },
  mandatory: {
    color: 'red',
    marginLeft: 5,
    fontSize: 18,
  },
  hiddenText: {
    marginLeft: 5,
    fontSize: 18,
    color: COLORS.lightWhite, // Match the background color to hide the text
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

export default RegisterBusinessLocation;
