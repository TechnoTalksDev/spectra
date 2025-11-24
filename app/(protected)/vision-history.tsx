import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { useTheme } from '@/context/theme-context';
import { useVisionHistory } from '@/hooks/useVisionHistory';
import { format } from 'date-fns';

export default function VisionHistoryPage() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { history, loading, fetchHistory, deleteHistoryItem, clearHistory } = useVisionHistory();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this analysis?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHistoryItem(id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all vision history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (err) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'quick':
        return 'flash';
      case 'detailed':
        return 'search';
      case 'accessibility':
        return 'eye';
      case 'continuous':
        return 'scan';
      default:
        return 'eye';
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground>
        <View />
      </AnimatedBackground>

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AppIcon name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>Vision History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={[styles.clearText, { color: '#ef4444' }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary.main} />
        }
      >
        {history.length === 0 ? (
          <GlassCard variant="surface" style={styles.emptyCard}>
            <AppIcon name="time" size={48} color={colors.text.secondary} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No History Yet</Text>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              Your vision analysis history will appear here
            </Text>
          </GlassCard>
        ) : (
          <View style={styles.historyList}>
            {history.map((item) => (
              <GlassCard key={item.id} variant="surface" style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.modeContainer}>
                    <View style={[styles.modeIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                      <AppIcon name={getModeIcon(item.mode)} size={16} color={colors.primary.main} />
                    </View>
                    <Text style={[styles.modeText, { color: colors.text.secondary }]}>
                      {item.mode.charAt(0).toUpperCase() + item.mode.slice(1)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <AppIcon name="trash" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                {item.image_uri && (
                  <Image source={{ uri: item.image_uri }} style={styles.thumbnail} />
                )}

                <Text style={[styles.description, { color: colors.text.primary }]} numberOfLines={3}>
                  {item.description}
                </Text>

                {item.objects && item.objects.length > 0 && (
                  <View style={styles.objectsRow}>
                    {item.objects.slice(0, 3).map((obj, idx) => (
                      <View key={idx} style={[styles.objectTag, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <Text style={[styles.objectText, { color: colors.text.secondary }]}>{obj}</Text>
                      </View>
                    ))}
                    {item.objects.length > 3 && (
                      <Text style={[styles.moreText, { color: colors.text.secondary }]}>
                        +{item.objects.length - 3} more
                      </Text>
                    )}
                  </View>
                )}

                <Text style={[styles.timestamp, { color: colors.text.secondary, opacity: 0.6 }]}>
                  {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                </Text>
              </GlassCard>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  historyList: {
    gap: 16,
  },
  historyCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  objectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  objectTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  objectText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '400',
  },
});
