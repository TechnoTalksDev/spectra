import * as React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { SpectraColors } from '@/constants/theme';

interface SpectraLogoProps {
  size?: number;
  animated?: boolean;
}

export function SpectraLogo({ size = 100, animated = false }: SpectraLogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={SpectraColors.primary.main} stopOpacity="1" />
            <Stop offset="100%" stopColor={SpectraColors.primary.variant2} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Outer eye shape */}
        <Path
          d="M50 25 C70 25, 85 40, 85 50 C85 60, 70 75, 50 75 C30 75, 15 60, 15 50 C15 40, 30 25, 50 25 Z"
          fill="url(#logoGradient)"
        />
        
        {/* Inner iris */}
        <Circle
          cx="50"
          cy="50"
          r="15"
          fill={SpectraColors.background.white}
          opacity="0.9"
        />
        
        {/* Pupil */}
        <Circle
          cx="50"
          cy="50"
          r="8"
          fill={SpectraColors.primary.main}
        />
        
        {/* Light reflection */}
        <Circle
          cx="54"
          cy="46"
          r="3"
          fill={SpectraColors.background.white}
          opacity="0.8"
        />
        
        {/* Spectrum rays */}
        <Path
          d="M50 35 L50 20 M35 38 L25 28 M35 62 L25 72 M50 65 L50 80 M65 62 L75 72 M65 38 L75 28"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
