import React, { useState, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Platform, 
  Alert, 
  Image,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseLayout from './BaseLayout';
import { sendMessage as sendMessageApi, getChatById } from '../apiCalls/chatApiCalls';
import { useSocket } from '../context/SocketContext';
import { getToken } from '../utils/userTokens';
import { useFocusEffect } from '@react-navigation/native';

const ChatPage = ({ route }) => {
  const { groupId, groupName, groupImage, owner } = route.params || { groupId: null, groupName: 'Group Name', groupImage: null, owner: false };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [hasMoreNewer, setHasMoreNewer] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const flatListRef = useRef(null);
  const { activeChat, setActiveChat, sendMessage: sendMessageSocket, updateLastSeen, chats } = useSocket();

  useEffect(() => {
    if (groupId) {
      const chat = chats.find(chat => chat.id === groupId);
      setUnreadCount(chat?.unreadCount || 0);
      setActiveChat({ groupId, messages: [] });
      updateLastSeen(groupId);
    }
  }, [groupId]);

  useEffect(() => {
    if (activeChat?.groupId === groupId) {
      setMessages(activeChat.messages);
    }
  }, [activeChat]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('ChatPage is focused');
      return () => {
        console.log('Cleaning up ChatPage');
        if (groupId) {
          updateLastSeen(groupId);
        }
        setActiveChat(null);
      };
    }, [groupId])
  );

  const fetchMessages = async ({ pageNumber = 1 } = {}) => {
    if (!groupId) return;

    setIsLoading(true);
    try {
      const currentUserEmail = await getToken('email');
      const response = await getChatById(groupId, pageNumber, 10); // Fetch unread and read messages

      const unreadMessages = response.unreadMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.userEmail === currentUserEmail ? "user" : msg.userEmail,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUnread: true,
        isOwner: owner,
      }));

      const readMessages = response.readMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.userEmail === currentUserEmail ? "user" : msg.userEmail,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUnread: false,
        isOwner: owner,
      }));

      // Combine messages: read messages first, unread messages at the bottom
      const combinedMessages = [...readMessages, ...unreadMessages];

      setMessages(prev => [...combinedMessages, ...prev]);
      setHasMoreOlder(readMessages.length === 10); // Check if more older messages exist

      setActiveChat(prev => ({
        ...prev,
        messages: [...(prev?.messages || []), ...combinedMessages],
      }));

      // Scroll to the bottom to show unread messages
      if (unreadMessages.length > 0 && flatListRef.current) {
        setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!groupId) return;

      const chat = chats.find(chat => chat.id === groupId);
      if (chat?.unreadCount > 0) {
        // Fetch unread messages
        await fetchMessages({ pageNumber: 1, direction: 'newer' });
      } else {
        // Fetch the last page of messages
        await fetchMessages({ pageNumber: 1, direction: 'older' });
      }
    };

    loadInitialMessages();
  }, [groupId]);

  const handleLoadOlderMessages = () => {
    if (!isLoading && hasMoreOlder) {
      setPage(prevPage => prevPage + 1);
      fetchMessages({ pageNumber: page + 1, direction: 'older' });
    }
  };

  const handleLoadNewerMessages = () => {
    if (!isLoading && hasMoreNewer) {
      setPage(prevPage => prevPage + 1);
      fetchMessages({ pageNumber: page + 1, direction: 'newer' });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !groupId) return;

    try {
      const tempMessage = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, tempMessage]);
      setActiveChat(prev => ({ ...prev, messages: [...(prev?.messages || []), tempMessage] }));
      setNewMessage('');

      sendMessageSocket(groupId, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setActiveChat(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== tempMessage.id)
      }));
    }
  };

  const renderMessage = ({ item, index }) => {
    const isUnreadBanner = unreadCount > 0 && index === messages.length - unreadCount;

    return (
      <>
        {isUnreadBanner && (
          <View style={styles.unreadBanner}>
            <Text style={styles.unreadBannerText}>
              {unreadCount} new message{unreadCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          item.sender === "user" ? styles.userMessage : styles.otherMessage
        ]}>
          <View style={[
            styles.messageBubble,
            item.sender === "user" ? styles.userBubble : styles.otherBubble
          ]}>
            <Text style={styles.senderText}>
              {item.sender}
              {/* {item.isOwner && <Text style={styles.ownerTag}> (Owner)</Text>} */}
            </Text>
            <Text style={[
              styles.messageText,
              item.sender === "user" ? styles.userMessageText : styles.otherMessageText
            ]}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <BaseLayout>
      <SafeAreaView style={styles.safeArea}>
        {/* Chat Header */}
        <View style={styles.header}>
          {groupImage && (
            <Image 
              source={groupImage ? { uri: groupImage } : null} 
              style={styles.groupImage} 
            />
          )}
          <Text style={styles.groupName}>{groupName}</Text>
        </View>

        <View style={[styles.messagesListContainer, keyboardStatus && styles.keyboardVisible]}>
          <View style={{ flex: 1}}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              refreshing={isLoading}
              onRefresh={() => fetchMessages({ pageNumber: 1 })}
              onEndReached={handleLoadOlderMessages}
              onEndReachedThreshold={0.5}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={false}
              alwaysBounceVertical={true}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 100,
              }}
              ListEmptyComponent={
                !isLoading && (
                  <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
                )
              }
              ListFooterComponent={
                isLoading && hasMoreOlder && (
                  <Text style={styles.loadingText}>Loading older messages...</Text>
                )
              }
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.gray}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Icon name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.glowingYeloow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    width: '100%',
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, 
  },
  groupName: {
    fontSize: 25,
    color: COLORS.black,
    fontFamily: FONT.arialBold,
  },
  messagesList: {
    width: '100%',
    flexGrow: 1,
  },
  messagesListContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.lightWhite,
    height: '70%', // Added height
  },
  keyboardVisible: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    width: '100%',
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 0,
  },
  userBubble: {
    backgroundColor: COLORS.lightPurple,
  },
  otherBubble: {
    backgroundColor: COLORS.lightYellow,
  },
  messageText: {
    fontSize: 18,
    fontFamily: FONT.arial,
  },
  userMessageText: {
    color: COLORS.black,
  },
  otherMessageText: {
    color: COLORS.black,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray,
    alignSelf: 'flex-end',
    marginTop: 5,
    fontFamily: FONT.arial,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray2,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 0,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontFamily: FONT.arial,
    fontSize: 18,
  },
  sendButton: {
    backgroundColor: COLORS.black,
    width: 40,
    height: 40,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  noMessagesText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONT.arial,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
    color: COLORS.gray,
    fontSize: 14,
    fontFamily: FONT.arial,
  },
  senderText: {
    fontSize: 14,
    fontFamily: FONT.arialBold,
    color: COLORS.gray,
    marginBottom: 2,
  },
  unreadBanner: {
    alignSelf: 'center',
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  unreadBannerText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONT.arialBold,
  },
  ownerTag: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: FONT.arialBold,
  },
});

export default ChatPage;

