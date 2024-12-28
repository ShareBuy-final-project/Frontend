import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './welcome';
import Register from './register';
import RegisterTypeSelection from './registerTypeSelection';
import RegisterBusinessDetails from './registerBusinessDetails';
import RegisterBusinessLocation from './registerBusinessLocation';
import RegisterBusinessContactInfo from './registerBusinessContactInfo';
import RegisterPassword from './registerPassword';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="registerPassword" component={RegisterPassword} />
        <Stack.Screen name="registerTypeSelection" component={RegisterTypeSelection} />
        <Stack.Screen name="registerBusinessDetails" component={RegisterBusinessDetails} />
        <Stack.Screen name="registerBusinessLocation" component={RegisterBusinessLocation} />
        <Stack.Screen name="registerBusinessContactInfo" component={RegisterBusinessContactInfo} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
