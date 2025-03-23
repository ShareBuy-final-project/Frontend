import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Welcome from './welcome';
import CheckoutScreen from './paymentPage';
import Register from './register';
import RegisterTypeSelection from './registerTypeSelection';
import RegisterBusinessDetails from './registerBusinessDetails';
import RegisterLocation from './registerLocation';
import RegisterBusinessContactInfo from './registerBusinessContactInfo';
import RegisterPassword from './registerPassword';
import FavoritesPage from './UserSideBarPages/favorites'
import home from './home';
import NewDealBasics from './NewDealBasics';
import NewDealDetails from './NewDealDetails';
import DealPage from './DealPage';
import PersonalInformation from './UserSideBarPages/personalInformation';
import PurchasesHistory from './UserSideBarPages/purchasesHistory';
import MyGroups from './UserSideBarPages/myGroups';
import History from './BuisnessSideBarPages/history';
import Groups from './BuisnessSideBarPages/groups';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="registerBankDetails" component={registerBankDetails} />
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="registerPassword" component={RegisterPassword} />
        <Stack.Screen name="registerTypeSelection" component={RegisterTypeSelection} />
        <Stack.Screen name="registerBusinessDetails" component={RegisterBusinessDetails} />
        <Stack.Screen name="registerLocation" component={RegisterLocation} />
        <Stack.Screen name="registerBusinessContactInfo" component={RegisterBusinessContactInfo} />
        <Stack.Screen name="favorites" component={FavoritesPage} />
        <Stack.Screen name="NewDealBasics" component={NewDealBasics} />
        <Stack.Screen name="NewDealDetails" component={NewDealDetails} />
        <Stack.Screen name="DealPage" component={DealPage} />
        <Stack.Screen name="personalInformation" component={PersonalInformation} />
        <Stack.Screen name="purchaseHistory" component={PurchasesHistory} />
        <Stack.Screen name="myGroups" component={MyGroups} />
        <Stack.Screen name="history" component={History} />
        <Stack.Screen name="groups" component={Groups} />
      </Stack.Navigator>
      <Toast/>
    </>
  );
};

export default AppNavigator;