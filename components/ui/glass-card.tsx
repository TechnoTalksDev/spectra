import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SpectraColors } from '@/constants/theme';

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
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return SpectraColors.surface.card;
      case 'surface':
        return '#ffffff';
      default:
        return '#ffffff';
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: getBackgroundColor() },
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
