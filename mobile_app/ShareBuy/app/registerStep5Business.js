import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation } from '@react-navigation/native';

const RegisterStep5Business = () => {
  const navigation = useNavigation();
  const [websiteLink, setWebsiteLink] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleNext = () => {
    // Handle the next step
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
          isValid={true}
          label="Website Link"
        />
        <InputField
          icon="envelope"
          placeholder="Contact Email"
          keyboardType="email-address"
          value={contactEmail}
          onChangeText={setContactEmail}
          isValid={true}
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

export default RegisterStep5Business;
