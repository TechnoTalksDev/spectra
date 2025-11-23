/**
 * Spectra App Theme
 * Premium color palette with glassmorphism support
 */

import { Platform } from 'react-native';

// Spectra Color Palette
export const SpectraColors = {
  // Primary Colors
  primary: {
    main: '#7371fc',
    variant1: '#7472fd',
    variant2: '#7470fc',
  },
  // Card/Surface Colors
  surface: {
    card: '#e6d9f2',
    secondary: '#e4daf2',
    alternate: '#e6d8f4',
    accent: '#e7daf3',
  },
  // Background
  background: {
    main: '#f4effe',
    white: '#ffffff',
  },
  // Text Colors
  text: {
    primary: '#2d2d2d',
    secondary: '#6b6b6b',
    light: '#9b9b9b',
    white: '#ffffff',
  },
  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.7)',
    medium: 'rgba(255, 255, 255, 0.5)',
    dark: 'rgba(115, 113, 252, 0.1)',
    card: 'rgba(230, 217, 242, 0.6)',
  },
};

const tintColorLight = SpectraColors.primary.main;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: SpectraColors.text.primary,
    background: SpectraColors.background.main,
    tint: tintColorLight,
    icon: SpectraColors.text.secondary,
    tabIconDefault: SpectraColors.text.light,
    tabIconSelected: tintColorLight,
    card: SpectraColors.surface.card,
    primary: SpectraColors.primary.main,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#2a2a2a',
    primary: SpectraColors.primary.main,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
