import React from 'react';
import { Text, StyleSheet } from 'react-native';
import BaseLayout from './BaseLayout'; // Adjust the path based on your folder structure

const Home = () => {
  return (
    <BaseLayout>
      <Text style={styles.contentText}>Welcome to the Home Page!</Text>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
