import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import * as LinkingExpo from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import BaseLayout from './BaseLayout';
import { COLORS } from '../constants/theme';
import { createBusinessConnectedAccount, generateBankRegistrationAccountLink } from '../apiCalls/paymentApiCalls';
import { registerBusiness } from '../apiCalls/userApiCalls';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const RegisterBusinessBankDetails = () => {
  const [accountId, setAccountId] = useState(null); // To store the Stripe account ID
  const [deepLinkHandled, setDeepLinkHandled] = useState(false); // To prevent duplicate handling of deep links
  const [isLoading, setIsLoading] = useState(false);  // Add this line
  const route = useRoute();
  const navigation = useNavigation();
  const { fullName,
    email,
    phone,
    password,
    state,
    city,
    street,
    streetNumber,
    zipCode,
    businessName,
    businessNumber,
    description,
    category,
    websiteLink,
    contactEmail } = route.params;
  /**
   * Configure Deep Linking with Expo
   */
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const { hostname } = LinkingExpo.parse(url);

      if (hostname === 'onboarding/success') {
        Alert.alert('Success', 'Business onboarding completed successfully!');
      } else if (hostname === 'onboarding/error') {
        Alert.alert('Error', 'Business onboarding failed. Please try again.');
      }
    };

    // Subscribe to deep links
    const subscription = LinkingExpo.addEventListener('url', handleDeepLink);

    // Cleanup the event listener on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (accountId) {  // Only trigger if accountId exists
      generateAccountLink();
    }
  }, [accountId]);  // This dependency array means the effect runs when accountId changes

  const handleNext = async () => {
    try {
      const response = await registerBusiness({
        fullName,
        email,
        phone,
        password,
        state,
        city,
        street,
        streetNumber,
        zipCode,
        businessName,
        businessNumber,
        description,
        category,
        websiteLink,
        contactEmail,
      });
      if (response.status === 201) {
        Toast.show({
          type: 'success',
        text1: 'Registration Successful 🎉',
        text2: 'You can now login to your account',
      });
      navigation.navigate('welcome');
    } 
    else {
      Alert.alert('Registration Error', response.data.error);
      throw new Error(response.data.error);
    }
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 201 range
      console.error('Registration Error:', error.response.data);
      Alert.alert('Registration Error', `Server Error: ${error.response.data.error}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Registration Error:', error.request);
      Alert.alert('Registration Error', 'No response from server. Please check your network connection.');
    } else {
      // Something else happened
      console.error('Registration Error:', error.message);
      Alert.alert('Registration Error', `An error occurred: ${error.message}`);
    }
  }
}
  /**
   * Step 1: Create a Connected Account
   */
  const createConnectedAccount = async () => {
    setIsLoading(true);  // Start loading
    try {
      const response = await createBusinessConnectedAccount(email);
      if (response.status !== 200) {
        throw new Error('Failed to create a connected account.');
      }
      const { id } = await response.data;
      setAccountId(id);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);  // End loading regardless of success/failure
    }
  };

  /**
   * Step 2: Generate an Account Link for Onboarding
   */
  const generateAccountLink = async () => {
    if (!accountId) {
      Alert.alert('Error', 'Please create a connected account first.');
      return;
    }

    try {
      const response = await generateBankRegistrationAccountLink(accountId);
      if (response.status !== 200) {
        throw new Error('Failed to generate an account link.');
      }

      const { url } = await response.data; // Get the account onboarding link

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        setDeepLinkHandled(false); // Reset the deep link handled flag
        await WebBrowser.openBrowserAsync(url); // Open the onboarding link in the browser
      } else {
        Alert.alert('Error', "Can't open the account link URL.");
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <BaseLayout>
        <View style={{ padding: 20 }}>
            <Text style={styles.headerText}>Secure Payment Setup</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoHeader}>You will be redirected to Stripe's secure platform to:</Text>
                <View style={styles.bulletPoints}>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Set up your business payment account</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Verify your identity</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Connect your bank account</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Enable secure payment processing</Text>
                    </View>
                </View>
                <Text style={styles.noteText}>This is a one-time setup required for receiving payments.</Text>
            </View>

            <TouchableOpacity 
                onPress={createConnectedAccount} 
                style={[styles.button, isLoading && styles.disabledButton]}
                disabled={isLoading}
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.white} />
                        <Text style={[styles.buttonText, styles.loadingText]}>
                            Creating Account...
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.buttonText}>Register bank details</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => {
                    if (accountId) {
                        handleNext();
                    }
                }} 
                style={[
                    styles.button,
                    { marginTop: 15, backgroundColor: accountId ? COLORS.black : COLORS.gray2 }
                ]}
                disabled={!accountId}
            >
                <Text style={[styles.buttonText, { color: accountId ? COLORS.white : COLORS.gray }]}>
                    Next
                </Text>
            </TouchableOpacity>
        </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 20,
        textAlign: 'center'
    },
    infoContainer: {
        backgroundColor: COLORS.lightWhite,
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    infoHeader: {
        fontSize: 18,
        color: COLORS.black,
        marginBottom: 15,
        fontWeight: '500'
    },
    bulletPoints: {
        marginLeft: 10,
        marginVertical: 10
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    bullet: {
        fontSize: 20,
        color: COLORS.black,
        marginRight: 10,
        color: COLORS.glowingYeloow
    },
    bulletText: {
        fontSize: 16,
        color: COLORS.gray,
        flex: 1
    },
    noteText: {
        fontSize: 14,
        color: COLORS.black,
        fontStyle: 'italic',
        marginTop: 15,
        textAlign: 'center',
        backgroundColor: COLORS.glowingYeloow,
        padding: 10,
        borderRadius: 5
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '80%',
        alignSelf: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        minHeight: 55,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: COLORS.gray2,
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    disabledText: {
        color: COLORS.gray
    }
});

export default RegisterBusinessBankDetails;
