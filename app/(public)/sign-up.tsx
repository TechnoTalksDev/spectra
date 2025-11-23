import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassInput } from '@/components/ui/glass-input';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { SpectraColors } from '@/constants/theme';
import { useSignUp } from '@/hooks/useSignUp';

export default function Page() {
  const { isLoaded, signUp, verifyOtp } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  // Animations
  const cardTranslateY = useSharedValue(100);
  const cardOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.8);

  useEffect(() => {
    cardTranslateY.value = withDelay(100, withSpring(0, { damping: 15 }));
    cardOpacity.value = withDelay(100, withSpring(1));
    titleScale.value = withDelay(200, withSpring(1, { damping: 12 }));
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: cardOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const onSignUpPress = async () => {
    if (!isLoaded || !email || !password) return;

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await signUp({ email, password });
      setPendingVerification(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.message || 'Failed to sign up. Please try again.');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !token) return;

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await verifyOtp({ email, token });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.message || 'Invalid verification code');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <AnimatedBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.header, titleAnimatedStyle]}>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We sent a verification code to{'\n'}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
            </Animated.View>

            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <GlassCard variant="surface" style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>✉️</Text>
                  </View>

                  <GlassInput
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    value={token}
                    onChangeText={setToken}
                    keyboardType="number-pad"
                    maxLength={6}
                  />

                  <GlassButton
                    title="Verify Email"
                    variant="primary"
                    size="large"
                    onPress={onVerifyPress}
                    disabled={!token || token.length !== 6 || loading}
                    loading={loading}
                    style={styles.verifyButton}
                  />

                  <TouchableOpacity
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      // TODO: Implement resend
                      Alert.alert('Coming Soon', 'Resend feature coming soon!');
                    }}
                    style={styles.resendContainer}
                  >
                    <Text style={styles.resendText}>
                      Didn't receive the code?{' '}
                      <Text style={styles.resendLink}>Resend</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.header, titleAnimatedStyle]}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Spectra and experience AI-powered vision</Text>
          </Animated.View>

          <Animated.View style={cardAnimatedStyle}>
            <GlassCard variant="surface" style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>👁️</Text>
                </View>

                <GlassInput
                  label="Email Address"
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                />

                <GlassInput
                  label="Password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password-new"
                  textContentType="newPassword"
                />

                <GlassInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoComplete="password-new"
                  textContentType="newPassword"
                />

                <GlassButton
                  title="Create Account"
                  variant="primary"
                  size="large"
                  onPress={onSignUpPress}
                  disabled={!email || !password || !confirmPassword || loading}
                  loading={loading}
                  style={styles.signUpButton}
                />

                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By creating an account, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.replace('/sign-in');
                    }}
                  >
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 28,
    color: SpectraColors.primary.main,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: SpectraColors.primary.main,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: '700',
    color: SpectraColors.primary.main,
  },
  card: {
    padding: 0,
  },
  cardContent: {
    padding: 24,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    fontSize: 40,
  },
  signUpButton: {
    width: '100%',
    marginBottom: 16,
  },
  verifyButton: {
    width: '100%',
    marginBottom: 24,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: SpectraColors.text.light,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: SpectraColors.primary.main,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: SpectraColors.surface.accent,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.light,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: SpectraColors.text.secondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: SpectraColors.primary.main,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: SpectraColors.text.secondary,
  },
  resendLink: {
    fontWeight: '700',
    color: SpectraColors.primary.main,
  },
});
