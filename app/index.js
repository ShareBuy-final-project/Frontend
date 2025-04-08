import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { deleteAllTokens } from "../utils/userTokens"; 
import AppNavigator from "./AppNavigator";
import { SocketProvider } from '../context/SocketContext';
import { logout } from "../apiCalls/authApiCalls";
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
        <NavigationContainer>
            <SocketProvider>
                <AppNavigator />
            </SocketProvider>
        </NavigationContainer>
    );
}

registerRootComponent(App);

export default App;