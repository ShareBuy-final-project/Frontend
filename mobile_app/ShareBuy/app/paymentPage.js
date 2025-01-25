import { StripeProvider } from '@stripe/stripe-react-native';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Modal, ActivityIndicator} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import BaseLayout from './BaseLayout';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CheckBox } from 'react-native-elements'; 
import TermsOfUse from '../components/TermsOfUse';
import DropDown from '../components/DropDown'; 
import {createPaymentIntent} from '../apiCalls/groupApiCalls';
import {updatePaymentConfirmed} from '../apiCalls/paymentApiCalls';
import Toast from 'react-native-toast-message';


const CheckoutScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const route = useRoute(); 
  let { name, price, groupId} = route.params;
  price = parseFloat(price.replace("$", ""));
  const  dealDetails  = {name, price, groupId};

  const [isTermsVisible, setIsTermsVisible] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [amount, setAmount] = useState(1);

  const setupPaymentSheet = async () => {
      try{
        const response = await createPaymentIntent(dealDetails.groupId, amount);
        if(response.error){
          return {error: response.error};
        }
        const {     
          paymentIntent,
          ephemeralKey,
          customer,
          publishableKey,
          paymentIntentId } = response;
          
        const { error } = await initPaymentSheet({
          customerId: customer,
          merchantDisplayName: 'Merchant Name',
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
          //methods that complete payment after a delay, like SEPA Debit and Sofort.
          allowsDelayedPaymentMethods: true,
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
          console.log('Error initializing Payment Sheet:', error);
          return {error};
        }
    
        console.log('Payment Sheet initialized successfully');
        return {paymentIntentId};
    }
    catch(error) {
      const errorMessage = error.response.data.error;
        console.log('Error setting up Payment Sheet:', errorMessage);
        return {error};
    }
  };

  const openPaymentSheet = async () => {
    if (!isConsentChecked) {
        Alert.alert(
            'Consent Required',
            'You must agree to the terms of use before proceeding.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'View Terms', onPress: () => setIsTermsVisible(true) }
            ]
        );
        return;
    }
    setIsLoading(true);
    const result = await setupPaymentSheet();
    if(result.error){
      Alert.alert(result.error);
      setIsLoading(false);
      return;
    }
    const { paymentIntentId } = result;
    setIsLoading(false);
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert('Error processing payment', error.message);
      
    } else {
      console.log('Payment authorized successfully.');
      setIsLoading(true);
      await updatePaymentConfirmed(paymentIntentId);
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Your payment was successful 🎉',
      });
      navigation.navigate('home')
    }
  };

  const totalPrice = dealDetails.price * amount; // Calculate total price
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f08080" />
      </View>
    );    
  }
  return (
      <BaseLayout>
          <StripeProvider publishableKey="pk_test_51Qg9a2GBz0nP5Loo5OXv3znrj1HFtp7pFa0cHkECXnvWbwAJFMYpYrvRLbw4An6eUmOM4EeUJ7BuhwgJj6JlUq1g003hKQsNBH">
              <View style={styles.container}>
                <Text style={styles.title}>{dealDetails?.name}</Text>
                <Text style={styles.description}>{dealDetails?.description}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>Price: ${totalPrice}</Text>
                  <DropDown
                      selectedValue={amount}
                      onValueChange={setAmount}
                      options={[...Array(10).keys()].map(i => ({ label: `${i + 1}`, value: i + 1 }))}
                      width='20%'
                  />
                </View>
              
              <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isTermsVisible}
                  onRequestClose={() => setIsTermsVisible(false)}
              >
                  <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                          <TermsOfUse />
                          <View style={styles.checkboxContainer}>
                              <CheckBox
                                  checked={isConsentChecked}
                                  onPress={() => setIsConsentChecked(!isConsentChecked)}
                              />
                              <Text style={styles.label}>I have read and agree to the terms of use</Text>
                          </View>
                          <TouchableOpacity onPress={() => setIsTermsVisible(false)}>
                              <Text style={styles.closeButton}>Close</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </Modal>
              <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.ProceedButton} onPress={openPaymentSheet}>
                      <Text style={styles.buttonText}>Proceed to Payment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsTermsVisible(true)}>
                      <Icon name="info" type="feather" size={24} />
                  </TouchableOpacity>
              </View>
              </View>
          </StripeProvider>
      </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
      flex: 1,
      padding: 15,
      backgroundColor: '#f9f9f9',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
    description: {
      fontSize: 16,
      color: '#555',
      marginVertical: 10,
      lineHeight: 22,
    },
    priceContainer: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    price: {
      fontSize: 18,
      color: '#f08080',
      fontWeight: 'bold',
      marginRight: 10,
    },
    dropDown: {
      width: 100, // Adjust width to make it smaller
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    ProceedButton: {
      backgroundColor: '#4caf50',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      justifyContent: 'center',
      marginRight: 10,
    },
    buttonText: {
      color: '#fff',
      marginLeft: 5,
      fontSize: 16,
    },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
  },
  closeButton: {
      marginTop: 20,
      color: '#007BFF',
      fontSize: 18,
  },

  checkboxContainer: {
      flexDirection: 'row',
      margin: 20,
      alignItems: 'center',
  },
  label: {
      marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',      
  },
});

export default CheckoutScreen;
