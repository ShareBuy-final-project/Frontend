import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import * as LinkingExpo from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import BaseLayout from './BaseLayout';

const RegisterBusinessBankDetails = () => {
  const [accountId, setAccountId] = useState(null); // To store the Stripe account ID
  const [deepLinkHandled, setDeepLinkHandled] = useState(false); // To prevent duplicate handling of deep links

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

  /**
   * Step 1: Create a Connected Account
   */
  const createConnectedAccount = async () => {
    const u = LinkingExpo.createURL("/");
    console.log(u);
    try {
      const response = await fetch('http://10.100.102.6:8000/create-connected-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to create a connected account.');
      }

      const { id } = await response.json(); // Get the account ID
      setAccountId(id); // Store the account ID
      Alert.alert('Success', `Connected account created: ${id}`);
    } catch (error) {
      Alert.alert('Error', error.message);
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
      const response = await fetch('http://132.73.244.186:8000/create-account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId,  }),
        //url: LinkingExpo.createURL("/")
      });

      if (!response.ok) {
        throw new Error('Failed to generate an account link.');
      }

      const { url } = await response.json(); // Get the account onboarding link

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

  /**
   * Render the UI
   */
  return (
    <BaseLayout>
        <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Register Business Bank Details</Text>

        <TouchableOpacity onPress={createConnectedAccount} style={{ marginVertical: 10 }}>
            <Text style={{ color: 'blue', fontSize: 16 }}>Create Connected Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={generateAccountLink} style={{ marginVertical: 10 }}>
            <Text style={{ color: 'blue', fontSize: 16 }}>Generate Account Link</Text>
        </TouchableOpacity>
        </View>
    </BaseLayout>
  );
};

export default RegisterBusinessBankDetails;
