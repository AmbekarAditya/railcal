import { GoogleSignin } from '@react-native-google-signin/google-signin';
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
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(userInfo.idToken);
      await signInWithCredential(auth, credential);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  }
};
