import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, ScrollView, View, TextInput, StyleSheet, Alert, Text, Platform, TouchableOpacity, Animated, Easing } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { login } from '../apiCalls/authApiCalls';
import { saveToken } from '../utils/userTokens';
import { useSocket } from '../context/SocketContext';
import Toast from 'react-native-toast-message';

import { getMyChats } from '../apiCalls/chatApiCalls';
import InputField from '../components/InputField';
import io from 'socket.io-client';

const Welcome = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  
  const socketContext = useSocket();
  
  const handleSignIn = async () => {
    console.log('handleSignIn - START');
    try {
      if (email == '' || password == '') {
        Alert.alert('Please fill in all fields!');
        return;
      }
      console.log('handleSignIn - Validating input');
      setIsLoading(true);
      const res = await login(email, password);
      await saveToken('isBusiness', res.isBusiness.toString());
      
      // Initialize socket connection after successful login
      console.log("Welcome - Attempting to initialize socket");
      if (typeof socketContext.initializeSocket === 'function') {
        socketContext.initializeSocket();
      } else {
        Alert.alert('Error', 'Failed to initialize chat connection');
        return;
      }

      // Fetch chats and update unread count
      const chatsData = await getMyChats();
      socketContext.setChats(chatsData);
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'You have successfully logged in!',
        position: 'top',
        visibilityTime: 4000,
      });
      navigation.navigate('home');
    } catch (error) {
      Alert.alert('Login Failed', 'Make sure the email and password are correct!');
    }
  };

  const spinnerAnimation = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinnerAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinnerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name="spinner" size={50} color={'#f08080'} />
          </Animated.View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
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
          <InputField
            icon="envelope"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            marginLeft={20}
            marginRight={5}
            borderColor={email ? COLORS.black : COLORS.gray}
          />
          <InputField
            icon="lock"
            placeholder="Password"
            keyboardType="default"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            marginBottom={5}
            marginLeft={20}
            marginRight={5}
            borderColor={password ? COLORS.black : COLORS.gray}
          />
          <TouchableOpacity style={styles.buttonContainer} onPress={handleSignIn}>
            <Text style={{color : COLORS.white}}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.messageContainer}>
            <Text style={styles.secondSubMessage}>
              don't have an account? <Text style={{ color: COLORS.black, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('registerTypeSelection')}>Create one</Text>
            </Text>
          </View>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
    color: COLORS.gray,
    fontSize: 14,
    fontFamily: FONT.arial,
  },
  loadingIcon: {
    color: '#f08080',
    fontSize: 50,
    animation: 'spin 2s linear infinite', // Added CSS animation for spinning
  },
});

export default Welcome;