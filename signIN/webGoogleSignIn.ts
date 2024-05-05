import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

export const signInWithGoogleWeb = async (auth, navigation: NavigationProp<any>) => {
  if (!auth) {
    console.error('Auth object is undefined in signInWithGoogleWeb');
    return;
  }

  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    navigation.navigate('Home');
  } catch (error) {
    console.error('Authentication error:', error);
    // Additional handling to debug or inform the user
  }
};