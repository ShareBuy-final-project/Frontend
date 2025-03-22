import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { deleteAllTokens } from "../utils/userTokens"; 
import AppNavigator from "./AppNavigator";
import { SocketProvider } from '../context/SocketContext';
function App() {
    useEffect(() => {
        // Clear the secure store when the app starts
        deleteAllTokens();
    }, []);

    return (
        <NavigationContainer>
            <SocketProvider>
                <AppNavigator />
            </SocketProvider>
        </NavigationContainer>
    );
}

registerRootComponent(App);

export default App;