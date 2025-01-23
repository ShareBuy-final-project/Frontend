
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../../constants/theme';

const PurchasesHistory = () => {
  // Implement purchases history section
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Purchases History</Text>
      {/* Add list of purchase history */}
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
});

export default PurchasesHistory;