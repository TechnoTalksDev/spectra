import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';
import { useSupabase } from '@/hooks/useSupabase';

export default function HomePage() {
  const { session } = useSupabase();
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getUserName = () => {
    if (session?.user?.email) {
      const emailName = session.user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Friend';
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 20 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{getUserName()}</Text>
        </View>

        {/* Quick Action */}
        <GlassCard variant="surface" style={styles.card}>
          <TouchableOpacity
            style={styles.actionContent}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <View style={styles.iconContainer}>
              <AppIcon name="eye" size={28} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.actionTitle}>Start AI Vision</Text>
              <Text style={styles.actionDescription}>
                Analyze your surroundings with AI
              </Text>
            </View>
            <AppIcon name="chevron-forward" size={24} color={SpectraColors.text.light} />
          </TouchableOpacity>
        </GlassCard>

        {/* Stats */}
        <GlassCard variant="primary" style={styles.card}>
          <Text style={styles.sectionTitle}>Activity</Text>
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
        </GlassCard>

        {/* Info */}
        <GlassCard variant="surface" style={styles.card}>
          <View style={styles.infoContent}>
            <View style={{ marginBottom: 16 }}>
              <AppIcon name="sparkles" size={32} color={SpectraColors.primary.main} />
            </View>
            <Text style={styles.infoTitle}>Welcome to Spectra</Text>
            <Text style={styles.infoDescription}>
              AI-powered visual assistance to help you navigate and understand your surroundings.
            </Text>
          </View>
        </GlassCard>

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
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
    color: SpectraColors.primary.main,
    letterSpacing: -0.5,
  },
  card: {
    marginBottom: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: SpectraColors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: SpectraColors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: SpectraColors.surface.accent,
  },
  infoContent: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
