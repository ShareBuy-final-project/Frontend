import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, View, TextInput, StyleSheet, Alert, Text, Platform, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from '../apiCalls/authApiCalls';
import { saveToken } from '../utils/userTokens';
import { useSocket } from '../context/SocketContext';
import { getMyChats } from '../apiCalls/chatApiCalls';
import io from 'socket.io-client';
console.log("Welcome - Component file loaded");

const Welcome = () => {
  console.log("Welcome - Component rendering");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  
  console.log("Welcome - Starting to use socket context");
  const socketContext = useSocket();
  
  const handleSignIn = async () => {
    console.log('handleSignIn - START');
    try {
      if (email == '' || password == '') {
        Alert.alert('Please fill in all fields!');
        return;
      }
      const res = await login(email, password);
      await saveToken('isBusiness', res.isBusiness.toString());
      
      // Initialize socket connection after successful login
      console.log("Welcome - Attempting to initialize socket");
      if (typeof socketContext.initializeSocket === 'function') {
        socketContext.initializeSocket();
      } else {
        console.error("Welcome - initializeSocket is not a function:", socketContext);
        Alert.alert('Error', 'Failed to initialize chat connection');
        return;
      }

      // Fetch chats and update unread count
      // const chatsData = await getMyChats();
      // socketContext.setChats(chatsData);
      
      Alert.alert('Login Successful', 'You have successfully logged in!', [{ text: 'OK' }]);
      navigation.navigate('home');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Make sure the email and password are correct!');
    }
  };

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
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignIn}>
          <Text style={{color : COLORS.white}}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.messageContainer}>
          <Text style={styles.secondSubMessage}>
            don't have an account? <Text style={{ color: COLORS.black, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('registerTypeSelection')}>Create one</Text>
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