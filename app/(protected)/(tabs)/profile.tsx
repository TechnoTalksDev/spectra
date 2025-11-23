import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';
import { useSupabase } from '@/hooks/useSupabase';

export default function ProfilePage() {
  const { session, signOut } = useSupabase();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (err) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
        },
      ]
    );
  };

  const getUserInitials = () => {
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserEmail = () => {
    return session?.user?.email || 'user@example.com';
  };

  const settingsOptions = [
    { icon: 'notifications', title: 'Notifications', description: 'Manage preferences' },
    { icon: 'color-palette', title: 'Appearance', description: 'Customize theme' },
    { icon: 'lock-closed', title: 'Privacy', description: 'Security settings' },
    { icon: 'help-circle', title: 'Help & Support', description: 'Get assistance' },
  ];

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 20 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <GlassCard variant="surface" style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </View>
          <Text style={styles.userName}>{getUserEmail().split('@')[0]}</Text>
          <Text style={styles.userEmail}>{getUserEmail()}</Text>
        </GlassCard>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <GlassCard variant="surface" style={styles.card}>
          {settingsOptions.map((option, index) => (
            <React.Fragment key={option.title}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert('Coming Soon', `${option.title} feature coming soon!`);
                }}
              >
                <View style={styles.settingIcon}>
                  <AppIcon name={option.icon as any} size={22} color={SpectraColors.primary.main} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingDescription}>{option.description}</Text>
                </View>
                <AppIcon name="chevron-forward" size={20} color={SpectraColors.text.light} />
              </TouchableOpacity>
              {index < settingsOptions.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </GlassCard>

        {/* Sign Out */}
        <GlassButton
          title="Sign Out"
          variant="secondary"
          size="large"
          onPress={handleSignOut}
          style={styles.signOutButton}
        />

        <Text style={styles.version}>Spectra v1.0.0</Text>

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
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SpectraColors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    marginBottom: 12,
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
  settingIcon: {
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
  signOutButton: {
    marginBottom: 16,
  },
  version: {
    fontSize: 13,
    fontWeight: '500',
    color: SpectraColors.text.light,
    textAlign: 'center',
  },
});
