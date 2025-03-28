import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import BaseLayout from '../BaseLayout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT } from '../../constants/theme';
import DefaultPic from '../../assets/images/default_pic.png';

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // TODO: Replace with actual API call to get user's chats
  const getChats = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockChats = [
        {
          id: 1,
          groupName: "iPhone 15 Pro Group",
          lastMessage: "Hey, when is the next meeting?",
          timestamp: "10:30 AM",
          unreadCount: 2,
          image: null
        },
        {
          id: 2,
          groupName: "MacBook Air Group",
          lastMessage: "Great deal everyone!",
          timestamp: "Yesterday",
          unreadCount: 0,
          image: null
        },
        // Add more mock chats as needed
      ];
      setChats(mockChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatPage', { 
        groupId: item.id,
        groupName: item.groupName 
      })}
    >
      <View style={styles.chatImageContainer}>
        <Image 
          source={item.image ? { uri: item.image } : DefaultPic} 
          style={styles.chatImage}
        />
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.groupName}>{item.groupName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <BaseLayout>
      <View style={styles.container}>
        {chats.length === 0 && !isLoading ? (
          <Text style={styles.noChatsText}>You don't have any chats yet!</Text>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={isLoading && <Text style={styles.loadingText}>Loading chats...</Text>}
          />
        )}
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    width: '100%',
  },
  listContainer: {
    padding: 5,
    width: '100%',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray2,
    width: '100%',
  },
  chatImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.black,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONT.arialBold,
  },
  chatInfo: {
    flex: 1,
    width: '100%',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },
  groupName: {
    fontSize: 16,
    fontFamily: FONT.arialBold,
    color: COLORS.black,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: FONT.arial,
    color: COLORS.gray,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: FONT.arial,
    color: COLORS.gray,
    width: '100%',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
    color: COLORS.gray,
    fontFamily: FONT.arial,
  },
  noChatsText: {
    textAlign: 'center',
    marginVertical: 20,
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONT.arial,
  },
});

export default MyChats;