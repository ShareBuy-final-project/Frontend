import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { COLORS, FONT } from '../../constants/theme';
import InputField from '../../components/InputField';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchPersonalInformation, updatePersonalInformation, changePassword } from '../../apiCalls/userApiCalls';
import BaseLayout from '../BaseLayout';
import Card from '../../components/Card';

const PersonalData = ({ userData, setUserData, originalData, setOriginalData }) => {
  const [isPersonalEditable, setIsPersonalEditable] = useState(false);
  const [isAddressEditable, setIsAddressEditable] = useState(false);
  const [tempUserData, setTempUserData] = useState({ ...userData });

  const handlePersonalUpdate = async () => {
    try {
      const personalData = {
        fullName: tempUserData.fullName,
        email: tempUserData.email,
        phone: tempUserData.phone,
      };
      const status = await updatePersonalInformation(personalData);
      Alert.alert('Success', status);
      setIsPersonalEditable(false);
      setUserData(tempUserData);
      setOriginalData(tempUserData);
    } catch (error) {
      Alert.alert('Update Error', `An error occurred: ${error.message}`);
    }
  };

  const handleAddressUpdate = async () => {
    try {
      const addressData = {
        state: tempUserData.state,
        city: tempUserData.city,
        street: tempUserData.street,
        streetNumber: tempUserData.streetNumber,
        zipCode: tempUserData.zipCode,
      };
      const status = await updatePersonalInformation(addressData);
      Alert.alert('Success', status);
      setIsAddressEditable(false);
      setUserData(tempUserData);
      setOriginalData(tempUserData);
    } catch (error) {
      Alert.alert('Update Error', `An error occurred: ${error.message}`);
    }
  };

  const handlePersonalCancel = () => {
    setTempUserData({
      ...tempUserData,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
    });
    setIsPersonalEditable(false);
  };

  const handleAddressCancel = () => {
    setTempUserData({
      ...tempUserData,
      state: userData.state,
      city: userData.city,
      street: userData.street,
      streetNumber: userData.streetNumber,
      zipCode: userData.zipCode,
    });
    setIsAddressEditable(false);
  };

  // Add useEffect to update tempUserData when userData changes
  useEffect(() => {
    setTempUserData(userData);
  }, [userData]);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {!isPersonalEditable ? (
        <Card 
          title="Personal Information"
          actionButton="Manage Data"
          onActionPress={() => setIsPersonalEditable(true)}
        >
          <Text style={styles.infoText}>Name: {userData.fullName}</Text>
          <Text style={styles.infoText}>Email: {userData.email}</Text>
          <Text style={styles.infoText}>Phone: {userData.phone}</Text>
        </Card>
      ) : (
        <Card title="Personal Information">
          <InputField
            icon="user"
            placeholder="Full Name"
            value={tempUserData.fullName}
            onChangeText={(text) => setTempUserData({ ...tempUserData, fullName: text })}
            label="Full Name"
          />
          <InputField
            icon="envelope"
            placeholder="Email"
            value={tempUserData.email}
            onChangeText={(text) => setTempUserData({ ...tempUserData, email: text })}
            label="Email"
          />
          <InputField
            icon="phone"
            placeholder="Phone"
            value={tempUserData.phone}
            onChangeText={(text) => setTempUserData({ ...tempUserData, phone: text })}
            label="Phone"
          />
          <TouchableOpacity style={styles.updateButton} onPress={handlePersonalUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handlePersonalCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </Card>
      )}

      {!isAddressEditable ? (
        <Card 
          title="Address"
          actionButton="Edit Address"
          onActionPress={() => setIsAddressEditable(true)}
        >
          <Text style={styles.infoText}>
            {userData.street} {userData.streetNumber}
          </Text>
          <Text style={styles.infoText}>
            {userData.city}, {userData.state}, {userData.zipCode}
          </Text>
        </Card>
      ) : (
        <Card title="Address">
          <InputField
            icon="map-marker"
            placeholder="Street"
            value={tempUserData.street}
            onChangeText={(text) => setTempUserData({ ...tempUserData, street: text })}
            label="Street"
          />
          <InputField
            icon="map-marker"
            placeholder="Street Number"
            value={tempUserData.streetNumber}
            onChangeText={(text) => setTempUserData({ ...tempUserData, streetNumber: text })}
            label="Street Number"
          />
          <InputField
            icon="map-marker"
            placeholder="City"
            value={tempUserData.city}
            onChangeText={(text) => setTempUserData({ ...tempUserData, city: text })}
            label="City"
          />
          <InputField
            icon="map-marker"
            placeholder="State"
            value={tempUserData.state}
            onChangeText={(text) => setTempUserData({ ...tempUserData, state: text })}
            label="State"
          />
          <InputField
            icon="map-marker"
            placeholder="Zip Code"
            value={tempUserData.zipCode}
            onChangeText={(text) => setTempUserData({ ...tempUserData, zipCode: text })}
            label="Zip Code"
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleAddressUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleAddressCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </Card>
      )}
    </ScrollView>
  );
};

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validatePassword = (password) => {
    setIsPasswordValid(regex.test(password));
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields must be filled');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isPasswordValid) {
      Alert.alert('Error', 'New password does not meet requirements');
      return;
    }

    try {
      const status = await changePassword({ currentPassword, newPassword });
      Alert.alert('Success', status);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.passwordContainer}>
        <View style={styles.inputWrapper}>
          <InputField
            icon="lock"
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            label="Current Password"
            secureTextEntry={true}
            marginBottom={20}
          />
        </View>
        
        <View style={styles.inputWrapper}>
          <InputField
            icon="lock"
            placeholder="New Password"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              validatePassword(text);
            }}
            label="New Password"
            secureTextEntry={true}
            marginBottom={20}
            borderColor={newPassword ? (isPasswordValid ? COLORS.green : COLORS.red) : COLORS.black}
          />
          <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.infoButton}>
            <Icon name="info-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {showInfo && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTextBold}>Password requirements:</Text>
            <Text style={styles.infoText}>- Be at least 8 characters long</Text>
            <Text style={styles.infoText}>- Contain at least one uppercase letter</Text>
            <Text style={styles.infoText}>- Contain at least one lowercase letter</Text>
            <Text style={styles.infoText}>- Contain at least one digit</Text>
            <Text style={styles.infoText}>- Contain at least one special character</Text>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <InputField
            icon="lock"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Confirm New Password"
            secureTextEntry={true}
            marginBottom={10}
            borderColor={confirmPassword ? (newPassword === confirmPassword ? COLORS.green : COLORS.red) : COLORS.black}
          />
        </View>

        {confirmPassword && (
          <Text style={[styles.matchLabel, { color: newPassword === confirmPassword ? COLORS.green : COLORS.red }]}>
            {newPassword === confirmPassword ? "Passwords match!" : "Passwords don't match!"}
          </Text>
        )}

        <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const PersonalInformation = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'personalData', title: 'Personal Data' },
    { key: 'passwordChange', title: 'Password Change' },
  ]);

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    street: '',
    streetNumber: '',
    zipCode: '',
  });

  const [originalData, setOriginalData] = useState({});
  //const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPersonalInformation();
        setUserData(data);
        setOriginalData(data);
      } catch (error) {
        console.error('Fetch Error:', error.message);
        Alert.alert('Fetch Error', `An error occurred: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const renderScene = SceneMap({
    personalData: () => <PersonalData userData={userData} setUserData={setUserData} originalData={originalData} setOriginalData={setOriginalData} />,
    passwordChange: PasswordChange,
  });

  return (
    <BaseLayout>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: '100%' }}
          style={styles.tabView}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: COLORS.primary }}
              style={styles.tabBar}
              labelStyle={styles.tabLabel}
              activeColor={COLORS.primary}
              inactiveColor={COLORS.black}
            />
          )}
        />
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#f5f5f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabLabel: {
    color: COLORS.black,
    fontFamily: FONT.arialBold,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  manageButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  // saveButton: {
  //   backgroundColor: COLORS.secondary,
  //   padding: 10,
  //   borderRadius: 5,
  //   marginTop: 20,
  // },
  cancelButton: {
    backgroundColor: COLORS.secondary,  // Using the new danger color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',  // Make buttons full width
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  infoContainer: {
    width: '80%',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center', 
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.black,
  },
  infoTextBold: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left', 
    width: '100%', 
  },
  matchLabel: {
    fontSize: 14,
    marginBottom: 20,
  },
  changePasswordButton: {
    backgroundColor: COLORS.purple,  // Changed from primary to purple
    padding: 15,
    borderRadius: 5,
    width: '60%',
    alignItems: 'center',
    marginTop: 20,
  },
  infoButton: {
    position: 'absolute',
    right: 10, 
    top: '50%',
    marginTop: -10,
  },
  updateButton: {
    backgroundColor: COLORS.primary,  // Using the new success color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',  // Make buttons full width
  },
});

export default PersonalInformation;
