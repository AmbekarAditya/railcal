import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions,Image,Platform } from 'react-native';
import backgroundImage from '../assets/bgimage6.png'; // Import your background image
import googleIcon from '../assets/googleIcon.png'; 
import { useNavigation } from '@react-navigation/native'
import { auth } from '../firebase/firebaseConfig';
import { handleGoogleSignIn } from './handleGoogleSignIn';

const { width } = Dimensions.get('window');


const SignInScreen = () =>  {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (err) {
      setError(err.message); // Set the error message
    }
  };
  
  function signInWithGoogle() {
    if (Platform.OS === 'web') {
      // For web, dynamically require the web-specific module
      const { signInWithGoogleWeb } = require('./webGoogleSignIn');
      signInWithGoogleWeb(auth, navigation);
    } else {
      // For mobile (iOS and Android), dynamically require the mobile-specific module
      const { handleGoogleSignIn } = require('./handleGoogleSignIn');
      handleGoogleSignIn(auth, navigation);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.imageOverlay}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <View style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
            <Text style={styles.title}>Allowance Calculator</Text>
            </View>
          </View>
          {/* Content Container */}
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
              <TouchableOpacity style={styles.signUpButton} onPress={handleSignIn}>
                <Text style={styles.signUpButtonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signUpButtonWithIcon} onPress={signInWithGoogle}>
                <Image source={googleIcon} style={styles.icon} />
                <Text style={styles.signUpButtonText}>Continue With Google</Text>
              </TouchableOpacity>
              <Text style={styles.errorText}>{error}</Text>
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
    marginTop:80,
    height: 60, // Adjust height as needed
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily:'sans-serif',
    textDecorationLine:'underline',
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
  signUpButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 5,
    height: 40,
    width: 280,
  },
  signUpButtonWithIcon: {
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
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10, // Adjust spacing between icon and text
  },
  loginLink: {
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
  },
  errorText:
  {
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
  }
});

export default SignInScreen;