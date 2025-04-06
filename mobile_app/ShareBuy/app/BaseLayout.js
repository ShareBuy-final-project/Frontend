import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../apiCalls/authApiCalls';
import { isLoggedIn } from '../utils/userTokens';
import { getToken } from '../utils/userTokens';
import { COLORS, FONT } from '../constants/theme';
import { useSocket } from '../context/SocketContext'; // Import useSocket

const BaseLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnimation = useState(new Animated.Value(0))[0]; // Sidebar animation value
  const [business, setBusiness] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigation = useNavigation();
  const { chats } = useSocket(); // Get chats from SocketContext

  const getUnreadCount = () => {
    return chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  };

  useEffect(() => {
    const fetchIsBusiness = async () => {
      const is_buisness = await getToken('isBusiness');
      setBusiness(is_buisness === 'true');
    };
    fetchIsBusiness();
  }, []);

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await getToken('email');
      setUserEmail(email);
    };
    fetchEmail();
  }, []);

  const handleHomePress = () => {
    navigation.navigate('home');
    closeSidebar(); 
  };

  const handleFavoritesPress = () => {
    navigation.navigate('favorites'); 
    closeSidebar(); 
  };

  const handleProfilePress = () => {
    navigation.navigate('personalInformation');
    closeSidebar(); 
  };

  const handleHistoryPress= () => {
    business? navigation.navigate('history'): navigation.navigate('purchaseHistory');
    closeSidebar(); 
  }

  const handleCurrentGroupsPress= () => {
    navigation.navigate('myGroups');
    closeSidebar(); 
  }

  const handleCreatedGroupsPress= () => {
    navigation.navigate('groups')
    closeSidebar(); 
  }


  const handleLogout = async () => {
    if(await isLoggedIn()) {
      const res = await logout();
      if(res.status === 200) {
        Alert.alert('Logout Successful', 'You have successfully logged out!', [{ text: 'OK' }]);
        navigation.navigate('welcome');
      }
      else{
        Alert.alert('Error', 'Error logging out', [{ text: 'ERROR' }]);
      }
    }
    else{
      Alert.alert('Error', 'You are not logged in', [{ text: 'ERROR' }]);
    }
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
            {getUnreadCount() > 0 && (
              <View style={styles.alertBadge}>
                <Icon name="notifications" size={15} color={COLORS.black} />
              </View>
            )}
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
            <Text style={styles.sidebarHeader}>{userEmail}</Text>
            <TouchableOpacity style={styles.sidebarItem} onPress={handleProfilePress}>
              <Icon name="person" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>{business ? "Business Profile" : "Profile"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={handleFavoritesPress}>
              <Icon name="favorite" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={handleHistoryPress}>
              <Icon name="history" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={handleCurrentGroupsPress}>
              <Icon name="group" size={20} color="#fff" style={styles.sidebarIcon}/>
              <Text style={styles.sidebarItemText}>My Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('myChats')}>
              <Icon name="chat" size={20} color="#fff" style={styles.sidebarIcon}/>
              <Text style={styles.sidebarItemText}>My Chats</Text>
              {getUnreadCount() > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{getUnreadCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
            {business && (
            <TouchableOpacity style={styles.sidebarItem} onPress={handleCreatedGroupsPress}>
              <Icon name="business" size={20} color="#fff" style={styles.sidebarIcon} />
              <Text style={styles.sidebarItemText}>Business Groups</Text>
            </TouchableOpacity>)}
            <TouchableOpacity style={styles.sidebarItem} onPress={async () => {await handleLogout();}}>
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
    marginTop: 50,
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