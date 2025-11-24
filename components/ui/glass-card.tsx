import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '@/context/theme-context';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'surface';
}

export function GlassCard({ 
  children, 
  variant = 'default',
  style, 
  ...props 
}: CardProps) {
  const { colors, isDark } = useTheme();
  
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.surface.card;
      case 'surface':
        return colors.surface.secondary;
      default:
        return colors.surface.secondary;
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: getBackgroundColor(),
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        },
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
