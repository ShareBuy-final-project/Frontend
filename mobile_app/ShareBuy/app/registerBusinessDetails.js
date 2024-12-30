import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import DropDown from '../components/DropDown';
import { useNavigation, useRoute } from '@react-navigation/native';

const RegisterBusinessDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, email, phone, password, state, city, street, streetNumber, zipCode } = route.params;
  const [businessName, setBusinessName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleNext = () => {
    if (!businessName) {
      Alert.alert('Invalid Input', 'Business Name field must be filled in.');
    } else if (!businessNumber) {
      Alert.alert('Invalid Input', 'Business Number field must be filled in.');
    } else if (!description) {
      Alert.alert('Invalid Input', 'Description field must be filled in.');
    } else if (!category) {
      Alert.alert('Invalid Input', 'Category must be selected.');
    } else {
      navigation.navigate('registerBusinessContactInfo', {
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
      });
    }
  };

  const categoryOptions = [
    { value: '', label: 'Category' },
    { value: 'retail', label: 'Retail' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education' },
    // Add more categories as needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.inputWrapper}>
      {item}
    </View>
  );

  const data = [
    <Text style={styles.header} key="header">
      What is your business name?
    </Text>,
    <View key="businessNameWrapper" style={styles.inputWrapper}>
      <InputField
        key="businessName"
        icon="building"
        placeholder="Business Name"
        keyboardType="default"
        value={businessName}
        onChangeText={setBusinessName}
        label="Business Name"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
    <View key="businessNumberWrapper" style={styles.inputWrapper}>
      <InputField
        key="businessNumber"
        icon="id-card"
        placeholder="Business Number"
        keyboardType="default"
        value={businessNumber}
        onChangeText={setBusinessNumber}
        label="Business Number"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
    <View key="categoryWrapper" style={styles.inputWrapper}>
      <DropDown
        key="category"
        selectedValue={category}
        onValueChange={setCategory}
        options={categoryOptions}
        label="Category"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
    <View key="descriptionWrapper" style={styles.inputWrapper}>
      <InputField
        key="description"
        icon="info-circle"
        placeholder="Description"
        keyboardType="default"
        value={description}
        onChangeText={setDescription}
        label="Description"
      />
      <Text style={styles.mandatory}>*</Text>
    </View>,
    <View style={[styles.buttonContainer, { marginTop: 60 }]} key="nextButtonWrapper">
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>next</Text>
        <Icon name="arrow-right" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollView}
      />
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
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    marginTop: 10,
  },
  mandatory: {
    color: 'red',
    marginLeft: 5,
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

export default RegisterBusinessDetails;