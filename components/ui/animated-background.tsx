import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SpectraColors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          SpectraColors.background.main,
          SpectraColors.surface.secondary,
          SpectraColors.background.main,
        ]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.blob, styles.blob1, animatedStyle]} />
        <Animated.View style={[styles.blob, styles.blob2, animatedStyle]} />
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob1: {
    width: width * 1.5,
    height: width * 1.5,
    backgroundColor: SpectraColors.primary.main,
    top: -width * 0.5,
    left: -width * 0.3,
  },
  blob2: {
    width: width * 1.2,
    height: width * 1.2,
    backgroundColor: SpectraColors.surface.card,
    bottom: -width * 0.4,
    right: -width * 0.2,
  },
});
