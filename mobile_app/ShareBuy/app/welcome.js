import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, View, TextInput, StyleSheet, Alert, Text, Platform, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { login } from '../apiCalls/authApiCalls';
import { isLoggedIn } from '../utils/userTokens';

const Welcome = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const  handleSignIn = async () => {
    try {
        const res = await login(email, password)
        Alert.alert('Login Successful', 'You have successfully logged in!', [{ text: 'OK' }]);
        navigation.navigate('home');
      }
      catch (error) {
        Alert.alert('Login Failed', error.message, [{ text: 'OK' }]);
      }
  };

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.iconContainer}>
          <Icon name="shopping-cart" size={150} color={COLORS.black} />
        </View>
        <Text style={styles.welcomeMessage}>
          Welcome to ShareBuy
        </Text>
        <View style={styles.messageContainer}>
          <Text style={styles.subMessage}>
            have we ever met?
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color={COLORS.gray} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.gray}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color={COLORS.gray} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => { handleSignIn(); }}>
          <Text style={{color : COLORS.white}}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.messageContainer}>
          <Text style={styles.secondSubMessage}>
            don't have an account? <Text style={{ color: COLORS.black, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('register')}>Create one</Text>
          </Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for Android status bar
  },
  scrollView: {
    flexGrow: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, // Add padding to move the content up
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 50,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  subMessage: {
    fontSize: 25,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
    backgroundColor: COLORS.glowingYeloow,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
    marginTop: 20,
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
    paddingLeft: 40, // Add padding to make space for the icon
  },
  buttonContainer: {
    paddingHorizontal: 20, // Add spacing inside the button
    paddingVertical: 10,   // Add vertical spacing
    marginTop: 20,
    alignSelf: 'center',   // Adjust position
    backgroundColor: COLORS.black,
    borderRadius: 0,
  },
  secondSubMessage: {
    fontSize: 18,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arial,
    marginTop: 20,
    backgroundColor: COLORS.glowingYeloow,
  },
});

export default Welcome;