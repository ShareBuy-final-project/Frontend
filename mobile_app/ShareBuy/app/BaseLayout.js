import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BaseLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useState(new Animated.Value(0))[0]; // Sidebar animation value
  const [business, setBusiness] = useState(false);
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate('home');
  };

  const handleFavoritesPress = () => {
    navigation.navigate('favorites'); // Navigate to the FavoritesPage
    closeSidebar(); // Close sidebar after navigating
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
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerButton}>
            <Icon name="menu" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
            <Icon name="home" size={30} color="#000" />
          </TouchableOpacity>
        </View>

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
            <TouchableOpacity style={styles.sidebarItem}>
              <Icon name="person" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>{business ? "Business Profile" : "Profile"}</Text>
            </TouchableOpacity>
            {!business && (
            <TouchableOpacity style={styles.sidebarItem} onPress={handleFavoritesPress}>
              <Icon name="favorite" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Favorites</Text>
            </TouchableOpacity>)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 10,
  },
  hamburgerButton: {
    zIndex: 11,
  },
  homeButton: {
    zIndex: 11,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#333',
    padding: 20,
    zIndex: 10,
    elevation: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  sidebarIcon: {
    marginRight: 10,
  },
  sidebarItemText: {
    color: '#fff',
    fontSize: 18,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
    padding: 10,
  },
});

export default BaseLayout;
