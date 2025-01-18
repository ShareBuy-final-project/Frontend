import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert, FlatList, Image } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { useNavigation } from '@react-navigation/native';
import BaseLayout from './BaseLayout';

const NewDealBasics = () => {
  const navigation = useNavigation();
  const [dealName, setDealName] = useState('');
  const [amountBefore, setAmountBefore] = useState('');
  const [amountAfter, setAmountAfter] = useState('');
  const [minimumAmount, setMinimumAmount] = useState('');

  const handleNext = () => {
    if (!dealName) {
      Alert.alert('Invalid Input', 'Deal Name field must be filled in.');
    } else if (!amountBefore) {
      Alert.alert('Invalid Input', 'Amount Before field must be filled in.');
    } else if (!amountAfter) {
      Alert.alert('Invalid Input', 'Amount After field must be filled in.');
    } else if (!minimumAmount) {
      Alert.alert('Invalid Input', 'Minimum Amount of Products must be provided.');
    } else {
      navigation.replace('NewDealDetails', {
        dealName,
        amountBefore,
        amountAfter,
        minimumAmount
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.inputWrapper}>
      {item}
    </View>
  );

  const data = [
    <Text style={styles.header} key="header">
      Tell us about your awesome deal idea!
    </Text>,
    <View key="dealNameWrapper" style={styles.inputWrapper}>
      <InputField
        key="dealName"
        icon="tag"
        placeholder="Deal Name"
        keyboardType="default"
        value={dealName}
        onChangeText={setDealName}
        label="Deal Name"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
    <View key="amountBeforeWrapper" style={styles.inputWrapper}>
      <InputField
        key="amountBefore"
        icon="dollar"
        placeholder="Amount Before"
        keyboardType="numeric"
        value={amountBefore}
        onChangeText={setAmountBefore}
        label="Amount Before"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
    <View key="amountAfterWrapper" style={styles.inputWrapper}>
      <InputField
        key="amountAfter"
        icon="dollar"
        placeholder="Amount After"
        keyboardType="numeric"
        value={amountAfter}
        onChangeText={setAmountAfter}
        label="Amount After"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
    <View key="minimumAmountWrapper" style={styles.inputWrapper}>
      <InputField
        key="minimumAmount"
        icon="sort-numeric-asc"
        placeholder="Minimum Amount of Products"
        keyboardType="numeric"
        value={minimumAmount}
        onChangeText={setMinimumAmount}
        label="Minimum Amount of Products"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
        <View style={[styles.buttonContainer, { marginTop: 40 }]}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>next</Text>
          <Icon name="arrow-right" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
];

  return (
    <BaseLayout>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.scrollView}
        />
      </SafeAreaView>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  mandatory: {
    color: COLORS.red,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: FONT.arial,
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

export default NewDealBasics;
