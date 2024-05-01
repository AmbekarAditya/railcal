import React, { useState } from 'react';
import { View, Text, ImageBackground, Pressable, Image, TextInput, StyleSheet } from 'react-native';
import GoogleSignInNative from './googleSignInNative';
import GoogleSignInWeb from './googleSignInWeb';
import { Platform } from 'react-native';

const SignInScreen: React.FC = () => {
  const isWeb = Platform.OS === 'web';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

  const handleSignIn = () => {
    setShowGoogleSignIn(true);
  };

  const signInWithGoogle = () => {
    handleSignIn();
  };

  return (
    <ImageBackground style={styles.appjsIcon} resizeMode="cover" source={require("./assets/vandebharat.jpg")}>
      <View style={styles.appjsChild} />
      <Text style={styles.allowanceCalculator}>ALLOWANCE CALCULATOR</Text>
      <Text style={styles.empoweringRailwayEmployees}>
        "Empowering railway employees with accurate allowance calculations - your one-stop solution for financial clarity and peace of mind."
      </Text>
      <ImageBackground style={[styles.image2Icon, styles.iconPosition]} resizeMode="cover" source={require("./assets/image21.png")} />
      <Pressable style={styles.googleSigin} onPress={signInWithGoogle}>
        <Image style={[styles.googleSiginChild, styles.appjsItemLayout]} contentFit="cover" source={require("./assets/rectanglewithborder.png")} />
        <Text style={[styles.continueWithGoogle, styles.loginTypo]}> Continue with Google </Text>
        <Image style={[styles.googleColorSvgrepoCom2Icon, styles.iconPosition]} contentFit="cover" source={require("./assets/googlecolorsvgrepocom.png")} />
      </Pressable>
      <TextInput style={[styles.appjsItem, styles.appjsTypo]} placeholder="Enter Email Address" placeholderTextColor="#fff" value={email} onChangeText={setEmail} />
      <TextInput style={[styles.appjsInner, styles.googleLayout]} placeholder="Enter Password " placeholderTextColor="#fff" secureTextEntry value={password} onChangeText={setPassword} />
      <Pressable style={[styles.googleSigin1, styles.googleLayout]} onPress={handleSignIn}>
        <Image style={[styles.googleSiginItem, styles.googleLayout]} contentFit="cover" source={require("./assets/rectanglewithborder.png")} />
        <Text style={[styles.login, styles.loginTypo]}>Login</Text>
      </Pressable>
      <Text style={[styles.forgotPassword, styles.createAccountTypo]}> forgot password ? </Text>
      <Text style={[styles.createAccount, styles.createAccountTypo]}> create account </Text>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {showGoogleSignIn && (isWeb ? <GoogleSignInWeb /> : <GoogleSignInNative />)}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
});

export default SignInScreen;