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
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import BaseLayout from './BaseLayout';
import { sendMessage as sendMessageApi, getChatById } from '../apiCalls/chatApiCalls';
import { useSocket } from '../context/SocketContext';
import { getToken } from '../utils/userTokens';
import { useFocusEffect } from '@react-navigation/native';

const ChatPage = ({ route }) => {
  const { groupId, groupName, groupImage, owner, totalMessages } = route.params || { groupId: null, groupName: 'Group Name', groupImage: null, owner: false };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [hasMoreNewer, setHasMoreNewer] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [contentHeight, setContentHeight] = useState(0); // Track content height
  const flatListRef = useRef(null);
  const scrollPositionRef = useRef(null); // Initialize with null to detect the first scroll event
  const contentHeightRef = useRef(0); // Ref to track content height changes
  const isAdjustingScrollRef = useRef(false); // Ref to track if scroll adjustment is in progress
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

  const fetchMessages = async (pageNumber = 1, isOlder = true) => {
    if (!groupId) return;

    console.log('Fetching messages for groupId:', groupId, 'Page:', pageNumber, 'isOlder:', isOlder);

    setIsLoading(true);
    try {
      const currentUserEmail = await getToken('email');
      const response = await getChatById(groupId, pageNumber, 10); // Use page number for pagination

      const messages = response.messages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.userEmail === currentUserEmail ? "user" : msg.userEmail,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      if (isOlder) {
        setMessages(prev => [...messages, ...prev]); // Add older messages to the top
      } else {
        setMessages(prev => [...prev, ...messages]); // Add newer messages to the bottom
      }

      // Calculate if the current page is the last page
      //length of messages const:
      console.log('totalMessages:', totalMessages);

      //const totalMessages = messages.length || 0; // Assume totalMessages is provided in the response
      const totalPages = Math.ceil(totalMessages / 10); // Calculate total pages based on limit (10)
      console.log('Total messages:', totalMessages, 'Total pages:', totalPages, 'Current page:', pageNumber);

      console.log('setting hasMoreOlder:', hasMoreOlder && pageNumber > 1);
      console.log('setting hasMoreNewer:', messages.length < totalMessages && pageNumber < totalPages);

      console.log('messages length:', messages.length);

      setHasMoreNewer(messages.length < totalMessages && pageNumber < totalPages); // Update hasMoreNewer based on messages and page number
      setHasMoreOlder(prev => prev && pageNumber > 1); // Update hasMoreOlder based on messages and page number

      setActiveChat(prev => ({
        ...prev,
        messages: isOlder ? [...messages, ...(prev?.messages || [])] : [...(prev?.messages || []), ...messages],
      }));
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
      console.log('unreadCount', chat?.unreadCount);

      if (chat?.unreadCount > 0) {
        // Calculate the first page to fetch unread messages
        const limit = 10; // Number of messages per page
        const unreadPage = Math.ceil(chat.unreadCount / limit);

        // Fetch messages starting from the page containing the first unread message
        await fetchMessages(unreadPage, false);

        // Scroll to the unread messages banner
        if (flatListRef.current) {
          setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
        }
      } else {
        // Fetch the last page of messages if there are no unread messages
        const totalMessages = chat?.totalMessages || 0; // Assume totalMessages is provided in the chat object
        const lastPage = Math.ceil(totalMessages / 10) || 1; // Calculate the last page
        await fetchMessages(lastPage, false);

        // Scroll to the bottom after messages are loaded
        if (flatListRef.current) {
          setTimeout(() => flatListRef.current.scrollToEnd({ animated: false }), 100);
        }
      }
    };

    loadInitialMessages();
  }, [groupId]);

  const handleLoadOlderMessages = () => {
    console.log('Loading older messages...');
    if (!isLoading && hasMoreOlder && !isAdjustingScrollRef.current) {
      isAdjustingScrollRef.current = true; // Mark scroll adjustment as in progress
      const currentScrollOffset = scrollPositionRef.current || 0;
      const initialContentHeight = contentHeightRef.current; // Use ref to track initial content height

      console.log('Current scroll offset:', currentScrollOffset);
      console.log('Initial content height:', initialContentHeight);

      prevPage = page - 1; // Decrement page for older messages
      setPage(prevPage);

      fetchMessages(prevPage, true).then(() => {
        // Wait for the content height to stabilize
        const stabilizeContentHeight = () => {
          const updatedContentHeight = contentHeightRef.current; // Use ref to get updated content height
          const heightDifference = updatedContentHeight - initialContentHeight;

          console.log('Updated content height:', updatedContentHeight);
          console.log('Height difference:', heightDifference);

          // Adjust the scroll position to maintain the same view
          flatListRef.current?.scrollTo({ y: currentScrollOffset + heightDifference, animated: false });

          // Check if the content height has stabilized
          setTimeout(() => {
            const finalContentHeight = contentHeightRef.current;
            if (finalContentHeight === updatedContentHeight) {
              console.log('Content height stabilized:', finalContentHeight);
              isAdjustingScrollRef.current = false; // Reset the flag after stabilization
            } else {
              console.log('Content height changed again, retrying...');
              stabilizeContentHeight(); // Retry if the content height changed again
            }
          }, 100);
        };

        stabilizeContentHeight(); // Start checking for content height stabilization
      }).catch(() => {
        isAdjustingScrollRef.current = false; // Reset the flag in case of an error
      });
    }
  };

  const handleLoadNewerMessages = () => {
    console.log('Loading newer messages...');
    if (!isLoading && hasMoreNewer && !isAdjustingScrollRef.current) {
      isAdjustingScrollRef.current = true; // Mark scroll adjustment as in progress
      const currentScrollOffset = scrollPositionRef.current || 0;
      const initialContentHeight = contentHeightRef.current; // Use ref to track initial content height

      console.log('Current scroll offset:', currentScrollOffset);
      console.log('Initial content height:', initialContentHeight);
      const nextPage = page + 1; // Increment page for newer messages
      setPage(nextPage);

      fetchMessages(nextPage, false).then(() => {
        // Wait for the content height to stabilize
        const stabilizeContentHeight = () => {
          const updatedContentHeight = contentHeightRef.current; // Use ref to get updated content height
          const heightDifference = updatedContentHeight - initialContentHeight;

          console.log('Updated content height:', updatedContentHeight);
          console.log('Height difference:', heightDifference);

          // Adjust the scroll position to maintain the same view
          flatListRef.current?.scrollTo({ y: currentScrollOffset, animated: false });

          // Check if the content height has stabilized
          setTimeout(() => {
            const finalContentHeight = contentHeightRef.current;
            if (finalContentHeight === updatedContentHeight) {
              console.log('Content height stabilized:', finalContentHeight);
              isAdjustingScrollRef.current = false; // Reset the flag after stabilization
            } else {
              console.log('Content height changed again, retrying...');
              stabilizeContentHeight(); // Retry if the content height changed again
            }
          }, 100);
        };

        stabilizeContentHeight(); // Start checking for content height stabilization
      }).catch(() => {
        isAdjustingScrollRef.current = false; // Reset the flag in case of an error
      });
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

  const handleScroll = (event) => {
    
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const offsetY = event.nativeEvent.contentOffset.y;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;
    console.log('Scroll event:', { offsetY, layoutHeight, contentHeight, isLoading, hasMoreOlder });

    if (scrollPositionRef.current === null) {
      // First scroll event
      console.log('First scroll event:', { offsetY, layoutHeight, contentHeight });
      scrollPositionRef.current = currentScrollY;
    } else {
      // Subsequent scroll events
      const previousScrollY = scrollPositionRef.current;
      if (currentScrollY > previousScrollY) {
        console.log('Scrolling down');
        if (offsetY + layoutHeight >= contentHeight - 10 && !isLoading && hasMoreNewer) {
          console.log('Triggering handleLoadNewerMessages');
          handleLoadNewerMessages();
        }
      } else if (currentScrollY < previousScrollY) {
        console.log('Scrolling up');
        if (offsetY <= 10 && contentHeight > layoutHeight && !isLoading && hasMoreOlder) {
          console.log('Triggering handleLoadOlderMessages');
          handleLoadOlderMessages();
        }
      }
    }

    scrollPositionRef.current = currentScrollY; // Update the previous scroll position
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

        <View style={[styles.messagesListContainer, keyboardStatus ? styles.keyboardVisible : null]}>
          <ScrollView 
            ref={flatListRef}
            style={{ flex: 1, width: '100%', height: '100%' }}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 15, paddingBottom: 70 }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onContentSizeChange={(width, height) => {
              console.log('Updated content height:', height);
              setContentHeight(height); // Update state for rendering
              contentHeightRef.current = height; // Update ref for tracking
            }}
          >
            <TouchableWithoutFeedback>
              <View style={{width: '100%', paddingHorizontal: 15}}>
                {messages.length === 0 && !isLoading && (
                  <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
                )}
                
                {isLoading && hasMoreOlder && (
                  <Text style={styles.loadingText}>Loading messages...</Text>
                )}
                
                {messages.map((item, index) => {
                  const isUnreadBanner = unreadCount > 0 && index === messages.length - unreadCount;
                
                  return (
                    <React.Fragment key={`message-${item.id}-${index}`}>
                      {isUnreadBanner && (
                        <View style={styles.unreadBanner}>
                          <Text style={styles.unreadBannerText}>
                            {unreadCount} new message{unreadCount > 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}
                      <View 
                        style={[
                          styles.messageContainer,
                          item.sender === "user" ? styles.userMessage : styles.otherMessage
                        ]}
                      >
                        <View 
                          style={[
                            styles.messageBubble,
                            item.sender === "user" ? styles.userBubble : styles.otherBubble
                          ]}
                        >
                          <Text style={styles.senderText}>
                            {item.sender}
                          </Text>
                          <Text style={[
                            styles.messageText,
                            item.sender === "user" ? styles.userMessageText : styles.otherMessageText
                          ]}>{item.text}</Text>
                          <Text style={styles.timestamp}>{item.timestamp}</Text>
                        </View>
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
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
    height: '100%',
    flex: 1,
  },
  messagesListContainer: {
    width: '100%',
    backgroundColor: COLORS.lightWhite,
    flex: 1, // Changed from fixed height to flex: 1
  },
  keyboardVisible: {
    height: '100%', // Use full height when keyboard is open
  },
  messagesContainer: {
    padding: 15,
    width: '100%',
    paddingBottom: 20,
    minHeight: '100%',
    flexGrow: 1,
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
    position: 'absolute', // Added to fix at bottom
    bottom: 0, // Added to fix at bottom
    left: 0, // Added to fix at bottom
    right: 0, // Added to fix at bottom
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
  scrollViewContent: {
    padding: 15,
    width: '100%',
    paddingBottom: 20,
    minHeight: '100%',
    flexGrow: 1,
  },
  messagesContent: {
    padding: 15,
    width: '100%',
    paddingBottom: 20,
    minHeight: '100%',
    flexGrow: 1,
  },
});

export default ChatPage;

