import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

export const signInWithGoogleWeb = async (
  auth: any,
  navigation: NavigationProp<any>,
  setLoading?: (loading: boolean) => void,
  setError?: (error: string) => void
) => {
  if (!auth) {
    const msg = 'Firebase Auth is not initialized. Please verify firebaseConfig.';
    console.error(msg);
    if (setError) setError(msg);
    return;
  }

  if (setLoading) setLoading(true);
  if (setError) setError('');

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    if (setLoading) setLoading(false);
    if (result && result.user) {
      navigation.navigate('Home' as never);
    }
  } catch (error: any) {
    if (setLoading) setLoading(false);
    console.error('Firebase Google Sign-In Error:', error);

    let userFriendlyMsg = error?.message || 'Authentication failed. Please try again.';

    if (error?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your domain';
      userFriendlyMsg = `Domain "${currentHost}" is not authorized in Firebase Console. Add it in Firebase Console → Authentication → Settings → Authorized domains, or click "Continue as Guest" below.`;
    } else if (error?.code === 'auth/popup-blocked') {
      userFriendlyMsg = 'The Google sign-in popup was blocked by your browser. Please allow popups or use "Continue as Guest".';
    } else if (error?.code === 'auth/popup-closed-by-user') {
      userFriendlyMsg = 'Sign-in cancelled. Please try again or continue as Guest.';
    } else if (error?.code === 'auth/cancelled-popup-request') {
      userFriendlyMsg = 'Sign-in request was cancelled.';
    }

    if (setError) {
      setError(userFriendlyMsg);
    }
  }
};
