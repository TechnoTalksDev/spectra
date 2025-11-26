import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorTheme = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

export interface ThemeColors {
  primary: {
    main: string;
    variant1: string;
    variant2: string;
  };
  surface: {
    card: string;
    secondary: string;
    alternate: string;
    accent: string;
  };
  background: {
    main: string;
    white: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
    white: string;
  };
}

interface ThemeContextType {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_THEMES: Record<ColorTheme, { main: string; variant1: string; variant2: string }> = {
  purple: {
    main: '#7371fc',
    variant1: '#7472fd',
    variant2: '#7470fc',
  },
  blue: {
    main: '#3B82F6',
    variant1: '#60A5FA',
    variant2: '#2563EB',
  },
  green: {
    main: '#10B981',
    variant1: '#34D399',
    variant2: '#059669',
  },
  orange: {
    main: '#F97316',
    variant1: '#FB923C',
    variant2: '#EA580C',
  },
  pink: {
    main: '#EC4899',
    variant1: '#F472B6',
    variant2: '#DB2777',
  },
};

const LIGHT_THEME = {
  surface: {
    card: '#f8f7ff',
    secondary: '#fafafa',
    alternate: '#f5f5f5',
    accent: '#eeeeee',
  },
  background: {
    main: '#ffffff',
    white: '#ffffff',
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    light: '#999999',
    white: '#ffffff',
  },
};

const DARK_THEME = {
  surface: {
    card: 'rgba(255, 255, 255, 0.08)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    alternate: 'rgba(255, 255, 255, 0.1)',
    accent: 'rgba(255, 255, 255, 0.15)',
  },
  background: {
    main: '#000000',
    white: '#0a0a0a',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    light: 'rgba(255, 255, 255, 0.5)',
    white: '#ffffff',
  },
};

const THEME_MODE_KEY = '@spectra_theme_mode';
const COLOR_THEME_KEY = '@spectra_color_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('purple');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved preferences
  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const [savedMode, savedColor] = await Promise.all([
        AsyncStorage.getItem(THEME_MODE_KEY),
        AsyncStorage.getItem(COLOR_THEME_KEY),
      ]);

      if (savedMode) setThemeModeState(savedMode as ThemeMode);
      if (savedColor) setColorThemeState(savedColor as ColorTheme);
    } catch (error) {
      console.error('Failed to load theme preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  const setColorTheme = async (theme: ColorTheme) => {
    setColorThemeState(theme);
    try {
      await AsyncStorage.setItem(COLOR_THEME_KEY, theme);
    } catch (error) {
      console.error('Failed to save color theme:', error);
    }
  };

  // Determine if dark mode should be active
  const isDark =
    themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  // Build current theme colors
  const colors: ThemeColors = {
    primary: COLOR_THEMES[colorTheme],
    ...(isDark ? DARK_THEME : LIGHT_THEME),
  };

  if (!isLoaded) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colorTheme,
        isDark,
        colors,
        setThemeMode,
        setColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
