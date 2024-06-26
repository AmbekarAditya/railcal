import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

const FloatingNextButton = ({ onPress }) => {
  if (Platform.OS !== "web" || typeof window === "undefined" || window.innerWidth >= 768) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Text style={styles.floatingButtonText}>Next</Text>   </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  // ... (keep existing styles)
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingButton: {
    position: 'fixed',  // Changed from 'absolute' to 'fixed'
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default FloatingNextButton;