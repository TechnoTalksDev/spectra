import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SpectraColors } from '@/constants/theme';

interface GlassButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  hapticFeedback?: boolean;
}

export function GlassButton({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  hapticFeedback = true,
  onPress,
  disabled,
  style,
  ...props
}: GlassButtonProps) {
  const handlePress = async (e: any) => {
    if (hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(e);
  };

  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'primary':
        return [SpectraColors.primary.main, SpectraColors.primary.variant2];
      case 'secondary':
        return ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.8)'];
      case 'ghost':
        return ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.08)'];
      default:
        return [SpectraColors.primary.main, SpectraColors.primary.variant2];
    }
  };

  const sizeStyles = {
    small: { height: 46, paddingHorizontal: 20 },
    medium: { height: 54, paddingHorizontal: 28 },
    large: { height: 58, paddingHorizontal: 32 },
  };

  const textSizeStyles = {
    small: { fontSize: 14 },
    medium: { fontSize: 16 },
    large: { fontSize: 16 },
  };

  const textColor = variant === 'ghost' 
    ? SpectraColors.primary.main
    : variant === 'secondary'
    ? SpectraColors.primary.main
    : SpectraColors.text.white;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.container, sizeStyles[size], disabled && styles.disabled, style]}
      {...props}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.text, textSizeStyles[size], { color: textColor }]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: SpectraColors.primary.main,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
