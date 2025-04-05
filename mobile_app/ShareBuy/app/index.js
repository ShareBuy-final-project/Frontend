import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { deleteAllTokens } from "../utils/userTokens"; 
import AppNavigator from "./AppNavigator";
import { SocketProvider } from '../context/SocketContext';
import * as SplashScreen from 'expo-splash-screen';
function App() {
    useEffect(() => {
        async function prepare() {
          try {
            await SplashScreen.preventAutoHideAsync();
            // load fonts, data, etc.
          } catch (e) {
            console.warn(e);
          } finally {
            await SplashScreen.hideAsync(); // <- This must be called!
          }
        }
      
        prepare();
      }, []);
      
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