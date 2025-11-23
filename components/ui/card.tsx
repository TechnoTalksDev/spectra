import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SpectraColors } from '@/constants/theme';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  blur?: 'light' | 'medium' | 'heavy';
  variant?: 'default' | 'primary' | 'surface';
}

export function GlassCard({ 
  children, 
  blur = 'medium', 
  variant = 'default',
  style, 
  ...props 
}: GlassCardProps) {
  const blurIntensity = {
    light: 0.5,
    medium: 0.7,
    heavy: 0.9,
  };

  const getColors = (): [string, string] => {
    switch (variant) {
      case 'primary':
        return ['rgba(115, 113, 252, 0.15)', 'rgba(115, 112, 252, 0.08)'];
      case 'surface':
        return ['rgba(230, 217, 242, 0.7)', 'rgba(228, 218, 242, 0.5)'];
      default:
        return ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.4)'];
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <LinearGradient
        colors={getColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={[styles.content, { opacity: blurIntensity[blur] }]}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(20px)',
  },
});
