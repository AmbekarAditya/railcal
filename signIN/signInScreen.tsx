import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import googleIcon from '../assets/googleIcon.png';
import {
  NeuColors,
  NeuRadii,
  NeuSpacing,
  NeuErgonomics,
  NeuCard,
  NeuButton,
  NeuContainer,
  getNeuShadowStyle,
} from '../src/components/neomorphic';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (typeof auth?.signInWithEmailAndPassword === 'function') {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigation.navigate('Home');
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInPress = () => {
    setError('');
    if (Platform.OS === 'web') {
      const { signInWithGoogleWeb } = require('./webGoogleSignIn');
      signInWithGoogleWeb(auth, navigation, setGoogleLoading, setError);
    } else {
      const { handleGoogleSignIn } = require('./handleGoogleSignIn');
      handleGoogleSignIn(auth, navigation, setGoogleLoading, setError);
    }
  };

  const handleGuestEntry = () => {
    navigation.navigate('Home');
  };

  const insetStyle = getNeuShadowStyle('concave', NeuRadii.md);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={NeuColors.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentWrapper}>
          
          {/* Top Brand Header */}
          <View style={styles.header}>
            <NeuContainer variant="convexSmall" style={styles.badge}>
              <Text style={styles.badgeText}>INDIAN RAILWAYS</Text>
            </NeuContainer>
            <Text style={styles.title}>Allowance Calculator</Text>
            <Text style={styles.subtitle}>
              Operational Running Staff Allowance & Duty Calculation Portal
            </Text>
          </View>

          {/* Main Neomorphic Card */}
          <NeuCard
            title="Sign In to Continue"
            subtitle="Sign in with your Google or Employee Account"
            variant="convex"
            style={styles.card}
          >
            {/* Error / Alert Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerTitle}>Authentication Notice</Text>
                <Text style={styles.errorBannerText}>{error}</Text>
                {error.includes('not authorized') && (
                  <Text style={styles.errorHelperText}>
                    💡 You can click "Continue as Guest" below to test the calculator immediately without Google Sign-in.
                  </Text>
                )}
              </View>
            ) : null}

            {/* Google One-Tap Action */}
            <NeuButton
              onPress={handleGoogleSignInPress}
              disabled={googleLoading || loading}
              variant="convex"
              fullWidth
              style={styles.googleBtn}
            >
              {googleLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={NeuColors.accent} />
                  <Text style={styles.googleBtnText}>Connecting to Google...</Text>
                </View>
              ) : (
                <View style={styles.googleBtnContent}>
                  <Image source={googleIcon} style={styles.googleIcon} resizeMode="contain" />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </View>
              )}
            </NeuButton>

            {/* Guest Access Button (Zero friction testing) */}
            <NeuButton
              title="Continue as Guest (Instant Access) →"
              onPress={handleGuestEntry}
              variant="accent"
              fullWidth
              style={styles.guestBtn}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign in with email</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Employee Email</Text>
              <View style={[styles.inputContainer, insetStyle]}>
                <TextInput
                  style={styles.input}
                  placeholder="name@railway.gov.in"
                  placeholderTextColor={NeuColors.textMuted}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (error) setError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputContainer, insetStyle]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={NeuColors.textMuted}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (error) setError('');
                  }}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Email Sign In Button */}
            <NeuButton
              title={loading ? 'Signing in...' : 'Sign In'}
              onPress={handleSignIn}
              disabled={loading || googleLoading}
              variant="primary"
              fullWidth
              style={styles.signInBtn}
            />
          </NeuCard>

          {/* Footer note */}
          <Text style={styles.footerNote}>
            Secure official allowance portal for Loco Pilots, Train Managers, and Railway Staff.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NeuColors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: NeuSpacing.md,
    paddingVertical: NeuSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: NeuSpacing.lg,
    marginTop: NeuSpacing.xs,
  },
  badge: {
    paddingHorizontal: NeuSpacing.md,
    paddingVertical: 5,
    borderRadius: NeuRadii.full,
    marginBottom: NeuSpacing.xs + 2,
    backgroundColor: NeuColors.surface,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: NeuColors.accent,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: NeuColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: NeuColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: NeuSpacing.sm,
    fontWeight: '500',
  },
  card: {
    width: '100%',
  },
  googleBtn: {
    marginBottom: NeuSpacing.sm + 4,
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: NeuColors.textPrimary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestBtn: {
    marginBottom: NeuSpacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: NeuSpacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: NeuColors.divider,
  },
  dividerText: {
    fontSize: 12,
    color: NeuColors.textSecondary,
    paddingHorizontal: NeuSpacing.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    marginBottom: NeuSpacing.sm + 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: NeuColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  inputContainer: {
    height: NeuErgonomics.inputHeight,
    paddingHorizontal: NeuSpacing.md,
    justifyContent: 'center',
  },
  input: {
    height: NeuErgonomics.inputHeight,
    fontSize: 15,
    fontWeight: '600',
    color: NeuColors.textPrimary,
    width: '100%',
    ...(Platform.OS === 'web' && {
      outlineWidth: 0,
      borderWidth: 0,
      backgroundColor: 'transparent',
    }),
  },
  signInBtn: {
    marginTop: NeuSpacing.xs,
  },
  errorBanner: {
    backgroundColor: NeuColors.dangerSubtle,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: NeuRadii.md,
    padding: NeuSpacing.sm + 4,
    marginBottom: NeuSpacing.md,
  },
  errorBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: NeuColors.danger,
    marginBottom: 3,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
  },
  errorHelperText: {
    fontSize: 12,
    fontWeight: '600',
    color: NeuColors.textPrimary,
    marginTop: 6,
    lineHeight: 16,
  },
  footerNote: {
    fontSize: 11,
    color: NeuColors.textMuted,
    textAlign: 'center',
    marginTop: NeuSpacing.lg,
    paddingHorizontal: NeuSpacing.md,
  },
});

export default SignInScreen;
