import { AnimatedBackground } from "@/components/ui/animated-background";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { SpectraColors } from "@/constants/theme";
import { useSignUp } from "@/hooks/useSignUp";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export default function Page() {
  const { isLoaded, signUp, verifyOtp } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const cardOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    const timingConfig = { duration: 350, easing: Easing.out(Easing.cubic) };
    cardOpacity.value = withDelay(100, withTiming(1, timingConfig));
    titleOpacity.value = withDelay(200, withTiming(1, timingConfig));
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const onSignUpPress = async () => {
    if (!isLoaded || !email || !password) return;

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
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
      Alert.alert(
        "Error",
        err.message || "Failed to sign up. Please try again.",
      );
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
      router.replace("/(protected)/onboarding");
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", err.message || "Invalid verification code");
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <AnimatedBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                We sent a verification code to{"\n"}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
            </Animated.View>

            <Animated.View style={cardAnimatedStyle}>
              <View style={[styles.cardContent, styles.verificationContent]}>
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
                    await Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light,
                    );
                    Alert.alert("Coming Soon", "Resend feature coming soon!");
                  }}
                  style={styles.resendContainer}
                >
                  <Text style={styles.resendText}>
                    Didn't receive the code?{" "}
                    <Text style={styles.resendLink}>Resend</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <Text style={styles.subtitle}>
              Join Spectra and experience AI-powered vision
            </Text>
          </Animated.View>

          <Animated.View style={cardAnimatedStyle}>
            <View style={styles.cardContent}>
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
                  By creating an account, you agree to our{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
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
                    await Haptics.impactAsync(
                      Haptics.ImpactFeedbackStyle.Light,
                    );
                    router.replace("/sign-in");
                  }}
                >
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 28,
    color: SpectraColors.primary.main,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: SpectraColors.primary.main,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: SpectraColors.text.secondary,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: "700",
    color: SpectraColors.primary.main,
  },
  cardContent: {
    padding: 0,
  },
  verificationContent: {
    paddingTop: 24,
  },
  signUpButton: {
    width: "100%",
    marginBottom: 16,
  },
  verifyButton: {
    width: "100%",
    marginBottom: 24,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: SpectraColors.text.light,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: SpectraColors.primary.main,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
    color: SpectraColors.text.light,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    color: SpectraColors.text.secondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "700",
    color: SpectraColors.primary.main,
  },
  resendContainer: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: SpectraColors.text.secondary,
  },
  resendLink: {
    fontWeight: "700",
    color: SpectraColors.primary.main,
  },
});
