import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Platform, Alert } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseLayout from './BaseLayout';
import { sendMessage as sendMessageApi, getChatById } from '../apiCalls/chatApiCalls';
import { useSocket } from '../context/SocketContext';

const ChatPage = ({ route }) => {
  const { groupId, groupName } = route.params || { groupId: null, groupName: 'Group Name' };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef(null);
  const { activeChat, setActiveChat, sendMessage: sendMessageSocket } = useSocket();

  useEffect(() => {
    if (groupId) {
      setActiveChat({ groupId, messages: [] });
    }
    return () => {
      setActiveChat(null);
    };
  }, [groupId]);

  const fetchMessages = async (pageNumber = 1) => {
    if (!groupId) return;
    
    setIsLoading(true);
    try {
      // const response = await getChatById(groupId, pageNumber);
      const response = [
        {
          id: 1,
          content: "Hello!",
          userEmail: "user1",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          content: "Hi, what a nice feature!",
          userEmail: "user2",
          createdAt: new Date().toISOString()
        }
      ];
      if (!response || response.length === 0) {
        setHasMore(false);
        return;
      }

      // Transform the API response to match our UI structure
      const formattedMessages = response.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.userEmail,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      // If it's the first page, replace messages. Otherwise, append to existing messages
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
      // Optimistically add the message to the UI
      const tempMessage = {
        id: Date.now(), // Temporary ID
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, tempMessage]);
      setActiveChat(prev => ({ ...prev, messages: [...(prev?.messages || []), tempMessage] }));
      setNewMessage('');

      // Send the message through both the API and socket
    //   await sendMessageApi(groupId, newMessage);
      sendMessageSocket(groupId, newMessage);
      
      // The socket listener will handle adding the actual message
      // No need to refresh messages here
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      // Remove the optimistic message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setActiveChat(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== tempMessage.id)
      }));
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === "user" ? styles.userMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={styles.senderText}>{item.sender}</Text>
        <Text style={[
          styles.messageText,
          item.sender === "user" ? styles.userMessageText : styles.otherMessageText
        ]}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <BaseLayout>
      <SafeAreaView style={styles.container}>
        {/* Chat Header */}
        <View style={styles.header}>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          refreshing={isLoading}
          onRefresh={() => fetchMessages(1)}
          //onEndReached={handleLoadMore}
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

        {/* Message Input */}
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
    padding: 15,
    backgroundColor: COLORS.glowingYeloow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
    width: '100%',
  },

  groupName: {
    fontSize: 25,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
    backgroundColor: COLORS.glowingYeloow,
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
    backgroundColor: COLORS.glowingYeloow,
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
});

export default ChatPage;

