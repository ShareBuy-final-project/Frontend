import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation, useRoute } from '@react-navigation/native';

const RegisterPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, email, phone } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validatePassword = (password) => {
    setIsPasswordValid(regex.test(password));
  };

  const handleNext = () => {
    if (!password) {
      Alert.alert('Invalid Input', 'Password field must be filled in.');
    } else if (!isPasswordValid) {
      Alert.alert('Invalid Input', 'Password does not meet the requirements.');
    } else if (password !== confirmPassword) {
      Alert.alert('Invalid Input', 'Passwords do not match.');
    } else {
      navigation.navigate('registerTypeSelection', {
        fullName,
        email,
        phone,
        password,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>
          Set Your Password
        </Text>
        <View style={styles.inputWrapper}>
          <InputField
            icon="lock"
            placeholder="Password"
            keyboardType="default"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
            isValid={isPasswordValid}
            label="Password"
            secureTextEntry={true}
            marginTop={10}
            marginBottom={5}
            marginLeft={20}
            marginRight={5}
          />
          <Text style={styles.mandatory}>*</Text>
          <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
            <Icon name="info-circle" size={20} color={COLORS.gray} style={styles.infoIcon} />
          </TouchableOpacity>
        </View>
        {showInfo && (
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, styles.infoTextBold]}>Password must:</Text>
            <Text style={styles.infoText}>- Be at least 8 characters long</Text>
            <Text style={styles.infoText}>- Contain at least one uppercase letter</Text>
            <Text style={styles.infoText}>- Contain at least one lowercase letter</Text>
            <Text style={styles.infoText}>- Contain at least one digit</Text>
            <Text style={styles.infoText}>- Contain at least one special character</Text>
          </View>
        )}
        <View style={styles.inputWrapper}>
          <InputField
            icon="lock"
            placeholder="Confirm Password"
            keyboardType="default"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isValid={true}
            label="Confirm Password"
            secureTextEntry={true}
            marginTop={10}
            marginBottom={10}
            marginRight={5}
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
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center', 
    marginBottom: 5, 
  },
  infoIcon: {
    marginLeft: 5, 
  },
  infoContainer: {
    width: '80%',
    backgroundColor: COLORS.lightWhite,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONT.arial,
  },
  infoTextBold: {
    fontFamily: FONT.arialBold,
    fontWeight: 'bold',
  },
  mandatory: {
    color: 'red',
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

export default RegisterPassword;
