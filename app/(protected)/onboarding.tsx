import { AnimatedBackground } from "@/components/ui/animated-background";
import { AppIcon } from "@/components/ui/app-icon";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { SpectraColors } from "@/constants/theme";
import { useProfile } from "@/hooks/useProfile";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function OnboardingPage() {
  const { createProfile } = useProfile();

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  // Animations
  const cardOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const progressValue = useSharedValue(0);

  useEffect(() => {
    const timingConfig = { duration: 400, easing: Easing.out(Easing.cubic) };
    cardOpacity.value = withDelay(100, withTiming(1, timingConfig));
    titleOpacity.value = withDelay(200, withTiming(1, timingConfig));
    progressValue.value = withSpring(step / 2, {
      damping: 20,
      stiffness: 90,
    });
  }, [step]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const progressWidth = interpolate(progressValue.value, [0, 1], [0, 100]);
    return {
      width: `${progressWidth}%`,
    };
  });

  const handleContinue = async () => {
    if (step === 1) {
      if (!firstName.trim()) {
        Alert.alert("Required", "Please enter your first name");
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        );
        return;
      }

      if (firstName.trim().length < 3) {
        Alert.alert("Invalid", "First name must be at least 3 characters");
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        );
        return;
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Animate step transition
      cardOpacity.value = withTiming(0, { duration: 200 }, () => {
        cardOpacity.value = withTiming(1, { duration: 200 });
      });

      setStep(2);
    } else if (step === 2) {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!firstName.trim()) {
      Alert.alert("Required", "Please enter your first name");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      console.log("[Onboarding] Creating profile with:", {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
      });

      const result = await createProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
      });

      console.log("[Onboarding] Profile created successfully:", result);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Small delay to ensure profile state propagates, then navigate
      console.log("[Onboarding] Profile created, navigating to tabs...");
      setTimeout(() => {
        console.log("[Onboarding] Executing navigation to tabs");
        router.replace("/(protected)/(tabs)");
      }, 100);
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Error",
        err.message || "Failed to create profile. Please try again.",
      );
      console.error("Profile creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (step === 1) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate step transition
    cardOpacity.value = withTiming(0, { duration: 200 }, () => {
      cardOpacity.value = withTiming(1, { duration: 200 });
    });

    setStep(step - 1);
  };

  const getStepIcon = () => {
    if (step === 1) return "person";
    if (step === 2) return "checkmark-circle";
    return "sparkles";
  };

  const getStepTitle = () => {
    if (step === 1) return "What's your name?";
    if (step === 2) return "Almost there!";
    return "Welcome!";
  };

  const getStepSubtitle = () => {
    if (step === 1) return "Let us know what to call you";
    if (step === 2) return "Add a last name (optional)";
    return "Your profile is ready";
  };

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
          {/* Header */}
          <Animated.View style={[styles.header, titleAnimatedStyle]}>
            <Text style={styles.title}>{getStepTitle()}</Text>
            <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
          </Animated.View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[styles.progressFill, progressAnimatedStyle]}
              />
            </View>
            <Text style={styles.progressText}>Step {step} of 2</Text>
          </View>

          {/* Card */}
          <Animated.View style={cardAnimatedStyle}>
            <View style={styles.cardContent}>
              {step === 1 && (
                <>
                  <GlassInput
                    label="First Name"
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    textContentType="givenName"
                    autoFocus
                  />
                  <Text style={styles.helperText}>
                    Minimum 3 characters required
                  </Text>
                </>
              )}

              {step === 2 && (
                <>
                  <View style={styles.summaryContainer}>
                    <Text style={styles.summaryLabel}>First Name</Text>
                    <Text style={styles.summaryValue}>{firstName}</Text>
                  </View>

                  <GlassInput
                    label="Last Name (Optional)"
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    textContentType="familyName"
                    autoFocus
                  />
                  <Text style={styles.helperText}>
                    You can skip this if you prefer
                  </Text>
                </>
              )}

              <View style={styles.buttonContainer}>
                {step > 1 && (
                  <GlassButton
                    title="Back"
                    variant="secondary"
                    size="large"
                    onPress={handleBack}
                    disabled={loading}
                    style={styles.backButton}
                  />
                )}
                <GlassButton
                  title={step === 2 ? "Complete" : "Continue"}
                  variant="primary"
                  size="large"
                  onPress={handleContinue}
                  disabled={
                    loading || (step === 1 && firstName.trim().length < 3)
                  }
                  loading={loading}
                  style={[
                    styles.continueButton,
                    step === 1 && styles.fullWidthButton,
                  ]}
                />
              </View>

              {step === 2 && (
                <Text style={styles.skipText}>
                  You can always update this later in your profile
                </Text>
              )}
            </View>
          </Animated.View>

          {/* Features Preview */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What you'll get:</Text>
            <View style={styles.featuresList}>
              <FeatureItem icon="eye" text="AI-powered vision assistance" />
              <FeatureItem icon="sparkles" text="Personalized experience" />
              <FeatureItem icon="shield-checkmark" text="Secure & private" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <AppIcon
          name={icon as any}
          size={20}
          color={SpectraColors.primary.main}
        />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 84,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    color: SpectraColors.primary.main,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: SpectraColors.text.primary,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: SpectraColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: SpectraColors.surface.accent,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: SpectraColors.primary.main,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: SpectraColors.text.light,
    textAlign: "center",
  },
  cardContent: {
    padding: 0,
    marginBottom: 32,
  },
  helperText: {
    fontSize: 13,
    color: SpectraColors.text.light,
    textAlign: "center",
    marginTop: -8,
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: SpectraColors.surface.accent,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: SpectraColors.text.light,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: SpectraColors.text.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  continueButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
  skipText: {
    fontSize: 12,
    color: SpectraColors.text.light,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: SpectraColors.text.secondary,
    marginBottom: 12,
    textAlign: "center",
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    fontWeight: "600",
    color: SpectraColors.text.primary,
    flex: 1,
  },
});
