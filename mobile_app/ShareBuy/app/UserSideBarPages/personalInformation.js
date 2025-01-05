import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { COLORS, FONT } from '../../constants/theme';
import InputField from '../../components/InputField';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import BaseLayout from '../BaseLayout';

const PersonalData = ({ userData, setUserData, isEditable, setIsEditable }) => {
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://132.73.84.56:443/user/data');
        setUserData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        console.error('Fetch Error:', error.message);
        Alert.alert('Fetch Error', `An error occurred: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.put('http://132.73.84.56:443/user/update', userData);
      if (response.data.message === 'User updated successfully') {
        Alert.alert('Success', 'User data updated successfully');
        setIsEditable(false);
        setOriginalData(userData);
      } else {
        Alert.alert('Update Error', response.data.error);
      }
    } catch (error) {
      console.error('Update Error:', error.message);
      Alert.alert('Update Error', `An error occurred: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditable(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <InputField
        icon="user"
        placeholder="Full Name"
        value={userData.fullName}
        onChangeText={(text) => setUserData({ ...userData, fullName: text })}
        editable={isEditable}
      />
      <InputField
        icon="envelope"
        placeholder="Email"
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
        editable={isEditable}
      />
      <InputField
        icon="phone"
        placeholder="Phone"
        value={userData.phone}
        onChangeText={(text) => setUserData({ ...userData, phone: text })}
        editable={isEditable}
      />
      <InputField
        icon="map-marker"
        placeholder="State"
        value={userData.state}
        onChangeText={(text) => setUserData({ ...userData, state: text })}
        editable={isEditable}
      />
      <InputField
        icon="map-marker"
        placeholder="City"
        value={userData.city}
        onChangeText={(text) => setUserData({ ...userData, city: text })}
        editable={isEditable}
      />
      <InputField
        icon="map-marker"
        placeholder="Street"
        value={userData.street}
        onChangeText={(text) => setUserData({ ...userData, street: text })}
        editable={isEditable}
      />
      <InputField
        icon="map-marker"
        placeholder="Street Number"
        value={userData.streetNumber}
        onChangeText={(text) => setUserData({ ...userData, streetNumber: text })}
        editable={isEditable}
      />
      <InputField
        icon="map-marker"
        placeholder="Zip Code"
        value={userData.zipCode}
        onChangeText={(text) => setUserData({ ...userData, zipCode: text })}
        editable={isEditable}
      />
      {isEditable ? (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Update Personal Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.manageButton} onPress={() => setIsEditable(true)}>
          <Text style={styles.buttonText}>Manage Data</Text>
        </TouchableOpacity>
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
      const response = await axios.put('http://132.73.84.56:443/user/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        Alert.alert('Success', 'Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', response.data.message);
      }
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

  const [isEditable, setIsEditable] = useState(false);

  const renderScene = SceneMap({
    personalData: () => <PersonalData userData={userData} setUserData={setUserData} isEditable={isEditable} setIsEditable={setIsEditable} />,
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
  saveButton: {
    backgroundColor: COLORS.success,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
    color: COLORS.black,
    fontSize: 14,
    textAlign: 'left',
    width: '100%', 
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
    backgroundColor: COLORS.primary,
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
});

export default PersonalInformation;
