import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView as RNSafeAreaView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './components/HomeScreen';
import CalculationPage from './components/calcualtionPage/CalculationPage';
import SignInScreen from './signIN/signInScreen';
import { NeuColors, NeuRadii, NeuSpacing, getNeuShadowStyle } from './src/theme/neomorphicTheme';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root {
      overflow-x: hidden !important;
      max-width: 100vw !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    *, *::before, *::after {
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(style);
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an uncaught runtime error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const cardShadow = getNeuShadowStyle('convex', NeuRadii.lg);
      return (
        <RNSafeAreaView style={errorStyles.safeArea}>
          <View style={errorStyles.container}>
            <View style={[errorStyles.card, cardShadow]}>
              <View style={errorStyles.badge}>
                <Text style={errorStyles.badgeText}>APPLICATION NOTICE</Text>
              </View>
              <Text style={errorStyles.title}>Something went wrong</Text>
              <Text style={errorStyles.message}>
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </Text>
              <TouchableOpacity
                onPress={this.handleReset}
                activeOpacity={0.8}
                style={errorStyles.reloadBtn}
              >
                <Text style={errorStyles.reloadBtnText}>Reload Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RNSafeAreaView>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NeuColors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: NeuSpacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: NeuColors.surface,
    padding: NeuSpacing.xl,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: NeuSpacing.md,
    paddingVertical: 4,
    borderRadius: NeuRadii.full,
    backgroundColor: NeuColors.surface,
    borderWidth: 1,
    borderColor: NeuColors.divider,
    marginBottom: NeuSpacing.md,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: NeuColors.danger,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: NeuColors.textPrimary,
    textAlign: 'center',
    marginBottom: NeuSpacing.sm,
  },
  message: {
    fontSize: 14,
    color: NeuColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: NeuSpacing.xl,
  },
  reloadBtn: {
    backgroundColor: NeuColors.accent,
    paddingVertical: 14,
    paddingHorizontal: NeuSpacing.xl,
    borderRadius: NeuRadii.lg,
    width: '100%',
    alignItems: 'center',
  },
  reloadBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

const Drawer = createDrawerNavigator();

const App = () => (
  <SafeAreaProvider>
    <AppErrorBoundary>
      <NavigationContainer
        theme={{
          dark: false,
          colors: {
            primary: NeuColors.accent,
            background: NeuColors.background,
            card: NeuColors.surface,
            text: NeuColors.textPrimary,
            border: NeuColors.divider,
            notification: NeuColors.accent,
          },
        }}
      >
        <Drawer.Navigator
          initialRouteName="SignIn"
          screenOptions={{
            headerStyle: {
              backgroundColor: NeuColors.surface,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: NeuColors.divider,
            },
            headerTintColor: NeuColors.textPrimary,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
              color: NeuColors.textPrimary,
            },
            drawerStyle: {
              backgroundColor: NeuColors.surface,
              width: 280,
            },
            drawerActiveTintColor: NeuColors.accent,
            drawerInactiveTintColor: NeuColors.textSecondary,
            sceneContainerStyle: {
              backgroundColor: NeuColors.background,
            },
          }}
        >
          {/* Primary Sign In route - matching initialRouteName */}
          <Drawer.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              headerShown: false,
              drawerItemStyle: { display: 'none' },
            }}
          />

          {/* Core Allowance Calculator screens */}
          <Drawer.Screen
            name="Home"
            component={HomeScreen as any}
            options={{ title: 'Home' }}
          />

          <Drawer.Screen
            name="CalculationPage"
            component={CalculationPage as any}
            options={{ title: 'Allowance Sheet' }}
          />

          {/* Drawer Log Out action */}
          <Drawer.Screen
            name="Log Out"
            component={SignInScreen}
            options={{
              headerShown: false,
              title: 'Log Out',
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </AppErrorBoundary>
  </SafeAreaProvider>
);

export default App;
