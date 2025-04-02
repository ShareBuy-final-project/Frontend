import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../utils/userTokens';
import io from 'socket.io-client';
import Constants from 'expo-constants';
import { getUserCurrentGroups } from '../apiCalls/groupApiCalls'; 

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
      } catch (error) {
        console.error('Error fetching user groups:', error);
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

  useEffect(() => {
    console.log("SocketProvider - useEffect running");
    return () => {
      console.log("SocketProvider - Cleanup running");
      disconnectSocket();
    };
  }, []);

  const contextValue = {
    socket,
    isConnected,
    initializeSocket,
    disconnectSocket,
    sendMessage,
    activeChat, // Add activeChat to context value
    setActiveChat // Add setActiveChat to context value
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};