import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/theme-context';

interface ButtonProps extends TouchableOpacityProps {
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
}: ButtonProps) {
  const { colors } = useTheme();
  
  const handlePress = async (e: any) => {
    if (hapticFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(e);
  };

  const getBackgroundColor = () => {
    if (disabled) return '#cccccc';
    switch (variant) {
      case 'primary':
        return colors.primary.main;
      case 'secondary':
        return colors.surface.secondary;
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary.main;
    }
  };

  const sizeStyles = {
    small: { height: 44, paddingHorizontal: 20 },
    medium: { height: 52, paddingHorizontal: 24 },
    large: { height: 56, paddingHorizontal: 28 },
  };

  const textSizeStyles = {
    small: { fontSize: 14 },
    medium: { fontSize: 15 },
    large: { fontSize: 16 },
  };

  const textColor = variant === 'ghost' 
    ? colors.primary.main
    : variant === 'secondary'
    ? colors.primary.main
    : '#ffffff';

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.container, 
        sizeStyles[size], 
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && { ...styles.secondary, borderColor: colors.primary.main },
        style
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[
          styles.text, 
          textSizeStyles[size], 
          { color: textColor },
          disabled && { color: '#999999' }
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondary: {
    borderWidth: 1.5,
  },
  text: {
    fontWeight: '600',
  },
});
