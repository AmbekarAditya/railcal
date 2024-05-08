import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Image, Platform, ActivityIndicator } from 'react-native';
import backgroundImage from '../assets/bgimage6.png';
import googleIcon from '../assets/googleIcon.png';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebaseConfig';
import { handleGoogleSignIn } from './handleGoogleSignIn';

const { width } = Dimensions.get('window');

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
  };

  function signInWithGoogle() {
    if (Platform.OS === 'web') {
      const { signInWithGoogleWeb } = require('./webGoogleSignIn');
      signInWithGoogleWeb(auth, navigation);
    } else {
      const { handleGoogleSignIn } = require('./handleGoogleSignIn');
      handleGoogleSignIn(auth, navigation);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.imageOverlay}>
          <View style={styles.titleContainer}>
            <View style={styles.titleBackground}>
              <Text style={styles.title}>Allowance Calculator</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.signInButtonWithIcon} onPress={signInWithGoogle}>
                <Image source={googleIcon} style={styles.icon} />
                <Text style={styles.signInButtonText}>Continue With Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    height: 60,
  },
  titleBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'sans-serif',
    textDecorationLine: 'underline',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 25,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderWidth: 0.3,
    width: 280,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 5,
    height: 40,
    width: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 5,
    height: 40,
    width: 280,
    justifyContent: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  forgotPasswordButton: {
    marginBottom: 15,
  },
  forgotPasswordButtonText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SignInScreen;