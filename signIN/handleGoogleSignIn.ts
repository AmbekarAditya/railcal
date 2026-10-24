import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Platform, Alert } from 'react-native';

try {
  GoogleSignin.configure({
    webClientId: '142052743063-he47ba59ocqbqphde7550n3bp14qafom.apps.googleusercontent.com',
  });
} catch (e) {
  // Silent fallback if native GoogleSignin is not available in environment
}

export const handleGoogleSignIn = async (
  auth: any,
  navigation: any,
  setLoading?: (loading: boolean) => void,
  setError?: (error: string) => void
) => {
  if (Platform.OS === 'web') {
    const { signInWithGoogleWeb } = require('./webGoogleSignIn');
    return signInWithGoogleWeb(auth, navigation, setLoading, setError);
  }

  if (setLoading) setLoading(true);
  if (setError) setError('');

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo: any = await GoogleSignin.signIn();
    const credential = GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken);
    await signInWithCredential(auth, credential);
    if (setLoading) setLoading(false);
    navigation.navigate('Home');
  } catch (error: any) {
    if (setLoading) setLoading(false);
    let msg = error?.message || 'Google Sign-In failed.';
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      msg = 'Sign-in cancelled.';
    } else if (error?.code === statusCodes.IN_PROGRESS) {
      msg = 'Sign-in is already in progress.';
    } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      msg = 'Google Play Services are not available or need updating.';
    }

    if (setError) {
      setError(msg);
    } else {
      Alert.alert('Google Sign-In Error', msg);
    }
  }
};
