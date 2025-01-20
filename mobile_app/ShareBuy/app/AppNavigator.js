import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Welcome from './welcome';
import CheckoutScreen from './pay';
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
import PersonalInformation from './UserSideBarPages/personalInformation';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="CheckoutScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
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
        <Stack.Screen name="personalInformation" component={PersonalInformation} />
        {/* Add other screens here */}
      </Stack.Navigator>
      <Toast/>
    </>
  );
};

export default AppNavigator;