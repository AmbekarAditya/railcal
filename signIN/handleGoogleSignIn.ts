import { GoogleSignin,statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Platform, Alert } from 'react-native';

GoogleSignin.configure({
  webClientId: '142052743063-he47ba59ocqbqphde7550n3bp14qafom.apps.googleusercontent.com', // replace this with your actual web client ID from Firebase
});

export const handleGoogleSignIn = async (auth, navigation) => {
  if (Platform.OS === 'web') {
    const { signInWithGoogleWeb } = require('./webGoogleSignIn');
    signInWithGoogleWeb(auth, navigation);
  } else {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
      await signInWithCredential(auth, credential);
      navigation.navigate('Home');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the sign-in flow
        console.log('Sign-in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation is in progress already
        console.log('In progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services are not available or outdated
        Alert.alert('Google Sign-In Eror', 'Play services are not available or outdated.');
      } else {
        // Some other error happened
        Alert.alert('Google Sign-In Error', error.message);
      }
    }
  }
};