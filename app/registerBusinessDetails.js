import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField';
import { Menu } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

const RegisterBusinessDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fullName, email, phone, password, state, city, street, streetNumber, zipCode } = route.params;
  const [businessName, setBusinessName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

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
    { value: 'finance', label: 'Finance' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'construction', label: 'Construction' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'educational_services', label: 'Educational Services' },
    { value: 'arts', label: 'Arts' },
  ];

  const getCategoryLabel = (val) => {
    const found = categoryOptions.find((item) => item.value === val);
    return found ? found.label : 'Category';
  };

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
      <Text style={styles.label}>Category</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.menuButtonText}>{getCategoryLabel(category)}</Text>
            <Icon name="chevron-down" size={16} color={COLORS.gray2} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        }
      >
        {categoryOptions.filter(opt => opt.value !== '').map((item) => (
          <Menu.Item
            key={item.value}
            title={item.label}
            onPress={() => {
              setCategory(item.value);
              setMenuVisible(false);
            }}
          />
        ))}
      </Menu>
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
  label: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONT.arial,
    marginRight: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
    minWidth: 150,
  },
  menuButtonText: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONT.arial,
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