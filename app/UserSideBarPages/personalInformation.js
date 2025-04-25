import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
          <InputField icon="user" placeholder="Full Name" value={tempUserData.fullName} onChangeText={(text) => setTempUserData({ ...tempUserData, fullName: text })} label="Full Name" />
          <InputField icon="envelope" placeholder="Email" value={tempUserData.email} onChangeText={(text) => setTempUserData({ ...tempUserData, email: text })} label="Email" />
          <InputField icon="phone" placeholder="Phone" value={tempUserData.phone} onChangeText={(text) => setTempUserData({ ...tempUserData, phone: text })} label="Phone" />
          <TouchableOpacity style={styles.updateButton} onPress={handlePersonalUpdate}><Text style={styles.buttonText}>Update</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handlePersonalCancel}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
        </Card>
      )}

      {!isAddressEditable ? (
        <Card 
          title="Address"
          actionButton="Edit Address"
          onActionPress={() => setIsAddressEditable(true)}
        >
          <Text style={styles.infoText}>{userData.street} {userData.streetNumber}</Text>
          <Text style={styles.infoText}>{userData.city}, {userData.state}, {userData.zipCode}</Text>
        </Card>
      ) : (
        <Card title="Address">
          <InputField icon="map-marker" placeholder="Street" value={tempUserData.street} onChangeText={(text) => setTempUserData({ ...tempUserData, street: text })} label="Street" />
          <InputField icon="map-marker" placeholder="Street Number" value={tempUserData.streetNumber} onChangeText={(text) => setTempUserData({ ...tempUserData, streetNumber: text })} label="Street Number" />
          <InputField icon="map-marker" placeholder="City" value={tempUserData.city} onChangeText={(text) => setTempUserData({ ...tempUserData, city: text })} label="City" />
          <InputField icon="map-marker" placeholder="State" value={tempUserData.state} onChangeText={(text) => setTempUserData({ ...tempUserData, state: text })} label="State" />
          <InputField icon="map-marker" placeholder="Zip Code" value={tempUserData.zipCode} onChangeText={(text) => setTempUserData({ ...tempUserData, zipCode: text })} label="Zip Code" />
          <TouchableOpacity style={styles.updateButton} onPress={handleAddressUpdate}><Text style={styles.buttonText}>Update</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleAddressCancel}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
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
  const validatePassword = (password) => setIsPasswordValid(regex.test(password));

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return Alert.alert('Error', 'All fields must be filled');
    if (currentPassword === newPassword) return Alert.alert('Error', 'New password must be different from current password');
    if (newPassword !== confirmPassword) return Alert.alert('Error', 'Passwords do not match');
    if (!isPasswordValid) return Alert.alert('Error', 'New password does not meet requirements');
    try {
      const status = await changePassword({ currentPassword, newPassword });
      Alert.alert('Success', status);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.passwordContainer}>
        <View style={styles.inputWrapper}>
          <InputField icon="lock" placeholder="Current Password" value={currentPassword} onChangeText={setCurrentPassword} label="Current Password" secureTextEntry={true} marginBottom={20} />
        </View>
        <View style={styles.inputWrapper}>
          <InputField icon="lock" placeholder="New Password" value={newPassword} onChangeText={(text) => { setNewPassword(text); validatePassword(text); }} label="New Password" secureTextEntry={true} marginBottom={20} borderColor={newPassword ? (isPasswordValid ? COLORS.green : COLORS.red) : COLORS.black} />
          <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.infoButton}><Icon name="info-circle" size={20} color={COLORS.gray} /></TouchableOpacity>
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
          <InputField icon="lock" placeholder="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} label="Confirm New Password" secureTextEntry={true} marginBottom={10} borderColor={confirmPassword ? (newPassword === confirmPassword ? COLORS.green : COLORS.red) : COLORS.black} />
        </View>
        {confirmPassword && (
          <Text style={[styles.matchLabel, { color: newPassword === confirmPassword ? COLORS.green : COLORS.red }]}> {newPassword === confirmPassword ? "Passwords match!" : "Passwords don't match!"} </Text>
        )}
        <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}><Text style={styles.buttonText}>Change Password</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const PersonalInformation = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState({ fullName: '', email: '', phone: '', state: '', city: '', street: '', streetNumber: '', zipCode: '' });
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPersonalInformation();
        if (isMounted) {
          setUserData(data);
          setOriginalData(data);
        }
      } catch (error) {
        Alert.alert('Fetch Error', `An error occurred: ${error.message}`);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <BaseLayout>
        <View style={styles.loadingContainer}><Text>Loading...</Text></View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <View style={styles.container}>
        <View style={styles.tabBarContainer}>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'personal' && styles.tabButtonActive]} onPress={() => setActiveTab('personal')}><Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}>Personal Data</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'password' && styles.tabButtonActive]} onPress={() => setActiveTab('password')}><Text style={[styles.tabText, activeTab === 'password' && styles.tabTextActive]}>Password Change</Text></TouchableOpacity>
        </View>
        <View style={styles.tabContent}>
          {activeTab === 'personal' ? (
            <PersonalData userData={userData} setUserData={setUserData} originalData={originalData} setOriginalData={setOriginalData} />
          ) : (
            <PasswordChange />
          )}
        </View>
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  tabBarContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f5f5f5', paddingVertical: 10, elevation: 2 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20 },
  tabButtonActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, color: COLORS.black, fontFamily: FONT.arialBold },
  tabTextActive: { color: COLORS.white },
  tabContent: { flex: 1, width: '100%' },
  infoText: { fontSize: 16, marginBottom: 5, color: COLORS.black },
  updateButton: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 5, marginTop: 10, width: '100%' },
  cancelButton: { backgroundColor: COLORS.secondary, padding: 10, borderRadius: 5, marginTop: 10, width: '100%' },
  buttonText: { color: COLORS.white, fontSize: 18, textAlign: 'center' },
  passwordContainer: { width: '100%', alignItems: 'center' },
  inputWrapper: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' },
  infoContainer: { width: '80%', backgroundColor: '#f5f5f5', padding: 10, borderRadius: 5, marginBottom: 10, alignItems: 'center' },
  infoTextBold: { color: COLORS.black, fontSize: 14, fontWeight: 'bold', marginBottom: 5, textAlign: 'left', width: '100%' },
  matchLabel: { fontSize: 14, marginBottom: 20 },
  changePasswordButton: { backgroundColor: COLORS.purple, padding: 15, borderRadius: 5, width: '60%', alignItems: 'center', marginTop: 20 },
  infoButton: { position: 'absolute', right: 10, top: '50%', marginTop: -10 }
});

export default PersonalInformation;
