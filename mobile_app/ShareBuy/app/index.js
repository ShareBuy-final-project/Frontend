import React, { useEffect } from "react";
import { I18nManager } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { deleteAllTokens } from "../utils/userTokens"; 
import AppNavigator from "./AppNavigator";
import { SocketProvider } from '../context/SocketContext';
import * as SplashScreen from 'expo-splash-screen';
import { logout } from "../apiCalls/authApiCalls";
import * as Updates from 'expo-updates';

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
        try{
            console.log("Try to logout before render")
            logout()
        }
        catch{
            console.log("Couldn't logout, user already loggedout")
        }
    }, []);

    useEffect(() => {
      if (I18nManager.isRTL) {
        I18nManager.forceRTL(false);
        I18nManager.allowRTL(false);
        Updates.reloadAsync(); // force a reload once LTR is enforced
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