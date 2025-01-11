import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT } from '../../constants/theme';

const MyGroups = () => {
  // Implement my groups section
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Groups</Text>
      {/* Add list of groups the user joined */}
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

export default MyGroups;
