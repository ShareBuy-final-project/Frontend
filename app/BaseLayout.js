import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback, Alert, I18nManager, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../apiCalls/authApiCalls';
import { isLoggedIn, getToken } from '../utils/userTokens';
import { COLORS, FONT } from '../constants/theme';
import { useSocket } from '../context/SocketContext';

const BaseLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-250)).current;
  const [business, setBusiness] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();
  const { chats } = useSocket();

  // Handle system UI and layout
  useEffect(() => {
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    
    if (Platform.OS === 'android') {
      // Reset sidebar state on Android
      setIsSidebarOpen(false);
      
      // Set status bar style
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#f5f5f5');
    }
  }, []);

  const getUnreadCount = () => chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);

  useEffect(() => {
    (async () => {
      const is_buisness = await getToken('isBusiness');
      const email = await getToken('email');
      setBusiness(is_buisness === 'true');
      setUserEmail(email);
    })();
  }, []);

  const handleLogout = async () => {
    if (await isLoggedIn()) {
      const res = await logout();
      if (res.status === 200) {
        Alert.alert('Logout Successful', 'You have successfully logged out!', [{ text: 'OK' }]);
        navigation.navigate('welcome');
      } else {
        Alert.alert('Error', 'Error logging out', [{ text: 'ERROR' }]);
      }
    } else {
      Alert.alert('Error', 'You are not logged in', [{ text: 'ERROR' }]);
    }
  };

  const handleNavigation = (route) => {
    closeSidebar();
    // Add a small delay to ensure sidebar is closed before navigation
    setTimeout(() => {
      navigation.navigate(route);
    }, Platform.OS === 'android' ? 100 : 0);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: -250,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setIsSidebarOpen(false));
  };

  const toggleSidebar = () => {
    isSidebarOpen ? closeSidebar() : openSidebar();
  };

  return (
    <View style={[styles.container, { direction: 'ltr' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      {/* Header */}
      <View style={[styles.header, { direction: 'ltr' }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerButton}>
          <Icon name="menu" size={30} color={COLORS.black} />
          {getUnreadCount() > 0 && (
            <View style={[styles.alertBadge, { backgroundColor: COLORS.glowingYeloow }]}>
              <Icon name="notifications" size={15} color={COLORS.black} />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={() => handleNavigation('home')}>
          <Icon name="home" size={30} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {/* Overlay */}
      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: sidebarAnimation }],
            left: 0,
            elevation: Platform.OS === 'android' ? 10 : 0,
            shadowColor: Platform.OS === 'android' ? '#000' : undefined,
            shadowOffset: Platform.OS === 'android' ? { width: 2, height: 0 } : undefined,
            shadowOpacity: Platform.OS === 'android' ? 0.5 : undefined,
            shadowRadius: Platform.OS === 'android' ? 5 : undefined,
          },
        ]}
      >
        <TouchableWithoutFeedback>
          <View>
            <Text style={styles.sidebarHeader}>{userEmail}</Text>

            <TouchableOpacity 
              style={styles.sidebarItem} 
              onPress={() => handleNavigation('personalInformation')}
            >
              <Icon name="person" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>{business ? 'Business Profile' : 'Profile'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => { handleNavigation('favorites'); }}>
              <Icon name="favorite" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => { business ? handleNavigation('history') : handleNavigation('purchaseHistory'); }}>
              <Icon name="history" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => { handleNavigation('myGroups'); }}>
              <Icon name="group" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>My Groups</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarItem} onPress={() => { handleNavigation('myChats'); }}>
              <Icon name="chat" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>My Chats</Text>
              {getUnreadCount() > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{getUnreadCount()}</Text>
                </View>
              )}
            </TouchableOpacity>

            {business && (
              <TouchableOpacity style={styles.sidebarItem} onPress={() => { handleNavigation('groups'); }}>
                <Icon name="business" size={20} color="#fff" style={styles.sidebarIcon} />
                <Text style={styles.sidebarItemText}>Business Groups</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.sidebarItem} onPress={async () => { await handleLogout(); closeSidebar(); }}>
              <Icon name="logout" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Content */}
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <View style={[styles.content, { direction: 'ltr' }]}>{children}</View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? 0 : 50,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 0 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 10,
    backgroundColor: '#f5f5f5',
    height: 50,
    alignItems: 'center',
  },
  hamburgerButton: { zIndex: 11 },
  homeButton: { zIndex: 11 },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#333',
    padding: 20,
    zIndex: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  sidebarHeader: {
    fontSize: 20,
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
  content: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: 60,
    padding: 10,
  },
  alertBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.glowingYeloow,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadBadge: {
    backgroundColor: COLORS.glowingYeloow,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BaseLayout;
