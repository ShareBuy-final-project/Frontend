import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Platform, Alert, Image } from 'react-native';
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
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
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

  const fetchMessages = async (pageNumber = 1) => {
    if (!groupId) return;
    
    setIsLoading(true);
    try {
      const currentUserEmail = await getToken('email');
      const response = await getChatById(groupId, pageNumber);

      const formattedMessages = response.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.userEmail === currentUserEmail ? "user" : msg.userEmail,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwner: owner
      }));

      if (pageNumber === 1) {
        setMessages(formattedMessages);
        setActiveChat(prev => ({ ...prev, messages: formattedMessages }));
      } else {
        setMessages(prev => [...formattedMessages, ...prev]);
        setActiveChat(prev => ({ ...prev, messages: [...formattedMessages, ...(prev?.messages || [])] }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1);
  }, [groupId]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
      fetchMessages(page + 1);
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
              {item.isOwner && <Text style={styles.ownerTag}> (Owner)</Text>}
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
      <SafeAreaView style={styles.container}>
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

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          refreshing={isLoading}
          onRefresh={() => fetchMessages(1)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
            )
          }
          ListFooterComponent={
            isLoading && hasMore && (
              <Text style={styles.loadingText}>Loading older messages...</Text>
            )
          }
        />

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
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    width: '100%',
  },
  header: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
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
    flex: 1,
    width: '100%',
  },
  messagesContainer: {
    padding: 15,
    width: '100%',
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

