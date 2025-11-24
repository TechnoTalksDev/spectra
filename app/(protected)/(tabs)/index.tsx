import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/context/theme-context';
import { useSupabase } from '@/hooks/useSupabase';
import { useVisionHistory } from '@/hooks/useVisionHistory';
import { useProfile } from '@/hooks/useProfile';
import { format, isToday } from 'date-fns';

export default function HomePage() {
  const { session } = useSupabase();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { history } = useVisionHistory();
  const { profile } = useProfile();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getUserName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
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

  const todayScans = history.filter(item => isToday(new Date(item.created_at))).length;
  const totalScans = history.length;
  const recentScan = history[0];

  const quickActions = [
    { id: 'camera', title: 'Quick Scan', icon: 'camera', color: '#8b5cf6', route: '/(protected)/(tabs)/vision' },
    { id: 'history', title: 'History', icon: 'time', color: '#3b82f6', route: '/(protected)/vision-history' },
    { id: 'discover', title: 'Discover', icon: 'compass', color: '#10b981', route: '/(protected)/(tabs)/discover' },
    { id: 'activity', title: 'Activity', icon: 'pulse', color: '#f59e0b', route: '/(protected)/(tabs)/activity' },
  ];

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 20 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text.secondary }]}>{getGreeting()},</Text>
          <Text style={[styles.userName, { color: colors.primary.main }]}>{getUserName()}</Text>
        </View>

        {/* Today Stats */}
        <GlassCard variant="primary" style={styles.card}>
          <View style={styles.todayHeader}>
            <View>
              <Text style={[styles.todayTitle, { color: colors.text.primary }]}>Today's Progress</Text>
              <Text style={[styles.todayDate, { color: colors.text.secondary }]}>
                {format(currentTime, 'EEEE, MMMM d')}
              </Text>
            </View>
            <View style={[styles.todayBadge, { backgroundColor: colors.primary.main }]}>
              <AppIcon name="eye" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.todayStats}>
            <View style={styles.todayStat}>
              <Text style={[styles.todayValue, { color: colors.text.primary }]}>{todayScans}</Text>
              <Text style={[styles.todayLabel, { color: colors.text.secondary }]}>Scans Today</Text>
            </View>
            <View style={[styles.todayDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
            <View style={styles.todayStat}>
              <Text style={[styles.todayValue, { color: colors.text.primary }]}>{totalScans}</Text>
              <Text style={[styles.todayLabel, { color: colors.text.secondary }]}>Total</Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick Actions Grid */}
        <View style={styles.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(action.route as any);
              }}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                <AppIcon name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text.primary }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Scan */}
        {recentScan && (
          <GlassCard variant="surface" style={styles.card}>
            <View style={styles.recentHeader}>
              <Text style={[styles.recentTitle, { color: colors.text.primary }]}>Recent Scan</Text>
              <TouchableOpacity onPress={() => router.push('/(protected)/vision-history')}>
                <Text style={[styles.viewAll, { color: colors.primary.main }]}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.recentDescription, { color: colors.text.secondary }]} numberOfLines={2}>
              {recentScan.description}
            </Text>
            <View style={styles.recentMeta}>
              <View style={styles.recentMetaItem}>
                <AppIcon name="time" size={14} color={colors.text.secondary} />
                <Text style={[styles.recentMetaText, { color: colors.text.secondary }]}>
                  {format(new Date(recentScan.created_at), 'h:mm a')}
                </Text>
              </View>
              <View style={styles.recentMetaItem}>
                <AppIcon name="cube" size={14} color={colors.text.secondary} />
                <Text style={[styles.recentMetaText, { color: colors.text.secondary }]}>
                  {recentScan.objects.length} objects
                </Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* AI Vision Feature */}
        <GlassCard variant="surface" style={styles.card}>
          <TouchableOpacity
            style={styles.featureContent}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(protected)/(tabs)/vision');
            }}
          >
            <View style={styles.iconContainer}>
              <AppIcon name="sparkles" size={32} color={colors.primary.main} />
            </View>
            <View style={styles.textContent}>
              <Text style={[styles.featureTitle, { color: colors.text.primary }]}>AI-Powered Vision</Text>
              <Text style={[styles.featureDescription, { color: colors.text.secondary }]}>
                Analyze your surroundings with cutting-edge AI
              </Text>
            </View>
            <AppIcon name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
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
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  card: {
    marginBottom: 16,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  todayDate: {
    fontSize: 13,
  },
  todayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  todayStat: {
    flex: 1,
    alignItems: 'center',
  },
  todayValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  todayLabel: {
    fontSize: 13,
  },
  todayDivider: {
    width: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  recentMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  recentMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recentMetaText: {
    fontSize: 12,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
});
