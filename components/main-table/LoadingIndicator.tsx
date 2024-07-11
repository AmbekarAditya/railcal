import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';

const LoadingIndicator = () => {
  if (Platform.OS === 'web') {
    return (
      <div style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Platform.OS === 'web' ? '100vh' : '100%',
  },
  text: {
    marginTop: 10,
  },
});

export default LoadingIndicator;