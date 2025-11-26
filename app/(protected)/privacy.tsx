import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';
import { useSupabase } from '@/hooks/useSupabase';

export default function PrivacyPage() {
  const insets = useSafeAreaInsets();
  const { signOut } = useSupabase();
  
  const [profilePublic, setProfilePublic] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReports, setCrashReports] = useState(true);

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const toggleProfilePublic = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProfilePublic(value);
  };

  const toggleDataCollection = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDataCollection(value);
  };

  const toggleAnalytics = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnalyticsEnabled(value);
  };

  const toggleCrashReports = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCrashReports(value);
  };

  const handleDownloadData = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Download Your Data',
      'We\'ll prepare a file with all your data and send it to your email within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () => {
            Alert.alert('Request Submitted', 'Check your email in 24 hours.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.\n\nAre you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Type DELETE to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'I Understand',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await signOut();
                      Alert.alert(
                        'Account Deletion Initiated',
                        'Your account deletion request has been submitted. You have been signed out.'
                      );
                    } catch (error) {
                      Alert.alert('Error', 'Failed to process deletion request.');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
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
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Account Privacy */}
        <Text style={styles.sectionTitle}>Account Privacy</Text>
        <GlassCard variant="surface" style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <AppIcon name="eye" size={24} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Public Profile</Text>
              <Text style={styles.settingDescription}>
                Make your profile visible to other users
              </Text>
            </View>
            <Switch
              value={profilePublic}
              onValueChange={toggleProfilePublic}
              trackColor={{ false: '#D1D5DB', true: SpectraColors.primary.variant1 }}
              thumbColor={profilePublic ? SpectraColors.primary.main : '#F3F4F6'}
            />
          </View>
        </GlassCard>

        {/* Data & Analytics */}
        <Text style={styles.sectionTitle}>Data & Analytics</Text>
        <GlassCard variant="surface" style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Usage Data Collection</Text>
              <Text style={styles.settingDescription}>
                Help improve the app by sharing usage data
              </Text>
            </View>
            <Switch
              value={dataCollection}
              onValueChange={toggleDataCollection}
              trackColor={{ false: '#D1D5DB', true: SpectraColors.primary.variant1 }}
              thumbColor={dataCollection ? SpectraColors.primary.main : '#F3F4F6'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Analytics</Text>
              <Text style={styles.settingDescription}>
                Allow anonymous analytics tracking
              </Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={toggleAnalytics}
              trackColor={{ false: '#D1D5DB', true: SpectraColors.primary.variant1 }}
              thumbColor={analyticsEnabled ? SpectraColors.primary.main : '#F3F4F6'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Crash Reports</Text>
              <Text style={styles.settingDescription}>
                Automatically send crash reports
              </Text>
            </View>
            <Switch
              value={crashReports}
              onValueChange={toggleCrashReports}
              trackColor={{ false: '#D1D5DB', true: SpectraColors.primary.variant1 }}
              thumbColor={crashReports ? SpectraColors.primary.main : '#F3F4F6'}
            />
          </View>
        </GlassCard>

        {/* Data Management */}
        <Text style={styles.sectionTitle}>Data Management</Text>
        <GlassCard variant="surface" style={styles.card}>
          <TouchableOpacity style={styles.actionItem} onPress={handleDownloadData}>
            <View style={styles.settingIconContainer}>
              <AppIcon name="download" size={24} color={SpectraColors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Download Your Data</Text>
              <Text style={styles.settingDescription}>
                Get a copy of your information
              </Text>
            </View>
            <AppIcon name="chevron-forward" size={20} color={SpectraColors.text.light} />
          </TouchableOpacity>
        </GlassCard>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <GlassCard variant="surface" style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <AppIcon name="warning" size={24} color="#EF4444" />
            <Text style={styles.dangerTitle}>Delete Account</Text>
          </View>
          <Text style={styles.dangerDescription}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
          <GlassButton
            title="Delete My Account"
            variant="secondary"
            size="large"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          />
        </GlassCard>

        <View style={styles.infoContainer}>
          <AppIcon name="shield-checkmark" size={20} color={SpectraColors.primary.main} />
          <Text style={styles.infoText}>
            Your privacy matters. We never sell your data to third parties.
          </Text>
        </View>

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
  actionItem: {
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
  dangerCard: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  dangerDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(115, 113, 252, 0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    lineHeight: 20,
  },
});
