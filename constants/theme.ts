/**
 * Spectra App Theme
 * Clean and premium color palette
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
    card: '#f8f7ff',
    secondary: '#fafafa',
    alternate: '#f5f5f5',
    accent: '#eeeeee',
  },
  // Background
  background: {
    main: '#ffffff',
    white: '#ffffff',
  },
  // Text Colors
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    light: '#999999',
    white: '#ffffff',
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
