import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions,Image } from 'react-native';
import backgroundImage from './assets/bgimage5.png'; // Import your background image
import googleIcon from './assets/googleIcon.png'; 

const { width } = Dimensions.get('window');

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

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
              <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.signUpButtonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signUpButtonWithIcon} onPress={handleSignUp}>
                <Image source={googleIcon} style={styles.icon} />
                <Text style={styles.signUpButtonText}>Continue With Google</Text>
              </TouchableOpacity>
              <Text style={styles.loginLink}>Error message here</Text>
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
});

export default App;