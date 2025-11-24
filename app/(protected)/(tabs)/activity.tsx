import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import { useTheme } from '@/context/theme-context';
import { useVisionHistory } from '@/hooks/useVisionHistory';
import { format, isToday, isThisWeek, isThisMonth, differenceInDays } from 'date-fns';

const { width } = Dimensions.get('window');

export default function ActivityPage() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { history, loading } = useVisionHistory();

  const stats = useMemo(() => {
    const today = history.filter(item => isToday(new Date(item.created_at)));
    const thisWeek = history.filter(item => isThisWeek(new Date(item.created_at)));
    const thisMonth = history.filter(item => isThisMonth(new Date(item.created_at)));

    const modeBreakdown = history.reduce((acc, item) => {
      acc[item.mode] = (acc[item.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueObjects = new Set(history.flatMap(item => item.objects)).size;

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const dates = [...new Set(history.map(item => format(new Date(item.created_at), 'yyyy-MM-dd')))].sort();
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const daysDiff = i === dates.length - 1 ? 
        differenceInDays(new Date(), new Date(dates[i])) :
        differenceInDays(new Date(dates[i + 1]), new Date(dates[i]));
      
      if (daysDiff <= 1) {
        tempStreak++;
        if (i === dates.length - 1) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      total: history.length,
      today: today.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      uniqueObjects,
      modeBreakdown,
      currentStreak,
      longestStreak,
    };
  }, [history]);

  const achievements = [
    { 
      id: 'first_scan', 
      title: 'First Scan', 
      description: 'Complete your first vision analysis',
      unlocked: stats.total >= 1,
      icon: 'eye',
      color: '#8b5cf6',
    },
    { 
      id: 'scan_10', 
      title: 'Explorer', 
      description: 'Complete 10 vision analyses',
      unlocked: stats.total >= 10,
      icon: 'compass',
      color: '#10b981',
    },
    { 
      id: 'streak_3', 
      title: '3-Day Streak', 
      description: 'Use the app 3 days in a row',
      unlocked: stats.currentStreak >= 3,
      icon: 'flame',
      color: '#f59e0b',
    },
    { 
      id: 'objects_50', 
      title: 'Object Master', 
      description: 'Detect 50 unique objects',
      unlocked: stats.uniqueObjects >= 50,
      icon: 'cube',
      color: '#3b82f6',
    },
  ];

  const recentActivity = history.slice(0, 5).map(item => ({
    id: item.id,
    title: item.description.slice(0, 50) + (item.description.length > 50 ? '...' : ''),
    mode: item.mode,
    time: format(new Date(item.created_at), 'MMM d, h:mm a'),
    objects: item.objects.length,
  }));

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 20 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Activity</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Track your vision journey
          </Text>
        </View>

        {/* Streak Card */}
        <GlassCard variant="primary" style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={[styles.streakIcon, { backgroundColor: '#f59e0b' + '30' }]}>
              <AppIcon name="flame" size={32} color="#f59e0b" />
            </View>
            <View style={styles.streakInfo}>
              <Text style={[styles.streakValue, { color: colors.text.primary }]}>
                {stats.currentStreak} Day{stats.currentStreak !== 1 ? 's' : ''}
              </Text>
              <Text style={[styles.streakLabel, { color: colors.text.secondary }]}>Current Streak</Text>
            </View>
            <View style={styles.streakBest}>
              <Text style={[styles.streakBestValue, { color: colors.primary.main }]}>
                {stats.longestStreak}
              </Text>
              <Text style={[styles.streakBestLabel, { color: colors.text.secondary }]}>Best</Text>
            </View>
          </View>
        </GlassCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <GlassCard variant="surface" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#8b5cf6' + '20' }]}>
              <AppIcon name="eye" size={24} color="#8b5cf6" />
            </View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total Scans</Text>
          </GlassCard>

          <GlassCard variant="surface" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#10b981' + '20' }]}>
              <AppIcon name="cube" size={24} color="#10b981" />
            </View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.uniqueObjects}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Objects</Text>
          </GlassCard>

          <GlassCard variant="surface" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#3b82f6' + '20' }]}>
              <AppIcon name="calendar" size={24} color="#3b82f6" />
            </View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.thisWeek}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>This Week</Text>
          </GlassCard>

          <GlassCard variant="surface" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b' + '20' }]}>
              <AppIcon name="today" size={24} color="#f59e0b" />
            </View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.today}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Today</Text>
          </GlassCard>
        </View>

        {/* Mode Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Analysis Modes</Text>
          <GlassCard variant="surface" style={styles.modeCard}>
            {Object.entries(stats.modeBreakdown).map(([mode, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const modeColors: Record<string, string> = {
                quick: '#8b5cf6',
                detailed: '#3b82f6',
                accessibility: '#10b981',
                continuous: '#f59e0b',
              };
              
              return (
                <View key={mode} style={styles.modeRow}>
                  <View style={styles.modeInfo}>
                    <Text style={[styles.modeName, { color: colors.text.primary }]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                    <Text style={[styles.modeCount, { color: colors.text.secondary }]}>
                      {count} scan{count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.modeBarContainer}>
                    <View 
                      style={[
                        styles.modeBar, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: modeColors[mode] || colors.primary.main,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.modePercentage, { color: colors.text.secondary }]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              );
            })}
          </GlassCard>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <GlassCard 
                key={achievement.id} 
                variant="surface" 
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && { opacity: 0.5 }
                ]}
              >
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
                  <AppIcon name={achievement.icon as any} size={28} color={achievement.color} />
                  {achievement.unlocked && (
                    <View style={styles.achievementBadge}>
                      <AppIcon name="checkmark-circle" size={20} color="#10b981" />
                    </View>
                  )}
                </View>
                <Text style={[styles.achievementTitle, { color: colors.text.primary }]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.text.secondary }]}>
                  {achievement.description}
                </Text>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Activity</Text>
          {recentActivity.length === 0 ? (
            <GlassCard variant="surface" style={styles.emptyCard}>
              <AppIcon name="time" size={48} color={colors.text.secondary} />
              <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                No activity yet
              </Text>
            </GlassCard>
          ) : (
            <GlassCard variant="surface" style={styles.activityCard}>
              {recentActivity.map((activity, index) => (
                <View key={activity.id}>
                  <TouchableOpacity
                    style={styles.activityRow}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <View style={[styles.activityDot, { backgroundColor: colors.primary.main }]} />
                    <View style={styles.activityContent}>
                      <Text style={[styles.activityTitle, { color: colors.text.primary }]} numberOfLines={1}>
                        {activity.title}
                      </Text>
                      <View style={styles.activityMeta}>
                        <Text style={[styles.activityMode, { color: colors.text.secondary }]}>
                          {activity.mode}
                        </Text>
                        <Text style={[styles.activitySeparator, { color: colors.text.secondary }]}>•</Text>
                        <Text style={[styles.activityObjects, { color: colors.text.secondary }]}>
                          {activity.objects} object{activity.objects !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      <Text style={[styles.activityTime, { color: colors.text.secondary }]}>
                        {activity.time}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {index < recentActivity.length - 1 && (
                    <View style={[styles.activityDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]} />
                  )}
                </View>
              ))}
            </GlassCard>
          )}
        </View>
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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  streakCard: {
    marginBottom: 20,
    padding: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  streakLabel: {
    fontSize: 14,
  },
  streakBest: {
    alignItems: 'center',
  },
  streakBestValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  streakBestLabel: {
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modeCard: {
    padding: 16,
    gap: 16,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeInfo: {
    width: 100,
  },
  modeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  modeCount: {
    fontSize: 12,
  },
  modeBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  modeBar: {
    height: '100%',
    borderRadius: 4,
  },
  modePercentage: {
    width: 40,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 52) / 2,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  achievementBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 11,
    textAlign: 'center',
  },
  activityCard: {
    padding: 16,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityMode: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  activitySeparator: {
    fontSize: 12,
  },
  activityObjects: {
    fontSize: 12,
  },
  activityTime: {
    fontSize: 12,
  },
  activityDivider: {
    height: 1,
    marginVertical: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
