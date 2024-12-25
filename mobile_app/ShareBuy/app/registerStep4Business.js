import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation } from '@react-navigation/native';

const RegisterStep4Business = () => {
  const navigation = useNavigation();
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleNext = () => {
    // Handle the next step
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>
          Where can we find you?
        </Text>
        <InputField
          icon="map-marker"
          placeholder="State"
          keyboardType="default"
          value={state}
          onChangeText={setState}
          isValid={true}
          label="State"
        />
        <InputField
          icon="map-marker"
          placeholder="City"
          keyboardType="default"
          value={city}
          onChangeText={setCity}
          isValid={true}
          label="City"
        />
        <InputField
          icon="map-marker"
          placeholder="Street"
          keyboardType="default"
          value={street}
          onChangeText={setStreet}
          isValid={true}
          label="Street"
        />
        <InputField
          icon="map-marker"
          placeholder="Street Number"
          keyboardType="default"
          value={streetNumber}
          onChangeText={setStreetNumber}
          isValid={true}
          label="Street Number"
        />
        <InputField
          icon="map-marker"
          placeholder="Zip Code"
          keyboardType="default"
          value={zipCode}
          onChangeText={setZipCode}
          isValid={true}
          label="Zip Code"
        />
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

export default RegisterStep4Business;
