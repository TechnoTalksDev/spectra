import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
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

  // Animations
  const profileScale = useSharedValue(0.8);
  const profileOpacity = useSharedValue(0);
  const card1TranslateY = useSharedValue(50);
  const card2TranslateY = useSharedValue(50);

  useEffect(() => {
    profileScale.value = withSpring(1, { damping: 12 });
    profileOpacity.value = withSpring(1);

    card1TranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));
    card2TranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));
  }, []);

  const profileAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: profileScale.value }],
    opacity: profileOpacity.value,
  }));

  const card1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: card1TranslateY.value }],
  }));

  const card2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: card2TranslateY.value }],
  }));

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
              console.error(JSON.stringify(err, null, 2));
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
    { icon: 'notifications', title: 'Notifications', description: 'Manage notification preferences' },
    { icon: 'color-palette', title: 'Appearance', description: 'Customize app theme' },
    { icon: 'lock-closed', title: 'Privacy', description: 'Privacy and security settings' },
    { icon: 'stats-chart', title: 'Usage Stats', description: 'View your activity data' },
    { icon: 'help-circle', title: 'Help & Support', description: 'Get help and contact support' },
    { icon: 'information-circle', title: 'About', description: 'App version and information' },
  ];

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <Animated.View style={profileAnimatedStyle}>
          <GlassCard variant="surface" style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getUserInitials()}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                </View>
              </View>

              <Text style={styles.userName}>{getUserEmail().split('@')[0]}</Text>
              <Text style={styles.userEmail}>{getUserEmail()}</Text>

              <View style={styles.membershipBadge}>
                <AppIcon name="sparkles" size={16} color={SpectraColors.primary.main} />
                <Text style={styles.membershipText}>Free Member</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View style={card1AnimatedStyle}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <GlassCard variant="surface" style={styles.settingsCard}>
            <View style={styles.settingsContent}>
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
                      <AppIcon name={option.icon as any} size={24} color={SpectraColors.primary.main} />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{option.title}</Text>
                      <Text style={styles.settingDescription}>{option.description}</Text>
                    </View>
                    <Text style={styles.settingArrow}>›</Text>
                  </TouchableOpacity>
                  {index < settingsOptions.length - 1 && <View style={styles.settingDivider} />}
                </React.Fragment>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Sign Out Section */}
        <Animated.View style={card2AnimatedStyle}>
          <GlassButton
            title="Sign Out"
            variant="secondary"
            size="large"
            onPress={handleSignOut}
            style={styles.signOutButton}
          />

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Spectra v1.0.0</Text>
            <Text style={styles.copyrightText}>© 2025 Spectra. All rights reserved.</Text>
          </View>
        </Animated.View>

        {/* Bottom Spacer */}
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: SpectraColors.primary.main,
    letterSpacing: -1,
  },
  profileCard: {
    marginBottom: 32,
    padding: 0,
  },
  profileContent: {
    padding: 32,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SpectraColors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: {
    fontSize: 44,
    fontWeight: '800',
    color: SpectraColors.text.white,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SpectraColors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: SpectraColors.background.white,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ade80',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: SpectraColors.primary.main,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    marginBottom: 16,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(115, 113, 252, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(115, 113, 252, 0.2)',
  },
  membershipText: {
    fontSize: 14,
    fontWeight: '600',
    color: SpectraColors.primary.main,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 16,
    marginLeft: 4,
  },
  settingsCard: {
    marginBottom: 24,
    padding: 0,
  },
  settingsContent: {
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    fontWeight: '500',
    color: SpectraColors.text.light,
  },
  settingArrow: {
    fontSize: 28,
    fontWeight: '300',
    color: SpectraColors.text.light,
  },
  settingDivider: {
    height: 1,
    backgroundColor: SpectraColors.surface.accent,
    marginHorizontal: 16,
  },
  signOutButton: {
    marginBottom: 24,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: SpectraColors.text.secondary,
    marginBottom: 6,
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: '500',
    color: SpectraColors.text.light,
  },
});
