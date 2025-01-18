import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './welcome';
import Register from './register';
import RegisterTypeSelection from './registerTypeSelection';
import RegisterBusinessDetails from './registerBusinessDetails';
import RegisterLocation from './registerLocation';
import RegisterBusinessContactInfo from './registerBusinessContactInfo';
import RegisterPassword from './registerPassword';
import FavoritesPage from './favorites';
import home from './home';
import NewDealBasics from './NewDealBasics';
import DealPage from './DealPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="registerPassword" component={RegisterPassword} />
        <Stack.Screen name="registerTypeSelection" component={RegisterTypeSelection} />
        <Stack.Screen name="registerBusinessDetails" component={RegisterBusinessDetails} />
        <Stack.Screen name="registerLocation" component={RegisterLocation} />
        <Stack.Screen name="registerBusinessContactInfo" component={RegisterBusinessContactInfo} />
        <Stack.Screen name="favorites" component={FavoritesPage} />
        <Stack.Screen name="NewDealBasics" component={NewDealBasics} />
        <Stack.Screen name="DealPage" component={DealPage} />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
