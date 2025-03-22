import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import Constants from 'expo-constants';

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

  const initializeSocket = () => {
    console.log("initializeSocket called");
    if (socket) {
      console.log("Socket already exists, returning");
      return;
    }

    const baseRoute = Constants.expoConfig.extra.BASE_ROUTE;
    console.log("Creating new socket connection to:", baseRoute);
    
    const newSocket = io('http://132.73.84.56:443/', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 2,
      reconnectionDelay: 1000
  });
    console.log("New socket created:");
    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
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

  const sendMessage = (message) => {
    if (!socket || !isConnected) {
      console.error('Socket not connected');
      return;
    }
    socket.emit('sendMessage', message);
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
    sendMessage
  };


  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};