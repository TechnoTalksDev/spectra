import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/context/theme-context';

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: colors.background.main }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
