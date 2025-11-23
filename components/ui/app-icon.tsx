import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SpectraColors } from '@/constants/theme';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export function AppIcon({ name, size = 24, color = SpectraColors.primary.main }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
