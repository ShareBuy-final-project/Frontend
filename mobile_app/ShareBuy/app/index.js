import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { deleteAllTokens } from "../utils/userTokens"; 
import AppNavigator from "./AppNavigator";

function App() {
    useEffect(() => {
        // Clear the secure store when the app starts
        deleteAllTokens();
    }, []);

    return (
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
}

registerRootComponent(App);

export default App;