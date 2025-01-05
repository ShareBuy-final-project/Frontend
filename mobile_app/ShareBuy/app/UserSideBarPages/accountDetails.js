import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONT } from '../../constants/theme';
import InputField from '../../components/InputField';
import axios from 'axios';

const AccountDetails = () => {
  const handleDeleteAccount = async () => {
    // Implement account deletion logic
    Alert.alert('Warning', 'Account deletion is not implemented yet.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Details</Text>
      {/* Add fields for updating password */}
      <InputField
        icon="lock"
        placeholder="Current Password"
        secureTextEntry
      />
      <InputField
        icon="lock"
        placeholder="New Password"
        secureTextEntry
      />
      <InputField
        icon="lock"
        placeholder="Confirm New Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AccountDetails;
