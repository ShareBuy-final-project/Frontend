import { StripeProvider } from '@stripe/stripe-react-native';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

import {
    useStripe,
    initPaymentSheet,
    presentPaymentSheet,
  } from '@stripe/stripe-react-native';
import BaseLayout from './BaseLayout';
  export default CheckoutScreen = () => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
    const setupPaymentSheet = async () => {
      const response = await fetch('http://10.100.102.6:4000/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        Authorization: 'Bearer access-token', // Replace with your API token
        body: JSON.stringify({ amount: 5000 }), // Replace with your amount
      });
  
      const {     
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
        paymentIntentId } = await response.json();
  
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
        appearance: {
            colors: {
              primary: '#000000',
              background: '#ffffff',
              componentBackground: '#f3f3f3',
              componentBorder: '#c7c7c7',
              componentDivider: '#e3e3e3',
              primaryText: '#000000',
              secondaryText: '#666666',
              componentText: '#000000',
              placeholderText: '#999999',
            },
          },

      });
  
      if (error) {
        console.error('Error initializing Payment Sheet:', error);
        return;
      }
  
      console.log('Payment Sheet initialized successfully');
    };
  
    const openPaymentSheet = async () => {
      const { error } = await presentPaymentSheet();
  
      if (error) {
        console.error('Payment failed:', error.message);
      } else {
        console.log('Payment authorized successfully');
        // Notify your backend that the Payment Intent was confirmed
      }
    };
  
    return (
        <BaseLayout>
            <StripeProvider publishableKey="pk_test_51Qg9a2GBz0nP5Loo5OXv3znrj1HFtp7pFa0cHkECXnvWbwAJFMYpYrvRLbw4An6eUmOM4EeUJ7BuhwgJj6JlUq1g003hKQsNBH">
                <TouchableOpacity onPress={setupPaymentSheet}>
                    <Text>Setup Payment Sheet</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openPaymentSheet} >
                    <Text>pay</Text>
                </TouchableOpacity>
            </StripeProvider>
        </BaseLayout>
    );
  };
  