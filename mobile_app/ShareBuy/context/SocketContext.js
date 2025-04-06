import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../utils/userTokens';
import io from 'socket.io-client';
import Constants from 'expo-constants';
import { getUserCurrentGroups } from '../apiCalls/groupApiCalls';
import { useNavigationState } from '@react-navigation/native'; // Import navigation state hook
import { getMyChats } from '../apiCalls/chatApiCalls'; // Import getMyChats API call

console.log("Creating SocketContext");
const SocketContext = createContext();

export const useSocket = () => {
  console.log("useSocket hook called");
  const context = useContext(SocketContext);
  if (!context) {
    console.error("useSocket - context is null!");
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  console.log("SocketProvider - Rendering");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null); // Add activeChat state
  const [chats, setChats] = useState([]); // Add chats state for MyChats logic
  const navigationState = useNavigationState((state) => state); // Get navigation state

  const initializeSocket = () => {
    console.log("initializeSocket called");
    if (socket) {
      console.log("Socket already exists, returning");
      return;
    }

    const baseRoute = Constants.expoConfig.extra.BASE_ROUTE;
    console.log("Creating new socket connection to: 'http://132.73.84.56:443/chat'");
    
    const newSocket = io('http://132.73.84.56:443/chat', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 2,
      reconnectionDelay: 1000
    });
    console.log("New socket created:");
    newSocket.on('connect', async () => {
      console.log('Socket connected successfully');
      setIsConnected(true);

      // Fetch user's groups and emit joinGroup for each
      try {
        const userGroups = await getUserCurrentGroups(1, Number.MAX_SAFE_INTEGER);
        userGroups.forEach(group => {
          console.log(`Emitting joinGroup for groupId: ${group.id}`);
          newSocket.emit('joinGroup', { groupId: group.id });
        });

        // Fetch chats and update unread count
        const chatsData = await getMyChats();
        setChats(chatsData);
      } catch (error) {
        console.error('Error fetching user groups or chats:', error);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const sendMessage = async (groupId, content) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }
    const userEmail = await getToken('email');
    console.log('Sending message:', { groupId, userEmail, content });
    socket.emit('sendMessage', { groupId, userEmail, content });
  };

  const updateLastSeen = async (groupId) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }
    const timestamp = new Date().toISOString();
    const userEmail = await getToken('email'); // Fetch the user's email
    console.log(`Updating last-seen for groupId: ${groupId} at ${timestamp} for user: ${userEmail}`);
    socket.emit('updateLastSeen', { groupId, timestamp, userEmail }); // Include userEmail

    // Reset unread count for the specific chat
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === groupId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  useEffect(() => {
    console.log("SocketProvider - useEffect running");
    return () => {
      console.log("SocketProvider - Cleanup running");
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', async (message) => {
        console.log('New message received:', message);

        const currentUserEmail = await getToken('email'); // Get the current user's email

        // Determine the sender
        const sender = message.userEmail === currentUserEmail ? "user" : message.userEmail;

        if (sender === "user") {
          console.log('Ignoring message sent by the current user:', message);
          return;
        }

        // Determine the current screen
        const currentRoute = navigationState?.routes?.[navigationState.index]?.name;

        if (currentRoute === 'ChatPage' && activeChat?.groupId === message.groupId) {
// Update activeChat if the user is in the ChatPage for this group
          setActiveChat((prev) => ({
            ...prev,
            messages: [...(prev?.messages || []), {
              id: message.id,
              text: message.content,
              sender,
              timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }],
          }));
        } else if (currentRoute === 'MyChats') {
// Update chats if the user is in MyChats
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === message.groupId
                ? {
                    ...chat,
                    lastMessage: message.content,
                    timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unreadCount: chat.unreadCount + 1,
                  }
                : chat
            )
          );
        }

        // Notify other components if needed
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, activeChat, navigationState]);

  const contextValue = {
    socket,
    isConnected,
    initializeSocket,
    disconnectSocket,
    sendMessage,
    activeChat, // Add activeChat to context value
    setActiveChat, // Add setActiveChat to context value
    chats, // Add chats to context value
    setChats, // Add setChats to context value
    updateLastSeen, // Add updateLastSeen to context value
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};