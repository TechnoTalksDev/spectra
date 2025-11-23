import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';
import { useSupabase } from '@/hooks/useSupabase';

const { width } = Dimensions.get('window');

export default function Page() {
  const { session } = useSupabase();
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get user's first name from email or display a friendly greeting
  const getUserName = () => {
    if (session?.user?.email) {
      const emailName = session.user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Friend';
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Animations
  const greetingScale = useSharedValue(0.8);
  const greetingOpacity = useSharedValue(0);
  const card1TranslateY = useSharedValue(50);
  const card2TranslateY = useSharedValue(50);
  const card3TranslateY = useSharedValue(50);

  useEffect(() => {
    greetingScale.value = withSpring(1, { damping: 12 });
    greetingOpacity.value = withTiming(1, { duration: 600 });

    card1TranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));
    card2TranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));
    card3TranslateY.value = withDelay(600, withSpring(0, { damping: 15 }));
  }, []);

  const greetingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: greetingScale.value }],
    opacity: greetingOpacity.value,
  }));

  const card1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: card1TranslateY.value }],
  }));

  const card2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: card2TranslateY.value }],
  }));

  const card3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: card3TranslateY.value }],
  }));

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <Animated.View style={[styles.greetingSection, greetingAnimatedStyle]}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{getUserName()}</Text>
              <AppIcon name="hand-right" size={32} color={SpectraColors.primary.main} />
            </View>
            <Text style={styles.tagline}>How can Spectra help you today?</Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={card1AnimatedStyle}>
          <GlassCard variant="surface" style={styles.card}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
              <View style={styles.quickActionIcon}>
                <AppIcon name="camera" size={32} color={SpectraColors.primary.main} />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionTitle}>AI Vision</Text>
                <Text style={styles.quickActionDescription}>
                  Start your AI-powered visual assistance
                </Text>
              </View>
              <Text style={styles.quickActionArrow}>→</Text>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Stats Card */}
        <Animated.View style={card2AnimatedStyle}>
          <GlassCard variant="primary" style={styles.card}>
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Your Activity</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Minutes</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Insights</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Info Card */}
        <Animated.View style={card3AnimatedStyle}>
          <GlassCard variant="surface" style={styles.card}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <AppIcon name="sparkles" size={40} color={SpectraColors.primary.main} />
              </View>
              <Text style={styles.infoTitle}>Welcome to Spectra!</Text>
              <Text style={styles.infoDescription}>
                Spectra uses cutting-edge AI to provide real-time visual assistance,
                helping you navigate and understand your surroundings with confidence.
              </Text>
              <GlassButton
                title="Learn More"
                variant="primary"
                size="medium"
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={styles.learnMoreButton}
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Spacer for bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  greetingSection: {
    marginBottom: 32,
  },
  greetingContainer: {
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: SpectraColors.text.secondary,
    marginBottom: 4,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  userName: {
    fontSize: 40,
    fontWeight: '800',
    color: SpectraColors.primary.main,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: SpectraColors.text.light,
  },
  card: {
    marginBottom: 20,
    padding: 0,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SpectraColors.primary.main,
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    lineHeight: 20,
  },
  quickActionArrow: {
    fontSize: 24,
    color: SpectraColors.primary.main,
    fontWeight: '600',
  },
  statsCard: {
    padding: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: SpectraColors.primary.main,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: SpectraColors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: SpectraColors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: SpectraColors.surface.accent,
  },
  infoCard: {
    padding: 24,
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 36,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: SpectraColors.primary.main,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  learnMoreButton: {
    paddingHorizontal: 32,
  },
});

