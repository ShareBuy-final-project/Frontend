import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './welcome';
import Register from './register';
import RegisterStep2 from './registerStep2';
import RegisterStep3Business from './registerStep3Business';
import RegisterStep4Business from './registerStep4Business';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="registerStep2" component={RegisterStep2} />
        <Stack.Screen name="registerStep3Business" component={RegisterStep3Business} />
        <Stack.Screen name="registerStep4Business" component={RegisterStep4Business} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
