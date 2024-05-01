import React, { useState } from 'react';
import firebase from './firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import CalculationPage from './components/CalculationPage';
const Stack = createNativeStackNavigator();

const GoogleSignInWeb: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CalculationPage" component={CalculationPage} />

        ) : (
          <Stack.Screen
            name="SignIn"
            component={() => (
              <div>
                <p>Welcome to the Sign-In Screen</p>
                <button onClick={signInWithGoogle}>Sign in with Google</button>
              </div>
            )}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default GoogleSignInWeb;