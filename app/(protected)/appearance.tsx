import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { GlassCard } from '@/components/ui/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import { SpectraColors } from '@/constants/theme';
import { useTheme, ThemeMode, ColorTheme } from '@/context/theme-context';

interface ThemeOption {
  mode: ThemeMode;
  title: string;
  description: string;
  icon: string;
}

interface ColorOption {
  theme: ColorTheme;
  name: string;
  color: string;
  gradient: string[];
}

export default function AppearancePage() {
  const insets = useSafeAreaInsets();
  const { themeMode, colorTheme, colors, setThemeMode, setColorTheme } = useTheme();
  
  const themeOptions: ThemeOption[] = [
    {
      mode: 'light',
      title: 'Light Mode',
      description: 'Clean and bright interface',
      icon: 'sunny',
    },
    {
      mode: 'dark',
      title: 'Dark Mode',
      description: 'Easy on the eyes',
      icon: 'moon',
    },
    {
      mode: 'auto',
      title: 'Auto',
      description: 'Matches system settings',
      icon: 'phone-portrait',
    },
  ];

  const colorOptions: ColorOption[] = [
    {
      theme: 'purple',
      name: 'Purple',
      color: '#7371fc',
      gradient: ['#7371fc', '#9896ff'],
    },
    {
      theme: 'blue',
      name: 'Ocean Blue',
      color: '#3B82F6',
      gradient: ['#3B82F6', '#60A5FA'],
    },
    {
      theme: 'green',
      name: 'Forest Green',
      color: '#10B981',
      gradient: ['#10B981', '#34D399'],
    },
    {
      theme: 'orange',
      name: 'Sunset Orange',
      color: '#F97316',
      gradient: ['#F97316', '#FB923C'],
    },
    {
      theme: 'pink',
      name: 'Rose Pink',
      color: '#EC4899',
      gradient: ['#EC4899', '#F472B6'],
    },
  ];

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleThemeSelect = async (mode: ThemeMode) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setThemeMode(mode);
  };

  const handleColorSelect = async (theme: ColorTheme) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setColorTheme(theme);
  };

  return (
    <AnimatedBackground>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <AppIcon name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Appearance</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Theme Mode Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Theme Mode</Text>
        <GlassCard variant="surface" style={styles.card}>
          {themeOptions.map((option, index) => (
            <React.Fragment key={option.mode}>
              <TouchableOpacity
                style={styles.themeOption}
                onPress={() => handleThemeSelect(option.mode)}
              >
                <View style={[
                  styles.themeIconContainer,
                  themeMode === option.mode && styles.themeIconContainerActive
                ]}>
                  <AppIcon 
                    name={option.icon as any} 
                    size={24} 
                    color={themeMode === option.mode ? colors.primary.main : colors.text.secondary} 
                  />
                </View>
                <View style={styles.themeContent}>
                  <Text style={[styles.themeTitle, { color: colors.text.primary }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.themeDescription, { color: colors.text.secondary }]}>
                    {option.description}
                  </Text>
                </View>
                {themeMode === option.mode && (
                  <AppIcon name="checkmark-circle" size={24} color={colors.primary.main} />
                )}
              </TouchableOpacity>
              {index < themeOptions.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </GlassCard>

        {/* Color Theme Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Color Theme</Text>
        <GlassCard variant="surface" style={styles.card}>
          <View style={styles.colorGrid}>
            {colorOptions.map((option) => (
              <TouchableOpacity
                key={option.theme}
                style={styles.colorOption}
                onPress={() => handleColorSelect(option.theme)}
              >
                <View style={[
                  styles.colorCircle,
                  { backgroundColor: option.color },
                  colorTheme === option.theme && styles.colorCircleSelected
                ]}>
                  {colorTheme === option.theme && (
                    <AppIcon name="checkmark" size={24} color="#ffffff" />
                  )}
                </View>
                <Text style={[styles.colorName, { color: colors.text.primary }]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Preview Section */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Preview</Text>
        <GlassCard variant="surface" style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={[styles.previewAvatar, { backgroundColor: colorOptions.find(c => c.theme === colorTheme)?.color }]}>
              <Text style={styles.previewAvatarText}>A</Text>
            </View>
            <View style={styles.previewInfo}>
              <Text style={[styles.previewName, { color: colors.text.primary }]}>Your Name</Text>
              <Text style={[styles.previewEmail, { color: colors.text.secondary }]}>your@email.com</Text>
            </View>
          </View>
          <View style={styles.previewContent}>
            <Text style={[styles.previewTitle, { color: colors.text.primary }]}>Sample Content</Text>
            <Text style={[styles.previewText, { color: colors.text.secondary }]}>
              This is how your app will look with the selected theme.
            </Text>
          </View>
        </GlassCard>

        <View style={styles.infoContainer}>
          <AppIcon name="information-circle" size={20} color={colors.text.secondary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            Theme changes will be applied immediately across the app
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: SpectraColors.text.primary,
  },
  headerSpacer: {
    width: 44,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: 24,
    padding: 0,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  themeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: SpectraColors.surface.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeIconContainerActive: {
    backgroundColor: 'rgba(115, 113, 252, 0.1)',
  },
  themeContent: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: SpectraColors.surface.accent,
    marginHorizontal: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  colorOption: {
    alignItems: 'center',
    width: '30%',
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: SpectraColors.text.primary,
  },
  colorName: {
    fontSize: 12,
    fontWeight: '600',
    color: SpectraColors.text.primary,
    textAlign: 'center',
  },
  previewCard: {
    marginBottom: 16,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: SpectraColors.text.primary,
  },
  previewEmail: {
    fontSize: 13,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
  },
  previewContent: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: SpectraColors.surface.accent,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: SpectraColors.text.primary,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 13,
    fontWeight: '400',
    color: SpectraColors.text.secondary,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(115, 113, 252, 0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: SpectraColors.text.secondary,
    lineHeight: 20,
  },
});
