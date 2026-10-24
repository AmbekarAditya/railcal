import { enableScreens } from 'react-native-screens';
enableScreens();
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/HomeScreen';
import CalculationPage from './components/calcualtionPage/CalculationPage';
import SignInScreen from './signIN/signInScreen';
import { NeuColors } from './src/theme/neomorphicTheme';

const Drawer = createDrawerNavigator();

const App = () => (
  <NavigationContainer
    theme={{
      dark: false,
      colors: {
        primary: NeuColors.accent,
        background: NeuColors.background,
        card: NeuColors.surface,
        text: NeuColors.textPrimary,
        border: NeuColors.divider,
        notification: NeuColors.accent,
      },
    }}
  >
    <Drawer.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: NeuColors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: NeuColors.divider,
        },
        headerTintColor: NeuColors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: NeuColors.textPrimary,
        },
        drawerStyle: {
          backgroundColor: NeuColors.surface,
          width: 280,
        },
        drawerActiveTintColor: NeuColors.accent,
        drawerInactiveTintColor: NeuColors.textSecondary,
        sceneContainerStyle: {
          backgroundColor: NeuColors.background,
        },
      }}
    >
      <Drawer.Screen
        name="Log Out"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Home"
        component={HomeScreen as any}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="CalculationPage"
        component={CalculationPage as any}
        options={{ title: 'Allowance Sheet' }}
      />
    </Drawer.Navigator>
  </NavigationContainer>
);

export default App;
