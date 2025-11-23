import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassButton } from '@/components/ui/glass-button';
import { SpectraLogo } from '@/components/ui/spectra-logo';
import { SpectraColors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function Page() {
  // Animation for the entire hero section moving to top
  const heroTranslateY = useSharedValue(0);
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(100);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    // Welcome haptic
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Step 1: Fade in logo at center (0-800ms)
    logoScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Step 2: Fade in title and subtitle (200-1000ms)
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    // Step 3: Move entire hero section to top - LESS MOVEMENT, SLOWER
    heroTranslateY.value = withDelay(
      1200,
      withTiming(-height * 0.12, {
        duration: 1200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Step 4: Slide in buttons from bottom (2000-2600ms)
    buttonsTranslateY.value = withDelay(
      2000,
      withSpring(0, { damping: 15, stiffness: 100 })
    );
    buttonsOpacity.value = withDelay(2000, withTiming(1, { duration: 600 }));
  }, []);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonsTranslateY.value }],
    opacity: buttonsOpacity.value,
  }));

  return (
    <AnimatedBackground>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Hero Section - Animates to top */}
          <Animated.View style={[styles.heroSection, heroAnimatedStyle]}>
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <SpectraLogo size={100} />
            </Animated.View>

            <Animated.View style={titleAnimatedStyle}>
              <Text style={styles.title}>Spectra</Text>
            </Animated.View>

            <Animated.View style={subtitleAnimatedStyle}>
              <Text style={styles.subtitle}>
                See the world through AI-powered vision
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Buttons Section - Slides in from bottom */}
          <Animated.View style={[styles.buttonsSection, buttonsAnimatedStyle]}>
            <Text style={styles.ctaTitle}>Get Started</Text>
            <Text style={styles.ctaDescription}>
              Experience real-time AI assistance designed to help you navigate
              the world with confidence.
            </Text>

            <View style={styles.buttonContainer}>
              <GlassButton
                title="Create Account"
                variant="primary"
                size="large"
                onPress={() => router.push('/sign-up')}
                style={styles.button}
              />

              <GlassButton
                title="Sign In"
                variant="ghost"
                size="large"
                onPress={() => router.push('/sign-in')}
                style={styles.button}
              />
            </View>
          </Animated.View>
        </View>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: 28,
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 58,
    fontWeight: '900',
    color: SpectraColors.primary.main,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  buttonsSection: {
    paddingBottom: 50,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  buttonContainer: {
    gap: 14,
  },
  button: {
    width: '100%',
  },
});

