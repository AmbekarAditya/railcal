import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/HomeScreen';
import CalculationPage from './components/calcualtionPage/CalculationPage';
import SignInScreen from './signIN/signInScreen';
import { configureGoogleSignIn } from './firebase/google-services';

const Drawer = createDrawerNavigator();

const App = () => (
  <NavigationContainer>
  <Drawer.Navigator initialRouteName="SignIn">
    <Drawer.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }}/>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="CalculationPage" component={CalculationPage} />
  </Drawer.Navigator>
</NavigationContainer>
);

export default App;

