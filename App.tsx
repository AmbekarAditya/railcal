import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import HomeScreen from './components/HomeScreen';
import CalculationPage from './components/CalculationPage';
// import DetailsScreen from './firstscreen/details_screen';

const Drawer = createDrawerNavigator();

type RootDrawerParamList = {
  Home: undefined;
  // Details: undefined;
};

type HomeScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Home'>;
// type DetailsScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Details'>;

interface AppNavigatorProps {
  navigation: HomeScreenNavigationProp ;
}

const AppNavigator: React.FC<AppNavigatorProps> = () => {

  console.log('Rendering navigation container');

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="CalculationPage" component={CalculationPage} />

      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;