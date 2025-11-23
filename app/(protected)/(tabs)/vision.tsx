import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function VisionPage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Camera Preview Placeholder */}
      <View style={styles.cameraPreview}>
        <View style={styles.centerIcon}>
          <AppIcon name="eye" size={64} color={SpectraColors.primary.main} />
        </View>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Coming Soon</Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCardContainer}>
        <GlassCard variant="surface" style={styles.infoCard}>
          <View style={styles.iconContainer}>
            <AppIcon name="rocket" size={32} color={SpectraColors.primary.main} />
          </View>

          <Text style={styles.infoTitle}>AI Vision is Coming!</Text>
          <Text style={styles.infoDescription}>
            Get ready for real-time AI-powered visual assistance.
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <AppIcon name="camera" size={24} color={SpectraColors.primary.main} />
              <Text style={styles.featureText}>Real-time</Text>
            </View>
            <View style={styles.featureItem}>
              <AppIcon name="volume-high" size={24} color={SpectraColors.primary.main} />
              <Text style={styles.featureText}>Voice</Text>
            </View>
            <View style={styles.featureItem}>
              <AppIcon name="cube" size={24} color={SpectraColors.primary.main} />
              <Text style={styles.featureText}>Objects</Text>
            </View>
          </View>

          <GlassButton
            title="Get Notified"
            variant="primary"
            size="large"
            onPress={async () => {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
            style={styles.button}
          />
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SpectraColors.background.main,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: SpectraColors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: SpectraColors.text.primary,
  },
  infoCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoCard: {
    maxHeight: height * 0.5,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: SpectraColors.surface.card,
    borderRadius: 12,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: SpectraColors.text.secondary,
  },
  button: {
    width: '100%',
  },
});
