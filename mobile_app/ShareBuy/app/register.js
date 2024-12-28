import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    setIsPhoneValid(phoneRegex.test(phone));
  };

  const handleNext = () => {
    if (!fullName) {
      Alert.alert('Invalid Input', 'Full Name field must be filled in.');
    } else if (!email) {
      Alert.alert('Invalid Input', 'Email field must be filled in.');
    } else if (!isEmailValid) {
      Alert.alert('Invalid Input', 'Email address is not valid.');
    } else if (!phone) {
      Alert.alert('Invalid Input', 'Phone Number field must be filled in.');
    } else if (!isPhoneValid) {
      Alert.alert('Invalid Input', 'Phone Number is not valid.');
    } else {
      navigation.navigate('registerPassword', {
        fullName,
        email,
        phone,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>
          Nice to
          {'\n'}
          meet you!
        </Text>
        <Text style={styles.subHeader}>Your deal group awaits!</Text>
        <Text style={styles.text}>
          Ready to find your perfect match with <Text style={styles.purpleText}>ShareBuy</Text>?
        </Text>
        <Text style={styles.text}>To pick things off, we'll need a few details about you.</Text>
        <View style={styles.inputWrapper}>
          <InputField
            icon="user"
            placeholder="Full Name"
            keyboardType="default"
            value={fullName}
            onChangeText={setFullName}
            label="Full Name"
            borderColor={COLORS.black}
          />
          <Text style={styles.mandatory}>*</Text>
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            icon="envelope"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            label="Email"
            borderColor={isEmailValid ? COLORS.black : COLORS.red}
          />
          <Text style={styles.mandatory}>*</Text>
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            icon="phone"
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              validatePhone(text);
            }}
            label="Phone Number"
            borderColor={isPhoneValid ? COLORS.black : COLORS.red}
          />
          <Text style={styles.mandatory}>*</Text>
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
  },
  subHeader: {
    fontSize: 25,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
    backgroundColor: COLORS.glowingYeloow,
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arial,
    marginTop: 20,
  },
  purpleText: {
    color: COLORS.purple,
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

export default Register;
