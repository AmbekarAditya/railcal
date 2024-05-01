import React from 'react';
import { Platform } from 'react-native';
import GoogleSignInNative from './googleSignInNative';
import GoogleSignInWeb from './googleSignInWeb';

const GoogleSignIn: React.FC = () => {
  const isWeb = Platform.OS === 'web';

  return isWeb ? <GoogleSignInWeb /> : <GoogleSignInNative />;
};

export default GoogleSignIn;