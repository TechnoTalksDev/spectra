import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsPage() {
  const insets = useSafeAreaInsets();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'vision-updates',
      title: 'Vision Updates',
      description: 'Get notified about AI vision feature updates',
      enabled: true,
    },
    {
      id: 'security-alerts',
      title: 'Security Alerts',
      description: 'Important security and account notifications',
      enabled: true,
    },
    {
      id: 'feature-announcements',
      title: 'Feature Announcements',
      description: 'New features and product updates',
      enabled: true,
    },
    {
      id: 'tips-tricks',
      title: 'Tips & Tricks',
      description: 'Learn how to get the most out of Spectra',
      enabled: false,
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Promotional content and special offers',
      enabled: false,
    },
  ]);

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const toggleNotification = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  const togglePush = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPushEnabled(value);
  };

  const toggleEmail = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEmailEnabled(value);
  };

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <AppIcon name="arrow-back" size={24} color={SpectraColors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Settings */}
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        <GlassCard variant="surface" style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <AppIcon name="notifications" size={24} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={togglePush}
              trackColor={{ false: '#D1D5DB', true: SpectraColors.primary.variant1 }}
              thumbColor={pushEnabled ? SpectraColors.primary.main : '#F3F4F6'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <AppIcon name="mail" size={24} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications via email
              </Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={toggleEmail}
              trackColor={{ false: '#D1D5DB', true: SpectraColors.primary.variant1 }}
              thumbColor={emailEnabled ? SpectraColors.primary.main : '#F3F4F6'}
            />
          </View>
        </GlassCard>

        {/* Notification Types */}
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <GlassCard variant="surface" style={styles.card}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{notification.title}</Text>
                  <Text style={styles.settingDescription}>
                    {notification.description}
                  </Text>
                </View>
                <Switch
                  value={notification.enabled}
                  onValueChange={() => toggleNotification(notification.id)}
                  trackColor={{ false: '#D1D5DB', true: SpectraColors.primary.variant1 }}
                  thumbColor={notification.enabled ? SpectraColors.primary.main : '#F3F4F6'}
                  disabled={!pushEnabled && !emailEnabled}
                />
              </View>
              {index < notifications.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </GlassCard>

        {(!pushEnabled && !emailEnabled) && (
          <View style={styles.warningContainer}>
            <AppIcon name="information-circle" size={20} color="#F59E0B" />
            <Text style={styles.warningText}>
              Enable at least one notification channel to receive updates
            </Text>
          </View>
        )}

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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SpectraColors.text.primary,
  },
  headerSpacer: {
    width: 44,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: 24,
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: SpectraColors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: SpectraColors.surface.accent,
    marginHorizontal: 16,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.primary,
    lineHeight: 20,
  },
});
