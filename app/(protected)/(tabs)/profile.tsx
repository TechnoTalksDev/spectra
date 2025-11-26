import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';
import { useSupabase } from '@/hooks/useSupabase';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { session, signOut } = useSupabase();
  const { profile, loading: profileLoading } = useProfile();
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
    if (profile?.first_name) {
      const firstInitial = profile.first_name.charAt(0).toUpperCase();
      const lastInitial = profile.last_name?.charAt(0).toUpperCase() || '';
      return firstInitial + lastInitial;
    }
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    if (profile?.first_name) {
      const fullName = profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`
        : profile.first_name;
      return fullName;
    }
    return session?.user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return session?.user?.email || 'user@example.com';
  };

  const settingsOptions = [
    { icon: 'create', title: 'Edit Profile', description: 'Update your information', action: 'edit-profile' },
    { icon: 'notifications', title: 'Notifications', description: 'Manage preferences', action: 'notifications' },
    { icon: 'color-palette', title: 'Appearance', description: 'Customize theme', action: 'appearance' },
    { icon: 'lock-closed', title: 'Privacy', description: 'Security settings', action: 'privacy' },
    { icon: 'help-circle', title: 'Help & Support', description: 'Get assistance', action: 'support' },
  ];

  const handleSettingPress = async (action: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (action) {
      case 'edit-profile':
        router.push('/(protected)/edit-profile');
        break;
      case 'notifications':
        router.push('/(protected)/notifications');
        break;
      case 'appearance':
        router.push('/(protected)/appearance');
        break;
      case 'privacy':
        router.push('/(protected)/privacy');
        break;
      case 'support':
        router.push('/(protected)/help-support');
        break;
      default:
        Alert.alert('Coming Soon', `${action} feature coming soon!`);
    }
  };

  if (profileLoading) {
    return (
      <AnimatedBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={SpectraColors.primary.main} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </AnimatedBackground>
    );
  }

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
          <Text style={styles.userName}>{getUserName()}</Text>
          <Text style={styles.userEmail}>{getUserEmail()}</Text>
          
          {profile && (
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => handleSettingPress('edit-profile')}
            >
              <AppIcon name="create" size={16} color={SpectraColors.primary.main} />
              <Text style={styles.editBadgeText}>Edit</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <GlassCard variant="surface" style={styles.card}>
          {settingsOptions.map((option, index) => (
            <React.Fragment key={option.title}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => handleSettingPress(option.action)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: SpectraColors.text.secondary,
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
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
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 4,
  },
  editBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: SpectraColors.primary.main,
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
