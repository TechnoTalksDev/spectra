import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SpectraColors } from '@/constants/theme';

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SpectraColors.background.main,
  },
});
