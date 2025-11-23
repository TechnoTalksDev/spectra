# Spectra UI Components

## Overview

Spectra features a premium glassmorphic design system with haptic feedback, smooth animations, and accessibility in mind.

## Color Palette

```typescript
Primary: #7371fc (Vibrant Periwinkle)
Surface Card: #e6d9f2 (Soft Lavender)
Background: #f4effe (Ultra-light Lavender)
```

## Components

### GlassCard

A glassmorphic card component with blur effects and gradient backgrounds.

```tsx
import { GlassCard } from '@/components/ui/glass-card';

<GlassCard variant="surface" blur="medium">
  <View>{/* Your content */}</View>
</GlassCard>
```

**Props:**
- `variant`: 'default' | 'primary' | 'surface'
- `blur`: 'light' | 'medium' | 'heavy'

### GlassButton

An animated button with haptic feedback and gradient backgrounds.

```tsx
import { GlassButton } from '@/components/ui/glass-button';

<GlassButton
  title="Click Me"
  variant="primary"
  size="large"
  onPress={handlePress}
  hapticFeedback={true}
/>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'small' | 'medium' | 'large'
- `hapticFeedback`: boolean (default: true)
- `loading`: boolean

### GlassInput

A glassmorphic text input with focus animations and haptic feedback.

```tsx
import { GlassInput } from '@/components/ui/glass-input';

<GlassInput
  label="Email"
  placeholder="your@email.com"
  value={email}
  onChangeText={setEmail}
  leftIcon={<Icon />}
  error={errorMessage}
/>
```

**Props:**
- `label`: string
- `error`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `hapticFeedback`: boolean (default: true)

### AnimatedBackground

An animated gradient background with floating blob effects.

```tsx
import { AnimatedBackground } from '@/components/ui/animated-background';

<AnimatedBackground>
  <View>{/* Your page content */}</View>
</AnimatedBackground>
```

## Haptic Feedback

Spectra uses expo-haptics for tactile feedback:

- **Light**: UI interactions (taps, toggles)
- **Medium**: Primary actions (button presses)
- **Heavy**: Important confirmations
- **Success**: Completed actions
- **Error**: Failed actions

## Animations

All components use `react-native-reanimated` for smooth 60fps animations:

- Spring animations for natural motion
- Staggered entry animations
- Pulse effects for emphasis
- Shimmer effects for loading states

## Accessibility

- High contrast color ratios
- Large touch targets (minimum 44x44)
- Screen reader support
- Haptic feedback for visual impairments

## Best Practices

1. **Consistent Spacing**: Use multiples of 4 (8, 16, 24, 32)
2. **Typography Scale**: 12, 14, 16, 18, 20, 24, 28, 32, 40, 56
3. **Border Radius**: 12, 16, 20, 24 for cards and buttons
4. **Shadows**: Use SpectraColors.primary.main for shadow colors
5. **Haptics**: Always provide haptic feedback for user interactions
