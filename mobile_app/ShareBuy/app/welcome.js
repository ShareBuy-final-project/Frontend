import React from 'react';
import { SafeAreaView, ScrollView, View, TextInput, StyleSheet, Button, Image, Text } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const Welcome = () => {
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
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color={COLORS.gray} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Sign In" color={COLORS.white} onPress={() => { /* Handle sign in */ }} />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.secondSubMessage}>
            don't have an account? <Text style={{ color: COLORS.black, textDecorationLine: 'underline' }} onPress={() => { /* Handle navigation to sign up */ }}>Create one</Text>
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
  },
  scrollView: {
    flexGrow: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  welcomeMessage: {
    fontSize: 50,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
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
    width: '25%',
    marginTop: 20,
    alignItems: 'center',
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
  iconContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Welcome;