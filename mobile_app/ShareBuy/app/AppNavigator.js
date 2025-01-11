import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Welcome from './welcome';
import Register from './register';
import RegisterTypeSelection from './registerTypeSelection';
import RegisterBusinessDetails from './registerBusinessDetails';
import RegisterLocation from './registerLocation';
import RegisterBusinessContactInfo from './registerBusinessContactInfo';
import RegisterPassword from './registerPassword';
import home from './home';
import PersonalInformation from './UserSideBarPages/personalInformation';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="registerPassword" component={RegisterPassword} />
        <Stack.Screen name="registerTypeSelection" component={RegisterTypeSelection} />
        <Stack.Screen name="registerBusinessDetails" component={RegisterBusinessDetails} />
        <Stack.Screen name="registerLocation" component={RegisterLocation} />
        <Stack.Screen name="registerBusinessContactInfo" component={RegisterBusinessContactInfo} />
        <Stack.Screen name="personalInformation" component={PersonalInformation} />
        {/* Add other screens here */}
      </Stack.Navigator>
      <Toast/>
    </>
  );
};

export default AppNavigator;