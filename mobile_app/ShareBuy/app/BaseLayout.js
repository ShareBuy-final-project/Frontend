import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BaseLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useState(new Animated.Value(0))[0]; // Sidebar animation value
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate('home');
  };

  const handleProfilePress = () => {
    navigation.navigate('personalInformation');
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;
    setIsSidebarOpen(!isSidebarOpen);

    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {!isSidebarOpen && (
        <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerButton}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
      )}

      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [
              {
                translateX: sidebarAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-250, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableWithoutFeedback>
          <View>
            <Text style={styles.sidebarHeader}>Amit Levints</Text>
            <TouchableOpacity style={styles.sidebarItem} onPress={handleProfilePress}>
              <Icon name="person" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Icon name="history" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Icon name="group" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Active Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Icon name="logout" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Render the child content here */}
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <View style={styles.content}>{children}</View>
      </TouchableWithoutFeedback>

      <TouchableOpacity style={styles.houseButton} onPress={handleHomePress}>
        <Icon name="home" size={30} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.heartButton}>
        <Icon name="favorite" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1, // Make sure the hamburger is on top of other content
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#333', // Fully opaque black for testing
    padding: 20,
    zIndex: 10, // Higher than any other element
    elevation: 10, // For Android
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  sidebarHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  sidebarItem: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center them vertically
    paddingVertical: 15,
  },
  sidebarIcon: {
    marginRight: 10, // Add spacing between icon and text
  },
  sidebarItemText: {
    color: '#fff',
    fontSize: 18,
  },
  content: {
    flex: 1, // Take up remaining space
    alignItems: 'center', // Center the content horizontally
    marginTop: 60, // Adjust to avoid overlap with the hamburger button
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
  },
  houseButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    zIndex: 1, // Keep it above the other elements
  },
  heartButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 1, // Keep it above the other elements
  },
});

export default BaseLayout;
