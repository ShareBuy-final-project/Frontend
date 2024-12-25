import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';

const register = () => {
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
        <InputField
          icon="user"
          placeholder="Full Name"
          keyboardType="default"
          value={fullName}
          onChangeText={setFullName}
          isValid={true}
        />
        <InputField
          icon="envelope"
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          isValid={isEmailValid}
        />
        <InputField
          icon="phone"
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            validatePhone(text);
          }}
          isValid={isPhoneValid}
        />
        <View style={[styles.buttonContainer, { marginTop: 40 }]}>
          <TouchableOpacity style={styles.nextButton} onPress={() => { /* move to next registration screen */ }}>
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
  },
});

export default register;
