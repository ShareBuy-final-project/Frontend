import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { deleteAllTokens } from "../utils/userTokens"; 
import AppNavigator from "./AppNavigator";
import { SocketProvider } from '../context/SocketContext';
import { logout } from "../apiCalls/authApiCalls";
import { Provider as PaperProvider } from 'react-native-paper'; 

function App() {
    useEffect(() => {
        // Clear the secure store when the app starts
        try{
            console.log("Try to logout before render")
            logout()
        }
        catch{
            console.log("Couldn't logout, user already loggedout")
        }
    }, []);

    return (
        <PaperProvider> 
            <NavigationContainer>
                <SocketProvider>
                    <AppNavigator />
                </SocketProvider>
            </NavigationContainer>
        </PaperProvider>
    );
}

registerRootComponent(App);

export default App;