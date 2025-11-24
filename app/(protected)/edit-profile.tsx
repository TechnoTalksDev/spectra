import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassInput } from '@/components/ui/glass-input';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';
import { useProfile } from '@/hooks/useProfile';

export default function EditProfileModal() {
  const { profile, updateProfile } = useProfile();
  const insets = useSafeAreaInsets();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [loading, setLoading] = useState(false);

  // Animations
  const cardOpacity = useSharedValue(0);
  
  React.useEffect(() => {
    const timingConfig = { duration: 350, easing: Easing.out(Easing.cubic) };
    cardOpacity.value = withDelay(100, withTiming(1, timingConfig));
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (firstName.trim().length < 3) {
      Alert.alert('Invalid', 'First name must be at least 3 characters');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.message || 'Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <AnimatedBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              disabled={loading}
            >
              <AppIcon name="close" size={24} color={SpectraColors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Card */}
          <Animated.View style={cardAnimatedStyle}>
            <GlassCard variant="surface" style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <AppIcon name="person" size={48} color={SpectraColors.primary.main} />
                </View>

                <Text style={styles.sectionTitle}>Personal Information</Text>

                <GlassInput
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoComplete="given-name"
                  textContentType="givenName"
                />
                <Text style={styles.helperText}>
                  Minimum 3 characters required
                </Text>

                <GlassInput
                  label="Last Name (Optional)"
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoComplete="family-name"
                  textContentType="familyName"
                />

                <View style={styles.buttonContainer}>
                  <GlassButton
                    title="Cancel"
                    variant="secondary"
                    size="large"
                    onPress={handleClose}
                    disabled={loading}
                    style={styles.cancelButton}
                  />
                  <GlassButton
                    title="Save Changes"
                    variant="primary"
                    size="large"
                    onPress={handleSave}
                    disabled={loading || firstName.trim().length < 3}
                    loading={loading}
                    style={styles.saveButton}
                  />
                </View>

                <Text style={styles.infoText}>
                  Your profile information is private and secure. It will never be shared without your permission.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  card: {
    padding: 0,
  },
  cardContent: {
    padding: 24,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 16,
  },
  helperText: {
    fontSize: 13,
    color: SpectraColors.text.light,
    marginTop: -8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: SpectraColors.text.light,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
