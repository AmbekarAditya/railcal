import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from './firebase';

const GoogleSignInNative: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        const { idToken, accessToken } = result;
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
        await firebase.auth().signInWithCredential(credential);
      } else {
        console.log('Google sign-in cancelled');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <View>
      {user ? (
        <Text>Welcome, {user.displayName}</Text>
      ) : (
        <Button title="Sign in with Google" onPress={signInWithGoogle} />
      )}
    </View>
  );
};

export default GoogleSignInNative;