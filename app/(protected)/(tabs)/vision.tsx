import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function VisionPage() {
  const insets = useSafeAreaInsets();

  // Animations
  const cameraScale = useSharedValue(0);
  const cameraOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(100);
  const pulseScale = useSharedValue(1);
  const shimmerTranslateX = useSharedValue(-width);

  useEffect(() => {
    // Camera animation
    cameraScale.value = withSpring(1, { damping: 15 });
    cameraOpacity.value = withTiming(1, { duration: 600 });

    // Card animation
    cardTranslateY.value = withDelay(300, withSpring(0, { damping: 15 }));

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Shimmer animation
    shimmerTranslateX.value = withRepeat(
      withTiming(width * 2, { duration: 2000 }),
      -1,
      false
    );
  }, []);

  const cameraAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cameraScale.value }],
    opacity: cameraOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Camera Preview Placeholder */}
      <LinearGradient
        colors={[
          SpectraColors.background.main,
          SpectraColors.surface.card,
          SpectraColors.primary.main,
        ]}
        style={styles.cameraPreview}
      >
        <Animated.View style={[styles.cameraContent, cameraAnimatedStyle]}>
          {/* Scanning Grid Effect */}
          <View style={styles.scanGrid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View 
                key={`h-${i}`} 
                style={[
                  styles.gridLineHorizontal,
                  { top: `${(i * 100) / 4}%` }
                ]} 
              />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <View 
                key={`v-${i}`} 
                style={[
                  styles.gridLineVertical,
                  { left: `${(i * 100) / 3}%` }
                ]} 
              />
            ))}
          </View>

          {/* Center Icon with Pulse */}
          <Animated.View style={[styles.centerIconContainer, pulseAnimatedStyle]}>
            <View style={styles.centerIcon}>
              <AppIcon name="eye" size={64} color={SpectraColors.primary.main} />
            </View>
          </Animated.View>

          {/* Status Text */}
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>AI Vision Coming Soon</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Info Card */}
      <Animated.View style={[styles.infoCardContainer, cardAnimatedStyle]}>
        <GlassCard variant="surface" style={styles.infoCard}>
          <View style={styles.infoContent}>
            <View style={styles.featureIconContainer}>
              <AppIcon name="rocket" size={40} color={SpectraColors.primary.main} />
            </View>

            <Text style={styles.infoTitle}>AI Vision is Coming!</Text>
            <Text style={styles.infoDescription}>
              Get ready for real-time AI-powered visual assistance. Spectra will help you
              understand and navigate your surroundings with confidence.
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <AppIcon name="camera" size={24} color={SpectraColors.primary.main} />
                <Text style={styles.featureText}>Real-time Analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <AppIcon name="volume-high" size={24} color={SpectraColors.primary.main} />
                <Text style={styles.featureText}>Voice Feedback</Text>
              </View>
              <View style={styles.featureItem}>
                <AppIcon name="cube" size={24} color={SpectraColors.primary.main} />
                <Text style={styles.featureText}>Object Recognition</Text>
              </View>
            </View>

            <GlassButton
              title="Get Notified"
              variant="primary"
              size="large"
              onPress={async () => {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                // TODO: Implement notification signup
              }}
              style={styles.notifyButton}
            />

            <Text style={styles.disclaimer}>
              We're working hard to bring this feature to you. Stay tuned!
            </Text>
          </View>
        </GlassCard>
      </Animated.View>
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
    position: 'relative',
  },
  cameraContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanGrid: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 400,
    maxHeight: 400,
  },
  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  gridLineVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  centerIconContainer: {
    position: 'relative',
    zIndex: 10,
  },
  centerIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  statusContainer: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f59e0b',
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: SpectraColors.primary.main,
  },
  infoCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  infoCard: {
    padding: 0,
    maxHeight: height * 0.55,
  },
  infoContent: {
    padding: 24,
  },
  featureIconContainer: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: SpectraColors.primary.main,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  infoDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 28,
    paddingVertical: 20,
    backgroundColor: 'rgba(115, 113, 252, 0.05)',
    borderRadius: 16,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: SpectraColors.text.secondary,
    textAlign: 'center',
  },
  notifyButton: {
    width: '100%',
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: '500',
    color: SpectraColors.text.light,
    textAlign: 'center',
    lineHeight: 18,
  },
});
